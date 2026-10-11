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
  it("advances Kleppmann Ch 7-9 then finishes; no SRE bookmark seed", () => {
    let p = parsePlaylistProgressCookie(undefined, "u1");
    assert.equal(
      lengthLabelFor("designing-data-intensive-applications"),
      "3 ch · ~8h"
    );
    assert.equal(lengthLabelFor("api-design"), "~10h");

    assert.equal(
      nowReadingItem(readingCurriculum, p)?.id,
      "designing-data-intensive-applications"
    );
    assert.equal(upNextItem(readingCurriculum, p)?.id, "api-design");
    assert.equal(
      currentChapterLabel(
        "designing-data-intensive-applications",
        p.books["designing-data-intensive-applications"] ?? emptyBookProgress()
      ),
      "Ch 7"
    );
    assert.equal(
      p.books["designing-data-intensive-applications"]?.bookmark ?? null,
      null
    );
    assert.equal(
      p.alreadyRead.some((e) => /Site Reliability|Release It/i.test(e.title)),
      false
    );

    for (let i = 0; i < 2; i += 1) {
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
    assert.equal(nowReadingItem(readingCurriculum, p)?.id, "api-design");
    assert.equal(
      trackStatusFor(
        readingCurriculum[0]!,
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
