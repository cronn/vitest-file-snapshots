import { beforeEach, describe, expect, test } from "vitest";

import { registerValidationFileMatchers } from "./register-matchers";

describe("matcher configuration", () => {
  test("resolves test path relative to testDir", () => {
    registerValidationFileMatchers({
      testDir: "src",
    });

    expect("value").toMatchTextFile();
  });

  test("stores snapshots in custom directories", () => {
    registerValidationFileMatchers({
      validationDir: "custom-data/validation",
      outputDir: "custom-data/output",
    });

    expect("value").toMatchTextFile();
  });
});

describe("JSON file matcher", () => {
  beforeEach(() => registerValidationFileMatchers());

  test("matches value with JSON file", () => {
    expect({
      key: "value",
    }).toMatchJsonFile();
  });

  test("when includeUndefinedObjectProperties is true, serializes undefined object properties", () => {
    expect({
      undefinedValue: undefined,
    }).toMatchJsonFile({ includeUndefinedObjectProperties: true });
  });

  test("appends name to file name", () => {
    expect.soft("value1").toMatchJsonFile({ name: "value 1" });
    expect.soft("value2").toMatchJsonFile({ name: "value 2" });
  });

  test("when matcher is inverted, throws error", () => {
    expect(() => expect("value").not.toMatchJsonFile()).toThrowError();
  });
});

describe("text file matcher", () => {
  beforeEach(() => registerValidationFileMatchers());

  test("matches value with text file", () => {
    expect("value").toMatchTextFile();
  });

  test("appends name to file name", () => {
    expect.soft("value1").toMatchTextFile({ name: "value 1" });
    expect.soft("value2").toMatchTextFile({ name: "value 2" });
  });

  test("when matcher is inverted, throws error", () => {
    expect(() => expect("value").not.toMatchTextFile()).toThrowError();
  });
});
