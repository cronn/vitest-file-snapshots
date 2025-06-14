import type { ExpectationResult, MatcherState } from "@vitest/expect";

import {
  CompositeSerializer,
  JsonSerializer,
  TextSerializer,
  ValidationFileMatcher,
} from "@cronn/lib-file-snapshots";
import { expect } from "vitest";
import type {
  VitestMatchValidationFileOptions,
  VitestValidationFileMatcherConfig,
  VitestValidationFileMatchers,
} from "./types";
import { parseTestName } from "./utils";

export function registerValidationFileMatcher(
  config: VitestValidationFileMatcherConfig = {},
): void {
  function toMatchValidationFile(
    this: MatcherState,
    received: unknown,
    options: VitestMatchValidationFileOptions = {},
  ): ExpectationResult {
    return matchValidationFile(received, config, options, this);
  }

  expect.extend({
    toMatchValidationFile,
  } satisfies VitestValidationFileMatchers);
}

function matchValidationFile(
  received: unknown,
  config: VitestValidationFileMatcherConfig,
  options: VitestMatchValidationFileOptions,
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

  const matcherResult = new ValidationFileMatcher(config).matchFileSnapshot(
    received,
    {
      testName: parseTestName(currentTestName),
      testDir: testPath,
      fileSuffix: options.fileSuffix ?? options.suffix,
      serializer: new CompositeSerializer([
        new TextSerializer(),
        new JsonSerializer({
          includeUndefinedObjectProperties:
            options.includeUndefinedObjectProperties,
        }),
      ]),
    },
  );

  return {
    pass: equals(matcherResult.actual, matcherResult.expected, [], true),
    message: (): string =>
      `${matcherResult.actualFile} does not match ${matcherResult.validationFile}`,
    actual: matcherResult.actual,
    expected: matcherResult.expected,
  };
}
