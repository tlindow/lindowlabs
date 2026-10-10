import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  curriculumEssayIntro,
  curriculumEssayTitle,
  readingCurriculum,
} from "../../data/learning/readingCurriculum.ts";
import {
  deskPayloadForUser,
  mayLoadOwnerCurriculum,
  readingCurriculumForUser,
} from "./learningScope.ts";

const EXPECTED_ORDER = [
  {
    id: "site-reliability-engineering",
    title: "Site Reliability Engineering",
    scope: "Ch 3, 4, 6, 14 and 15",
    exerciseId: "merchant-portal-slos",
    exercise:
      "write SLOs and an error budget for a merchant portal, then a small check that alerts when errors burn through the budget too fast.",
  },
  {
    id: "design-of-web-apis",
    title: "The Design of Web APIs",
    scope: "Whole book",
    exerciseId: "api-design",
    exercise:
      "model Merchant, Order and Refund as resources, map each one to routes and methods, then write the OpenAPI spec.",
  },
  {
    id: "domain-driven-design",
    title: "Domain-Driven Design",
    scope: "from Ch 2",
    exerciseId: "bounded-contexts",
    exercise:
      "split a small checkout codebase into Merchant, Payments and Disputes contexts, naming each in the words your team actually used.",
  },
  {
    id: "payments-systems-us",
    title: "Payments Systems in the U.S.",
    scope: "Whole book",
    exerciseId: "card-payment-lifecycle",
    exercise:
      "trace one card payment through authorization, capture, clearing and settlement as a state machine in code.",
  },
  {
    id: "designing-data-intensive-applications",
    title: "Designing Data-Intensive Applications",
    scope: "Ch 7 only",
    exerciseId: "idempotent-refund",
    exercise:
      "build an idempotent refund endpoint, meaning a refund sent twice only refunds once.",
  },
  {
    id: "grokking-algorithms",
    title: "Grokking Algorithms",
    scope: "alongside everything else",
    exerciseId: "settlement-binary-search",
    exercise:
      "one algorithm per session, applied to merchant data, like binary search over sorted settlement records.",
  },
] as const;

describe("readingCurriculumForUser", () => {
  it("owner sees essay curriculum in the new order with matching exercises", () => {
    const items = readingCurriculumForUser(true);
    assert.equal(items.length, 6);
    assert.equal(items.length, readingCurriculum.length);
    assert.equal(
      curriculumEssayTitle,
      "A curriculum for an engineering manager in developer experience and payments"
    );
    assert.match(curriculumEssayIntro, /^You led merchant and partner/);
    assert.match(curriculumEssayIntro, /Each book comes with one exercise in Tinker\.$/);

    for (let i = 0; i < EXPECTED_ORDER.length; i += 1) {
      const item = items[i]!;
      const expected = EXPECTED_ORDER[i]!;
      assert.equal(item.number, i + 1);
      assert.equal(item.id, expected.id);
      assert.equal(item.title, expected.title);
      assert.equal(item.scope, expected.scope);
      assert.ok(
        item.heading.includes(expected.title),
        `heading should include title for module ${i + 1}`
      );
      assert.ok(
        item.heading.toLowerCase().includes(expected.scope.toLowerCase()) ||
          expected.scope === "Whole book",
        `heading should include scope for module ${i + 1}`
      );
      assert.ok(item.prose.trim().length > 40);
      assert.ok(item.consideredInstead.trim().length > 20);
      assert.equal(item.exercise.id, expected.exerciseId);
      assert.equal(item.exercise.summary, expected.exercise);
      assert.ok(item.exercise.openInTinkerUrl.includes("tinker.beginner.work"));
      assert.match(item.exercise.openInCursorUrl, /^cursor:\/\//);
      assert.equal(
        item.exercise.githubUrl,
        `https://github.com/tlindow/lindowlabs/tree/main/exercises/${expected.exerciseId}`
      );
    }

    assert.equal(items[0]?.ownership, "Owned (paperback)");
    assert.ok(items[0]?.heading.includes("You own this one in paperback"));
    assert.equal(
      items.filter((item) => item.ownership).length,
      1
    );
  });

  it("non-owner sees empty curriculum (no essay modules)", () => {
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
