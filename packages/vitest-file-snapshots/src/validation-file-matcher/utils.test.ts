import { describe, expect, test } from "vitest";
import { parseTestName, parseTestPath } from "./utils";

describe("parseTestName", () => {
  test("splits test name into titles", () => {
    expect(parseTestName("a > b > c")).toStrictEqual(["a", "b", "c"]);
  });
});

describe("parseTestPath", () => {
  test("removes test extension from test path", () => {
    expect(parseTestPath("src/tests/feature.test.ts", ".")).toBe(
      "src/tests/feature",
    );
  });

  test("resolves test path relative to testDir", () => {
    expect(parseTestPath("src/tests/feature.test.ts", "src/tests")).toBe(
      "feature",
    );
  });
});
