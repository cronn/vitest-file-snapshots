import { test } from "vitest";
import { testSerializer, testSerializerThrows } from "../utils/test";
import { TextSerializer } from "./text-serializer";

test("text", testSerializer(new TextSerializer(), "value"));

test(
  "text with control characters",
  testSerializer(
    new TextSerializer(),
    "first line\nsecond line\n\ttabbed line",
  ),
);

test(
  "text with leading and trailing whitespaces",
  testSerializer(new TextSerializer(), " value "),
);

test(
  "when value is not of type string, throws error",
  testSerializerThrows(new TextSerializer(), ["value"]),
);
