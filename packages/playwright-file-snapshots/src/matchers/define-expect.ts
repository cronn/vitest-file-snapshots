import { JsonSerializer, TextSerializer } from "@cronn/lib-file-snapshots";
import type {
  Expect,
  ExpectMatcherState,
  MatcherReturnType,
} from "@playwright/test";
import { expect as baseExpect } from "@playwright/test";
import { matchValidationFile } from "./file-matcher";
import type {
  PlaywrightMatchJsonFileOptions,
  PlaywrightMatchValidationFileOptions,
  PlaywrightValidationFileMatcherConfig,
  PlaywrightValidationFileMatchers,
} from "./types";

export function defineValidationFileExpect(
  config: PlaywrightValidationFileMatcherConfig = {},
): Expect<PlaywrightValidationFileMatchers> {
  function toMatchJsonFile(
    this: ExpectMatcherState,
    actual: unknown,
    options: PlaywrightMatchJsonFileOptions = {},
  ): MatcherReturnType {
    const { includeUndefinedObjectProperties, ...snapshotOptions } = options;
    return matchValidationFile({
      actual,
      name: "toMatchJsonFile",
      serializer: new JsonSerializer({ includeUndefinedObjectProperties }),
      config,
      options: snapshotOptions,
      matcherState: this,
    });
  }

  function toMatchTextFile(
    this: ExpectMatcherState,
    actual: unknown,
    options: PlaywrightMatchValidationFileOptions = {},
  ): MatcherReturnType {
    return matchValidationFile({
      actual,
      name: "toMatchTextFile",
      serializer: new TextSerializer(),
      config,
      options,
      matcherState: this,
    });
  }

  return baseExpect.extend({
    toMatchJsonFile,
    toMatchTextFile,
  });
}
