import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { dirname, relative, resolve } from "node:path";

const root = resolve(".");
const entry = resolve(root, "src/app/presidential-operating-proof-session.ts");
const extensions = ["", ".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", "/index.ts", "/index.tsx"];
const forbiddenFiles = new Set([
  "src/app/integrated-session.ts",
  "src/app/production-session.ts",
  "src/app/production-contract.ts",
  "src/ui/opening-usability.ts",
]);
const forbiddenSymbols = [
  "IntegratedPartialRuntimeSession",
  "ProductionGameSession",
  "ProductionGameView",
  "availablePlayerActions",
  "dispatchPlayerCommand",
  "INTEGRATED_PARTIAL_SAVE_FORMAT_VERSION",
  "opening-usability",
];
const forbiddenAuditPatterns = [
  /\bget[A-Z]\w*Audit\b/,
  /\binject[A-Z]\w*\b/,
];

const resolveImport = (from, specifier) => {
  if (!specifier.startsWith(".")) return null;
  const base = resolve(dirname(from), specifier);
  return extensions
    .map((suffix) => `${base}${suffix}`)
    .find((candidate) => existsSync(candidate)) ?? null;
};

if (!existsSync(entry)) throw new Error("POP0-I1 proof factory entry is missing.");
if (existsSync(resolve(root, "src/ui/opening-usability.ts"))) {
  throw new Error("Stage 1 opening-usability source must not exist on the POP0 implementation branch.");
}

const visited = new Set();
const visit = async (file) => {
  if (visited.has(file)) return;
  visited.add(file);
  const path = relative(root, file).replaceAll("\\", "/");
  if (forbiddenFiles.has(path)) throw new Error(`POP0-I1 reaches forbidden legacy dependency ${path}.`);
  const source = await readFile(file, "utf8");
  for (const symbol of forbiddenSymbols) {
    if (source.includes(symbol)) throw new Error(`POP0-I1 reaches forbidden symbol ${symbol} through ${path}.`);
  }
  for (const pattern of forbiddenAuditPatterns) {
    if (pattern.test(source)) throw new Error(`POP0-I1 reaches an audit-only API through ${path}.`);
  }
  for (const match of source.matchAll(/(?:import|export)\s+(?:[^"']*?\s+from\s+)?["']([^"']+)["']/g)) {
    const resolved = resolveImport(file, match[1]);
    if (resolved !== null) await visit(resolved);
  }
};

await visit(entry);
console.log(`POP0-I1 boundary verified across ${visited.size} modules: no Stage 1, legacy session, global action surface, or audit dependency.`);
