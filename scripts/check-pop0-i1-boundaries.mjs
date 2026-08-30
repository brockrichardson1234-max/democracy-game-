import { spawnSync } from "node:child_process";
import { existsSync, statSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { dirname, relative, resolve } from "node:path";

const root = resolve(".");
const entry = resolve(root, "src/app/presidential-operating-proof-session.ts");
const acceptedProductionBase = "44c1724962830225e6fc34f41d0df0cfdb7dfec0";
const stageOneCommit = "a7e04ca78ba1ccb06d8dc3a4dfb0d43389804144";
const extensions = ["", ".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", "/index.ts", "/index.tsx"];
const forbiddenFiles = new Set([
  "src/app/integrated-session.ts",
  "src/app/opening-usability.ts",
  "src/app/production-session.ts",
  "src/app/production-contract.ts",
]);
const forbiddenStageOnePaths = [
  "artifacts/stage1-decision-receipt.png",
  "artifacts/stage1-opening.png",
  "artifacts/stage1-sponsor-decision.png",
  "src/app/opening-usability.ts",
  "tests/stage1-opening-usability.test.ts",
];
const forbiddenSymbols = [
  "IntegratedPartialRuntimeSession",
  "IntegratedPartialSaveEnvelope",
  "ProductionGameSession",
  "ProductionGameView",
  "ProductionPlayerAction",
  "availablePlayerActions",
  "dispatchPlayerCommand",
  "INTEGRATED_PARTIAL_SAVE_FORMAT_VERSION",
  "opening-usability",
];
const forbiddenAuditPatterns = [
  /\b[A-Za-z_$][\w$]*Audit[\w$]*\b/,
  /\binject[A-Z]\w*\b/,
];

const git = (...args) => {
  const result = spawnSync("git", args, { cwd: root, encoding: "utf8" });
  if (result.error !== undefined || result.status !== 0) {
    const detail = result.error?.message ?? (result.stderr.trim() || `exit ${String(result.status)}`);
    throw new Error(`POP0-I1 ancestry check could not run git ${args.join(" ")}: ${detail}`);
  }
  return result.stdout.trim();
};

const mergeBase = git("merge-base", "HEAD", "origin/main");
if (mergeBase !== acceptedProductionBase) {
  throw new Error(
    `POP0-I1 merge base must remain ${acceptedProductionBase}; received ${mergeBase}.`,
  );
}
const mainTip = git("rev-parse", "origin/main");
if (mainTip !== acceptedProductionBase) {
  throw new Error(
    `POP0-I1 verification requires unchanged main at ${acceptedProductionBase}; received ${mainTip}.`,
  );
}
const stageOneAncestry = spawnSync(
  "git",
  ["merge-base", "--is-ancestor", stageOneCommit, "HEAD"],
  { cwd: root, encoding: "utf8" },
);
if (stageOneAncestry.error !== undefined || ![0, 1].includes(stageOneAncestry.status ?? -1)) {
  const detail = stageOneAncestry.error?.message ?? stageOneAncestry.stderr.trim();
  throw new Error(`POP0-I1 Stage 1 ancestry check failed to execute: ${detail}`);
}
if (stageOneAncestry.status === 0) {
  throw new Error(`POP0-I1 branch must not contain Stage 1 commit ${stageOneCommit}.`);
}

const resolveImport = (from, specifier) => {
  if (!specifier.startsWith(".")) return null;
  const base = resolve(dirname(from), specifier);
  return extensions
    .map((suffix) => `${base}${suffix}`)
    .find((candidate) => existsSync(candidate) && statSync(candidate).isFile()) ?? null;
};

if (!existsSync(entry)) throw new Error("POP0-I1 proof factory entry is missing.");
for (const path of forbiddenStageOnePaths) {
  if (existsSync(resolve(root, path))) {
    throw new Error(`Stage 1 source/artifact ${path} must not exist on the POP0 implementation branch.`);
  }
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
  const importPatterns = [
    /(?:import|export)\s+(?:[^"']*?\s+from\s+)?["']([^"']+)["']/g,
    /\b(?:import|require)\s*\(\s*["']([^"']+)["']\s*\)/g,
  ];
  for (const pattern of importPatterns) {
    for (const match of source.matchAll(pattern)) {
      const resolved = resolveImport(file, match[1]);
      if (resolved !== null) await visit(resolved);
    }
  }
};

await visit(entry);
console.log(
  `POP0-I1 boundary verified across ${visited.size} modules at accepted base ${acceptedProductionBase}: no Stage 1, legacy session, global action surface, or audit dependency.`,
);
