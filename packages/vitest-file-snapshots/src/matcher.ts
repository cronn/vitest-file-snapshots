import type { VitestValidationFileMatchers } from "./validation-file-matcher/types";

declare module "vitest" {
  // biome-ignore lint/suspicious/noExplicitAny: needs to use same type as extended interface
  interface Assertion<T = any> extends VitestValidationFileMatchers<T> {}
  interface AsymmetricMatchersContaining extends VitestValidationFileMatchers {}
}

export { registerValidationFileMatcher } from "./validation-file-matcher/matcher";
