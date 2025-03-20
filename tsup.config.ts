import { defineConfig } from "tsup";

export default defineConfig((options) => ({
  entry: ["src/extend-expect.ts"],
  platform: "node",
  format: ["esm"],
  outDir: "./lib",
  clean: true,
  ...options,
}));
