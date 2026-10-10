import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readingCurriculum } from "../../data/learning/readingCurriculum.ts";
import {
  bookProgressPct,
  currentChapterLabel,
  emptyBookProgress,
  emptyPlaylistProgress,
  formatBookmark,
  lengthLabelFor,
  markBookFinished,
  markChapterRead,
  nowReadingItem,
  setBookmark,
  trackStatusFor,
  upNextItem,
} from "./playlistProgress.ts";

describe("playlistProgress", () => {
  it("advances SRE chapters then finishes; lengths use listed ch counts", () => {
    let p = emptyPlaylistProgress("u1");
    assert.equal(lengthLabelFor("site-reliability-engineering"), "5 ch · ~8h");
    assert.equal(lengthLabelFor("design-of-web-apis"), "~10h");
    assert.equal(lengthLabelFor("designing-data-intensive-applications"), "1 ch · ~3h");

    assert.equal(nowReadingItem(readingCurriculum, p)?.id, "site-reliability-engineering");
    assert.equal(upNextItem(readingCurriculum, p)?.id, "design-of-web-apis");
    assert.equal(
      currentChapterLabel("site-reliability-engineering", emptyBookProgress()),
      "Ch 3"
    );

    for (let i = 0; i < 4; i += 1) {
      p = markChapterRead(p, "site-reliability-engineering");
      assert.equal(p.books["site-reliability-engineering"]?.finished, false);
    }
    p = markChapterRead(p, "site-reliability-engineering");
    assert.equal(p.books["site-reliability-engineering"]?.finished, true);
    assert.equal(bookProgressPct("site-reliability-engineering", p.books["site-reliability-engineering"]!), 100);
    assert.equal(nowReadingItem(readingCurriculum, p)?.id, "design-of-web-apis");
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
      "Bookmarked: p. 142, Error budgets"
    );
    p = markBookFinished(p, "design-of-web-apis");
    assert.equal(p.books["design-of-web-apis"]?.finished, true);
  });
});
