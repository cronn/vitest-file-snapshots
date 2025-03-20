export function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

export function isObject(value: unknown): value is object {
  return typeof value == "object" && value !== null;
}
