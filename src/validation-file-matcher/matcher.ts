import * as fs from "node:fs";
import * as path from "node:path";
import type { ExpectationResult, MatcherState } from "@vitest/expect";
import "vitest";

import { expect } from "vitest";
import { DEFAULT_VALIDATION_FILE_OPTIONS, TEST_PATH_SEPARATOR } from "./config";
import { serializeAsJson } from "./json-serializer";
import { normalizeTestName } from "./normalizers";
import { serializeAsText } from "./text-serializer";
import type {
  SerializerResult,
  ValidationFileMatcherOptions,
  ValidationFileOptions,
} from "./types";
import { bannerValue, mkdir, readFile, writeFile } from "./utils";

export function registerValidationFileMatcher(
  validationFileOptions: ValidationFileOptions = {},
): void {
  function toMatchValidationFile(
    this: MatcherState,
    received: unknown,
    matcherOptions: ValidationFileMatcherOptions = {},
  ): ExpectationResult {
    const mergedOptions: MatchValidationFileOptions = {
      ...DEFAULT_VALIDATION_FILE_OPTIONS,
      ...validationFileOptions,
      ...matcherOptions,
    };

    return matchValidationFile(received, mergedOptions, this);
  }

  expect.extend({
    toMatchValidationFile,
  });
}

type MatchValidationFileOptions = Required<ValidationFileOptions> &
  ValidationFileMatcherOptions;

function matchValidationFile(
  received: unknown,
  options: MatchValidationFileOptions,
  matcherState: MatcherState,
): ExpectationResult {
  const { currentTestName, testPath, equals, isNot } = matcherState;

  if (currentTestName === undefined) {
    throw new Error("Missing test name");
  }

  if (testPath === undefined) {
    throw new Error("Missing test path");
  }

  if (isNot) {
    throw new Error("Matcher negation is not supported");
  }

  const testNames = currentTestName
    .split(TEST_PATH_SEPARATOR)
    .map(normalizeTestName);
  const suffix =
    options.suffix !== undefined ? `_${normalizeTestName(options.suffix)}` : "";

  const serializerResult = serializeValue(
    received,
    options.includeUndefinedObjectProperties,
  );
  const actual = `${serializerResult.value}\n`;

  const testName = testNames.pop();
  const absoluteTestNamePath = path.join(testPath, ...testNames);
  const relativeTestNamePath = path.relative(
    options.baseDir,
    absoluteTestNamePath,
  );
  const fileName = `${testName}${suffix}.${serializerResult.fileExtension}`;

  const testOutputDir = `${options.outputDir}/${relativeTestNamePath}`;
  const actualFile = `${testOutputDir}/${fileName}`;

  const testValidationDir = `${options.validationDir}/${relativeTestNamePath}`;
  const validationFile = `${testValidationDir}/${fileName}`;

  mkdir(testOutputDir);
  mkdir(testValidationDir);

  if (!fs.existsSync(validationFile)) {
    writeFile(validationFile, `${bannerValue("missing file")}\n${actual}`);
  }
  writeFile(actualFile, actual);

  const storedActual = readFile(actualFile);
  const storedValidation = readFile(validationFile);

  return {
    pass: equals(storedActual, storedValidation, [], true),
    message: (): string => "Actual value does not match validation file.",
    actual: storedActual,
    expected: storedValidation,
  };
}

function serializeValue(
  value: unknown,
  includeUndefinedObjectProperties = false,
): SerializerResult {
  if (typeof value === "string") {
    return serializeAsText(value);
  }

  return serializeAsJson(value, { includeUndefinedObjectProperties });
}
