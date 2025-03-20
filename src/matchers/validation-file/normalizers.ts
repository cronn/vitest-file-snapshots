export function normalizeTestName(testName: string): string {
  return testName
    .replaceAll(/'\+?(\w+)'/g, "$1")
    .replaceAll(/[ .:']/g, "_")
    .replaceAll(/,/g, "");
}
