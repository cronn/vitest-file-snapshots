import type { ExpectationResult, MatcherState } from "@vitest/expect";

import { JsonSerializer, TextSerializer } from "@cronn/lib-file-snapshots";
import { expect } from "vitest";
import { matchValidationFile } from "./file-matcher";
import type {
  VitestMatchJsonFileOptions,
  VitestMatchValidationFileOptions,
  VitestValidationFileMatcherConfig,
  VitestValidationFileMatchers,
} from "./types";

export function registerValidationFileMatchers(
  config: VitestValidationFileMatcherConfig = {},
): void {
  function toMatchJsonFile(
    this: MatcherState,
    received: unknown,
    options: VitestMatchJsonFileOptions = {},
  ): ExpectationResult {
    const { includeUndefinedObjectProperties, ...snapshotOptions } = options;
    return matchValidationFile({
      received,
      serializer: new JsonSerializer({ includeUndefinedObjectProperties }),
      config,
      options: snapshotOptions,
      matcherState: this,
    });
  }

  function toMatchTextFile(
    this: MatcherState,
    received: unknown,
    options: VitestMatchValidationFileOptions = {},
  ): ExpectationResult {
    return matchValidationFile({
      received,
      serializer: new TextSerializer(),
      config,
      options,
      matcherState: this,
    });
  }

  expect.extend({
    toMatchJsonFile,
    toMatchTextFile,
  } satisfies VitestValidationFileMatchers);
}
