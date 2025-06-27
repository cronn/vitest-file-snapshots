import type {
  SnapshotSerializer,
  SnapshotSerializerResult,
} from "../types/serializer";

export interface TextSerializerOptions {
  /**
   * Custom normalizers to apply before serialization
   */
  normalizers?: TextNormalizer[];
}

export type TextNormalizer = (value: string) => string;

export class TextSerializer implements SnapshotSerializer {
  private readonly normalizers: TextNormalizer[];

  public constructor(options: TextSerializerOptions = {}) {
    this.normalizers = options.normalizers ?? [];
  }

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
    let normalizedValue = value;

    for (const normalizer of this.normalizers) {
      normalizedValue = normalizer(normalizedValue);
    }

    return normalizedValue.trim();
  }
}
