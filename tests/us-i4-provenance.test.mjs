import { Buffer } from "node:buffer";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import { strFromU8, strToU8, unzipSync, zipSync } from "fflate";
import { beforeAll, describe, expect, it } from "vitest";

import { readDbfRecords } from "../scripts/lib/us-topology-artifacts.mjs";

import {
  buildCvapArtifact,
  buildElectoralAllocationArtifact,
  buildGeographyArtifacts,
  buildResidentPopulationArtifact,
  buildTenureArtifact,
  RESIDENT_POPULATION_PRODUCT,
  serializeArtifact,
  sha256,
} from "../scripts/lib/us-i4-artifacts.mjs";

const root = resolve(".");
const sources = resolve(root, "data/us-v0/i4-sources");
const i2Sources = resolve(root, "data/us-v0/topology-sources");
const i2Artifacts = resolve(root, "src/content/us-v0/artifacts");
const artifacts = resolve(root, "src/content/us-v0/i4-artifacts");

let stateRecords;
let districtRecords;
let stateZip;
let districtZip;
let populationBytes;
let tenureBytes;
let cvapBytes;
let electoralBytes;
let populationArtifact;

const DISTRICT_DBF_MEMBER = "cb_2025_us_cd119_500k.dbf";
const DISTRICT_SHP_MEMBER = "cb_2025_us_cd119_500k.shp";

const shapefileRecords = (bytes) => {
  const header = Buffer.from(bytes.subarray(0, 100));
  const records = [];
  let offset = 100;
  while (offset < bytes.length) {
    const contentLength = bytes.readInt32BE(offset + 4) * 2;
    records.push(Buffer.from(bytes.subarray(offset + 8, offset + 8 + contentLength)));
    offset += 8 + contentLength;
  }
  return { header, records };
};

const serializeShapefile = ({ header, records }) => {
  const recordBuffers = records.map((content, index) => {
    const record = Buffer.alloc(8 + content.length);
    record.writeInt32BE(index + 1, 0);
    record.writeInt32BE(content.length / 2, 4);
    content.copy(record, 8);
    return record;
  });
  const output = Buffer.concat([header, ...recordBuffers]);
  output.writeInt32BE(output.length / 2, 24);
  return output;
};

const districtRecordIndex = (entries, geoid) => readDbfRecords(
  Buffer.from(entries[DISTRICT_DBF_MEMBER]),
  ["GEOID"],
).findIndex((record) => record.GEOID === geoid);

const translatePolygonLongitude = (content, longitudeDelta) => {
  const translated = Buffer.from(content);
  translated.writeDoubleLE(translated.readDoubleLE(4) + longitudeDelta, 4);
  translated.writeDoubleLE(translated.readDoubleLE(20) + longitudeDelta, 20);
  const partCount = translated.readInt32LE(36);
  const pointCount = translated.readInt32LE(40);
  const pointsOffset = 44 + partCount * 4;
  for (let index = 0; index < pointCount; index += 1) {
    const pointOffset = pointsOffset + index * 16;
    translated.writeDoubleLE(translated.readDoubleLE(pointOffset) + longitudeDelta, pointOffset);
  }
  return translated;
};

beforeAll(async () => {
  stateRecords = JSON.parse(await readFile(resolve(i2Artifacts, "state-identifiers.json"), "utf8")).records;
  districtRecords = JSON.parse(await readFile(resolve(i2Artifacts, "house-district-identities-119.json"), "utf8")).districts;
  stateZip = await readFile(resolve(sources, "state-500k.zip"));
  districtZip = await readFile(resolve(i2Sources, "cd119-500k.zip"));
  populationBytes = await readFile(resolve(sources, "nst-est2025-pop.xlsx"));
  tenureBytes = await readFile(resolve(sources, "acsdt5y2024-b25008.dat"));
  cvapBytes = await readFile(resolve(sources, "cvap-2020-2024.zip"));
  electoralBytes = await readFile(resolve(sources, "nara-electoral-allocation.html"));
  populationArtifact = buildResidentPopulationArtifact({ bytes: populationBytes, stateIdentityRecords: stateRecords, retrievedAt: "2026-08-23" });
});

describe("I4 source-authenticated initialization", () => {
  it("cryptographically pins every actual raw source consumed by runtime artifacts", async () => {
    const expected = {
      "state-500k.zip": "9cbfe171dad1555e11770c981d8f4db9e687a65c86f5bdae684eeb487e2e9b80",
      "nst-est2025-pop.xlsx": "20a556d397a46b484dcc78785482a16d06dbf9159e67971fa69b1244b09c7559",
      "acsdt5y2024-b25008.dat": "caf0a0ed0ed04f462880589096143d9f89c2e870c0e9e75c99a993cb3bf9c751",
      "cvap-2020-2024.zip": "0c67665c62de843de7a3521a8110de05b4aa158cdc2db304015380615941056c",
      "nara-electoral-allocation.html": "6c0028d6e956c038302d10926cb0dbed959b87cad4761a49efe2e00d1d79fc71",
      "stables-waiver.pdf": "1714642ebec3ed2ecccaa76693f259cacc4c16a41d18cb82512b3b1b873862c5",
      "palms-project.html": "bc5ba153d9012b191095a1bd154bb0f2cbfc9363c952b28b6fced2de7638c2c9",
    };
    for (const [filename, digest] of Object.entries(expected)) {
      expect(sha256(await readFile(resolve(sources, filename)))).toBe(digest);
    }
    expect(sha256(districtZip)).toBe("8e804518d333d67e24e25c61767c6a7c78fd0a0852179e8cc19c36fd66011010");
  });

  it("rebuilds Geography from the authenticated ZIP members and rejects missing members", async () => {
    const rebuilt = buildGeographyArtifacts({
      stateZipBytes: stateZip,
      districtZipBytes: districtZip,
      stateIdentityRecords: stateRecords,
      districtIdentityRecords: districtRecords,
      retrievedAt: "2026-08-23",
    });
    expect(serializeArtifact(rebuilt.states)).toBe(await readFile(resolve(artifacts, "state-geography-2025.json"), "utf8"));
    expect(serializeArtifact(rebuilt.districts)).toBe(await readFile(resolve(artifacts, "district-geography-cd119-2025.json"), "utf8"));
    expect(() => buildGeographyArtifacts({
      stateZipBytes: Buffer.from(zipSync({ "wrong.txt": strToU8("not geography") })),
      districtZipBytes: districtZip,
      stateIdentityRecords: stateRecords,
      districtIdentityRecords: districtRecords,
      retrievedAt: "2026-08-23",
    })).toThrow(/missing required member/i);
  }, 60_000);

  it("REV-005 rejects a same-state DBF/SHP identity swap", () => {
    const entries = unzipSync(new Uint8Array(districtZip));
    const source = shapefileRecords(Buffer.from(entries[DISTRICT_SHP_MEMBER]));
    const first = districtRecordIndex(entries, "0601");
    const second = districtRecordIndex(entries, "0602");
    [source.records[first], source.records[second]] = [source.records[second], source.records[first]];
    entries[DISTRICT_SHP_MEMBER] = serializeShapefile(source);
    expect(() => buildGeographyArtifacts({
      stateZipBytes: stateZip,
      districtZipBytes: Buffer.from(zipSync(entries)),
      stateIdentityRecords: stateRecords,
      districtIdentityRecords: districtRecords,
      retrievedAt: "2026-08-23",
    })).toThrow(/ALAND\/AWATER identity/i);
  }, 60_000);

  it("REV-005 rejects a materially outside polygon that retains minor state overlap", () => {
    const entries = unzipSync(new Uint8Array(districtZip));
    const source = shapefileRecords(Buffer.from(entries[DISTRICT_SHP_MEMBER]));
    const index = districtRecordIndex(entries, "0601");
    source.records[index] = translatePolygonLongitude(source.records[index], 3.5);
    entries[DISTRICT_SHP_MEMBER] = serializeShapefile(source);
    expect(() => buildGeographyArtifacts({
      stateZipBytes: stateZip,
      districtZipBytes: Buffer.from(zipSync(entries)),
      stateIdentityRecords: stateRecords,
      districtIdentityRecords: districtRecords,
      retrievedAt: "2026-08-23",
    })).toThrow(/not materially contained/i);
  }, 60_000);

  it("REV-001 derives resident controls from exact POP workbook bytes and rejects ALLDATA-format substitution", async () => {
    expect(serializeArtifact(populationArtifact)).toBe(await readFile(resolve(artifacts, "resident-population-controls-2025.json"), "utf8"));
    expect(populationArtifact.metadata.sources[0].product).toContain(RESIDENT_POPULATION_PRODUCT);
    const alldataSubstitution = Buffer.from(
      "SUMLEV,STATE,NAME,POPESTIMATE2025\n010,00,United States,341784857\n040,06,California,39355309\n",
    );
    expect(() => buildResidentPopulationArtifact({
      bytes: alldataSubstitution,
      stateIdentityRecords: stateRecords,
      retrievedAt: "2026-08-23",
    })).toThrow(/NST-EST2025-POP workbook/i);
  });

  it("derives B25008 measures from the accepted table bytes and rejects source inconsistency", async () => {
    const rebuilt = buildTenureArtifact({ bytes: tenureBytes, stateIdentityRecords: stateRecords, retrievedAt: "2026-08-23" });
    expect(serializeArtifact(rebuilt)).toBe(await readFile(resolve(artifacts, "tenure-exposure-input-acs2024.json"), "utf8"));
    const text = tenureBytes.toString("utf8");
    const mutated = Buffer.from(text.replace(/(0400000US06[^\n]*\|)([0-9]+)(\|)/, (_match, prefix, value, suffix) => `${prefix}${Number(value) + 1}${suffix}`));
    expect(() => buildTenureArtifact({ bytes: mutated, stateIdentityRecords: stateRecords, retrievedAt: "2026-08-23" })).toThrow();
  });

  it("parses the exact CVAP State.csv member and rejects missing or changed substantive data", async () => {
    const rebuilt = buildCvapArtifact({ bytes: cvapBytes, stateIdentityRecords: stateRecords, populationArtifact, retrievedAt: "2026-08-23" });
    expect(serializeArtifact(rebuilt)).toBe(await readFile(resolve(artifacts, "cvap-proxy-state-2020-2024.json"), "utf8"));
    expect(() => buildCvapArtifact({
      bytes: Buffer.from(zipSync({ "not-state.csv": strToU8("missing") })),
      stateIdentityRecords: stateRecords,
      populationArtifact,
      retrievedAt: "2026-08-23",
    })).toThrow(/missing required member/i);

    const entries = unzipSync(cvapBytes);
    const original = strFromU8(entries["State.csv"]);
    const changedRows = original.split(/\r?\n/).map((line) => {
      const fields = line.split(",");
      if (fields[2] === "0400000US06" && fields[3] === "1") fields[10] = String(Number(fields[10]) + 1);
      return fields.join(",");
    });
    entries["State.csv"] = strToU8(changedRows.join("\n"));
    const changed = buildCvapArtifact({
      bytes: Buffer.from(zipSync(entries)),
      stateIdentityRecords: stateRecords,
      populationArtifact,
      retrievedAt: "2026-08-23",
    });
    expect(changed.metadata.contentSha256).not.toBe(rebuilt.metadata.contentSha256);
  }, 40_000);

  it("derives all 51 electoral allocations from NARA bytes and detects mutation", async () => {
    const rebuilt = buildElectoralAllocationArtifact({
      bytes: electoralBytes,
      stateIdentityRecords: stateRecords,
      districtIdentityRecords: districtRecords,
      retrievedAt: "2026-08-23",
    });
    expect(serializeArtifact(rebuilt)).toBe(await readFile(resolve(artifacts, "electoral-allocation-2028.json"), "utf8"));
    const mutated = Buffer.from(electoralBytes.toString("utf8").replace(/California\s*-\s*54 votes/i, "California - 53 votes"));
    expect(() => buildElectoralAllocationArtifact({
      bytes: mutated,
      stateIdentityRecords: stateRecords,
      districtIdentityRecords: districtRecords,
      retrievedAt: "2026-08-23",
    })).toThrow(/538 total/);
  });

  it("REV-004 requires the source-authenticated Maine/Nebraska method passage", () => {
    const withoutMethod = Buffer.from(electoralBytes.toString("utf8").replace(
      /<h2>Allocation within each State<\/h2>[\s\S]*?<h2>Current allocations<\/h2>/i,
      "<h2>Allocation within each State</h2><p>Method omitted.</p><h2>Current allocations</h2>",
    ));
    expect(() => buildElectoralAllocationArtifact({
      bytes: withoutMethod,
      stateIdentityRecords: stateRecords,
      districtIdentityRecords: districtRecords,
      retrievedAt: "2026-08-23",
    })).toThrow(/Maine\/Nebraska|allocation-within-state/i);

    const contradictoryMethod = Buffer.from(electoralBytes.toString("utf8").replace(
      "except for Maine and Nebraska",
      "except for Alabama and Nebraska",
    ));
    expect(() => buildElectoralAllocationArtifact({
      bytes: contradictoryMethod,
      stateIdentityRecords: stateRecords,
      districtIdentityRecords: districtRecords,
      retrievedAt: "2026-08-23",
    })).toThrow(/Maine\/Nebraska/i);
  });

  it("contains no manually authoritative 51-state resident/CVAP/elector table", async () => {
    const source = await readFile(resolve(root, "scripts/lib/us-i4-artifacts.mjs"), "utf8");
    expect(source).not.toMatch(/expectedPopulation|expectedCvap|expectedElectoral|expectedAllocation/);
    expect(source).not.toMatch(/\bCA\s*:\s*(?:39_?355_?309|54)\b/);
  });
});
