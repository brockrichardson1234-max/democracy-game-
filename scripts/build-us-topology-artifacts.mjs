import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";

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

const sha256 = (value) => createHash("sha256").update(value).digest("hex");
const sha256File = async (path) => sha256(await readFile(path));
const contentHash = (value) => sha256(JSON.stringify(value));
const writeArtifact = async (name, artifact) => {
  await writeFile(join(outputDirectory, name), `${JSON.stringify(artifact, null, 2)}\n`);
};

const statePath = join(sourceDirectory, "state.txt");
const districtZipPath = join(sourceDirectory, "cd119-500k.zip");
const districtDbfPath = join(sourceDirectory, "cd119", "cb_2025_us_cd119_500k.dbf");
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

const readDbf = async (path) => {
  const buffer = await readFile(path);
  const recordCount = buffer.readUInt32LE(4);
  const headerLength = buffer.readUInt16LE(8);
  const recordLength = buffer.readUInt16LE(10);
  const fields = [];
  for (let offset = 32; buffer[offset] !== 0x0d; offset += 32) {
    fields.push({
      name: buffer.subarray(offset, offset + 11).toString("ascii").replace(/\0.*$/, ""),
      length: buffer[offset + 16],
    });
  }
  const records = [];
  for (let index = 0; index < recordCount; index += 1) {
    const recordOffset = headerLength + index * recordLength;
    if (buffer[recordOffset] === 0x2a) continue;
    let fieldOffset = recordOffset + 1;
    const record = {};
    for (const field of fields) {
      record[field.name] = buffer
        .subarray(fieldOffset, fieldOffset + field.length)
        .toString("utf8")
        .trim();
      fieldOffset += field.length;
    }
    records.push(record);
  }
  return records;
};

const stateByFips = new Map(stateRecords.map((record) => [record.stateFips, record]));
const districtRecords = (await readDbf(districtDbfPath))
  .filter((record) => stateUspsCodes.has(stateByFips.get(record.STATEFP)?.stateUsps))
  .map((record) => ({
    stateFips: record.STATEFP,
    districtCode: record.CD119FP,
    geoid: record.GEOID,
    stateJurisdictionId: `us.jurisdiction.state.${record.STATEFP}`,
  }))
  .sort((left, right) => left.geoid.localeCompare(right.geoid));
if (districtRecords.length !== 435 || new Set(districtRecords.map((record) => record.geoid)).size !== 435) {
  throw new Error("119th district extract must contain exactly 435 unique apportioned voting districts.");
}
for (const district of districtRecords) {
  if (district.geoid !== `${district.stateFips}${district.districtCode}`) {
    throw new Error(`Invalid Census GEOID components for ${district.geoid}.`);
  }
}

const expectedApportionment = {
  AL: 7, AK: 1, AZ: 9, AR: 4, CA: 52, CO: 8, CT: 5, DE: 1, FL: 28, GA: 14,
  HI: 2, ID: 2, IL: 17, IN: 9, IA: 4, KS: 4, KY: 6, LA: 6, ME: 2, MD: 8,
  MA: 9, MI: 13, MN: 8, MS: 4, MO: 8, MT: 2, NE: 3, NV: 4, NH: 2, NJ: 12,
  NM: 3, NY: 26, NC: 14, ND: 1, OH: 15, OK: 5, OR: 6, PA: 17, RI: 2, SC: 7,
  SD: 1, TN: 9, TX: 38, UT: 4, VT: 1, VA: 11, WA: 10, WV: 2, WI: 8, WY: 1,
};
const apportionment = stateRecords
  .filter((record) => stateUspsCodes.has(record.stateUsps))
  .map((record) => ({
    stateFips: record.stateFips,
    stateUsps: record.stateUsps,
    votingSeats: expectedApportionment[record.stateUsps],
  }));
for (const record of apportionment) {
  const districtCount = districtRecords.filter((district) => district.stateFips === record.stateFips).length;
  if (districtCount !== record.votingSeats) {
    throw new Error(`119th district count does not match 2020 apportionment for ${record.stateUsps}.`);
  }
}
if (apportionment.reduce((total, record) => total + record.votingSeats, 0) !== 435) {
  throw new Error("2020 apportionment must sum to 435 voting seats.");
}

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
await writeArtifact("house-district-identities-119.json", {
  metadata: {
    artifactId: "us.topology.house-district-identities-119-v1",
    vintage: "2025 119th Congressional Districts, 1:500,000 identity extract",
    transformationVersion,
    contentSha256: contentHash({ districts: districtRecords, apportionment }),
    sources: [
      {
        sourceId: "USR-SRC-0088",
        product: "Census 2025 Cartographic Boundary Files, 119th Congressional Districts, 1:500,000",
        locator: "https://www2.census.gov/geo/tiger/GENZ2025/shp/cb_2025_us_cd119_500k.zip",
        retrievedAt,
        rawSha256: await sha256File(districtZipPath),
      },
      {
        sourceId: "USR-SRC-0090",
        product: "2020 Census Apportionment Table 1",
        locator: "https://www2.census.gov/programs-surveys/decennial/2020/data/apportionment/apportionment-2020-table01.xlsx",
        retrievedAt,
        rawSha256: await sha256File(apportionmentPath),
      },
    ],
  },
  districts: districtRecords,
  apportionment,
});
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
