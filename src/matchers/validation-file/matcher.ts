import * as fs from "node:fs";
import * as path from "node:path";
import type { ExpectationResult, MatcherState } from "@vitest/expect";
import "vitest";

import {
  OUTPUT_FOLDER,
  TEST_PATH_SEPARATOR,
  VALIDATION_FOLDER,
} from "./config";
import { serializeAsJson } from "./json-serializer";
import { normalizeTestName } from "./normalizers";
import { serializeAsText } from "./text-serializer";
import type { SerializerResult } from "./types";
import { bannerValue, mkdir, readFile, writeFile } from "./utils";

export interface MatchValidationFileOptions {
  suffix?: string;
  includeUndefinedObjectProperties?: boolean;
}

export function toMatchValidationFile(
  this: MatcherState,
  received: unknown,
  options: MatchValidationFileOptions = {},
): ExpectationResult {
  const { currentTestName, testPath, equals, isNot } = this;

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
  const suffix = options.suffix !== undefined ? `_${options.suffix}` : "";

  const serializerResult = serializeValue(
    received,
    options.includeUndefinedObjectProperties,
  );
  const actual = `${serializerResult.value}\n`;

  const testName = testNames.pop();
  const absoluteTestNamePath = path.join(testPath, ...testNames);
  const relativeTestNamePath = path.relative("src", absoluteTestNamePath);
  const fileName = `${testName}${suffix}.${serializerResult.fileExtension}`;

  const outputFolder = `${OUTPUT_FOLDER}/${relativeTestNamePath}`;
  const actualFile = `${outputFolder}/${fileName}`;

  const validationFolder = `${VALIDATION_FOLDER}/${relativeTestNamePath}`;
  const validationFile = `${validationFolder}/${fileName}`;

  mkdir(outputFolder);
  mkdir(validationFolder);

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
