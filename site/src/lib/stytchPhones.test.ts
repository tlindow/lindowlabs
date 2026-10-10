import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isLearningOwner } from "./auth/learningOwner.ts";
import {
  loadUserPhonesForAccess,
  phonesFromSessionFactors,
  phonesFromStytchUser,
  type StytchSessionPayload,
  type StytchUser,
} from "./stytch.ts";

const OWNER_PHONE = "+16505805788";
const OWNER_USER = "user-live-owner-1";

describe("loadUserPhonesForAccess", () => {
  it("uses session user phones when present (no users.get)", async () => {
    let fetched = 0;
    const phones = await loadUserPhonesForAccess(
      {
        user: {
          user_id: OWNER_USER,
          phone_numbers: [{ phone_number: OWNER_PHONE }],
        },
      },
      {
        getUser: async () => {
          fetched += 1;
          return { user_id: OWNER_USER };
        },
      }
    );
    assert.deepEqual(phones, [OWNER_PHONE]);
    assert.equal(fetched, 0);
  });

  it("reads nested phone_number_factor from authentication_factors", async () => {
    // Production Stytch shape (otp + sms). Flat phone_number is NOT present.
    let fetched = 0;
    const session: StytchSessionPayload = {
      user: { user_id: OWNER_USER, phone_numbers: [] },
      session: {
        authentication_factors: [
          {
            type: "otp",
            delivery_method: "sms",
            phone_number_factor: {
              phone_id: "phone-live-1",
              phone_number: OWNER_PHONE,
            },
          },
        ],
      },
    };
    assert.deepEqual(phonesFromSessionFactors(session), [OWNER_PHONE]);
    const phones = await loadUserPhonesForAccess(session, {
      getUser: async () => {
        fetched += 1;
        return { user_id: OWNER_USER };
      },
    });
    assert.deepEqual(phones, [OWNER_PHONE]);
    assert.equal(fetched, 0);
  });

  it("still accepts flat factor.phone_number for older fixtures", async () => {
    const session: StytchSessionPayload = {
      user: { user_id: OWNER_USER, phone_numbers: [] },
      session: {
        authentication_factors: [
          { delivery_method: "sms", phone_number: OWNER_PHONE },
        ],
      },
    };
    assert.deepEqual(phonesFromSessionFactors(session), [OWNER_PHONE]);
  });

  it("falls back to users.get when session omits phones (owner regression)", async () => {
    // Root cause: sessions/authenticate returned user_id but no phone_numbers,
    // so phone-based LEARNING_OWNER_PHONES matching failed closed as non-owner.
    const sessionUser: StytchUser = {
      user_id: OWNER_USER,
      // omitted / empty — what production was seeing
    };
    assert.deepEqual(phonesFromStytchUser(sessionUser), []);
    assert.deepEqual(
      phonesFromSessionFactors({ user: sessionUser }),
      []
    );

    let fetched = 0;
    const phones = await loadUserPhonesForAccess(
      { user: sessionUser },
      {
        getUser: async (userId) => {
          fetched += 1;
          assert.equal(userId, OWNER_USER);
          return {
            user_id: OWNER_USER,
            phone_numbers: [{ phone_number: OWNER_PHONE, verified: true }],
          };
        },
      }
    );
    assert.equal(fetched, 1);
    assert.deepEqual(phones, [OWNER_PHONE]);

    const env = {
      LEARNING_OWNER_PHONES: OWNER_PHONE,
    } as NodeJS.ProcessEnv;
    assert.equal(
      isLearningOwner({ userId: OWNER_USER, phones: [] }, env),
      false
    );
    assert.equal(
      isLearningOwner({ userId: OWNER_USER, phones }, env),
      true
    );
  });
});
