import { MatchValidationFileOptions, toMatchValidationFile } from "./validation-file/matcher";

export { toMatchValidationFile };

export interface CustomMatchers<R = unknown> {
  toMatchValidationFile: (options?: MatchValidationFileOptions) => R;
}
