import { readFileSync } from "node:fs";

const packageJson = JSON.parse(readFileSync("package.json", "utf8"));
const tauriConfig = JSON.parse(readFileSync("src-tauri/tauri.conf.json", "utf8"));
const cargoToml = readFileSync("src-tauri/Cargo.toml", "utf8");
const cargoMatch = cargoToml.match(/^version = "([^"]+)"/m);

if (!cargoMatch) {
  console.error("Cargo.toml is missing a package version.");
  process.exit(1);
}

const versions = {
  package: packageJson.version,
  tauri: tauriConfig.version,
  cargo: cargoMatch[1],
};

const unique = new Set(Object.values(versions));
if (unique.size !== 1) {
  console.error("Version mismatch.");
  console.error(versions);
  process.exit(1);
}

console.log(
  `Version ${versions.package} matches package.json, tauri.conf.json, and Cargo.toml.`,
);
