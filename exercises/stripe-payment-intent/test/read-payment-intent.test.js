"use strict";

const assert = require("node:assert/strict");
const { test } = require("node:test");
const path = require("node:path");
const fs = require("node:fs");

const api = require("../readPaymentIntentClient");
const fixtures = {
  paymentIntent: JSON.parse(
    fs.readFileSync(
      path.join(__dirname, "../fixtures/stripe-payment-intent-create.json"),
      "utf8"
    )
  ),
};

test("reads client_secret from the fixture", () => {
  var out = api.readPaymentIntentClient(fixtures.paymentIntent);
  assert.equal(out.clientSecret, fixtures.paymentIntent.client_secret);
});

test("reads amount as integer cents", () => {
  var out = api.readPaymentIntentClient(fixtures.paymentIntent);
  assert.equal(out.amountCents, 1099);
});

test("reads currency and test-mode livemode", () => {
  var out = api.readPaymentIntentClient(fixtures.paymentIntent);
  assert.equal(out.currency, "usd");
  assert.equal(out.livemode, false);
});

test("fixture stays offline (no network fields required)", () => {
  assert.equal(fixtures.paymentIntent.object, "payment_intent");
  assert.equal(fixtures.paymentIntent.livemode, false);
  assert.ok(String(fixtures.paymentIntent.id).indexOf("pi_") === 0);
});
