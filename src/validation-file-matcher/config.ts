import type { ValidationFileOptions } from "./types";

export const TEST_PATH_SEPARATOR = " > ";

export const DEFAULT_VALIDATION_FILE_OPTIONS = {
  baseDir: ".",
  validationDir: "data/test/validation",
  outputDir: "data/test/output",
} satisfies ValidationFileOptions;
