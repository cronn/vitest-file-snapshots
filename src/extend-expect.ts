/* eslint-disable @typescript-eslint/no-empty-object-type, @typescript-eslint/no-explicit-any */
import { expect } from "vitest";

import * as matchers from "./matchers";
import type { CustomMatchers } from "./matchers";

expect.extend(matchers);

declare module "vitest" {
  interface Assertion<T = any> extends CustomMatchers<T> {}
  interface AsymmetricMatchersContaining extends CustomMatchers {}
}
