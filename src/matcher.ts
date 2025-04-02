import type { ValidationFileMatchers } from "./validation-file-matcher/types";

declare module "vitest" {
  // biome-ignore lint/suspicious/noExplicitAny: needs to use same type as extended interface
  interface Assertion<T = any> extends ValidationFileMatchers<T> {}
  interface AsymmetricMatchersContaining extends ValidationFileMatchers {}
}

export { registerValidationFileMatcher } from "./validation-file-matcher/matcher";
