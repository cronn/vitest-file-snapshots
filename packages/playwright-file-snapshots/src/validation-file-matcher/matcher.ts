import {
  CompositeSerializer,
  JsonSerializer,
  TextSerializer,
  ValidationFileMatcher,
} from "@cronn/lib-file-snapshots";
import {
  type Expect,
  type ExpectMatcherState,
  type MatcherReturnType,
  expect as baseExpect,
  test,
} from "@playwright/test";
import type {
  PlaywrightMatchValidationFileOptions,
  PlaywrightValidationFileMatcherConfig,
  PlaywrightValidationFileMatchers,
} from "./types";
import { parseTestInfo } from "./utils";

export function defineValidationFileExpect(
  config: PlaywrightValidationFileMatcherConfig = {},
): Expect<PlaywrightValidationFileMatchers> {
  function toMatchValidationFile(
    this: ExpectMatcherState,
    actual: unknown,
    options: PlaywrightMatchValidationFileOptions = {},
  ): MatcherReturnType {
    return matchValidationFile(actual, config, options, this);
  }

  return baseExpect.extend({
    toMatchValidationFile,
  });
}

function matchValidationFile(
  actual: unknown,
  config: PlaywrightValidationFileMatcherConfig,
  options: PlaywrightMatchValidationFileOptions,
  matcherState: ExpectMatcherState,
): MatcherReturnType {
  const { isNot } = matcherState;

  if (isNot) {
    throw new Error("Matcher negation is not supported");
  }

  const { titlePath, testPath } = parseTestInfo(test.info());
  let pass: boolean;

  const { name, includeUndefinedObjectProperties } = options;
  const matcherResult = new ValidationFileMatcher(config).matchFileSnapshot(
    actual,
    {
      testPath,
      titlePath,
      name,
      serializer: new CompositeSerializer([
        new TextSerializer(),
        new JsonSerializer({
          includeUndefinedObjectProperties,
        }),
      ]),
    },
  );

  try {
    baseExpect.soft(matcherResult.actual).toBe(matcherResult.expected);
    pass = true;
  } catch (e: unknown) {
    pass = false;
  }

  return {
    name: "toMatchValidationFile",
    pass,
    message: matcherResult.message,
    expected: matcherResult.expected,
    actual: matcherResult.actual,
  };
}
