import { defineConfig } from "tsup";

export default defineConfig((options) => ({
  entry: ["src/extend-expect.ts"],
  platform: "node",
  format: ["esm"],
  dts: true,
  outDir: "./dist",
  clean: true,
  ...options,
}));
