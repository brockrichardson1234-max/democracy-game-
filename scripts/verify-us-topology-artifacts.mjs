import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import {
  buildHouseDistrictArtifact,
  serializeArtifact,
  sha256,
} from "./lib/us-topology-artifacts.mjs";

const root = resolve(".");
const sourceDirectory = resolve(root, "data/us-v0/topology-sources");
const artifactDirectory = resolve(root, "src/content/us-v0/artifacts");

const stateArtifact = JSON.parse(
  await readFile(resolve(artifactDirectory, "state-identifiers.json"), "utf8"),
);
const committedHouseArtifactBytes = await readFile(
  resolve(artifactDirectory, "house-district-identities-119.json"),
  "utf8",
);
const committedHouseArtifact = JSON.parse(committedHouseArtifactBytes);
const districtZipBytes = await readFile(resolve(sourceDirectory, "cd119-500k.zip"));
const apportionmentWorkbookBytes = await readFile(
  resolve(sourceDirectory, "apportionment-2020-table01.xlsx"),
);

const rebuilt = buildHouseDistrictArtifact({
  districtZipBytes,
  apportionmentWorkbookBytes,
  stateRecords: stateArtifact.records,
});
const rebuiltBytes = serializeArtifact(rebuilt);
if (rebuiltBytes !== committedHouseArtifactBytes) {
  throw new Error(
    "Authenticated Census topology sources do not reproduce house-district-identities-119.json byte-for-byte.",
  );
}

const expectedSources = new Map(
  committedHouseArtifact.metadata.sources.map((source) => [source.sourceId, source.rawSha256]),
);
const districtHash = sha256(districtZipBytes);
const apportionmentHash = sha256(apportionmentWorkbookBytes);
if (districtHash !== expectedSources.get("USR-SRC-0088")) {
  throw new Error("Committed Census district ZIP does not match recorded USR-SRC-0088 provenance.");
}
if (apportionmentHash !== expectedSources.get("USR-SRC-0090")) {
  throw new Error("Committed Census apportionment workbook does not match recorded USR-SRC-0090 provenance.");
}

process.stdout.write(
  [
    "Authenticated U.S. House topology artifact rebuild passed.",
    `District ZIP SHA-256: ${districtHash}`,
    `Apportionment workbook SHA-256: ${apportionmentHash}`,
    `Artifact records: ${rebuilt.districts.length} districts / ${rebuilt.apportionment.length} states.`,
  ].join("\n") + "\n",
);
