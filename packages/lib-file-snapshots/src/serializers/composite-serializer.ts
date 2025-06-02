import type {
  SnapshotSerializer,
  SnapshotSerializerResult,
} from "../types/serializer";

export class CompositeSerializer implements SnapshotSerializer {
  private readonly serializers: SnapshotSerializer[];

  public constructor(serializers: SnapshotSerializer[]) {
    this.serializers = serializers;
  }

  public canSerialize(value: unknown): boolean {
    return this.serializers.some((serializer) =>
      serializer.canSerialize(value),
    );
  }

  public serialize(value: unknown): SnapshotSerializerResult {
    for (const serializer of this.serializers) {
      if (serializer.canSerialize(value)) {
        return serializer.serialize(value);
      }
    }

    throw new Error(`Missing serializer for value of type ${typeof value}.`);
  }
}
