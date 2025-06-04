# @cronn/vitest-file-snapshots

## 0.5.0

### Minor Changes

- 6e55368: Deprecate suffix in favor of fileSuffix

### Patch Changes

- 4fc3c09: Generalize serializers and extract validation file matcher
- a2a8534: chore(deps): bump @types/node from 22.15.21 to 22.15.29
- Updated dependencies [4fc3c09]
- Updated dependencies [a2a8534]
  - @cronn/lib-file-snapshots@0.2.0

## 0.4.2

### Patch Changes

- 25931bc: Update dependencies
- 12d4a0b: Extract core library to @cronn/lib-file-snapshots
- Updated dependencies [25931bc]
- Updated dependencies [12d4a0b]
  - @cronn/lib-file-snapshots@0.1.0

## 0.4.1

### Patch Changes

- f9541a3: Update dependencies

## 0.4.0

### Minor Changes

- 8864f93: Enable configuration of snapshot directories.

  This is a breaking change. Before, the base directory for snapshot files was `src`, now it is the root directory. This allows using the matcher in projects where tests are located in a different directory.
  The validation file matcher must now be setup using the following snippet:

  ```ts
  import { registerValidationFileMatcher } from "@cronn/vitest-file-snapshots/matcher";

  registerValidationFileMatcher();
  ```

  To achieve the previous behavior, the following configuration can be used:

  ```ts
  import { registerValidationFileMatcher } from "@cronn/vitest-file-snapshots/matcher";

  registerValidationFileMatcher({
    baseDir: "src",
  });
  ```

## 0.3.2

### Patch Changes

- 8152882: Fix path in README

## 0.3.1

### Patch Changes

- e7975cc: Fix example in README

## 0.3.0

### Minor Changes

- 94c5937: - Normalize file suffix
  - Fix module augmentation in declaration file

## 0.2.0

### Minor Changes

- 5ad7bb0: Improve test name normalization

## 0.1.0

### Minor Changes

- 6dd1b10: Initial release
