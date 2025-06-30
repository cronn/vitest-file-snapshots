import type { Locator } from "@playwright/test";
import { parse } from "yaml";

import {
  type PlainObject,
  isArray,
  isPlainObject,
  isString,
} from "@cronn/lib-file-snapshots";
import {
  isNonNullish,
  isSingleItemArray,
  parseSinglePropertyObject,
  unwrapSingleItemArray,
} from "./utils";

export async function snapshotAria(locator: Locator): Promise<unknown> {
  return await new AriaSnapshot().snapshot(locator);
}

class AriaSnapshot {
  private readonly textNodeTypes = ["text", "paragraph"];

  public async snapshot(locator: Locator): Promise<unknown> {
    const yamlSnapshot = await locator.ariaSnapshot();
    const jsonSnapshot: unknown = parse(yamlSnapshot);
    return this.normalizeJsonRecursive(jsonSnapshot);
  }

  private normalizeJsonRecursive(value: unknown): unknown {
    if (isArray(value)) {
      return this.normalizeArray(value);
    }

    if (isPlainObject(value)) {
      return this.normalizeObject(value);
    }

    if (isString(value)) {
      return this.normalizeString(value);
    }

    return value;
  }

  private normalizeArray(array: unknown[]): unknown {
    const normalizedArray = array
      .map((item) => this.normalizeJsonRecursive(item))
      .filter(isNonNullish);

    if (isSingleItemArray(normalizedArray)) {
      return unwrapSingleItemArray(normalizedArray);
    }

    return normalizedArray;
  }

  private normalizeObject(value: PlainObject): unknown {
    const objectEntries = Object.entries(value);
    const normalizedObject: PlainObject = {};
    for (const [key, value] of objectEntries) {
      normalizedObject[this.normalizeString(key)] =
        this.normalizeJsonRecursive(value);
    }

    if (this.isAtomicTextNode(normalizedObject)) {
      return this.unwrapAtomicTextNode(value);
    }

    return normalizedObject;
  }

  private isAtomicTextNode(value: PlainObject): boolean {
    const node = parseSinglePropertyObject(value);
    return (
      this.textNodeTypes.some(
        (textObjectType) => node.key === textObjectType,
      ) && isString(node.value)
    );
  }

  private unwrapAtomicTextNode(value: PlainObject): string {
    const node = parseSinglePropertyObject(value);
    return `${node.key} '${node.value}'`;
  }

  private normalizeString(value: string): string {
    return value.replaceAll('"', "'");
  }
}
