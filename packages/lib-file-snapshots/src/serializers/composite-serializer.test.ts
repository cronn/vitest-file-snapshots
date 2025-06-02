import { test } from "vitest";
import {
  FailingSerializer,
  testSerializer,
  testSerializerThrows,
} from "../utils/test";
import { CompositeSerializer } from "./composite-serializer";
import { JsonSerializer } from "./json-serializer";
import { TextSerializer } from "./text-serializer";

test(
  "when value matches first serializer, applies first serializer",
  testSerializer(
    new CompositeSerializer([new TextSerializer(), new JsonSerializer()]),
    "text value",
  ),
);

test(
  "when value matches second serializer, applies second serializer",
  testSerializer(
    new CompositeSerializer([new TextSerializer(), new JsonSerializer()]),
    ["JSON value"],
  ),
);

test(
  "when no serializer matches, throws error",
  testSerializerThrows(
    new CompositeSerializer([new FailingSerializer()]),
    "value",
  ),
);
