import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    exclude: configDefaults.exclude,
    environment: "node",
    reporters: ["default"],
    globals: true,
    coverage: {
      provider: "istanbul",
      all: true,
      reporter: ["text-summary", "html"],
      include: ["src/**/*"],
    },
  },
});
