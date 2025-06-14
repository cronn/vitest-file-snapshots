import { test } from "@playwright/test";
import { defineValidationFileExpect } from "../src";

const expect = defineValidationFileExpect();

test("when includeUndefinedObjectProperties is true, serializes undefined object properties", () => {
  expect({ undefinedProperty: undefined }).toMatchValidationFile({
    includeUndefinedObjectProperties: true,
  });
});

test("when name is specified, appends suffix to snapshot file name", () => {
  expect("value").toMatchValidationFile({ name: "name" });
});
