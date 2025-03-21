import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginImport from "eslint-plugin-import";
import eslintPluginUnusedImports from "eslint-plugin-unused-imports";
import tseslint from "typescript-eslint";

export default tseslint.config(
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  eslintConfigPrettier,
  {
    plugins: {
      import: eslintPluginImport,
      "unused-imports": eslintPluginUnusedImports,
    },
    languageOptions: {
      ecmaVersion: 6,
      sourceType: "module",
      parserOptions: {
        projectService: true,
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
  },
  {
    rules: {
      "no-console": ["warn"],
      "no-debugger": ["warn"],
      "func-style": ["error", "declaration"],
      "no-duplicate-imports": ["warn"],

      "@typescript-eslint/unbound-method": "off",
      "@typescript-eslint/no-misused-promises": [
        "error",
        {
          checksVoidReturn: {
            attributes: false,
          },
        },
      ],

      "@typescript-eslint/no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],
    },
  },
  {
    files: ["src/**/*"],
    rules: {
      "import/no-default-export": "error",
    },
  },
);
