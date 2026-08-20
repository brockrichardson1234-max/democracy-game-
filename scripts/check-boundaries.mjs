import { readdir, readFile } from "node:fs/promises";
import { extname, join, relative, resolve } from "node:path";

const root = resolve(".");
const sourceExtensions = new Set([".ts", ".tsx", ".js", ".jsx", ".cjs", ".mjs"]);

const listSourceFiles = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true }).catch(() => []);
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await listSourceFiles(path)));
    else if (sourceExtensions.has(extname(entry.name))) files.push(path);
  }
  return files;
};

const importRules = [
  {
    root: "src/sim",
    forbidden: ["src/app", "../app", "src/ui", "../ui", "electron", "react", "react-dom", "node:", "vite"],
    reason: "simulation must remain platform- and presentation-independent",
  },
  {
    root: "src/app",
    forbidden: ["src/ui", "../ui", "electron", "react", "react-dom", "node:"],
    reason: "application/session layer must remain UI- and host-independent",
  },
  {
    root: "src/ui",
    forbidden: ["src/sim", "../sim", "electron", "node:"],
    reason: "UI consumes the application layer instead of canonical simulation state directly",
  },
  {
    root: "electron",
    forbidden: ["src/sim", "src/app", "src/ui"],
    reason: "Electron is an outer desktop host and contains no game-domain runtime logic",
  },
];

const violations = [];
for (const rule of importRules) {
  for (const file of await listSourceFiles(join(root, rule.root))) {
    const source = await readFile(file, "utf8");
    for (const forbidden of rule.forbidden) {
      const escaped = forbidden.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const pattern = new RegExp(
        `(?:from\\s+|import\\s*\\(|require\\s*\\()\\s*["'][^"']*${escaped}[^"']*["']`,
        "m",
      );
      if (pattern.test(source)) {
        violations.push(`${relative(root, file)} imports ${forbidden}: ${rule.reason}`);
      }
    }
  }
}

const simForbiddenGlobals = [
  ["Math.random", /\bMath\.random\s*\(/],
  ["Date.now", /\bDate\.now\s*\(/],
  ["new Date", /\bnew\s+Date\s*\(/],
  ["performance.now", /\bperformance\.now\s*\(/],
  ["window", /\bwindow\b/],
  ["document", /\bdocument\b/],
  ["navigator", /\bnavigator\b/],
  ["localStorage", /\blocalStorage\b/],
  ["sessionStorage", /\bsessionStorage\b/],
  ["fetch", /\bfetch\s*\(/],
  ["setTimeout", /\bsetTimeout\s*\(/],
  ["setInterval", /\bsetInterval\s*\(/],
];

for (const file of await listSourceFiles(join(root, "src/sim"))) {
  const source = await readFile(file, "utf8");
  for (const [name, pattern] of simForbiddenGlobals) {
    if (pattern.test(source)) {
      violations.push(`${relative(root, file)} uses ${name}: canonical simulation cannot depend on uncontrolled platform/wall-clock/random APIs`);
    }
  }
}

if (violations.length > 0) {
  process.stderr.write(`${violations.join("\n")}\n`);
  process.exitCode = 1;
} else {
  process.stdout.write("Runtime boundary check passed.\n");
}
