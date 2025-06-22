import { test } from "@playwright/test";
import { defineValidationFileExpect } from "../src";

test("stores snapshots in custom directories", () => {
  const expect = defineValidationFileExpect({
    validationDir: "custom-data/validation",
    outputDir: "custom-data/output",
  });

  expect("value").toMatchTextFile();
});
