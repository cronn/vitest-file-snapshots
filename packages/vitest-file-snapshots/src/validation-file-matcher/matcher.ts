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
import { parseTestName, parseTestPath } from "./utils";

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

  const { name, includeUndefinedObjectProperties } = options;
  const matcherResult = new ValidationFileMatcher(config).matchFileSnapshot(
    received,
    {
      testPath: parseTestPath(testPath),
      titlePath: parseTestName(currentTestName),
      name,
      serializer: new CompositeSerializer([
        new TextSerializer(),
        new JsonSerializer({
          includeUndefinedObjectProperties,
        }),
      ]),
    },
  );

  return {
    pass: equals(matcherResult.actual, matcherResult.expected, [], true),
    message: matcherResult.message,
    actual: matcherResult.actual,
    expected: matcherResult.expected,
  };
}
