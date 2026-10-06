import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  getAllowedPhones,
  isLearningPhoneAllowed,
  isLearningPhonesAllowed,
  normalizeE164,
  parseAllowedPhones,
} from "./learningPhones.ts";

const ALLOWED = "+16505805788";
const REFUSED = "+14155550100";

describe("normalizeE164", () => {
  it("accepts 10-digit US national", () => {
    assert.equal(normalizeE164("6505805788"), ALLOWED);
    assert.equal(normalizeE164("(650) 580-5788"), ALLOWED);
  });

  it("accepts +1 / 11-digit forms", () => {
    assert.equal(normalizeE164("+16505805788"), ALLOWED);
    assert.equal(normalizeE164("16505805788"), ALLOWED);
  });

  it("rejects short or empty input", () => {
    assert.equal(normalizeE164(""), null);
    assert.equal(normalizeE164("555"), null);
    assert.equal(normalizeE164(null), null);
  });
});

describe("parseAllowedPhones / allowlist", () => {
  it("parses comma and space separated lists", () => {
    const set = parseAllowedPhones(`${ALLOWED}, ${REFUSED}`);
    assert.equal(set.size, 2);
    assert.ok(set.has(ALLOWED));
    assert.ok(set.has(REFUSED));
  });

  it("empty env means nobody is allowed", () => {
    assert.equal(getAllowedPhones("").size, 0);
    assert.equal(getAllowedPhones(undefined).size, 0);
    assert.equal(isLearningPhoneAllowed(ALLOWED, ""), false);
  });

  it("allows the configured number and refuses others", () => {
    assert.equal(isLearningPhoneAllowed(ALLOWED, ALLOWED), true);
    assert.equal(isLearningPhoneAllowed("(650) 580-5788", ALLOWED), true);
    assert.equal(isLearningPhoneAllowed(REFUSED, ALLOWED), false);
    assert.equal(isLearningPhoneAllowed("4155550100", ALLOWED), false);
  });

  it("isLearningPhonesAllowed matches any listed phone", () => {
    assert.equal(isLearningPhonesAllowed([REFUSED, ALLOWED], ALLOWED), true);
    assert.equal(isLearningPhonesAllowed([REFUSED], ALLOWED), false);
    assert.equal(isLearningPhonesAllowed([], ALLOWED), false);
  });
});
