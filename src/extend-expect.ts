import { expect } from "vitest";

import * as matchers from "./matchers";
import type { CustomMatchers } from "./matchers";

expect.extend(matchers);

declare module "vitest" {
  // biome-ignore lint/suspicious/noExplicitAny: needs to use same type as extended interface
  interface Assertion<T = any> extends CustomMatchers<T> {}
  interface AsymmetricMatchersContaining extends CustomMatchers {}
}
