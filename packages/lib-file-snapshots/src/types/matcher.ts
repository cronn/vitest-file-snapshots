import type { SnapshotSerializer } from "./serializer";

export interface ValidationFileMatcherConfig {
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

export interface MatchValidationFileOptions {
  /**
   * The full name of the test, including the names of nested describe blocks
   *
   * @example ["test feature", "when x, then y"]
   */
  testName: string[];

  /**
   * The directory in which the current test is located
   */
  testDir: string;

  /**
   * Appends `fileSuffix` to the generated snapshot file
   *
   * Should be used whenever having multiple snapshot assertions in a single `test`.
   */
  fileSuffix?: string;

  /**
   * The serializer to use for the snapshot
   */
  serializer: SnapshotSerializer;
}

export interface ValidationFileMeta {
  testName: string[];
  testDir: string;
  fileSuffix?: string;
  fileExtension: string;
}

export interface ValidationFileMatcherResult {
  actual: string;
  expected: string;
  actualFile: string;
  validationFile: string;
}
