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
  [
    { name: "null", value: null },
    { name: "undefined", value: undefined },
    { name: "boolean", value: true },
    { name: "number", value: 4711 },
    { name: "string", value: "first line\nsecond line" },
  ].forEach(({ name, value }) => {
    expect.soft(value).toMatchValidationFile({ suffix: name });
  });
});

test("validates JS values", () => {
  expect({
    undefinedValue: undefined,
    infinityValue: Infinity,
    nanValue: Number.NaN,
    setValue: new Set(["item1", "item2"]),
    mapValue: new Map([
      ["key1", "item1"],
      ["key2", "item2"],
    ]),
    promiseValue: Promise.resolve("async value"),
    functionValue: () => {
      return "value";
    },
    dateValue: new Date("2000-01-01T12:34:56Z"),
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
  expect.soft("value1").toMatchValidationFile({ suffix: "value1"});
  expect.soft("value2").toMatchValidationFile({ suffix: "value2"});
});

test("when matcher is inverted, throws error", () => {
  expect(() => expect("value").not.toMatchValidationFile());
});
