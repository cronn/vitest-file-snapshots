import type { MatcherReturnType } from "@playwright/test";

export interface PlaywrightValidationFileMatcherConfig {
  /**
   * Directory in which golden masters are stored
   *
   * @default "data/test/validation"
   */
  validationDir?: string;

  /**
   * Directory in which file snapshots from test runs are stored
   *
   * @default "data/test/output"
   */
  outputDir?: string;
}

export interface PlaywrightValidationFileMatchers {
  toMatchValidationFile: (
    actual: unknown,
    options?: PlaywrightMatchValidationFileOptions,
  ) => MatcherReturnType;
}

export interface PlaywrightMatchValidationFileOptions {
  /**
   * Unique name of the file snapshot
   *
   * Used to distinguish multiple file snapshots within the same `test` or `test.step`.
   */
  name?: string;

  /**
   * Serializes `undefined` properties in objects. By default, they are omitted.
   *
   * @default false
   */
  includeUndefinedObjectProperties?: boolean;
}
