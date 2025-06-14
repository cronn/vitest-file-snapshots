import { test } from "@playwright/test";
import { defineValidationFileExpect } from "../../src";

const expect = defineValidationFileExpect();

test.describe("describe title", () => {
  test("test title", async () => {
    await test.step("step with single assertion", () => {
      expect("value").toMatchValidationFile();
    });

    await test.step("step with multiple assertions", () => {
      expect("value 1").toMatchValidationFile({ name: "snapshot 1" });
      expect("value 2").toMatchValidationFile({ name: "snapshot 2" });
    });

    await test.step("step with nested step", async () => {
      await test.step("nested step", () => {
        expect("value").toMatchValidationFile();
      });
    });
  });
});
