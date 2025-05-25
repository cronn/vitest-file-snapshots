import { describe, expect, test } from "vitest";

import { normalizeTestName } from "./normalizers";

describe("normalize test name", () => {
  test.each([" ", ".", ":", "'"])("replaces '%s' by underscore", (value) => {
    expect(normalizeTestName(value)).toBe("_");
  });

  test.each([","])("removes '%s' from test name", (value) => {
    expect(normalizeTestName(value)).toBe("");
  });

  test("unwraps quoted value", () => {
    expect(normalizeTestName(`'value with 1 number'`)).toBe(
      "value_with_1_number",
    );
  });

  test("removes plus from positive zero", () => {
    expect(normalizeTestName("+0")).toBe("0");
  });
});
