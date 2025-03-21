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

  throw new Error(
    `Missing text normalization for value of type ${typeof value}.`,
  );
}
