import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";

import stateIdentities from "../src/content/us-v0/artifacts/state-identifiers.json" with { type: "json" };
import { buildI6Artifact, buildI6Manifest, serializeI6Artifact } from "./lib/us-i6-artifacts.mjs";

const sourceDirectory = resolve("data/us-v0/i6-sources");
const artifactDirectory = resolve("src/content/us-v0/i6-artifacts");
const artifact = await buildI6Artifact({
  appropriationBytes: await readFile(join(sourceDirectory, "plaw-118publ42.htm")),
  apportionmentBytes: await readFile(join(sourceDirectory, "omb-fy2024-home-apportionment.json")),
  arapahoeAwardBytes: await readFile(join(sourceDirectory, "usaspending-arapahoe-award.json")),
  arapahoePlanBytes: await readFile(join(sourceDirectory, "arapahoe-2025-2029-conplan.pdf")),
  consortiumAgreementBytes: await readFile(join(sourceDirectory, "englewood-consortium-renewal.pdf")),
  stablesWaiverBytes: await readFile(resolve("data/us-v0/i4-sources/stables-waiver.pdf")),
  corpusAwardBytes: await readFile(join(sourceDirectory, "usaspending-corpus-christi-award.json")),
  palmsExpenditureBytes: await readFile(join(sourceDirectory, "corpus-september-2025-check-register.xlsx")),
  consortiumGuidanceBytes: await readFile(join(sourceDirectory, "hud-home-consortia.html")),
  currentStatuteBytes: await readFile(join(sourceDirectory, "plaw-119publ101.pdf")),
  currentRegulationBytes: await readFile(join(sourceDirectory, "ecfr-title24-part92-2026-08-19.xml")),
  delayedAmendmentsBytes: await readFile(join(sourceDirectory, "fr-2026-08339.html")),
  stateIdentityRecords: stateIdentities.records,
});
const manifest = buildI6Manifest(artifact);
await mkdir(artifactDirectory, { recursive: true });
await writeFile(join(artifactDirectory, "finance-home-initialization.json"), serializeI6Artifact(artifact));
await writeFile(join(artifactDirectory, "i6-initialization-manifest.json"), serializeI6Artifact(manifest));
process.stdout.write(
  `Wrote ${artifact.budgetAuthorities.length} authority, ${artifact.fiscalControls.length} control, ` +
  `${artifact.awards.length} awards, ${artifact.relationships.length} relationships, and ${artifact.coverage.length} coverage records.\n`,
);
