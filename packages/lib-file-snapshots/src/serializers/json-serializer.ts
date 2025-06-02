import type {
  SnapshotSerializer,
  SnapshotSerializerResult,
} from "../types/serializer";
import { isArray, isPlainObject } from "../utils/guards";

type JsonValue =
  | Record<string, unknown>
  | unknown[]
  | string
  | number
  | boolean
  | null;

export interface JsonSerializerOptions {
  /**
   * Serializes `undefined` properties in objects. By default, they are omitted.
   *
   * @default false
   */
  includeUndefinedObjectProperties?: boolean;
}

export class JsonSerializer implements SnapshotSerializer {
  private readonly includeUndefinedObjectProperties: boolean;

  public constructor(options: JsonSerializerOptions = {}) {
    this.includeUndefinedObjectProperties =
      options.includeUndefinedObjectProperties ?? false;
  }

  public canSerialize(value: unknown): boolean {
    return true;
  }

  public serialize(value: unknown): SnapshotSerializerResult {
    const jsonValue =
      isPlainObject(value) || isArray(value)
        ? this.normalizeValueRecursive(value)
        : this.normalizeValue(value);
    const serializedValue = JSON.stringify(jsonValue, undefined, 2);

    return {
      serializedValue: serializedValue,
      fileExtension: "json",
    };
  }

  private normalizeValueRecursive(value: unknown): JsonValue {
    if (isArray(value)) {
      return this.normalizeArray(value);
    }

    if (isPlainObject(value)) {
      return this.normalizePlainObject(value);
    }

    if (
      typeof value === "string" ||
      typeof value === "boolean" ||
      value === null
    ) {
      return value;
    }

    return this.normalizeValue(value);
  }

  private normalizeValue(value: unknown): JsonValue {
    if (value === undefined) {
      return this.serializedValue("undefined");
    }

    if (
      value === null ||
      typeof value === "string" ||
      typeof value === "boolean"
    ) {
      return this.serializedValue(typeof value, { value });
    }

    if (typeof value === "number") {
      return this.normalizeNumber(value);
    }

    if (typeof value === "bigint") {
      return this.serializedValue("bigint", { value: value.toString() });
    }

    if (typeof value === "symbol") {
      return this.serializedValue("symbol", { description: value.description });
    }

    if (typeof value === "function") {
      return this.serializedValue("function", { name: value.name });
    }

    if (typeof value === "object") {
      return this.normalizeObject(value);
    }

    throw new Error(
      `Missing JSON normalization for value of type ${typeof value}.`,
    );
  }

  private normalizeNumber(value: number): JsonValue {
    if (Number.isNaN(value)) {
      return this.serializedValue("number", { value: "Number.NaN" });
    }

    switch (value) {
      case Number.MIN_VALUE:
        return this.serializedValue("number", { value: "Number.MIN_VALUE" });
      case Number.MAX_VALUE:
        return this.serializedValue("number", { value: "Number.MAX_VALUE" });
      case Number.MIN_SAFE_INTEGER:
        return this.serializedValue("number", {
          value: "Number.MIN_SAFE_INTEGER",
        });
      case Number.MAX_SAFE_INTEGER:
        return this.serializedValue("number", {
          value: "Number.MAX_SAFE_INTEGER",
        });
      case Number.NEGATIVE_INFINITY:
        return this.serializedValue("number", {
          value: "Number.NEGATIVE_INFINITY",
        });
      case Number.POSITIVE_INFINITY:
        return this.serializedValue("number", {
          value: "Number.POSITIVE_INFINITY",
        });
      default:
        return value;
    }
  }

  private normalizeArray(value: unknown[]): JsonValue {
    return value.map((item) => this.normalizeValueRecursive(item));
  }

  private normalizeObject(value: object): JsonValue {
    if (value instanceof Date) {
      return this.normalizeDate(value);
    }

    if (value instanceof Promise) {
      return this.serializedValue("Promise");
    }

    if (value instanceof Set) {
      return this.serializedValue("Set", {
        values: this.normalizeArray(Array.from(value.values())),
      });
    }

    if (value instanceof Map) {
      const mapAsObject = this.normalizeMap(value);
      return this.serializedValue("Map", {
        values: this.normalizePlainObject(mapAsObject),
      });
    }

    throw new Error(
      `Missing JSON normalization for object of type ${Object.getPrototypeOf(value)}`,
    );
  }

  private normalizeDate(value: Date): JsonValue {
    if (Number.isNaN(value.getTime())) {
      return this.serializedValue("Date", { value: "Invalid date" });
    }

    return this.serializedValue("Date", { value: value.toISOString() });
  }

  private normalizePlainObject(value: object): JsonValue {
    const normalizedObject: Record<string, unknown> = {};

    for (const [key, propertyValue] of Object.entries(value)) {
      if (
        propertyValue === undefined &&
        !this.includeUndefinedObjectProperties
      ) {
        continue;
      }

      this.assertKeyType(key);
      normalizedObject[key] = this.normalizeValueRecursive(propertyValue);
    }

    return normalizedObject;
  }

  private normalizeMap(value: Map<unknown, unknown>): Record<string, unknown> {
    return Array.from(value.entries()).reduce(
      (object, [key, value]) => {
        this.assertKeyType(key);
        object[key] = value;
        return object;
      },
      {} as Record<string, unknown>,
    );
  }

  private serializedValue(
    type: string,
    additionalProps: Partial<Record<string, JsonValue>> = {},
  ): JsonValue {
    return { $type: type, ...additionalProps };
  }

  private assertKeyType(key: unknown): asserts key is string {
    if (!(typeof key === "string")) {
      throw new Error(`Key of type ${typeof key} cannot be normalized.`);
    }
  }
}
