import * as fs from "node:fs";

const generatedDeclarationFile = "./dist/matcher.d.ts";

if (!fs.existsSync(generatedDeclarationFile)) {
  throw new Error("Declaration file does not exist.");
}

const declaration = fs.readFileSync(generatedDeclarationFile);
fs.writeFileSync(generatedDeclarationFile, `import "vitest";\n${declaration}`);
