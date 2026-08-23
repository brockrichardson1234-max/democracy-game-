import { readFile } from "node:fs/promises";
import { join, resolve } from "node:path";

import stateIdentities from "../src/content/us-v0/artifacts/state-identifiers.json" with { type: "json" };
import districtIdentities from "../src/content/us-v0/artifacts/house-district-identities-119.json" with { type: "json" };
import {
  buildI4Artifacts,
  buildI4InitializationManifest,
  serializeArtifact,
  sha256,
} from "./lib/us-i4-artifacts.mjs";

const root = resolve(import.meta.dirname, "..");
const sourceDirectory = join(root, "data/us-v0/i4-sources");
const districtSourcePath = join(root, "data/us-v0/topology-sources/cd119-500k.zip");
const artifactDirectory = join(root, "src/content/us-v0/i4-artifacts");

const sources = {
  stateZipBytes: await readFile(join(sourceDirectory, "state-500k.zip")),
  districtZipBytes: await readFile(districtSourcePath),
  populationBytes: await readFile(join(sourceDirectory, "nst-est2025-alldata.csv")),
  tenureBytes: await readFile(join(sourceDirectory, "acsdt5y2024-b25008.dat")),
  cvapBytes: await readFile(join(sourceDirectory, "cvap-2020-2024.zip")),
  electoralBytes: await readFile(join(sourceDirectory, "nara-electoral-allocation.html")),
  stablesBytes: await readFile(join(sourceDirectory, "stables-waiver.pdf")),
  palmsBytes: await readFile(join(sourceDirectory, "palms-project.html")),
};
const artifacts = await buildI4Artifacts({
  ...sources,
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

for (const [filename, artifact] of outputs) {
  const committed = await readFile(join(artifactDirectory, filename), "utf8");
  const reconstructed = serializeArtifact(artifact);
  if (committed !== reconstructed) throw new Error(`Committed I4 artifact ${filename} is not a byte-for-byte authenticated rebuild.`);
}

const rawHashes = Object.fromEntries(Object.entries(sources).map(([name, bytes]) => [name, sha256(bytes)]));
process.stdout.write(
  "Authenticated U.S. I4 artifact reconstruction passed.\n" +
  `State Geography: ${artifacts.geography.states.features.length}; District Geography: ${artifacts.geography.districts.features.length}.\n` +
  `Resident controls: ${artifacts.population.controls.length}; Cohorts: ${artifacts.cohorts.cohorts.length}; ` +
  `eligibility proxies: ${artifacts.cvap.records.length}; electors: ${artifacts.electoral.totalElectors}.\n` +
  `Raw SHA-256 pins: ${JSON.stringify(rawHashes)}\n`,
);
