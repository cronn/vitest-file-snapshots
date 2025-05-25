import type { Options } from "tsup";

export function tsupConfig(options: Options): Options {
  return {
    platform: "node",
    format: ["esm"],
    dts: true,
    outDir: "./dist",
    clean: true,
    skipNodeModulesBundle: true,
    ...options,
  };
}
