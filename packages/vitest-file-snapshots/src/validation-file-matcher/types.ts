export interface VitestValidationFileMatchers<R = unknown> {
  toMatchValidationFile: (options?: VitestMatchValidationFileOptions) => R;
}

export interface VitestMatchValidationFileOptions {
  /**
   * Unique name of the file snapshot
   *
   * Used to distinguish multiple file snapshots within the same `test`.
   */
  name?: string;

  /**
   * Serializes `undefined` properties in objects. By default, they are omitted.
   *
   * @default false
   */
  includeUndefinedObjectProperties?: boolean;
}

export interface VitestValidationFileMatcherConfig {
  /**
   * Base directory for tests
   *
   * The paths of snapshot files will be relative to this directory.
   * @default "."
   */
  testDir?: string;

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
