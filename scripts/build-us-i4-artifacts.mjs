import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";

import stateIdentities from "../src/content/us-v0/artifacts/state-identifiers.json" with { type: "json" };
import districtIdentities from "../src/content/us-v0/artifacts/house-district-identities-119.json" with { type: "json" };
import {
  buildI4Artifacts,
  buildI4InitializationManifest,
  serializeArtifact,
} from "./lib/us-i4-artifacts.mjs";

const argumentsByName = new Map();
for (let index = 2; index < process.argv.length; index += 2) {
  argumentsByName.set(process.argv[index], process.argv[index + 1]);
}

const sourceDirectory = resolve(argumentsByName.get("--source-dir") ?? "data/us-v0/i4-sources");
const districtSourcePath = resolve(
  argumentsByName.get("--district-source") ?? "data/us-v0/topology-sources/cd119-500k.zip",
);
const outputDirectory = resolve(argumentsByName.get("--output-dir") ?? "src/content/us-v0/i4-artifacts");

const artifacts = await buildI4Artifacts({
  stateZipBytes: await readFile(join(sourceDirectory, "state-500k.zip")),
  districtZipBytes: await readFile(districtSourcePath),
  populationBytes: await readFile(join(sourceDirectory, "nst-est2025-alldata.csv")),
  tenureBytes: await readFile(join(sourceDirectory, "acsdt5y2024-b25008.dat")),
  cvapBytes: await readFile(join(sourceDirectory, "cvap-2020-2024.zip")),
  electoralBytes: await readFile(join(sourceDirectory, "nara-electoral-allocation.html")),
  stablesBytes: await readFile(join(sourceDirectory, "stables-waiver.pdf")),
  palmsBytes: await readFile(join(sourceDirectory, "palms-project.html")),
  stateIdentityRecords: stateIdentities.records,
  districtIdentityRecords: districtIdentities.districts,
});

const manifest = buildI4InitializationManifest(artifacts);

const outputs = new Map([
  ["state-geography-2025.json", artifacts.geography.states],
  ["district-geography-cd119-2025.json", artifacts.geography.districts],
  ["resident-population-controls-2025.json", artifacts.population],
  ["tenure-exposure-input-acs2024.json", artifacts.tenure],
  ["cvap-proxy-state-2020-2024.json", artifacts.cvap],
  ["project-locators.json", artifacts.projectLocators],
  ["population-initial-cohorts-2026-08-22.json", artifacts.cohorts],
  ["electoral-allocation-2028.json", artifacts.electoral],
  ["i4-initialization-manifest.json", manifest],
]);

await mkdir(outputDirectory, { recursive: true });
for (const [filename, artifact] of outputs) {
  await writeFile(join(outputDirectory, filename), serializeArtifact(artifact));
}

process.stdout.write(
  `Wrote ${artifacts.geography.states.features.length} state/DC geometries, ` +
  `${artifacts.geography.districts.features.length} district geometries, ` +
  `${artifacts.population.controls.length} resident controls, ${artifacts.cohorts.cohorts.length} cohorts, ` +
  `${artifacts.cvap.records.length} eligibility proxies, and ${artifacts.electoral.totalElectors} static electors.\n`,
);
