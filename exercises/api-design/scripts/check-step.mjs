#!/usr/bin/env node
/**
 * Lint and assert required OpenAPI shapes for one step.
 *
 * Usage:
 *   node scripts/check-step.mjs 03
 *   node scripts/check-step.mjs 03 --solutions
 *   node scripts/check-step.mjs --all-solutions
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import YAML from "yaml";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const STEPS = {
  "01": "01-smallest-valid-spec",
  "02": "02-name-the-thing",
  "03": "03-create",
  "04": "04-failure",
  "05": "05-lists",
  "06": "06-auth",
  "07": "07-from-scratch",
};

function fail(message) {
  console.error(`check:step: ${message}`);
  process.exit(1);
}

function loadSpec(filePath) {
  if (!fs.existsSync(filePath)) {
    fail(`missing file ${filePath}`);
  }
  const raw = fs.readFileSync(filePath, "utf8");
  const stripped = raw
    .split("\n")
    .filter((line) => !/^\s*#/.test(line))
    .join("\n")
    .trim();
  if (!stripped) {
    fail(`${filePath} is empty (comment-only files do not pass)`);
  }
  try {
    return YAML.parse(raw);
  } catch (err) {
    fail(`YAML parse failed for ${filePath}: ${err.message}`);
  }
}

function get(obj, dotted) {
  return dotted.split(".").reduce((acc, key) => (acc == null ? acc : acc[key]), obj);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function hasQueryParam(operation, name) {
  const params = operation?.parameters ?? [];
  return params.some((p) => p && p.name === name && p.in === "query");
}

function responseUsesRef(operation, status, refSuffix) {
  const content = operation?.responses?.[status]?.content?.["application/json"];
  const ref = content?.schema?.$ref;
  return typeof ref === "string" && ref.endsWith(refSuffix);
}

function lintFile(filePath) {
  const result = spawnSync(
    "npx",
    ["--no-install", "@redocly/cli", "lint", filePath, "--config", "redocly.yaml"],
    { cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }
  );
  if (result.status !== 0) {
    process.stdout.write(result.stdout || "");
    process.stderr.write(result.stderr || "");
    fail(`@redocly/cli lint failed for ${filePath}`);
  }
}

function checkStep01(spec) {
  assert(typeof spec.openapi === "string" && spec.openapi.startsWith("3."), "openapi version 3.x required");
  assert(typeof spec.info?.title === "string" && spec.info.title.length > 0, "info.title required");
  assert(typeof spec.info?.version === "string" && spec.info.version.length > 0, "info.version required");
  const getRide = get(spec, "paths./rides/{id}.get");
  assert(getRide, "GET /rides/{id} required");
  assert(getRide.responses?.["200"], "GET /rides/{id} must declare 200");
}

function checkStep02(spec) {
  checkStep01(spec);
  const ride = get(spec, "components.schemas.Ride");
  assert(ride && ride.type === "object", "components.schemas.Ride required");
  assert(
    responseUsesRef(get(spec, "paths./rides/{id}.get"), "200", "/Ride"),
    "GET /rides/{id} 200 must $ref Ride"
  );
}

function checkStep03(spec) {
  checkStep02(spec);
  const post = get(spec, "paths./rides.post");
  assert(post, "POST /rides required");
  assert(post.requestBody, "POST /rides requestBody required");
  const create = get(spec, "components.schemas.CreateRide")
    ?? Object.values(spec.components?.schemas ?? {}).find(
      (s) => Array.isArray(s?.required) && s.required.length > 0 && s !== get(spec, "components.schemas.Ride")
    );
  assert(create, "a create schema with required fields is required");
  assert(Array.isArray(create.required) && create.required.length > 0, "create schema must list required fields");
  const bodySchema = post.requestBody?.content?.["application/json"]?.schema;
  assert(bodySchema, "POST /rides must accept application/json");
}

function checkStep04(spec) {
  checkStep03(spec);
  const error = get(spec, "components.schemas.Error");
  assert(error && error.type === "object", "components.schemas.Error required");
  const getRide = get(spec, "paths./rides/{id}.get");
  const post = get(spec, "paths./rides.post");
  assert(getRide.responses?.["404"] || post.responses?.["404"], "a 404 response is required");
  assert(getRide.responses?.["400"] || post.responses?.["400"], "a 400 response is required");
  const usesError =
    responseUsesRef(getRide, "404", "/Error") ||
    responseUsesRef(getRide, "400", "/Error") ||
    responseUsesRef(post, "404", "/Error") ||
    responseUsesRef(post, "400", "/Error");
  assert(usesError, "400 or 404 must $ref Error");
}

function checkStep05(spec) {
  checkStep04(spec);
  const list = get(spec, "paths./rides.get");
  assert(list, "GET /rides required");
  assert(list.responses?.["200"], "GET /rides must declare 200");
  const hasLimit = hasQueryParam(list, "limit");
  const hasOffset = hasQueryParam(list, "offset");
  const hasPage = hasQueryParam(list, "page");
  const hasCursor = hasQueryParam(list, "cursor");
  assert(
    (hasLimit && hasOffset) || hasPage || hasCursor || hasLimit,
    "GET /rides needs pagination query params (limit/offset, page, or cursor)"
  );
}

function checkStep06(spec) {
  checkStep05(spec);
  const schemes = spec.components?.securitySchemes;
  assert(schemes && Object.keys(schemes).length > 0, "components.securitySchemes required");
  const rootSecurity = Array.isArray(spec.security) && spec.security.length > 0;
  const opSecurity = ["paths./rides.get", "paths./rides.post", "paths./rides/{id}.get"].some((p) => {
    const op = get(spec, p);
    return Array.isArray(op?.security) && op.security.length > 0;
  });
  assert(rootSecurity || opSecurity, "security must be applied at root or on an operation");
}

function checkStep07(spec) {
  assert(typeof spec.openapi === "string" && spec.openapi.startsWith("3."), "openapi version 3.x required");
  assert(typeof spec.info?.title === "string" && spec.info.title.length > 0, "info.title required");
  assert(typeof spec.info?.version === "string" && spec.info.version.length > 0, "info.version required");

  assert(get(spec, "paths./payments.post"), "POST /payments required");
  assert(get(spec, "paths./payments.get"), "GET /payments required");
  assert(get(spec, "paths./payments/{paymentId}.get"), "GET /payments/{paymentId} required");
  assert(get(spec, "paths./payments/{paymentId}/refunds.post"), "POST /payments/{paymentId}/refunds required");
  assert(get(spec, "paths./refunds/{refundId}.get"), "GET /refunds/{refundId} required");

  for (const name of ["Payment", "Refund", "Error"]) {
    assert(get(spec, `components.schemas.${name}`), `components.schemas.${name} required`);
  }

  const createPayment = get(spec, "paths./payments.post");
  assert(createPayment.requestBody, "POST /payments requestBody required");
  assert(createPayment.responses?.["201"] || createPayment.responses?.["200"], "POST /payments success response required");
  assert(createPayment.responses?.["400"], "POST /payments 400 required");
  assert(get(spec, "paths./payments/{paymentId}.get").responses?.["404"], "GET payment 404 required");
}

const CHECKERS = {
  "01": checkStep01,
  "02": checkStep02,
  "03": checkStep03,
  "04": checkStep04,
  "05": checkStep05,
  "06": checkStep06,
  "07": checkStep07,
};

function resolveStepId(raw) {
  const cleaned = String(raw).replace(/^0+/, "") || "0";
  const padded = cleaned.padStart(2, "0");
  if (!STEPS[padded]) {
    fail(`unknown step "${raw}". Use 01..07`);
  }
  return padded;
}

function checkOne(stepId, useSolutions) {
  const folder = STEPS[stepId];
  const filePath = useSolutions
    ? path.join(ROOT, "solutions", folder, "openapi.yaml")
    : path.join(ROOT, folder, "openapi.yaml");
  console.log(`check:step ${stepId} -> ${path.relative(ROOT, filePath)}`);
  const spec = loadSpec(filePath);
  lintFile(filePath);
  CHECKERS[stepId](spec);
  console.log(`ok: step ${stepId}`);
}

function main() {
  const args = process.argv.slice(2).filter((a) => a !== "--");
  const useSolutions = args.includes("--solutions");
  const allSolutions = args.includes("--all-solutions");
  const positional = args.filter((a) => !a.startsWith("--"));

  if (allSolutions) {
    for (const stepId of Object.keys(STEPS)) {
      checkOne(stepId, true);
    }
    console.log("ok: all solutions");
    return;
  }

  if (positional.length !== 1) {
    fail("usage: npm run check:step -- <01-07> [--solutions]");
  }

  checkOne(resolveStepId(positional[0]), useSolutions);
}

main();
