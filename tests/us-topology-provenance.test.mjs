import { Buffer } from "node:buffer";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import { strFromU8, strToU8, unzipSync, zipSync } from "fflate";
import { beforeAll, describe, expect, it } from "vitest";

import {
  APPORTIONMENT_WORKSHEET_NAME,
  DISTRICT_DBF_MEMBER,
  buildHouseDistrictArtifact,
  parseApportionmentWorkbook,
  readRequiredZipMember,
  serializeArtifact,
  sha256,
} from "../scripts/lib/us-topology-artifacts.mjs";

const root = resolve(".");
const sourceDirectory = resolve(root, "data/us-v0/topology-sources");
const artifactDirectory = resolve(root, "src/content/us-v0/artifacts");

let stateArtifact;
let committedHouseArtifact;
let committedHouseArtifactBytes;
let districtZipBytes;
let apportionmentWorkbookBytes;

const buildHouseArtifact = (overrides = {}) =>
  buildHouseDistrictArtifact({
    districtZipBytes,
    apportionmentWorkbookBytes,
    stateRecords: stateArtifact.records,
    ...overrides,
  });

const replaceDbfField = (dbfBytes, targetGeoid, replacements) => {
  const buffer = Buffer.from(dbfBytes);
  const recordCount = buffer.readUInt32LE(4);
  const headerLength = buffer.readUInt16LE(8);
  const recordLength = buffer.readUInt16LE(10);
  const fields = [];
  let relativeOffset = 1;
  for (let offset = 32; buffer[offset] !== 0x0d; offset += 32) {
    const length = buffer[offset + 16];
    fields.push({
      name: buffer.subarray(offset, offset + 11).toString("ascii").replace(/\0.*$/, ""),
      length,
      relativeOffset,
    });
    relativeOffset += length;
  }
  const geoidField = fields.find((field) => field.name === "GEOID");
  if (geoidField === undefined) throw new Error("Test DBF lacks GEOID.");

  for (let index = 0; index < recordCount; index += 1) {
    const recordOffset = headerLength + index * recordLength;
    const geoid = buffer
      .subarray(
        recordOffset + geoidField.relativeOffset,
        recordOffset + geoidField.relativeOffset + geoidField.length,
      )
      .toString("ascii")
      .trim();
    if (geoid !== targetGeoid) continue;
    for (const [fieldName, replacement] of Object.entries(replacements)) {
      const field = fields.find((candidate) => candidate.name === fieldName);
      if (field === undefined || replacement.length > field.length) {
        throw new Error(`Invalid test replacement for ${fieldName}.`);
      }
      const fieldStart = recordOffset + field.relativeOffset;
      buffer.fill(0x20, fieldStart, fieldStart + field.length);
      buffer.write(replacement, fieldStart, field.length, "ascii");
    }
    return buffer;
  }
  throw new Error(`Test DBF did not contain GEOID ${targetGeoid}.`);
};

beforeAll(async () => {
  stateArtifact = JSON.parse(
    await readFile(resolve(artifactDirectory, "state-identifiers.json"), "utf8"),
  );
  committedHouseArtifactBytes = await readFile(
    resolve(artifactDirectory, "house-district-identities-119.json"),
    "utf8",
  );
  committedHouseArtifact = JSON.parse(committedHouseArtifactBytes);
  districtZipBytes = await readFile(resolve(sourceDirectory, "cd119-500k.zip"));
  apportionmentWorkbookBytes = await readFile(
    resolve(sourceDirectory, "apportionment-2020-table01.xlsx"),
  );
});

describe("I2 source-authenticated U.S. House topology", () => {
  it("rebuilds the committed artifact byte-for-byte from the pinned official sources", () => {
    const rebuilt = buildHouseArtifact();
    expect(serializeArtifact(rebuilt)).toBe(committedHouseArtifactBytes);
    expect(rebuilt.districts).toHaveLength(435);
    expect(rebuilt.apportionment).toHaveLength(50);
    expect(rebuilt.apportionment.reduce((total, state) => total + state.votingSeats, 0)).toBe(435);

    const sources = new Map(
      committedHouseArtifact.metadata.sources.map((source) => [source.sourceId, source.rawSha256]),
    );
    expect(sha256(districtZipBytes)).toBe(sources.get("USR-SRC-0088"));
    expect(sha256(apportionmentWorkbookBytes)).toBe(sources.get("USR-SRC-0090"));
  });

  it("parses the required DBF directly from the authenticated Census ZIP", async () => {
    const dbfBytes = readRequiredZipMember(
      districtZipBytes,
      DISTRICT_DBF_MEMBER,
      "test district source",
    );
    expect(sha256(dbfBytes)).toBe("2d50701cde6dc197574ea8bfa7f1e83d45a68ed63847b0012bc5733095bb3de8");

    const builderSource = await readFile(resolve(root, "scripts/build-us-topology-artifacts.mjs"), "utf8");
    expect(builderSource).not.toContain("districtDbfPath");
    expect(builderSource).not.toContain("cb_2025_us_cd119_500k.dbf");
  });

  it("rejects a missing or substituted district DBF member", () => {
    const missingMemberZip = zipSync({ "not-the-required-member.dbf": new Uint8Array([1, 2, 3]) });
    expect(() =>
      readRequiredZipMember(missingMemberZip, DISTRICT_DBF_MEMBER, "test district source"),
    ).toThrow(/missing required ZIP member/);

    const tamperedEntries = unzipSync(new Uint8Array(districtZipBytes));
    const tamperedDbf = Uint8Array.from(tamperedEntries[DISTRICT_DBF_MEMBER]);
    const headerLength = tamperedDbf[8] | (tamperedDbf[9] << 8);
    tamperedDbf[headerLength] = 0x2a;
    tamperedEntries[DISTRICT_DBF_MEMBER] = tamperedDbf;
    const tamperedZip = zipSync(tamperedEntries);
    expect(() => buildHouseArtifact({ districtZipBytes: tamperedZip })).toThrow(
      /exactly 435 unique apportioned voting districts/,
    );
  });

  it("detects a structurally valid substituted DBF through the pinned rebuild proof", () => {
    const tamperedEntries = unzipSync(new Uint8Array(districtZipBytes));
    tamperedEntries[DISTRICT_DBF_MEMBER] = replaceDbfField(
      tamperedEntries[DISTRICT_DBF_MEMBER],
      "0652",
      { CD119FP: "53", GEOID: "0653" },
    );
    const tamperedZip = zipSync(tamperedEntries);
    const rebuiltFromTamperedSource = buildHouseArtifact({ districtZipBytes: tamperedZip });

    expect(rebuiltFromTamperedSource.districts.some((district) => district.geoid === "0653")).toBe(true);
    expect(sha256(tamperedZip)).not.toBe(committedHouseArtifact.metadata.sources[0].rawSha256);
    expect(serializeArtifact(rebuiltFromTamperedSource)).not.toBe(committedHouseArtifactBytes);
  });

  it("derives all 50 state seat totals from the named Table 1 worksheet", () => {
    expect(APPORTIONMENT_WORKSHEET_NAME).toBe("Table 1");
    const parsed = parseApportionmentWorkbook(apportionmentWorkbookBytes, stateArtifact.records);
    expect(parsed).toHaveLength(50);
    expect(parsed.reduce((total, state) => total + state.votingSeats, 0)).toBe(435);
    expect(parsed.find((state) => state.stateUsps === "CA")?.votingSeats).toBe(52);
    expect(parsed.find((state) => state.stateUsps === "TX")?.votingSeats).toBe(38);
    expect(parsed.some((state) => state.stateUsps === "DC")).toBe(false);
  });

  it("fails cross-source validation when a workbook seat value changes", () => {
    const workbookEntries = unzipSync(new Uint8Array(apportionmentWorkbookBytes));
    const worksheetPath = "xl/worksheets/sheet1.xml";
    const worksheet = strFromU8(workbookEntries[worksheetPath]);
    const californiaCell = '<c r="C9"><v>52</v></c>';
    const texasCell = '<c r="C47"><v>38</v></c>';
    expect(worksheet.split(californiaCell)).toHaveLength(2);
    expect(worksheet.split(texasCell)).toHaveLength(2);
    workbookEntries[worksheetPath] = strToU8(
      worksheet
        .replace(californiaCell, '<c r="C9"><v>51</v></c>')
        .replace(texasCell, '<c r="C47"><v>39</v></c>'),
    );
    const changedWorkbook = zipSync(workbookEntries);
    expect(() => buildHouseArtifact({ apportionmentWorkbookBytes: changedWorkbook })).toThrow(
      /parsed 2020 apportionment 51 for CA/,
    );
  });

  it("rejects missing substantive workbook data and has no manual authority table", async () => {
    const workbookEntries = unzipSync(new Uint8Array(apportionmentWorkbookBytes));
    delete workbookEntries["xl/worksheets/sheet1.xml"];
    expect(() =>
      parseApportionmentWorkbook(zipSync(workbookEntries), stateArtifact.records),
    ).toThrow(/missing worksheet data/);

    const productionSources = await Promise.all([
      readFile(resolve(root, "scripts/build-us-topology-artifacts.mjs"), "utf8"),
      readFile(resolve(root, "scripts/lib/us-topology-artifacts.mjs"), "utf8"),
    ]);
    expect(productionSources.join("\n")).not.toContain("expectedApportionment");
  });
});
