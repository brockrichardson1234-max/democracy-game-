import { createHash } from "node:crypto";

import { strFromU8, unzipSync } from "fflate";

export const DISTRICT_DBF_MEMBER = "cb_2025_us_cd119_500k.dbf";
export const APPORTIONMENT_WORKSHEET_NAME = "Table 1";

const DISTRICT_SOURCE = {
  sourceId: "USR-SRC-0088",
  product: "Census 2025 Cartographic Boundary Files, 119th Congressional Districts, 1:500,000",
  locator: "https://www2.census.gov/geo/tiger/GENZ2025/shp/cb_2025_us_cd119_500k.zip",
};
const APPORTIONMENT_SOURCE = {
  sourceId: "USR-SRC-0090",
  product: "2020 Census Apportionment Table 1",
  locator:
    "https://www2.census.gov/programs-surveys/decennial/2020/data/apportionment/apportionment-2020-table01.xlsx",
};

export const sha256 = (value) => createHash("sha256").update(value).digest("hex");
export const contentHash = (value) => sha256(JSON.stringify(value));
export const serializeArtifact = (artifact) => `${JSON.stringify(artifact, null, 2)}\n`;

const unzipEntries = (archiveBytes, label) => {
  try {
    return unzipSync(new Uint8Array(archiveBytes));
  } catch (error) {
    throw new Error(`Unable to read ${label} ZIP container.`, { cause: error });
  }
};

export const readRequiredZipMember = (archiveBytes, memberName, label = "source") => {
  const member = unzipEntries(archiveBytes, label)[memberName];
  if (member === undefined) {
    throw new Error(`${label} is missing required ZIP member ${memberName}.`);
  }
  return Buffer.from(member);
};

export const readDbfRecords = (
  buffer,
  requiredFields = ["STATEFP", "CD119FP", "GEOID"],
) => {
  if (buffer.length < 33) throw new Error("District DBF is too short.");
  const recordCount = buffer.readUInt32LE(4);
  const headerLength = buffer.readUInt16LE(8);
  const recordLength = buffer.readUInt16LE(10);
  if (headerLength < 33 || recordLength < 2 || headerLength + recordCount * recordLength > buffer.length) {
    throw new Error("District DBF header is inconsistent with its byte length.");
  }

  const fields = [];
  for (let offset = 32; offset < headerLength && buffer[offset] !== 0x0d; offset += 32) {
    if (offset + 32 > buffer.length) throw new Error("District DBF field header is truncated.");
    fields.push({
      name: buffer.subarray(offset, offset + 11).toString("ascii").replace(/\0.*$/, ""),
      length: buffer[offset + 16],
    });
  }
  for (const requiredField of requiredFields) {
    if (!fields.some((field) => field.name === requiredField)) {
      throw new Error(`District DBF is missing required field ${requiredField}.`);
    }
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

const decodeXml = (value) =>
  value
    .replace(/&#x([0-9a-f]+);/gi, (_, digits) => String.fromCodePoint(Number.parseInt(digits, 16)))
    .replace(/&#([0-9]+);/g, (_, digits) => String.fromCodePoint(Number.parseInt(digits, 10)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");

const xmlAttribute = (attributes, name) => {
  const match = attributes.match(new RegExp(`(?:^|\\s)${name}="([^"]*)"`));
  return match?.[1] ?? null;
};

const parseSharedStrings = (xml) =>
  [...xml.matchAll(/<si\b[^>]*>([\s\S]*?)<\/si>/g)].map((match) =>
    [...match[1].matchAll(/<t\b[^>]*>([\s\S]*?)<\/t>/g)]
      .map((textMatch) => decodeXml(textMatch[1]))
      .join(""),
  );

const parseWorksheetRows = (xml, sharedStrings) =>
  [...xml.matchAll(/<row\b[^>]*\br="([0-9]+)"[^>]*>([\s\S]*?)<\/row>/g)].map((rowMatch) => {
    const cells = {};
    for (const cellMatch of rowMatch[2].matchAll(/<c\b([^>]*)>([\s\S]*?)<\/c>/g)) {
      const reference = xmlAttribute(cellMatch[1], "r");
      if (reference === null) throw new Error("Apportionment worksheet contains a cell without a reference.");
      const column = reference.match(/^[A-Z]+/)?.[0];
      if (column === undefined) throw new Error(`Invalid workbook cell reference ${reference}.`);
      const value = cellMatch[2].match(/<v>([\s\S]*?)<\/v>/)?.[1] ?? "";
      const type = xmlAttribute(cellMatch[1], "t");
      if (type === "s") {
        const sharedIndex = Number(value);
        if (!Number.isInteger(sharedIndex) || sharedStrings[sharedIndex] === undefined) {
          throw new Error(`Invalid shared-string reference in cell ${reference}.`);
        }
        cells[column] = sharedStrings[sharedIndex];
      } else {
        cells[column] = decodeXml(value);
      }
    }
    return { rowNumber: Number(rowMatch[1]), cells };
  });

const normalizedHeader = (value) => value.replace(/\s+/g, " ").trim();

export const parseApportionmentWorkbook = (workbookBytes, stateRecords) => {
  const entries = unzipEntries(workbookBytes, "2020 Census apportionment workbook");
  const workbookXmlBytes = entries["xl/workbook.xml"];
  const relationshipsXmlBytes = entries["xl/_rels/workbook.xml.rels"];
  const sharedStringsBytes = entries["xl/sharedStrings.xml"];
  if (workbookXmlBytes === undefined || relationshipsXmlBytes === undefined || sharedStringsBytes === undefined) {
    throw new Error("Apportionment workbook is missing required workbook metadata.");
  }

  const workbookXml = strFromU8(workbookXmlBytes);
  const sheetMatches = [...workbookXml.matchAll(/<sheet\b([^>]*)\/?>(?:<\/sheet>)?/g)];
  const intendedSheet = sheetMatches.find(
    (match) => decodeXml(xmlAttribute(match[1], "name") ?? "") === APPORTIONMENT_WORKSHEET_NAME,
  );
  if (intendedSheet === undefined) {
    throw new Error(`Apportionment workbook requires worksheet ${APPORTIONMENT_WORKSHEET_NAME}.`);
  }
  const relationshipId = xmlAttribute(intendedSheet[1], "r:id");
  if (relationshipId === null) throw new Error("Apportionment worksheet lacks a relationship ID.");

  const relationshipsXml = strFromU8(relationshipsXmlBytes);
  const relationship = [...relationshipsXml.matchAll(/<Relationship\b([^>]*)\/?>(?:<\/Relationship>)?/g)].find(
    (match) => xmlAttribute(match[1], "Id") === relationshipId,
  );
  const target = relationship === undefined ? null : xmlAttribute(relationship[1], "Target");
  if (target === null || target.includes("..")) {
    throw new Error("Apportionment worksheet has an invalid relationship target.");
  }
  const worksheetPath = target.startsWith("/") ? target.slice(1) : `xl/${target}`;
  const worksheetBytes = entries[worksheetPath];
  if (worksheetBytes === undefined) {
    throw new Error(`Apportionment workbook is missing worksheet data ${worksheetPath}.`);
  }

  const sharedStrings = parseSharedStrings(strFromU8(sharedStringsBytes));
  const rows = parseWorksheetRows(strFromU8(worksheetBytes), sharedStrings);
  const headerRow = rows.find((row) => {
    const stateHeader = normalizedHeader(row.cells.A ?? "");
    const seatHeader = normalizedHeader(row.cells.C ?? "");
    return (
      stateHeader === "STATE" &&
      seatHeader.includes("NUMBER OF APPORTIONED REPRESENTATIVES BASED ON") &&
      seatHeader.includes("2020 CENSUS")
    );
  });
  if (headerRow === undefined) throw new Error("Apportionment workbook schema headers are not recognized.");

  const apportionedStates = stateRecords.filter((record) => record.stateUsps !== "DC");
  const stateByName = new Map(apportionedStates.map((record) => [record.officialName, record]));
  const seatsByState = new Map();
  let workbookTotal = null;
  for (const row of rows.filter((candidate) => candidate.rowNumber > headerRow.rowNumber)) {
    const stateName = normalizedHeader(row.cells.A ?? "");
    if (stateName.startsWith("TOTAL APPORTIONMENT POPULATION")) {
      workbookTotal = Number(row.cells.C);
      break;
    }
    if (stateName.length === 0) continue;
    const state = stateByName.get(stateName);
    if (state === undefined) throw new Error(`Unexpected apportionment row ${stateName}.`);
    if (seatsByState.has(state.stateUsps)) {
      throw new Error(`Duplicate apportionment row for ${state.stateUsps}.`);
    }
    const votingSeats = Number(row.cells.C);
    if (!Number.isInteger(votingSeats) || votingSeats <= 0) {
      throw new Error(`Invalid apportioned representative count for ${state.stateUsps}.`);
    }
    seatsByState.set(state.stateUsps, votingSeats);
  }

  if (seatsByState.size !== 50) {
    throw new Error(`Apportionment workbook must contain exactly 50 states; found ${seatsByState.size}.`);
  }
  const records = apportionedStates.map((state) => ({
    stateFips: state.stateFips,
    stateUsps: state.stateUsps,
    votingSeats: seatsByState.get(state.stateUsps),
  }));
  const derivedTotal = records.reduce((total, record) => total + record.votingSeats, 0);
  if (derivedTotal !== 435 || workbookTotal !== 435) {
    throw new Error(
      `2020 apportionment must total 435 seats; derived ${derivedTotal}, workbook total ${String(workbookTotal)}.`,
    );
  }
  return records;
};

export const buildHouseDistrictArtifact = ({
  districtZipBytes,
  apportionmentWorkbookBytes,
  stateRecords,
  retrievedAt = "2026-08-22",
  transformationVersion = "i2-us-topology-v1",
}) => {
  const stateByFips = new Map(stateRecords.map((record) => [record.stateFips, record]));
  const stateUspsCodes = new Set(
    stateRecords.filter((record) => record.stateUsps !== "DC").map((record) => record.stateUsps),
  );
  if (stateUspsCodes.size !== 50) throw new Error("House topology requires exactly 50 state records.");

  const districtDbfBytes = readRequiredZipMember(
    districtZipBytes,
    DISTRICT_DBF_MEMBER,
    "2025 Census 119th congressional-district source",
  );
  const districts = readDbfRecords(districtDbfBytes)
    .filter((record) => stateUspsCodes.has(stateByFips.get(record.STATEFP)?.stateUsps))
    .map((record) => ({
      stateFips: record.STATEFP,
      districtCode: record.CD119FP,
      geoid: record.GEOID,
      stateJurisdictionId: `us.jurisdiction.state.${record.STATEFP}`,
    }))
    .sort((left, right) => left.geoid.localeCompare(right.geoid));
  if (districts.length !== 435 || new Set(districts.map((record) => record.geoid)).size !== 435) {
    throw new Error("119th district extract must contain exactly 435 unique apportioned voting districts.");
  }
  for (const district of districts) {
    if (district.geoid !== `${district.stateFips}${district.districtCode}`) {
      throw new Error(`Invalid Census GEOID components for ${district.geoid}.`);
    }
  }

  const apportionment = parseApportionmentWorkbook(apportionmentWorkbookBytes, stateRecords);
  for (const record of apportionment) {
    const districtCount = districts.filter((district) => district.stateFips === record.stateFips).length;
    if (districtCount !== record.votingSeats) {
      throw new Error(
        `119th district count ${districtCount} does not match parsed 2020 apportionment ${record.votingSeats} for ${record.stateUsps}.`,
      );
    }
  }

  return {
    metadata: {
      artifactId: "us.topology.house-district-identities-119-v1",
      vintage: "2025 119th Congressional Districts, 1:500,000 identity extract",
      transformationVersion,
      contentSha256: contentHash({ districts, apportionment }),
      sources: [
        {
          ...DISTRICT_SOURCE,
          retrievedAt,
          rawSha256: sha256(districtZipBytes),
        },
        {
          ...APPORTIONMENT_SOURCE,
          retrievedAt,
          rawSha256: sha256(apportionmentWorkbookBytes),
        },
      ],
    },
    districts,
    apportionment,
  };
};
