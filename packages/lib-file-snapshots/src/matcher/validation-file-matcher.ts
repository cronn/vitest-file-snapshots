import * as fs from "node:fs";
import * as path from "node:path";
import "vitest";

import type {
  MatchValidationFileOptions,
  ValidationFileMatcherConfig,
  ValidationFileMatcherResult,
  ValidationFileMeta,
} from "../types/matcher";
import {
  mkdirRecursive,
  normalizeFileName,
  readSnapshotFile,
  writeSnapshotFile,
} from "../utils/file";

export class ValidationFileMatcher {
  private readonly baseDir: string;
  private readonly validationDir: string;
  private readonly outputDir: string;

  public constructor(config: ValidationFileMatcherConfig = {}) {
    this.baseDir = config.baseDir ?? ".";
    this.validationDir = config.validationDir ?? "data/test/validation";
    this.outputDir = config.outputDir ?? "data/test/output";
  }

  public matchFileSnapshot(
    actual: unknown,
    options: MatchValidationFileOptions,
  ): ValidationFileMatcherResult {
    const { testName, testDir, fileSuffix, serializer } = options;

    if (!serializer.canSerialize(actual)) {
      throw new Error(`Cannot serialize value of type ${typeof actual}`);
    }

    const serializerResult = serializer.serialize(actual);

    const validationFilePath = this.buildValidationFilePath({
      testName,
      testDir,
      fileSuffix,
      fileExtension: serializerResult.fileExtension,
    });

    return this.writeFileSnapshots(
      serializerResult.serializedValue,
      validationFilePath,
    );
  }

  private buildValidationFilePath(options: ValidationFileMeta): string {
    const { testName, testDir, fileSuffix, fileExtension } = options;

    const normalizedTestNames = testName.map(normalizeFileName);
    const normalizedFileSuffix =
      fileSuffix !== undefined ? `_${normalizeFileName(fileSuffix)}` : "";

    const normalizedTestName = normalizedTestNames.pop();
    const absoluteValidationFilePath = path.join(
      testDir,
      ...normalizedTestNames,
    );
    const relativeValidationFilePath = path.relative(
      this.baseDir,
      absoluteValidationFilePath,
    );
    const validationFileName = `${normalizedTestName}${normalizedFileSuffix}.${fileExtension}`;
    return path.join(relativeValidationFilePath, validationFileName);
  }

  private writeFileSnapshots(
    actual: string,
    validationFilePath: string,
  ): ValidationFileMatcherResult {
    const validationFileDir = path.dirname(validationFilePath);
    const testOutputDir = `${this.outputDir}/${validationFileDir}`;
    const actualFile = `${this.outputDir}/${validationFilePath}`;

    const testValidationDir = `${this.validationDir}/${validationFileDir}`;
    const validationFile = `${this.validationDir}/${validationFilePath}`;

    mkdirRecursive(testOutputDir);
    mkdirRecursive(testValidationDir);

    if (!fs.existsSync(validationFile)) {
      writeSnapshotFile(validationFile, actual, true);
    }
    writeSnapshotFile(actualFile, actual);

    return {
      actual: readSnapshotFile(actualFile),
      expected: readSnapshotFile(validationFile),
      actualFile,
      validationFile,
    };
  }
}
