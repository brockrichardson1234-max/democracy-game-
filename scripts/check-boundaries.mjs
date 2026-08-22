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
    forbidden: ["src/app", "../app", "src/ui", "../ui", "src/content", "../content", "electron", "react", "react-dom", "node:", "vite"],
    reason: "simulation must remain platform-, presentation-, and named-content-independent",
  },
  {
    root: "src/configuration",
    forbidden: ["src/content", "../content", "src/ui", "../ui", "electron", "react", "react-dom"],
    reason: "production configuration loading/bootstrap cannot depend on a named content package or presentation",
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
        `(?:from\\s+|import\\s*\\(|require\\s*\\(|import\\s+)["'][^"']*${escaped}[^"']*["']`,
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

const stripComments = (source) =>
  source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:])\/\/.*$/gm, "$1");

const usExecutionTokens = [
  "USA",
  "UNITED_STATES",
  "HUD",
  "HOME",
  "HOUSE",
  "SENATE",
  "ELECTORAL_COLLEGE",
  "FIPS",
  "GEOID",
];
for (const file of await listSourceFiles(join(root, "src/sim"))) {
  const source = stripComments(await readFile(file, "utf8"));
  for (const token of usExecutionTokens) {
    if (new RegExp(`\\b${token}\\b`).test(source)) {
      violations.push(`${relative(root, file)} contains U.S.-specific execution token ${token}`);
    }
  }
  for (const numericToken of [435, 538, 270]) {
    if (new RegExp(`(^|[^0-9_])${numericToken}([^0-9_]|$)`).test(source)) {
      violations.push(`${relative(root, file)} contains U.S.-specific execution number ${numericToken}`);
    }
  }
}

const genericConfigurationFiles = [
  ...(await listSourceFiles(join(root, "src/sim"))),
  join(root, "src/configuration/bootstrap.ts"),
];
for (const file of genericConfigurationFiles) {
  const source = stripComments(await readFile(file, "utf8"));
  if (
    /(?:if|switch)\s*\([^)]*(?:configurationId|scenarioId)[^)]*\)/m.test(source) ||
    /(?:configurationId|scenarioId)\s*={2,3}/m.test(source)
  ) {
    violations.push(`${relative(root, file)} branches on configuration/scenario identity`);
  }
}

const syntheticExecutionSymbols = [
  "STATE_A_ID",
  "STATE_B_ID",
  "STATE_C_ID",
  "GEOGRAPHY_REGION_A_ID",
  "GEOGRAPHY_REGION_B_ID",
  "GEOGRAPHY_REGION_C_ID",
  "HOUSING_REGION_A_ID",
  "HOUSING_REGION_B_ID",
  "HOUSING_REGION_C_ID",
  "PUBLIC_AUDIENCE_ALPHA_ID",
  "PUBLIC_AUDIENCE_BETA_ID",
  "PUBLIC_AUDIENCE_GAMMA_ID",
  "GL0_INCUMBENT_EXECUTIVE_ACTOR_ID",
  "GL0_OPPOSITION_EXECUTIVE_ACTOR_ID",
  "GL0_EXECUTIVE_CONTEST_ID",
  "GL0_EXECUTIVE_ELECTION_RESULT_ID",
  "GL0_EXECUTIVE_ELECTION_CERTIFICATION_ID",
  "DEPLOY_SUPPORT_TO_C",
];
const syntheticExecutionStrings = [
  "state-a",
  "state-b",
  "state-c",
  "geo-region-a",
  "geo-region-b",
  "geo-region-c",
  "gl0-public-audience-alpha",
  "gl0-public-audience-beta",
  "gl0-public-audience-gamma",
  "gl0-incumbent-executive-actor",
  "gl0-opposition-executive-actor",
  "gl0-executive-contest",
];
const syntheticCourtRouteContentStrings = [
  "EXECUTIVE_REDIRECTION_EXCEEDS_EXISTING_HOUSING_AUTHORITY",
  "TEMPORARY_NONEXECUTION_ORDER",
  "GRANT_DECISION_AUTHORIZES_SCOPED_TEMPORARY_NONEXECUTION_ORDER",
  "GRANT",
  "AUTONOMOUS_DETERMINISTIC_FIXTURE",
  "DO_NOT_EXECUTE_DISPUTED_HOUSING_FUNDS_REDIRECTION",
  "UNTIL_FURTHER_JUDICIAL_ORDER_OR_MERITS_RESOLUTION",
];
for (const file of await listSourceFiles(join(root, "src/sim"))) {
  const source = stripComments(await readFile(file, "utf8"));
  for (const token of syntheticExecutionSymbols) {
    if (new RegExp(`\\b${token}\\b`).test(source)) {
      violations.push(`${relative(root, file)} depends on synthetic fixture symbol ${token}`);
    }
  }
  for (const token of syntheticExecutionStrings) {
    if (source.includes(`"${token}"`) || source.includes(`'${token}'`)) {
      violations.push(`${relative(root, file)} owns synthetic fixture identity ${token}`);
    }
  }
  for (const token of syntheticCourtRouteContentStrings) {
    if (source.includes(`"${token}"`) || source.includes(`'${token}'`)) {
      violations.push(`${relative(root, file)} owns synthetic court-route content ${token}`);
    }
  }
  if (
    /resolveContestedAuthorityComplianceBoundary\s*\([\s\S]{0,300}?["'](?:COMPLY|REFUSE)["']/.test(
      source,
    )
  ) {
    violations.push(
      `${relative(root, file)} authors a scheduled court-route compliance response`,
    );
  }
  if (/\b(?:createInitial|createDeterministic)GL0\w*\b/.test(source)) {
    violations.push(`${relative(root, file)} owns a synthetic fixture builder`);
  }
}

if (violations.length > 0) {
  process.stderr.write(`${violations.join("\n")}\n`);
  process.exitCode = 1;
} else {
  process.stdout.write("Runtime boundary check passed.\n");
}
