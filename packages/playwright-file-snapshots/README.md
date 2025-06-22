# playwright-file-snapshots

Write tests with Playwright using file snapshots.

## Motivation

Classical assertions in Playwright typically assert only specific aspects of a page considered relevant for the current test. Complex assertions are usually cumbersome to write and hard to maintain. Also, regressions caused by side effects might be introduced unnoticed, because assertions focus only on what's expected to change after a user interaction.

File snapshots can help to increase test coverage by enabling assertions which cover larger portions of a tested page. `playwright-file-snapshots` provides a custom matcher for snapshot testing with the following features:

- Zero configuration: snapshot files are named based on the test name
- Automatic serialization of snapshots as JSON (default) or text (string values
  only)

## Getting Started

### Adding the library to your project

```shell
npm install -D @cronn/playwright-file-snapshots
```

```shell
yarn add -D @cronn/playwright-file-snapshots
```

```shell
pnpm add -D @cronn/playwright-file-snapshots
```

### Using the Custom Matcher in your project

Import the Custom Matcher in your test:

```ts
import { defineValidationFileExpect } from "@cronn/playwright-file-snapshots";

const expect = defineValidationFileExpect();
```

### Adding output files to `.gitignore`

All file snapshots are generated to `/data/test`. The golden masters will be
stored in `/data/test/validation`, which should be under version control. The
file snapshots generated for test runs will be stored under
`/data/test/output` and should be ignored:

```gitignore
# file snapshots
/data/test/output
```

## Writing Tests

File snapshot assertions use the custom matcher `toMatchValidationFile`:

```ts
test("value is expected value", () => {
  expect({ value: "expected value" }).toMatchValidationFile();
});

// value_is_expected_value.json
// {
//   "value": "expected value"
// }
```

### Using Soft Assertions

`toMatchValidationFile` uses soft assertions by default. This allows to check all snapshots within a test in single run:

```ts
test("perform login", async () => {
  await test.step("initial page", async () => {
    const snapshot = await myPage.snapshot();
    expect(snapshot).toMatchValidationFile();
  });

  await test.step("login page", async () => {
    await myPage.login("user", "password");
    const snapshot = await myPage.snapshot();
    expect(snapshot).toMatchValidationFile();
  });
});
```

## Configuration

### Matcher Options

Matcher options can be passed when defining the matcher:

 ```ts
import { defineValidationFileExpect } from "@cronn/playwright-file-snapshots";

const expect = defineValidationFileExpect({
  validationDir: "custom-validation",
  outputDir: "custom-output"
});
```

| Option          | Default Value          | Description                                                                               |
|-----------------|------------------------|-------------------------------------------------------------------------------------------|
| `validationDir` | `data/test/validation` | Directory in which golden masters are stored.                                             |
| `outputDir`     | `data/test/output`     | Directory in which file snapshots from test runs are stored.                              |


### Snapshot Options

Snapshot options can be passed whenever calling the validation file matcher:

 ```ts
expect(value).toMatchValidationFile({
  includeUndefinedObjectProperties: true
});
```

| Option                             | Default Value | Description                                                                                               |
|------------------------------------|---------------|-----------------------------------------------------------------------------------------------------------|
| `name`                             | `undefined`   | Unique `name` of the file snapshot. Used to distinguish multiple file snapshots within the same `test`.   |
| `includeUndefinedObjectProperties` | `false`       | Serializes `undefined` properties in objects. By default, they are omitted.                               |
