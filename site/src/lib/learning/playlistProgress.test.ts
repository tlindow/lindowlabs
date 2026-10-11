import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readingCurriculum } from "../../data/learning/readingCurriculum.ts";
import { OWNER_ALREADY_READ_SEED } from "../../data/learning/alreadyReadSeed.ts";
import {
  addAlreadyRead,
  bookProgressPct,
  currentChapterLabel,
  emptyBookProgress,
  emptyPlaylistProgress,
  formatBookmark,
  lengthLabelFor,
  markBookFinished,
  markChapterRead,
  nowReadingItem,
  parsePlaylistProgressCookie,
  removeAlreadyRead,
  setBookmark,
  trackStatusFor,
  upNextItem,
} from "./playlistProgress.ts";

describe("playlistProgress", () => {
  it("advances SRE remaining chapters then finishes; lengths use listed ch counts", () => {
    let p = emptyPlaylistProgress("u1");
    assert.equal(lengthLabelFor("site-reliability-engineering"), "4 ch · ~6h");
    assert.equal(lengthLabelFor("api-design"), "~10h");
    assert.equal(lengthLabelFor("designing-data-intensive-applications"), "1 ch · ~3h");

    // Seeded bookmark (Ch 3) does not finish the track; next chapter is Ch 4.
    p = parsePlaylistProgressCookie(undefined, "u1");
    assert.equal(nowReadingItem(readingCurriculum, p)?.id, "site-reliability-engineering");
    assert.equal(upNextItem(readingCurriculum, p)?.id, "api-design");
    assert.equal(
      currentChapterLabel(
        "site-reliability-engineering",
        p.books["site-reliability-engineering"]!
      ),
      "Ch 4"
    );
    assert.equal(
      formatBookmark(p.books["site-reliability-engineering"]!.bookmark),
      "Chapter 3, Types of Failures"
    );
    // Partial read stays on the module; Already read seed has no SRE book.
    assert.equal(
      p.alreadyRead.some((e) => /Site Reliability/i.test(e.title)),
      false
    );

    for (let i = 0; i < 3; i += 1) {
      p = markChapterRead(p, "site-reliability-engineering");
      assert.equal(p.books["site-reliability-engineering"]?.finished, false);
    }
    p = markChapterRead(p, "site-reliability-engineering");
    assert.equal(p.books["site-reliability-engineering"]?.finished, true);
    assert.equal(bookProgressPct("site-reliability-engineering", p.books["site-reliability-engineering"]!), 100);
    assert.equal(nowReadingItem(readingCurriculum, p)?.id, "api-design");
    assert.equal(
      trackStatusFor(readingCurriculum[0]!, p, nowReadingItem(readingCurriculum, p)?.id ?? null),
      "Done"
    );
  });

  it("bookmark formatting and mark book finished", () => {
    let p = emptyPlaylistProgress("u1");
    p = setBookmark(p, "site-reliability-engineering", 142, "Error budgets");
    assert.equal(
      formatBookmark(p.books["site-reliability-engineering"]!.bookmark),
      "p. 142, Error budgets"
    );
    p = markBookFinished(p, "api-design");
    assert.equal(p.books["api-design"]?.finished, true);
  });

  it("seeds Already read once and keeps later edits", () => {
    const seeded = parsePlaylistProgressCookie(undefined, "u1");
    assert.equal(seeded.alreadyRead.length, OWNER_ALREADY_READ_SEED.length);
    assert.equal(seeded.alreadyRead[0]?.title, "Mindstorms");
    assert.ok(
      seeded.alreadyRead.some(
        (e) => e.title === "The Life-Changing Magic of Tidying Up"
      )
    );

    let p = removeAlreadyRead(seeded, seeded.alreadyRead[0]!.id);
    p = addAlreadyRead(p, {
      title: "Extra",
      author: "Someone",
      howMuch: "whole book",
      note: "",
    });
    const raw = JSON.stringify(p);
    const again = parsePlaylistProgressCookie(raw, "u1");
    assert.equal(again.alreadyRead.length, p.alreadyRead.length);
    assert.ok(again.alreadyRead.some((e) => e.title === "Extra"));
    assert.equal(
      again.alreadyRead.some((e) => e.title === "Mindstorms"),
      false
    );
  });

  it("emptyBookProgress starts unread", () => {
    assert.deepEqual(emptyBookProgress(), {
      chaptersRead: 0,
      finished: false,
      bookmark: null,
    });
  });
});
