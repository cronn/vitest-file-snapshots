import { describe, expect, test } from "vitest";
import { parseTestInfo, parseTestPath, parseTestSteps } from "./utils";

describe("parseTestInfo", () => {
  test("when titlePath is empty, throws error", () => {
    expect(() => parseTestInfo({ titlePath: [] })).toThrowError();
  });

  test("when _steps is missing, throws error", () => {
    expect(() =>
      parseTestInfo({ titlePath: ["tests/feature.spec.ts", "test title"] }),
    ).toThrowError();
  });
});

describe("parseTestSteps", () => {
  test("extracts titles of user defined test steps", () => {
    expect(
      parseTestSteps([
        { title: "expect", category: "expect", steps: [] },
        { title: "pw:api", category: "pw:api", steps: [] },
        { title: "hook", category: "hook", steps: [] },
        { title: "fixture", category: "fixture", steps: [] },
        { title: "attach", category: "test.attach", steps: [] },
        {
          title: "root step",
          category: "test.step",
          steps: [
            {
              title: "nested step",
              category: "test.step",
              steps: [],
            },
          ],
        },
      ]),
    ).toStrictEqual(["root step", "nested step"]);
  });

  test("when steps contain no user defined step, returns empty array", () => {
    expect(
      parseTestSteps([
        { title: "expect", category: "expect", steps: [] },
        { title: "pw:api", category: "pw:api", steps: [] },
        { title: "hook", category: "hook", steps: [] },
        { title: "fixture", category: "fixture", steps: [] },
        { title: "attach", category: "test.attach", steps: [] },
      ]),
    ).toHaveLength(0);
  });
});

describe("parseTestPath", () => {
  test.each([
    ".spec.ts",
    ".test.ts",
    ".spec.js",
    ".test.js",
    ".spec.mjs",
    ".test.mjs",
  ])("removes test extension %s from test path", (testExtension) => {
    expect(parseTestPath(`tests/feature${testExtension}`)).toBe(
      "tests/feature",
    );
  });
});
