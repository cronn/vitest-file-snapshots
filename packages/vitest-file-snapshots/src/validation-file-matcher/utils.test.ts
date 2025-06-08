import { describe, expect, test } from "vitest";
import { parseTestName } from "./utils";

describe("parseTestName", () => {
  test("splits test name into titles", () => {
    expect(parseTestName("a > b > c")).toStrictEqual(["a", "b", "c"]);
  });
});

