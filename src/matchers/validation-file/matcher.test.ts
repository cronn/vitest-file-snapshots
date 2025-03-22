import { describe, expect, test } from "vitest";

import { toMatchValidationFile } from "./matcher";

expect.extend({
  toMatchValidationFile,
});

test("validates object", () => {
  expect({
    stringValue: "value",
    booleanValue: true,
    numberValue: 4711,
    nullValue: null,
    undefinedValue: undefined,
    arrayValue: ["item1", "item2"],
    objectValue: {
      key: "value",
    },
  }).toMatchValidationFile();
});

test("validates array", () => {
  expect([
    "value",
    true,
    4711,
    null,
    undefined,
    ["item1", "item2"],
    {
      key: "value",
    },
  ]).toMatchValidationFile();
});

test("validates atomic values", () => {
  for (const { name, value } of [
    { name: "null", value: null },
    { name: "undefined", value: undefined },
    { name: "boolean", value: true },
    { name: "number", value: 4711 },
    { name: "string", value: "first line\nsecond line" },
  ]) {
    expect.soft(value).toMatchValidationFile({ suffix: name });
  }
});

test("validates JS-specific values", () => {
  expect({
    undefinedValue: undefined,
    nanValue: Number.NaN,
    minNumberValue: Number.MIN_VALUE,
    maxNumberValue: Number.MAX_VALUE,
    minSafeIntegerValue: Number.MIN_SAFE_INTEGER,
    maxSafeIntegerValue: Number.MAX_SAFE_INTEGER,
    positiveInfinityValue: Number.POSITIVE_INFINITY,
    negativeInfinityValue: Number.NEGATIVE_INFINITY,
    bigintValue: BigInt(1),
    setValue: new Set(["item1", "item2"]),
    mapValue: new Map([
      ["key1", "item1"],
      ["key2", "item2"],
    ]),
    promiseValue: Promise.resolve("async value"),
    functionValue: function functionName(): string {
      return "value";
    },
    arrowFunctionValue: (): string => {
      return "value";
    },
    dateValue: new Date("2000-01-01T12:34:56Z"),
    invalidDateValue: new Date("invalid"),
    symbolValue: Symbol("description"),
  }).toMatchValidationFile();
});

test("includes undefined object properties", () => {
  expect({
    undefinedValue: undefined,
  }).toMatchValidationFile({ includeUndefinedObjectProperties: true });
});

describe("creates directory for describe block", () => {
  test("creates file for test block", () => {
    expect("value").toMatchValidationFile();
  });
});

test("appends suffix to file name", () => {
  expect.soft("value1").toMatchValidationFile({ suffix: "value1" });
  expect.soft("value2").toMatchValidationFile({ suffix: "value2" });
});

test("when matcher is inverted, throws error", () => {
  expect(() => expect("value").not.toMatchValidationFile());
});
