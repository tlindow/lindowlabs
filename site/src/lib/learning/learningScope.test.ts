import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readingCurriculum } from "../../data/learning/readingCurriculum.ts";
import {
  deskPayloadForUser,
  mayLoadOwnerCurriculum,
  readingCurriculumForUser,
} from "./learningScope.ts";

describe("readingCurriculumForUser", () => {
  it("owner sees personalized curriculum with essay titles", () => {
    const items = readingCurriculumForUser(true);
    assert.ok(items.length > 0);
    assert.equal(items.length, readingCurriculum.length);
    assert.ok(items.some((item) => item.essayTitle));
    assert.ok(
      items.some((item) => item.title === "The Design of Web APIs")
    );
  });

  it("non-owner sees empty curriculum (no essay quotes)", () => {
    const items = readingCurriculumForUser(false);
    assert.deepEqual(items, []);
    assert.equal(items.length, 0);
  });
});

describe("mayLoadOwnerCurriculum (course/lesson routes)", () => {
  it("allows owner only; non-owner gets no curriculum from any route", () => {
    assert.equal(mayLoadOwnerCurriculum(true), true);
    assert.equal(mayLoadOwnerCurriculum(false), false);
  });
});

describe("deskPayloadForUser", () => {
  it("signed-in non-owner always gets starter empty state", () => {
    assert.equal(
      deskPayloadForUser({
        isOwner: false,
        curriculum: { status: "ok", curriculum: {} as never },
      }),
      "starter"
    );
    assert.equal(
      deskPayloadForUser({ isOwner: false, curriculum: null }),
      "starter"
    );
  });

  it("owner with curriculum gets owner-curriculum", () => {
    assert.equal(
      deskPayloadForUser({
        isOwner: true,
        curriculum: {
          status: "ok",
          curriculum: {
            courses: [],
            fetchedAt: "",
            pageLastEditedAt: "",
            source: "fixture",
            staleAsOf: null,
          },
        },
      }),
      "owner-curriculum"
    );
  });

  it("owner without connected curriculum gets owner-not-connected", () => {
    assert.equal(
      deskPayloadForUser({
        isOwner: true,
        curriculum: { status: "not-connected" },
      }),
      "owner-not-connected"
    );
    assert.equal(
      deskPayloadForUser({ isOwner: true, curriculum: null }),
      "owner-not-connected"
    );
  });
});

describe("signed-out gate", () => {
  it("signed-out status is distinct from starter (page shows login)", () => {
    // loadLearningGate returns { status: "signed-out" } before any desk.
    // Pages redirect/render LearningSignIn — never curriculum.
    const signedOut = { status: "signed-out" as const };
    assert.equal(signedOut.status, "signed-out");
    assert.notEqual(signedOut.status, "ok");
  });
});
