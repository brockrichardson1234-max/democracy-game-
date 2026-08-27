import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const entry = path.join(root, "src", "ui", "main.tsx");
const extensions = ["", ".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", "/index.ts", "/index.tsx"];
const visited = new Set();
const forbiddenSymbols = ["GL0_SYNTHETIC_CONFIGURATION", "createDeterministicWorldFixture"];

const resolveImport = (from, specifier) => {
  if (!specifier.startsWith(".")) return null;
  const base = path.resolve(path.dirname(from), specifier);
  return extensions.map((suffix) => `${base}${suffix}`).find((candidate) => fs.existsSync(candidate) && fs.statSync(candidate).isFile()) ?? null;
};

const visit = (file) => {
  if (visited.has(file)) return;
  visited.add(file);
  const relative = path.relative(root, file).replaceAll("\\", "/");
  if (relative.startsWith("src/content/gl0-synthetic/")) throw new Error(`Production entry reaches quarantined GL0 module ${relative}.`);
  const source = fs.readFileSync(file, "utf8");
  for (const symbol of forbiddenSymbols) if (source.includes(symbol)) {
    throw new Error(`Production entry reaches forbidden legacy symbol ${symbol} through ${relative}.`);
  }
  const imports = source.matchAll(/(?:import|export)\s+(?:[^"']*?\s+from\s+)?["']([^"']+)["']/g);
  for (const match of imports) {
    const resolved = resolveImport(file, match[1]);
    if (resolved !== null) visit(resolved);
  }
};

visit(entry);
const appSource = fs.readFileSync(path.join(root, "src", "ui", "App.tsx"), "utf8");
if (!appSource.includes("createProductionGameSession")) throw new Error("Default App does not use the production game factory.");
console.log(`Production import graph verified across ${visited.size} local modules: accepted U.S. runtime, no GL0 boot path.`);
