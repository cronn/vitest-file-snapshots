import type { ValidationFileMatchers } from "./matchers/validation-file/types";

declare module "vitest" {
  // biome-ignore lint/suspicious/noExplicitAny: needs to use same type as extended interface
  interface Assertion<T = any> extends ValidationFileMatchers<T> {}
  interface AsymmetricMatchersContaining extends ValidationFileMatchers {}
}

export { registerValidationFileMatcher } from "./matchers/validation-file/matcher";
