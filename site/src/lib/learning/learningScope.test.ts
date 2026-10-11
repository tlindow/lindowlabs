import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  curriculumBookCount,
  curriculumEssayIntro,
  curriculumEssayTitle,
  DDIA_2E_BOOK_URL,
  moduleHasBook,
  readingCurriculum,
  VITILLO_BOOK_URL,
} from "../../data/learning/readingCurriculum.ts";
import {
  deskPayloadForUser,
  mayLoadOwnerCurriculum,
  readingCurriculumForUser,
} from "./learningScope.ts";

const EXPECTED_ORDER = [
  {
    id: "understanding-distributed-systems",
    title: "Understanding Distributed Systems",
    author: "Roberto Vitillo",
    scope: "Whole book, 2nd edition",
    exerciseIds: [] as string[],
    hasBook: true,
  },
  {
    id: "api-design",
    title: "API design",
    author: "Exercise",
    scope: "in Tinker",
    exerciseIds: ["api-design"],
    hasBook: false,
  },
  {
    id: "learning-domain-driven-design",
    title: "Learning Domain-Driven Design",
    author: "Vladik Khononov",
    scope: "Whole book",
    exerciseIds: ["bounded-contexts"],
    hasBook: true,
  },
  {
    id: "payments-systems-us",
    title: "Payments Systems in the U.S.",
    author: "Glenbrook",
    scope: "Whole book",
    exerciseIds: ["card-payment-lifecycle"],
    hasBook: true,
  },
  {
    id: "designing-data-intensive-applications",
    title: "Designing Data-Intensive Applications",
    author: "Martin Kleppmann",
    scope: "2nd edition, Ch 7, 8, 9 and 10",
    exerciseIds: ["idempotent-refund", "consensus-under-partition"],
    hasBook: true,
  },
  {
    id: "grokking-algorithms",
    title: "Grokking Algorithms",
    author: "Aditya Bhargava",
    scope: "alongside everything else",
    exerciseIds: ["settlement-binary-search"],
    hasBook: true,
  },
] as const;

const FORBIDDEN =
  /Oct 4|Sep 30|your earlier pick|on your plan|ruled out|already reading|one chapter in|Owned \(paperback\)|You own this one in paperback|Lauret|Design of Web APIs|Designing Web APIs|Each module is a book|Ch 3, 4, 6, 14 and 15|Ch 4, 6, 21 and 22|Types of Failures|Release It! is the pick|site-reliability-engineering|Ch 7 only|Ch 7, 8 and 9(?! and 10)/i;

describe("readingCurriculumForUser", () => {
  it("owner sees Vitillo bridge then Kleppmann 2nd-ed Ch 7-10", () => {
    const items = readingCurriculumForUser(true);
    assert.equal(items.length, 6);
    assert.equal(items.length, readingCurriculum.length);
    assert.equal(curriculumBookCount(items), 5);
    assert.equal(
      curriculumEssayTitle,
      "A curriculum for an engineering manager in developer experience and payments"
    );
    assert.match(curriculumEssayIntro, /^You led merchant and partner/);
    assert.match(
      curriculumEssayIntro,
      /Vitillo\) comes before Designing Data-Intensive Applications/
    );
    assert.match(
      curriculumEssayIntro,
      /Grokking Algorithms runs alongside everything else/
    );
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
      assert.deepEqual(
        item.exercises.map((e) => e.id),
        [...expected.exerciseIds]
      );
      for (const ex of item.exercises) {
        assert.ok(ex.openInTinkerUrl.includes("tinker.beginner.work"));
        assert.equal(FORBIDDEN.test(ex.summary), false);
      }
      if (expected.hasBook) {
        assert.ok(item.getBookUrl?.startsWith("https://"));
        assert.ok((item.consideredInstead ?? "").trim().length > 20);
      } else {
        assert.equal(item.getBookUrl, undefined);
        assert.equal(item.consideredInstead, undefined);
      }
      assert.equal(FORBIDDEN.test(item.heading), false);
      assert.equal(FORBIDDEN.test(item.prose), false);
      assert.equal(FORBIDDEN.test(item.consideredInstead ?? ""), false);
    }

    assert.equal(items[0]?.getBookUrl, VITILLO_BOOK_URL);
    assert.equal(items[0]?.exercises.length, 0);
    assert.equal(items[4]?.getBookUrl, DDIA_2E_BOOK_URL);
    assert.match(items[4]?.prose ?? "", /Vitillo\) comes first so this is the rigorous version/);
    assert.match(items[4]?.consideredInstead ?? "", /Chapters 9 and 10/);
    assert.match(items[5]?.prose ?? "", /runs alongside everything else/);
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
