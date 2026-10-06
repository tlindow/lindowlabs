import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { learningOverlay } from "../../data/learning/overlay.ts";
import { mergeCurriculum } from "./mergeOverlay.ts";
import {
  parseChapterList,
  parseReadingPlanMarkdown,
} from "./parseReadingPlan.ts";

const here = path.dirname(fileURLToPath(import.meta.url));
const fixtureMd = readFileSync(
  path.join(here, "../../data/learning/fixtures/reading-plan-page.md"),
  "utf8"
);

describe("parseChapterList", () => {
  it("parses SRE-style chapter lists", () => {
    assert.deepEqual(parseChapterList("Ch 3, 4, 6, 14 and 15."), [
      3, 4, 6, 14, 15,
    ]);
  });
});

describe("parseReadingPlanMarkdown (Reading plan fixture)", () => {
  const plan = parseReadingPlanMarkdown(fixtureMd, "2026-10-06T21:43:25.133Z");

  it("reads Currently reading as DDD Ch 2", () => {
    assert.ok(plan.currentlyReading);
    assert.match(plan.currentlyReading!.pageText, /Domain-Driven Design/);
    assert.equal(plan.currentlyReading!.lessonLabel, "Ch 2");
  });

  it("keeps Reading order and excludes Sealed / Already read / Dropped", () => {
    assert.equal(plan.courses.length, 4);
    const titles = plan.courses.map((c) => c.title);
    assert.ok(titles.includes("Site Reliability Engineering"));
    assert.ok(titles.includes("Domain-Driven Design"));
    assert.ok(
      titles.some((t) => t.includes("transformative tools for thought"))
    );
    assert.ok(titles.includes("TypeScript and React foundations"));
    // Designing Web APIs is under Dropped — must never appear
    assert.ok(!titles.some((t) => /Designing Web APIs/i.test(t)));
    assert.ok(!titles.some((t) => /Mindstorms/i.test(t)));
    assert.ok(!titles.some((t) => /People management/i.test(t)));
  });

  it("parses SRE chapters from the page scope", () => {
    const sre = plan.courses.find((c) => c.key === "sre");
    assert.ok(sre);
    assert.equal(sre!.why?.startsWith("Backs"), true);
    const keys = sre!.lessons.map((l) => l.key);
    assert.deepEqual(keys, ["ch3", "ch4", "ch6", "ch14", "ch15"]);
  });

  it("marks DDD Ch 1 done and Ch 2 current from page text", () => {
    const ddd = plan.courses.find((c) => c.key === "ddd");
    assert.ok(ddd);
    const ch1 = ddd!.lessons.find((l) => l.key === "ch1");
    const ch2 = ddd!.lessons.find((l) => l.key === "ch2");
    assert.equal(ch1?.status, "done");
    assert.equal(ch2?.status, "current");
  });

  it("keeps Practice as not_written without inventing a link", () => {
    assert.equal(plan.practice.length, 1);
    assert.equal(plan.practice[0].state, "not_written");
    assert.equal(plan.practice[0].url, null);
    assert.match(plan.practice[0].title, /API design worksheet/i);
  });

  it("surfaces unparseable items as raw text instead of guessing", () => {
    const broken = parseReadingPlanMarkdown(`## Reading order
1. ???
## Sealed
- ignore me
`);
    assert.equal(broken.courses.length, 1);
    assert.equal(broken.courses[0].parseFailed, true);
    assert.ok(broken.courses[0].rawText);
  });
});

describe("mergeCurriculum with overlay", () => {
  const plan = parseReadingPlanMarkdown(fixtureMd, "2026-10-06T21:43:25.133Z");
  const curriculum = mergeCurriculum(plan, learningOverlay, {
    fetchedAt: "2026-10-06T21:45:00.000Z",
    source: "fixture",
  });

  it("expands DDD cover-to-cover to 17 overlay chapters", () => {
    const ddd = curriculum.courses.find((c) => c.key === "ddd");
    assert.ok(ddd);
    assert.equal(ddd!.lessons.length, 17);
    assert.equal(ddd!.progress.done, 1);
    assert.equal(ddd!.progress.total, 17);
    assert.equal(ddd!.state, "current");
    assert.equal(ddd!.lessons[0].status, "done");
    assert.equal(ddd!.lessons[1].status, "current");
    assert.equal(ddd!.lessons[2].status, "pending");
  });

  it("shows Fastify exercise only on reached DDD Ch 2", () => {
    const ddd = curriculum.courses.find((c) => c.key === "ddd")!;
    const ch1 = ddd.lessons.find((l) => l.key === "ch1")!;
    const ch2 = ddd.lessons.find((l) => l.key === "ch2")!;
    const ch3 = ddd.lessons.find((l) => l.key === "ch3")!;
    assert.equal(ch1.exercises.length, 0);
    assert.equal(ch2.exercises.length, 1);
    assert.equal(ch2.exercises[0].path, "exercises/api-design");
    assert.match(ch2.exercises[0].openInCursorUrl, /^cursor:\/\//);
    assert.match(
      ch2.exercises[0].githubUrl,
      /^https:\/\/github\.com\/tlindow\/lindowlabs\/tree\/main\/exercises\/api-design$/
    );
    assert.equal(ch3.exercises.length, 0);
    assert.equal(ch3.reflectionPrompt, null);
  });

  it("never includes dropped Designing Web APIs", () => {
    assert.ok(
      !curriculum.courses.some((c) => /Designing Web APIs/i.test(c.title))
    );
  });
});
