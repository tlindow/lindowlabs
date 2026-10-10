import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  getOwnerPhones,
  isLearningOwner,
  parseOwnerUserIds,
  readOwnerPhonesEnv,
} from "./learningOwner.ts";

const OWNER_PHONE = "+16505805788";
const OTHER_PHONE = "+14155550100";
const OWNER_USER = "user-test-owner-1";
const OTHER_USER = "user-test-guest-9";

describe("readOwnerPhonesEnv", () => {
  it("prefers LEARNING_OWNER_PHONES over LEARNING_ALLOWED_PHONES", () => {
    assert.equal(
      readOwnerPhonesEnv({
        LEARNING_OWNER_PHONES: OWNER_PHONE,
        LEARNING_ALLOWED_PHONES: OTHER_PHONE,
      } as NodeJS.ProcessEnv),
      OWNER_PHONE
    );
  });

  it("falls back to LEARNING_ALLOWED_PHONES when owner unset", () => {
    assert.equal(
      readOwnerPhonesEnv({
        LEARNING_ALLOWED_PHONES: OWNER_PHONE,
      } as NodeJS.ProcessEnv),
      OWNER_PHONE
    );
  });

  it("returns undefined when both unset (fail closed)", () => {
    assert.equal(readOwnerPhonesEnv({} as NodeJS.ProcessEnv), undefined);
  });
});

describe("isLearningOwner", () => {
  it("matches owner by phone from LEARNING_OWNER_PHONES", () => {
    const env = {
      LEARNING_OWNER_PHONES: OWNER_PHONE,
    } as NodeJS.ProcessEnv;
    assert.equal(
      isLearningOwner({ userId: OTHER_USER, phones: [OWNER_PHONE] }, env),
      true
    );
    assert.equal(
      isLearningOwner({ userId: OTHER_USER, phones: [OTHER_PHONE] }, env),
      false
    );
  });

  it("reuses LEARNING_ALLOWED_PHONES when OWNER unset", () => {
    const env = {
      LEARNING_ALLOWED_PHONES: OWNER_PHONE,
    } as NodeJS.ProcessEnv;
    assert.equal(
      isLearningOwner({ userId: OTHER_USER, phones: [OWNER_PHONE] }, env),
      true
    );
    assert.equal(
      isLearningOwner({ userId: OTHER_USER, phones: [OTHER_PHONE] }, env),
      false
    );
  });

  it("matches owner by LEARNING_OWNER_USER_IDS", () => {
    const env = {
      LEARNING_OWNER_USER_IDS: OWNER_USER,
    } as NodeJS.ProcessEnv;
    assert.equal(
      isLearningOwner({ userId: OWNER_USER, phones: [OTHER_PHONE] }, env),
      true
    );
    assert.equal(
      isLearningOwner({ userId: OTHER_USER, phones: [OTHER_PHONE] }, env),
      false
    );
  });

  it("fails closed when no owner env is configured", () => {
    const env = {} as NodeJS.ProcessEnv;
    assert.equal(
      isLearningOwner({ userId: OWNER_USER, phones: [OWNER_PHONE] }, env),
      false
    );
    assert.equal(getOwnerPhones(env).size, 0);
  });

  it("parses owner user ids", () => {
    const set = parseOwnerUserIds(`${OWNER_USER}, ${OTHER_USER}`);
    assert.equal(set.size, 2);
    assert.ok(set.has(OWNER_USER));
  });
});
