import { getUserIds } from "./common.mjs";
import assert from "node:assert";
import test from "node:test";
import { revisionDates } from "./script.mjs";

test("User count is correct", () => {
  assert.equal(getUserIds().length, 5);
});


test("revisionDates returns 5 revision dates", () => {
  const result = revisionDates("2026-01-01");
  assert.ok(Array.isArray(result));
  assert.equal(result.length, 5, "Should contain 5 revision items");
});
test("previous date selection", () => {
  const resultA = revisionDates("2025-01-01");
  assert.ok(Array.isArray(resultA));
  assert.equal(resultA.length, 1, "Should contain 1 revision items");
  const resultB = revisionDates("2023-01-01");
  assert.ok(Array.isArray(resultB));
  assert.equal(resultB.length, 0, "Should contain 0 revision items");
});