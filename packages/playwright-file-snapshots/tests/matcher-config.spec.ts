import { test } from "@playwright/test";
import { defineValidationFileExpect } from "../src";

test("configure custom snapshot directories", () => {
  const expect = defineValidationFileExpect({
    validationDir: "custom-data/validation",
    outputDir: "custom-data/output",
  });

  expect("value").toMatchValidationFile();
});
