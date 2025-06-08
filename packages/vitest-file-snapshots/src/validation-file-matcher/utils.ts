import { TEST_PATH_SEPARATOR } from "./config";

export function parseTestName(currentTestName: string): string[] {
  return currentTestName.split(TEST_PATH_SEPARATOR);
}

export function parseTestPath(testPath: string): string {
  return testPath.replace(/\.(test|spec)\.[cm]?[tj]sx?$/, "");
}
