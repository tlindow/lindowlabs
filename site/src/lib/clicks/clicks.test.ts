import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildClickLogLine } from "./log.ts";
import { extractTag, extractUtmAndTag, normalizeQuery, UNTAGGED } from "./tag.ts";

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

describe("extractUtmAndTag", () => {
  it("collects present utm_* and tag keys only", () => {
    assert.deepEqual(
      extractUtmAndTag("utm_source=email&utm_content=alex&foo=1&tag=x"),
      {
        utm_source: "email",
        utm_content: "alex",
        tag: "x",
      }
    );
  });

  it("returns empty object when none", () => {
    assert.deepEqual(extractUtmAndTag(""), {});
    assert.deepEqual(extractUtmAndTag("foo=bar"), {});
  });
});

describe("buildClickLogLine", () => {
  it("builds the Runtime Logs payload fields", () => {
    const line = buildClickLogLine({
      path: "/resume",
      query: "?utm_content=alex&utm_source=email",
      referrer: "https://mail.example/",
      userAgent: "TestUA",
      timestamp: "2026-10-13T03:00:00.000Z",
    });
    assert.deepEqual(line, {
      timestamp: "2026-10-13T03:00:00.000Z",
      path: "/resume",
      query: "utm_content=alex&utm_source=email",
      utm: { utm_content: "alex", utm_source: "email" },
      tag: "alex",
      referrer: "https://mail.example/",
      userAgent: "TestUA",
    });
  });
});
