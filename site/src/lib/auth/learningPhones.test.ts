import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  isLearningPhoneAllowed,
  isLearningPhonesAllowed,
  normalizeE164,
  parseAllowedPhones,
} from "./learningPhones.ts";

const OWNER = "+16505805788";
const OTHER = "+14155550100";

describe("normalizeE164", () => {
  it("accepts 10-digit US national", () => {
    assert.equal(normalizeE164("6505805788"), OWNER);
    assert.equal(normalizeE164("(650) 580-5788"), OWNER);
  });

  it("accepts +1 / 11-digit forms", () => {
    assert.equal(normalizeE164("+16505805788"), OWNER);
    assert.equal(normalizeE164("16505805788"), OWNER);
  });

  it("rejects short or empty input", () => {
    assert.equal(normalizeE164(""), null);
    assert.equal(normalizeE164("555"), null);
    assert.equal(normalizeE164(null), null);
  });
});

describe("parseAllowedPhones / phone list matching", () => {
  it("parses comma and space separated lists", () => {
    const set = parseAllowedPhones(`${OWNER}, ${OTHER}`);
    assert.equal(set.size, 2);
    assert.ok(set.has(OWNER));
    assert.ok(set.has(OTHER));
  });

  it("empty env means nobody matches", () => {
    assert.equal(parseAllowedPhones("").size, 0);
    assert.equal(parseAllowedPhones(undefined).size, 0);
    assert.equal(isLearningPhoneAllowed(OWNER, ""), false);
  });

  it("matches configured numbers and refuses others", () => {
    assert.equal(isLearningPhoneAllowed(OWNER, OWNER), true);
    assert.equal(isLearningPhoneAllowed("(650) 580-5788", OWNER), true);
    assert.equal(isLearningPhoneAllowed(OTHER, OWNER), false);
    assert.equal(isLearningPhoneAllowed("4155550100", OWNER), false);
  });

  it("isLearningPhonesAllowed matches any listed phone", () => {
    assert.equal(isLearningPhonesAllowed([OTHER, OWNER], OWNER), true);
    assert.equal(isLearningPhonesAllowed([OTHER], OWNER), false);
    assert.equal(isLearningPhonesAllowed([], OWNER), false);
  });
});
