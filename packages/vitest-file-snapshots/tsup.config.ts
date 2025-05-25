import { tsupConfig } from "@cronn/shared-configs/tsup";
import { defineConfig } from "tsup";

export default defineConfig((options) =>
  tsupConfig({
    entry: ["src/matcher.ts"],
    ...options,
  }),
);
