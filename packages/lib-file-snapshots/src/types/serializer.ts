export interface SnapshotSerializer {
  /**
   * Returns true when value can be serialized
   *
   * @param value The value to be serialized
   */
  canSerialize(value: unknown): boolean;

  /**
   * Serializes value
   *
   * @param value The value to be serialized
   * @throws {Error} Will throw an error if value cannot be serialized.
   */
  serialize(value: unknown): SnapshotSerializerResult;
}

export interface SnapshotSerializerResult {
  /**
   * The serialized value
   */
  serializedValue: string;

  /**
   * The file extension associated with the serialized value
   */
  fileExtension: string;
}
