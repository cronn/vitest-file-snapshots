import { isArray, isObject } from "./guards";
import { SerializerResult } from "./types";

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
  if (!(typeof value === "object")) {
    throw new Error(
      `Value of type ${typeof value} cannot be serialized as JSON.`,
    );
  }

  const jsonValue = normalizeValue(value, options);
  const serializedValue = JSON.stringify(jsonValue, undefined, 2);

  return {
    value: serializedValue,
    fileExtension: "json",
  };
}

function normalizeValue(
  value: unknown,
  options: JsonSerializerOptions,
): JsonValue {
  if (value === undefined) {
    return normalizedValue("undefined");
  }

  if (Number.isNaN(value)) {
    return normalizedValue("number", "NaN");
  }

  if (value === Infinity) {
    return normalizedValue("number", "Infinity");
  }

  if (typeof value === "symbol") {
    return normalizedValue("Symbol", value.description);
  }

  if (value instanceof Date) {
    return normalizedValue("Date", value.toISOString());
  }

  if (value instanceof Promise) {
    return normalizedValue("Promise");
  }

  if (typeof value === "function") {
    return normalizedValue("Function");
  }

  if (
    typeof value === "string" ||
    typeof value === "boolean" ||
    typeof value === "number" ||
    value === null
  ) {
    return value;
  }

  if (isArray(value)) {
    return normalizeArray(value, options);
  }

  if (isObject(value)) {
    return normalizeObject(value, options);
  }

  throw new Error(
    `Value of type ${typeof value} cannot be normalized to JSON.`,
  );
}

function normalizeArray(
  value: unknown[],
  options: JsonSerializerOptions,
): JsonValue {
  return value.map((item) => normalizeValue(item, options));
}

function normalizeObject(
  value: object,
  options: JsonSerializerOptions,
): JsonValue {
  if (value instanceof Set) {
    return normalizedValue(
      "Set",
      normalizeArray(Array.from(value.values()), options),
    );
  }

  if (value instanceof Map) {
    const mapAsObject = normalizeMap(value);
    return normalizedValue("Map", normalizeObject(mapAsObject, options));
  }

  const normalizedObject: Record<string, unknown> = {};

  for (const [key, propertyValue] of Object.entries(value)) {
    if (
      propertyValue === undefined &&
      !options.includeUndefinedObjectProperties
    ) {
      continue;
    }

    assertKeyType(key);
    normalizedObject[key] = normalizeValue(propertyValue, options);
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

function normalizedValue(type: string, value?: JsonValue) {
  return { $type: type, value };
}

function assertKeyType(key: unknown): asserts key is string {
  if (!(typeof key === "string")) {
    throw new Error(`Key of type ${typeof key} cannot be normalized.`);
  }
}
