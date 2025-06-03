export interface VitestValidationFileMatchers<R = unknown> {
  toMatchValidationFile: (options?: VitestMatchValidationFileOptions) => R;
}

export interface VitestMatchValidationFileOptions {
  /**
   * Appends `fileSuffix` to the generated snapshot file
   *
   * Should be used whenever having multiple snapshot assertions in a single `test`.
   */
  fileSuffix?: string;

  /**
   * Appends `suffix` to the generated snapshot file
   *
   * @deprecated Use `fileSuffix` instead.
   */
  suffix?: string;

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
  baseDir?: string;

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
