import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { groupClicksByTag } from "./group.ts";
import { extractTag, normalizeQuery, UNTAGGED } from "./tag.ts";
import { buildClickEvent } from "./store.ts";
import type { ClickEvent } from "./types.ts";

describe("normalizeQuery", () => {
  it("strips a leading question mark", () => {
    assert.equal(normalizeQuery("?utm_content=a"), "utm_content=a");
  });

  it("leaves bare query strings alone", () => {
    assert.equal(normalizeQuery("utm_content=a"), "utm_content=a");
  });
});

describe("extractTag", () => {
  it("prefers utm_content", () => {
    assert.equal(
      extractTag("utm_source=email&utm_content=alex&utm_campaign=em"),
      "alex"
    );
  });

  it("falls back to tag, then campaign", () => {
    assert.equal(extractTag("tag=sam"), "sam");
    assert.equal(extractTag("utm_campaign=warm"), "warm");
  });

  it("returns untagged when empty", () => {
    assert.equal(extractTag(""), UNTAGGED);
    assert.equal(extractTag("foo=bar"), UNTAGGED);
  });
});

describe("groupClicksByTag", () => {
  it("groups newest-first and orders groups by newest visit", () => {
    const events: ClickEvent[] = [
      buildClickEvent({
        path: "/",
        query: "utm_content=older",
        ts: "2026-10-12T10:00:00.000Z",
      }),
      buildClickEvent({
        path: "/resume",
        query: "utm_content=newer",
        ts: "2026-10-12T12:00:00.000Z",
      }),
      buildClickEvent({
        path: "/",
        query: "utm_content=newer",
        ts: "2026-10-12T11:00:00.000Z",
      }),
    ];

    const groups = groupClicksByTag(events);
    assert.equal(groups[0]?.tag, "newer");
    assert.equal(groups[0]?.visits.length, 2);
    assert.equal(groups[0]?.visits[0]?.ts, "2026-10-12T12:00:00.000Z");
    assert.equal(groups[1]?.tag, "older");
  });
});
