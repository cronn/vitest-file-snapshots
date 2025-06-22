import type { VitestValidationFileMatchers } from "./matchers/types";

declare module "vitest" {
  // biome-ignore lint/suspicious/noExplicitAny: needs to use same type as extended interface
  interface Assertion<T = any> extends VitestValidationFileMatchers<T> {}
  interface AsymmetricMatchersContaining extends VitestValidationFileMatchers {}
}

export { registerValidationFileMatchers } from "./matchers/register-matchers";
