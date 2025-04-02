---
"@cronn/vitest-file-snapshots": minor
---

Enable configuration of snapshot directories.

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
  baseDir: "src"
});
```
