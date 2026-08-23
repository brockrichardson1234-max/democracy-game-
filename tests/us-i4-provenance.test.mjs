import { Buffer } from "node:buffer";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import { strFromU8, strToU8, unzipSync, zipSync } from "fflate";
import { beforeAll, describe, expect, it } from "vitest";

import {
  buildCvapArtifact,
  buildElectoralAllocationArtifact,
  buildGeographyArtifacts,
  buildResidentPopulationArtifact,
  buildTenureArtifact,
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

beforeAll(async () => {
  stateRecords = JSON.parse(await readFile(resolve(i2Artifacts, "state-identifiers.json"), "utf8")).records;
  districtRecords = JSON.parse(await readFile(resolve(i2Artifacts, "house-district-identities-119.json"), "utf8")).districts;
  stateZip = await readFile(resolve(sources, "state-500k.zip"));
  districtZip = await readFile(resolve(i2Sources, "cd119-500k.zip"));
  populationBytes = await readFile(resolve(sources, "nst-est2025-alldata.csv"));
  tenureBytes = await readFile(resolve(sources, "acsdt5y2024-b25008.dat"));
  cvapBytes = await readFile(resolve(sources, "cvap-2020-2024.zip"));
  electoralBytes = await readFile(resolve(sources, "nara-electoral-allocation.html"));
  populationArtifact = buildResidentPopulationArtifact({ bytes: populationBytes, stateIdentityRecords: stateRecords, retrievedAt: "2026-08-23" });
});

describe("I4 source-authenticated initialization", () => {
  it("cryptographically pins every actual raw source consumed by runtime artifacts", async () => {
    const expected = {
      "state-500k.zip": "9cbfe171dad1555e11770c981d8f4db9e687a65c86f5bdae684eeb487e2e9b80",
      "nst-est2025-alldata.csv": "92188e29cb0a67dcf95afa7d6c47359409782f086478b70ea4128eb70e223ca9",
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
  });

  it("derives resident controls from source rows and rejects a substantive population mutation", async () => {
    expect(serializeArtifact(populationArtifact)).toBe(await readFile(resolve(artifacts, "resident-population-controls-2025.json"), "utf8"));
    const mutated = Buffer.from(populationBytes.toString("utf8").replace(",39355309,", ",39355308,"));
    expect(() => buildResidentPopulationArtifact({ bytes: mutated, stateIdentityRecords: stateRecords, retrievedAt: "2026-08-23" }))
      .toThrow(/differs from published scope/);
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

  it("contains no manually authoritative 51-state resident/CVAP/elector table", async () => {
    const source = await readFile(resolve(root, "scripts/lib/us-i4-artifacts.mjs"), "utf8");
    expect(source).not.toMatch(/expectedPopulation|expectedCvap|expectedElectoral|expectedAllocation/);
    expect(source).not.toMatch(/\bCA\s*:\s*(?:39_?355_?309|54)\b/);
  });
});
