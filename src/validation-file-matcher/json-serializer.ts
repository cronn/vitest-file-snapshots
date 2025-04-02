import { isArray, isPlainObject } from "./guards";
import type { SerializerResult } from "./types";

type JsonValue =
  | Record<string, unknown>
  | unknown[]
  | string
  | number
  | boolean
  | null;

interface JsonSerializerOptions {
  includeUndefinedObjectProperties: boolean;
}

export function serializeAsJson(
  value: unknown,
  options: JsonSerializerOptions,
): SerializerResult {
  const jsonValue =
    isPlainObject(value) || isArray(value)
      ? normalizeValueRecursive(value, options)
      : normalizeValue(value, options);
  const serializedValue = JSON.stringify(jsonValue, undefined, 2);

  return {
    value: serializedValue,
    fileExtension: "json",
  };
}

function normalizeValueRecursive(
  value: unknown,
  options: JsonSerializerOptions,
): JsonValue {
  if (isArray(value)) {
    return normalizeArray(value, options);
  }

  if (isPlainObject(value)) {
    return normalizePlainObject(value, options);
  }

  if (
    typeof value === "string" ||
    typeof value === "boolean" ||
    value === null
  ) {
    return value;
  }

  return normalizeValue(value, options);
}

function normalizeValue(
  value: unknown,
  options: JsonSerializerOptions,
): JsonValue {
  if (value === undefined) {
    return normalizedValue("undefined");
  }

  if (
    value === null ||
    typeof value === "string" ||
    typeof value === "boolean"
  ) {
    return normalizedValue(typeof value, { value });
  }

  if (typeof value === "number") {
    return normalizeNumber(value);
  }

  if (typeof value === "bigint") {
    return normalizedValue("bigint", { value: value.toString() });
  }

  if (typeof value === "symbol") {
    return normalizedValue("symbol", { description: value.description });
  }

  if (typeof value === "function") {
    return normalizedValue("function", { name: value.name });
  }

  if (typeof value === "object") {
    return normalizeObject(value, options);
  }

  throw new Error(
    `Missing JSON normalization for value of type ${typeof value}.`,
  );
}

function normalizeNumber(value: number): JsonValue {
  if (Number.isNaN(value)) {
    return normalizedValue("number", { value: "Number.NaN" });
  }

  switch (value) {
    case Number.MIN_VALUE:
      return normalizedValue("number", { value: "Number.MIN_VALUE" });
    case Number.MAX_VALUE:
      return normalizedValue("number", { value: "Number.MAX_VALUE" });
    case Number.MIN_SAFE_INTEGER:
      return normalizedValue("number", { value: "Number.MIN_SAFE_INTEGER" });
    case Number.MAX_SAFE_INTEGER:
      return normalizedValue("number", { value: "Number.MAX_SAFE_INTEGER" });
    case Number.NEGATIVE_INFINITY:
      return normalizedValue("number", { value: "Number.NEGATIVE_INFINITY" });
    case Number.POSITIVE_INFINITY:
      return normalizedValue("number", { value: "Number.POSITIVE_INFINITY" });
    default:
      return value;
  }
}

function normalizeArray(
  value: unknown[],
  options: JsonSerializerOptions,
): JsonValue {
  return value.map((item) => normalizeValueRecursive(item, options));
}

function normalizeObject(
  value: object,
  options: JsonSerializerOptions,
): JsonValue {
  if (value instanceof Date) {
    return normalizeDate(value);
  }

  if (value instanceof Promise) {
    return normalizedValue("Promise");
  }

  if (value instanceof Set) {
    return normalizedValue("Set", {
      values: normalizeArray(Array.from(value.values()), options),
    });
  }

  if (value instanceof Map) {
    const mapAsObject = normalizeMap(value);
    return normalizedValue("Map", {
      values: normalizePlainObject(mapAsObject, options),
    });
  }

  throw new Error(
    `Missing JSON normalization for object of type ${Object.getPrototypeOf(value)}`,
  );
}

function normalizeDate(value: Date): JsonValue {
  if (Number.isNaN(value.getTime())) {
    return normalizedValue("Date", { value: "Invalid date" });
  }

  return normalizedValue("Date", { value: value.toISOString() });
}

function normalizePlainObject(
  value: object,
  options: JsonSerializerOptions,
): JsonValue {
  const normalizedObject: Record<string, unknown> = {};

  for (const [key, propertyValue] of Object.entries(value)) {
    if (
      propertyValue === undefined &&
      !options.includeUndefinedObjectProperties
    ) {
      continue;
    }

    assertKeyType(key);
    normalizedObject[key] = normalizeValueRecursive(propertyValue, options);
  }

  return normalizedObject;
}

function normalizeMap(value: Map<unknown, unknown>): Record<string, unknown> {
  return Array.from(value.entries()).reduce(
    (object, [key, value]) => {
      assertKeyType(key);
      object[key] = value;
      return object;
    },
    {} as Record<string, unknown>,
  );
}

function normalizedValue(
  type: string,
  additionalProps: Partial<Record<string, JsonValue>> = {},
): JsonValue {
  return { $type: type, ...additionalProps };
}

function assertKeyType(key: unknown): asserts key is string {
  if (!(typeof key === "string")) {
    throw new Error(`Key of type ${typeof key} cannot be normalized.`);
  }
}
