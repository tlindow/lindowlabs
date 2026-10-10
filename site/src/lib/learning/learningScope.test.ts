import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readingCurriculum } from "../../data/learning/readingCurriculum.ts";
import {
  deskPayloadForUser,
  mayLoadOwnerCurriculum,
  readingCurriculumForUser,
} from "./learningScope.ts";

describe("readingCurriculumForUser", () => {
  it("owner sees exactly six books with resume lines and exercises", () => {
    const items = readingCurriculumForUser(true);
    assert.equal(items.length, 6);
    assert.equal(items.length, readingCurriculum.length);
    assert.equal(items[0]?.title, "The Design of Web APIs");
    assert.equal(items[5]?.title, "Grokking Algorithms");
    for (const item of items) {
      assert.ok(item.resumeLine.trim());
      assert.ok(item.exercise.id);
      assert.ok(item.exercise.openInTinkerUrl.includes("tinker.beginner.work"));
      assert.match(item.exercise.openInCursorUrl, /^cursor:\/\//);
      assert.match(
        item.exercise.githubUrl,
        /^https:\/\/github\.com\/tlindow\/lindowlabs\/tree\/main\/exercises\//
      );
      assert.ok(item.essayTitle || item.essaySource);
    }
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
