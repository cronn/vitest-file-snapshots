import { test } from "@playwright/test";
import { defineValidationFileExpect } from "../src";

const expect = defineValidationFileExpect();

test("when value is of type string, serializes snapshot as txt file", () => {
  expect("text").toMatchValidationFile();
});

test("when value is not of type string, serializes snapshot as json file", () => {
  expect(["value"]).toMatchValidationFile();
});
