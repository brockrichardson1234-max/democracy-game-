import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";

import {
  buildHouseDistrictArtifact,
  contentHash,
  serializeArtifact,
  sha256,
} from "./lib/us-topology-artifacts.mjs";

const args = new Map();
for (let index = 2; index < process.argv.length; index += 2) {
  args.set(process.argv[index], process.argv[index + 1]);
}
const sourceDirectory = args.get("--source-dir");
if (sourceDirectory === undefined) {
  throw new Error("Usage: node scripts/build-us-topology-artifacts.mjs --source-dir <official-source-directory>");
}
const outputDirectory = resolve(
  args.get("--output-dir") ?? "src/content/us-v0/artifacts",
);
const retrievedAt = "2026-08-22";
const transformationVersion = "i2-us-topology-v1";

const sha256File = async (path) => sha256(await readFile(path));
const writeArtifact = async (name, artifact) => {
  await writeFile(join(outputDirectory, name), serializeArtifact(artifact));
};

const statePath = join(sourceDirectory, "state.txt");
const districtZipPath = join(sourceDirectory, "cd119-500k.zip");
const apportionmentPath = join(sourceDirectory, "apportionment-2020-table01.xlsx");
const senatePaths = {
  I: join(sourceDirectory, "class-i.html"),
  II: join(sourceDirectory, "class-ii.html"),
  III: join(sourceDirectory, "class-iii.html"),
};

const stateUspsCodes = new Set([
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY",
]);
const acceptedJurisdictionCodes = new Set([...stateUspsCodes, "DC"]);

const stateLines = (await readFile(statePath, "utf8")).trim().split(/\r?\n/);
if (stateLines.shift() !== "STATE|STUSAB|STATE_NAME|STATENS") {
  throw new Error("Unexpected Census state identifier schema.");
}
const stateRecords = stateLines
  .map((line) => {
    const [stateFips, stateUsps, officialName, gnisId] = line.split("|");
    return { stateFips, stateUsps, officialName, gnisId };
  })
  .filter((record) => acceptedJurisdictionCodes.has(record.stateUsps))
  .sort((left, right) => left.stateFips.localeCompare(right.stateFips));
if (stateRecords.length !== 51 || stateRecords.filter((record) => record.stateUsps === "DC").length !== 1) {
  throw new Error("Census state extract must contain exactly 50 states plus the District of Columbia.");
}

const houseDistrictArtifact = buildHouseDistrictArtifact({
  districtZipBytes: await readFile(districtZipPath),
  apportionmentWorkbookBytes: await readFile(apportionmentPath),
  stateRecords,
  retrievedAt,
  transformationVersion,
});

const classBoundaries = {
  I: "2031-01-03T12:00:00-05:00",
  II: "2027-01-03T12:00:00-05:00",
  III: "2029-01-03T12:00:00-05:00",
};
const senateRecords = [];
for (const [classLabel, path] of Object.entries(senatePaths)) {
  const html = await readFile(path, "utf8");
  const stateCodes = [...html.matchAll(/\((?:D|R|I)-([A-Z]{2})\)/g)].map((match) => match[1]);
  for (const stateUsps of stateCodes) {
    if (!stateUspsCodes.has(stateUsps)) throw new Error(`Unexpected Senate jurisdiction ${stateUsps}.`);
    const state = stateRecords.find((record) => record.stateUsps === stateUsps);
    senateRecords.push({
      stateFips: state.stateFips,
      stateUsps,
      classLabel,
      ordinaryBoundaryAt: classBoundaries[classLabel],
    });
  }
}
senateRecords.sort(
  (left, right) =>
    left.stateFips.localeCompare(right.stateFips) || left.classLabel.localeCompare(right.classLabel),
);
if (senateRecords.length !== 100) throw new Error("Senate class extract must contain 100 seats.");
for (const state of stateRecords.filter((record) => stateUspsCodes.has(record.stateUsps))) {
  const classes = senateRecords
    .filter((record) => record.stateFips === state.stateFips)
    .map((record) => record.classLabel);
  if (classes.length !== 2 || new Set(classes).size !== 2) {
    throw new Error(`Senate class extract must contain two differently classed seats for ${state.stateUsps}.`);
  }
}

await mkdir(outputDirectory, { recursive: true });
await writeArtifact("state-identifiers.json", {
  metadata: {
    artifactId: "us.topology.state-identifiers-v1",
    vintage: "Census ANSI/FIPS/GNIS reference retrieved 2026-08-22",
    transformationVersion,
    contentSha256: contentHash(stateRecords),
    sources: [
      {
        sourceId: "USR-SRC-0085",
        product: "Census National FIPS and GNIS Codes File",
        locator: "https://www2.census.gov/geo/docs/reference/state.txt",
        retrievedAt,
        rawSha256: await sha256File(statePath),
      },
    ],
  },
  records: stateRecords,
});
await writeArtifact("house-district-identities-119.json", houseDistrictArtifact);
await writeArtifact("senate-seat-classes.json", {
  metadata: {
    artifactId: "us.topology.senate-seat-classes-v1",
    vintage: "Official Senate class records retrieved 2026-08-22",
    transformationVersion,
    contentSha256: contentHash(senateRecords),
    sources: await Promise.all(
      Object.entries(senatePaths).map(async ([classLabel, path]) => ({
        sourceId: "USR-SRC-0010",
        product: `Official Senate Class ${classLabel} record`,
        locator: `https://www.senate.gov/senators/Class_${classLabel}.htm`,
        retrievedAt,
        rawSha256: await sha256File(path),
      })),
    ),
  },
  records: senateRecords,
});

process.stdout.write(
  `Wrote 51 state/DC identifiers, 435 district identities, and 100 Senate seat/class records to ${outputDirectory}.\n`,
);
