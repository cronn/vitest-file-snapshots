export interface ValidationFileMatchers<R = unknown> {
  toMatchValidationFile: (options?: ValidationFileMatcherOptions) => R;
}

export interface ValidationFileMatcherOptions {
  /**
   * Appends `suffix` to the generated snapshot file
   *
   * Should be used whenever having multiple snapshot assertions in a single `test`.
   */
  suffix?: string;

  /**
   * Serializes `undefined` properties in objects. By default, they are omitted.
   *
   * @default false
   */
  includeUndefinedObjectProperties?: boolean;
}

export interface ValidationFileOptions {
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
