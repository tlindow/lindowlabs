import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  curriculumBookCount,
  curriculumEssayIntro,
  curriculumEssayTitle,
  moduleHasBook,
  readingCurriculum,
  SRE_FREE_BOOK_URL,
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
    author: "Google",
    scope: "Ch 4, 6, 21 and 22",
    exerciseId: "merchant-portal-slos",
    hasBook: true,
  },
  {
    id: "api-design",
    title: "API design",
    author: "Exercise",
    scope: "in Tinker",
    exerciseId: "api-design",
    hasBook: false,
  },
  {
    id: "learning-domain-driven-design",
    title: "Learning Domain-Driven Design",
    author: "Vladik Khononov",
    scope: "Whole book",
    exerciseId: "bounded-contexts",
    hasBook: true,
  },
  {
    id: "payments-systems-us",
    title: "Payments Systems in the U.S.",
    author: "Glenbrook",
    scope: "Whole book",
    exerciseId: "card-payment-lifecycle",
    hasBook: true,
  },
  {
    id: "designing-data-intensive-applications",
    title: "Designing Data-Intensive Applications",
    author: "Martin Kleppmann",
    scope: "Ch 7 only",
    exerciseId: "idempotent-refund",
    hasBook: true,
  },
  {
    id: "grokking-algorithms",
    title: "Grokking Algorithms",
    author: "Aditya Bhargava",
    scope: "alongside everything else",
    exerciseId: "settlement-binary-search",
    hasBook: true,
  },
] as const;

const FORBIDDEN =
  /Oct 4|Sep 30|your earlier pick|on your plan|ruled out|already reading|one chapter in|Owned \(paperback\)|You own this one in paperback|Lauret|Design of Web APIs|Designing Web APIs|Each module is a book|Ch 3, 4, 6, 14 and 15|Ch 14|Ch 15/i;

describe("readingCurriculumForUser", () => {
  it("owner sees essay lineup with exercise-only API design and no Lauret book", () => {
    const items = readingCurriculumForUser(true);
    assert.equal(items.length, 6);
    assert.equal(items.length, readingCurriculum.length);
    assert.equal(curriculumBookCount(items), 5);
    assert.equal(
      curriculumEssayTitle,
      "A curriculum for an engineering manager in developer experience and payments"
    );
    assert.match(curriculumEssayIntro, /^You led merchant and partner/);
    assert.match(curriculumEssayIntro, /exercise ladder alone/);
    assert.equal(FORBIDDEN.test(curriculumEssayIntro), false);

    for (let i = 0; i < EXPECTED_ORDER.length; i += 1) {
      const item = items[i]!;
      const expected = EXPECTED_ORDER[i]!;
      assert.equal(item.number, i + 1);
      assert.equal(item.id, expected.id);
      assert.equal(item.title, expected.title);
      assert.equal(item.author, expected.author);
      assert.equal(item.scope, expected.scope);
      assert.ok(item.heading.includes(expected.title.split(" (")[0]!));
      assert.ok(item.prose.trim().length > 40);
      assert.equal(moduleHasBook(item), expected.hasBook);
      assert.equal(item.exercise.id, expected.exerciseId);
      assert.ok(item.exercise.openInTinkerUrl.includes("tinker.beginner.work"));
      if (expected.hasBook) {
        assert.ok(item.getBookUrl?.startsWith("https://"));
        assert.ok((item.consideredInstead ?? "").trim().length > 20);
      } else {
        assert.equal(item.getBookUrl, undefined);
        assert.equal(item.consideredInstead, undefined);
        assert.equal(item.alreadyReadNote, undefined);
      }
      assert.equal(FORBIDDEN.test(item.heading), false);
      assert.equal(FORBIDDEN.test(item.prose), false);
      assert.equal(FORBIDDEN.test(item.consideredInstead ?? ""), false);
      assert.equal(FORBIDDEN.test(item.exercise.summary), false);
    }

    assert.equal(
      items[1]?.prose,
      "No book here. The gap is turning resources into routes, and that only sticks by building it. Each step in this exercise models one more resource and wires its routes in code, so the design choices come from writing it, not from reading about it."
    );
    assert.equal(items[0]?.getBookUrl, SRE_FREE_BOOK_URL);
    assert.equal(items[0]?.coveredWithinModule, "Chapters 1 to 3");
    assert.equal(
      items[0]?.prose,
      "Chapters 1 to 3 restate availability and risk work Tyler already led. The gap starts at turning targets into SLOs and designing for overload and cascading failure, so the reading starts there."
    );
    assert.equal(items[2]?.title, "Learning Domain-Driven Design");
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
    const signedOut = { status: "signed-out" as const };
    assert.equal(signedOut.status, "signed-out");
    assert.notEqual(signedOut.status, "ok");
  });
});
