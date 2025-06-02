export function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

function isObject(value: unknown): value is object {
  return typeof value === "object" && value !== null && !isArray(value);
}

export function isPlainObject(
  value: unknown,
): value is Record<PropertyKey, unknown> {
  if (!isObject(value)) {
    return false;
  }

  const proto: unknown = Object.getPrototypeOf(value);
  return proto === null || proto === Object.prototype;
}
