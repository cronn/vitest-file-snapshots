import fs from "fs";

export function bannerValue(value: string): string {
  return `===== ${value} =====`;
}

export function mkdir(path: string): void {
  fs.mkdirSync(path, { recursive: true });
}

export function readFile(path: string): string {
  return fs.readFileSync(path, { encoding: "utf8" });
}

export function writeFile(file: string, data: string): void {
  fs.writeFileSync(file, data, { encoding: "utf8" });
}
