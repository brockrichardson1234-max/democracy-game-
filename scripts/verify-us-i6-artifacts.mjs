import { readFile } from "node:fs/promises";
import { join, resolve } from "node:path";

import stateIdentities from "../src/content/us-v0/artifacts/state-identifiers.json" with { type: "json" };
import { buildI6Artifact, buildI6Manifest, serializeI6Artifact } from "./lib/us-i6-artifacts.mjs";

const root = resolve(import.meta.dirname, "..");
const sourceDirectory = join(root, "data/us-v0/i6-sources");
const artifactDirectory = join(root, "src/content/us-v0/i6-artifacts");
const artifact = await buildI6Artifact({
  appropriationBytes: await readFile(join(sourceDirectory, "plaw-118publ42.htm")),
  apportionmentBytes: await readFile(join(sourceDirectory, "omb-fy2024-home-apportionment.json")),
  arapahoeAwardBytes: await readFile(join(sourceDirectory, "usaspending-arapahoe-award.json")),
  arapahoePlanBytes: await readFile(join(sourceDirectory, "arapahoe-2025-2029-conplan.pdf")),
  consortiumAgreementBytes: await readFile(join(sourceDirectory, "englewood-consortium-renewal.pdf")),
  stablesWaiverBytes: await readFile(join(root, "data/us-v0/i4-sources/stables-waiver.pdf")),
  corpusAwardBytes: await readFile(join(sourceDirectory, "usaspending-corpus-christi-award.json")),
  palmsExpenditureBytes: await readFile(join(sourceDirectory, "corpus-september-2025-check-register.xlsx")),
  consortiumGuidanceBytes: await readFile(join(sourceDirectory, "hud-home-consortia.html")),
  currentStatuteBytes: await readFile(join(sourceDirectory, "plaw-119publ101.pdf")),
  currentRegulationBytes: await readFile(join(sourceDirectory, "ecfr-title24-part92-2026-08-19.xml")),
  delayedAmendmentsBytes: await readFile(join(sourceDirectory, "fr-2026-08339.html")),
  stateIdentityRecords: stateIdentities.records,
});
const outputs = new Map([
  ["finance-home-initialization.json", artifact],
  ["i6-initialization-manifest.json", buildI6Manifest(artifact)],
]);
for (const [filename, value] of outputs) {
  const committed = await readFile(join(artifactDirectory, filename), "utf8");
  if (committed !== serializeI6Artifact(value)) {
    throw new Error(`Committed I6 artifact ${filename} is not a byte-for-byte authenticated rebuild.`);
  }
}
process.stdout.write(
  "Authenticated U.S. I6 artifact reconstruction passed.\n" +
  `Authority: $${(artifact.budgetAuthorities[0].amount.minorUnits / 100).toLocaleString("en-US")}; ` +
  `awards: ${artifact.awards.length}; relationships: ${artifact.relationships.length}; coverage: ${artifact.coverage.length}.\n` +
  `Raw SHA-256 pins: ${JSON.stringify(Object.fromEntries(artifact.metadata.sources.map((source) => [source.sourceId + ":" + source.product, source.rawSha256])))}\n`,
);
