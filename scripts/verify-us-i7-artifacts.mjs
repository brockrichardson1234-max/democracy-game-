import { readFile } from "node:fs/promises";
import { join, resolve } from "node:path";

import stateIdentities from "../src/content/us-v0/artifacts/state-identifiers.json" with { type: "json" };
import residentPopulation from "../src/content/us-v0/i4-artifacts/resident-population-controls-2025.json" with { type: "json" };
import { buildI7Artifact, buildI7Manifest, serializeI7Artifact } from "./lib/us-i7-artifacts.mjs";

const root = resolve(import.meta.dirname, "..");
const sourceDirectory = join(root, "data/us-v0/i7-sources");
const artifactDirectory = join(root, "src/content/us-v0/i7-artifacts");
const artifact = await buildI7Artifact({
  acsTables: Object.fromEntries(await Promise.all(["B25001", "B25002", "B25070", "B25106"].map(async (table) => [
    table, await readFile(join(sourceDirectory, `acsdt5y2024-${table.toLowerCase()}.dat`)),
  ]))),
  bpsBytes: await readFile(join(sourceDirectory, "bps-state-history-2025.xlsx")),
  palmsPermitBytes: await readFile(join(sourceDirectory, "palms-permits-feb-2025.pdf")),
  stablesWaiverBytes: await readFile(join(root, "data/us-v0/i4-sources/stables-waiver.pdf")),
  palmsProjectBytes: await readFile(join(root, "data/us-v0/i4-sources/palms-project.html")),
  stateIdentityRecords: stateIdentities.records,
  residentControls: residentPopulation.controls,
});
const outputs = new Map([
  ["housing-initialization.json", artifact],
  ["i7-initialization-manifest.json", buildI7Manifest(artifact)],
]);
for (const [filename, value] of outputs) {
  const committed = await readFile(join(artifactDirectory, filename), "utf8");
  if (committed !== serializeI7Artifact(value)) throw new Error(`Committed I7 artifact ${filename} is not a byte-for-byte authenticated rebuild.`);
}
process.stdout.write(
  `Authenticated U.S. I7 artifact reconstruction passed: ${artifact.controls.length} controls, ` +
  `${artifact.regions.length} regions, ${artifact.projects.length} projects.\n` +
  `Raw SHA-256 pins: ${JSON.stringify(Object.fromEntries(artifact.metadata.sources.map((source) => [source.product, source.rawSha256])))}\n`,
);
