import type {
  SnapshotSerializer,
  SnapshotSerializerResult,
} from "../types/serializer";

export class TextSerializer implements SnapshotSerializer {
  public canSerialize(value: unknown): value is string {
    return typeof value === "string";
  }

  public serialize(value: unknown): SnapshotSerializerResult {
    if (!this.canSerialize(value)) {
      throw new Error(
        `Missing text serialization for value of type ${typeof value}.`,
      );
    }

    return {
      serializedValue: this.normalizeValue(value),
      fileExtension: "txt",
    };
  }

  private normalizeValue(value: string): string {
    return value.trim();
  }
}
