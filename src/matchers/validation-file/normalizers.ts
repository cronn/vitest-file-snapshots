export function normalizeTestName(testName: string): string {
  return testName
    .replaceAll(/\+0/g, "0")
    .replaceAll(/'([\w]+)'/g, "$1")
    .replaceAll(/[ .:']/g, "_")
    .replaceAll(/,/g, "");
}
