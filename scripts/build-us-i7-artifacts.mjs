import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";

import stateIdentities from "../src/content/us-v0/artifacts/state-identifiers.json" with { type: "json" };
import residentPopulation from "../src/content/us-v0/i4-artifacts/resident-population-controls-2025.json" with { type: "json" };
import { buildI7Artifact, buildI7Manifest, serializeI7Artifact } from "./lib/us-i7-artifacts.mjs";

const sourceDirectory = resolve("data/us-v0/i7-sources");
const artifactDirectory = resolve("src/content/us-v0/i7-artifacts");
const artifact = await buildI7Artifact({
  acsTables: Object.fromEntries(await Promise.all(["B25001", "B25002", "B25070", "B25106"].map(async (table) => [
    table, await readFile(join(sourceDirectory, `acsdt5y2024-${table.toLowerCase()}.dat`)),
  ]))),
  bpsBytes: await readFile(join(sourceDirectory, "bps-state-history-2025.xlsx")),
  palmsPermitBytes: await readFile(join(sourceDirectory, "palms-permits-feb-2025.pdf")),
  stablesWaiverBytes: await readFile(resolve("data/us-v0/i4-sources/stables-waiver.pdf")),
  palmsProjectBytes: await readFile(resolve("data/us-v0/i4-sources/palms-project.html")),
  stateIdentityRecords: stateIdentities.records,
  residentControls: residentPopulation.controls,
});
const manifest = buildI7Manifest(artifact);
await mkdir(artifactDirectory, { recursive: true });
await writeFile(join(artifactDirectory, "housing-initialization.json"), serializeI7Artifact(artifact));
await writeFile(join(artifactDirectory, "i7-initialization-manifest.json"), serializeI7Artifact(manifest));
process.stdout.write(`Wrote ${artifact.controls.length} controls, ${artifact.regions.length} regions, and ${artifact.projects.length} projects.\n`);
