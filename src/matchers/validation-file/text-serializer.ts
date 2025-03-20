import { bannerValue } from "./utils";
import { SerializerResult } from "./types";

export function serializeAsText(value: unknown): SerializerResult {
  return {
    value: normalizeValue(value),
    fileExtension: "txt",
  };
}

function normalizeValue(value: unknown): string {
  if (typeof value === "string") {
    return value.trim();
  }

  if (typeof value === "boolean" || typeof value === "number") {
    return value.toString();
  }

  if (value === undefined) {
    return bannerValue("undefined");
  }

  if (value === null) {
    return bannerValue("null");
  }

  if (Number.isNaN(value)) {
    return bannerValue("NaN");
  }

  if (value === Infinity) {
    return bannerValue("Infinity");
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (value instanceof Promise) {
    return bannerValue("Promise");
  }

  if (typeof value === "function") {
    return bannerValue("Function");
  }

  if (typeof value === "symbol") {
    return bannerValue(value.toString());
  }

  throw new Error(
    `Value of type ${typeof value} cannot be serialized as text.`,
  );
}
