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
  it("starts on API design; then Vitillo; Kleppmann has Ch 7 bookmark and 4-chapter length", () => {
    let p = parsePlaylistProgressCookie(undefined, "u1");
    assert.equal(lengthLabelFor("api-design"), "~10h");
    assert.equal(lengthLabelFor("understanding-distributed-systems"), "~8h");
    assert.equal(
      lengthLabelFor("designing-data-intensive-applications"),
      "4 ch · ~10h"
    );

    assert.equal(nowReadingItem(readingCurriculum, p)?.id, "api-design");
    assert.equal(
      upNextItem(readingCurriculum, p)?.id,
      "understanding-distributed-systems"
    );

    assert.equal(
      formatBookmark(p.books["designing-data-intensive-applications"]!.bookmark),
      "Chapter 7, sharding by hash key"
    );
    assert.equal(
      p.books["understanding-distributed-systems"]?.bookmark ?? null,
      null
    );
    assert.equal(
      p.alreadyRead.some((e) => /Site Reliability|Release It/i.test(e.title)),
      false
    );

    p = markBookFinished(p, "api-design");
    assert.equal(
      nowReadingItem(readingCurriculum, p)?.id,
      "understanding-distributed-systems"
    );

    // After finishing tracks before Kleppmann, Now reading is Kleppmann Ch 7.
    p = markBookFinished(p, "understanding-distributed-systems");
    p = markBookFinished(p, "learning-domain-driven-design");
    p = markBookFinished(p, "payments-systems-us");
    assert.equal(
      nowReadingItem(readingCurriculum, p)?.id,
      "designing-data-intensive-applications"
    );
    assert.equal(
      currentChapterLabel(
        "designing-data-intensive-applications",
        p.books["designing-data-intensive-applications"]!
      ),
      "Ch 7"
    );

    for (let i = 0; i < 3; i += 1) {
      p = markChapterRead(p, "designing-data-intensive-applications");
      assert.equal(
        p.books["designing-data-intensive-applications"]?.finished,
        false
      );
    }
    p = markChapterRead(p, "designing-data-intensive-applications");
    assert.equal(
      p.books["designing-data-intensive-applications"]?.finished,
      true
    );
    assert.equal(
      bookProgressPct(
        "designing-data-intensive-applications",
        p.books["designing-data-intensive-applications"]!
      ),
      100
    );
    assert.equal(nowReadingItem(readingCurriculum, p)?.id, "grokking-algorithms");
    assert.equal(
      trackStatusFor(
        readingCurriculum[4]!,
        p,
        nowReadingItem(readingCurriculum, p)?.id ?? null
      ),
      "Done"
    );
  });

  it("bookmark formatting and mark book finished", () => {
    let p = emptyPlaylistProgress("u1");
    p = setBookmark(p, "designing-data-intensive-applications", 142, "Transactions");
    assert.equal(
      formatBookmark(p.books["designing-data-intensive-applications"]!.bookmark),
      "p. 142, Transactions"
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
