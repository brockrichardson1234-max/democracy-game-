import { createHash } from "node:crypto";

import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import { unzipSync } from "fflate";

import { readDbfRecords } from "./us-topology-artifacts.mjs";

export const I4_TRANSFORMATION_VERSION = "us-v0-i4-artifacts-v1";
export const POPULATION_SCAFFOLD_VERSION = "us-v0-population-joint-scaffold-1";
export const CVAP_TRANSFORMATION_VERSION = "us-v0-cvap-proxy-v1-round-half-up-largest-remainder";
export const REFINEMENT_SEMANTIC_VERSION = "weighted-population-refinement-v1";

const SOURCE_CRS = "NAD83 geographic coordinates (EPSG:4269)";
const RUNTIME_CRS = "NAD83 geographic coordinates (EPSG:4269)";
const CO_FIPS = "08";
const TX_FIPS = "48";

const SOURCES = {
  stateGeography: {
    sourceId: "USR-SRC-0088",
    product: "Census 2025 Cartographic Boundary Files, States, 1:500,000",
    producer: "U.S. Census Bureau",
    sourceScope: "states and state-equivalents; runtime filters to 50 states plus District of Columbia",
    sourceResolution: "cartographic boundary 1:500,000",
    locator: "https://www2.census.gov/geo/tiger/GENZ2025/shp/cb_2025_us_state_500k.zip",
    vintage: "2025",
    mappingClass: "DIRECT",
  },
  districtGeography: {
    sourceId: "USR-SRC-0088",
    product: "Census 2025 Cartographic Boundary Files, 119th Congressional Districts, 1:500,000",
    producer: "U.S. Census Bureau",
    sourceScope: "119th Congressional Districts; runtime filters to 435 apportioned voting districts",
    sourceResolution: "cartographic boundary 1:500,000",
    locator: "https://www2.census.gov/geo/tiger/GENZ2025/shp/cb_2025_us_cd119_500k.zip",
    vintage: "2025 / 119th Congress",
    mappingClass: "DIRECT",
  },
  residentPopulation: {
    sourceId: "USR-SRC-0092",
    product: "Census Vintage 2025 NST-EST2025-ALLDATA",
    producer: "U.S. Census Bureau",
    sourceScope: "50 states plus District of Columbia and national validation row",
    locator: "https://www2.census.gov/programs-surveys/popest/datasets/2020-2025/state/totals/NST-EST2025-ALLDATA.csv",
    vintage: "Vintage 2025; reference date 2025-07-01",
    mappingClass: "DIRECT",
  },
  tenure: {
    sourceId: "USR-SRC-0111",
    product: "ACS 2024 five-year B25008 table-based summary file",
    producer: "U.S. Census Bureau",
    sourceScope: "state/DC estimates and margins of error; universe is persons in occupied housing units",
    locator: "https://www2.census.gov/programs-surveys/acs/summary_file/2024/table-based-SF/data/5YRData/acsdt5y2024-b25008.dat",
    vintage: "2020-2024 ACS five-year",
    mappingClass: "DERIVED",
  },
  cvap: {
    sourceId: "USR-SRC-0111",
    product: "2020-2024 ACS CVAP Special Tabulation, CSV files",
    producer: "U.S. Census Bureau",
    sourceScope: "state/DC total rows from State.csv; CVAP estimate, denominator, and margins of error",
    locator: "https://www2.census.gov/programs-surveys/decennial/rdo/datasets/2024/2024-cvap/CVAP_2020-2024_ACS_csv_files.zip",
    vintage: "2020-2024 ACS; released 2026-01-30",
    mappingClass: "APPROXIMATED",
  },
  electoral: {
    sourceId: "USR-SRC-0091",
    product: "National Archives Distribution of Electoral Votes",
    producer: "National Archives and Records Administration",
    sourceScope: "50 states plus District of Columbia; 2024/2028 allocation",
    locator: "https://www.archives.gov/electoral-college/allocation",
    vintage: "2020 Census allocation applicable to 2024 and 2028",
    mappingClass: "DIRECT",
  },
  stables: {
    sourceId: "USR-SRC-0106",
    product: "HUD final Stables project-specific nonavailability waiver W-0000102",
    producer: "U.S. Department of Housing and Urban Development",
    sourceScope: "accepted project identity and supported address only",
    locator: "https://www.hud.gov/sites/default/files/Main/documents/Final-Nonavailability-Waiver-CO-DOLA-Arapahoe-Co-HVAC-W-0000102.pdf",
    vintage: "effective 2026-08-10",
    mappingClass: "DIRECT",
  },
  palms: {
    sourceId: "USR-SRC-0119",
    product: "Texas TABS2025005871 Palms physical-project record",
    producer: "Texas Department of Licensing and Regulation",
    sourceScope: "accepted project identity and supported address only",
    locator: "https://www.tdlr.texas.gov/TABS/Search/Print/TABS2025005871",
    vintage: "registered 2024-11-19; frozen 2026-08-22",
    mappingClass: "DIRECT",
  },
};

export const sha256 = (value) => createHash("sha256").update(value).digest("hex");
export const contentHash = (value) => sha256(JSON.stringify(value));
export const serializeArtifact = (artifact) => `${JSON.stringify(artifact, null, 2)}\n`;

const sourceRecord = (source, bytes, retrievedAt, consumed) => ({
  ...source,
  retrievedAt,
  rawSha256: sha256(bytes),
  consumed,
});

const artifactMetadata = ({ artifactId, vintage, records, sources, derivedFrom = [], limitations = [] }) => ({
  artifactId,
  vintage,
  transformationVersion: I4_TRANSFORMATION_VERSION,
  contentSha256: contentHash(records),
  rawSourceSha256s: sources.map((source) => source.rawSha256).sort(),
  sources,
  derivedFrom,
  limitations,
});

const unzip = (bytes, label) => {
  try {
    return unzipSync(new Uint8Array(bytes));
  } catch (error) {
    throw new Error(`Unable to read ${label} ZIP container.`, { cause: error });
  }
};

const requiredZipMember = (entries, member, label) => {
  const bytes = entries[member];
  if (bytes === undefined) throw new Error(`${label} is missing required member ${member}.`);
  return Buffer.from(bytes);
};

const parseDelimited = (text, separator) => {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (quoted) {
      if (character === '"' && text[index + 1] === '"') {
        field += '"';
        index += 1;
      } else if (character === '"') quoted = false;
      else field += character;
    } else if (character === '"') quoted = true;
    else if (character === separator) {
      row.push(field);
      field = "";
    } else if (character === "\n") {
      row.push(field.replace(/\r$/, ""));
      rows.push(row);
      row = [];
      field = "";
    } else field += character;
  }
  if (quoted) throw new Error("Delimited source contains an unterminated quoted field.");
  if (field.length > 0 || row.length > 0) {
    row.push(field.replace(/\r$/, ""));
    rows.push(row);
  }
  if (rows.length < 2) throw new Error("Delimited source contains no data rows.");
  const headers = rows[0];
  if (new Set(headers).size !== headers.length) throw new Error("Delimited source contains duplicate headers.");
  return rows.slice(1).filter((values) => values.some((value) => value.length > 0)).map((values) => {
    if (values.length !== headers.length) throw new Error("Delimited source row does not match its header width.");
    return Object.fromEntries(headers.map((header, index) => [header, values[index]]));
  });
};

const parseInteger = (value, label, { positive = true } = {}) => {
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || (positive && parsed <= 0)) throw new Error(`${label} must be a safe integer.`);
  return parsed;
};

const round6 = (value) => Math.round(value * 1_000_000) / 1_000_000;

const parsePolygonShapefile = (bytes, label) => {
  if (bytes.length < 100 || bytes.readInt32BE(0) !== 9994) throw new Error(`${label} has an invalid shapefile header.`);
  const declaredLength = bytes.readInt32BE(24) * 2;
  if (declaredLength !== bytes.length) throw new Error(`${label} shapefile length does not match its header.`);
  const headerType = bytes.readInt32LE(32);
  if (headerType !== 5) throw new Error(`${label} must contain Polygon shapes.`);
  const shapes = [];
  let offset = 100;
  while (offset < bytes.length) {
    if (offset + 8 > bytes.length) throw new Error(`${label} contains a truncated record header.`);
    const recordNumber = bytes.readInt32BE(offset);
    const contentLength = bytes.readInt32BE(offset + 4) * 2;
    const start = offset + 8;
    const end = start + contentLength;
    if (end > bytes.length || contentLength < 44) throw new Error(`${label} contains an invalid record length.`);
    const shapeType = bytes.readInt32LE(start);
    if (shapeType !== 5) throw new Error(`${label} record ${recordNumber} is not a Polygon.`);
    const bounds = [
      bytes.readDoubleLE(start + 4),
      bytes.readDoubleLE(start + 12),
      bytes.readDoubleLE(start + 20),
      bytes.readDoubleLE(start + 28),
    ].map(round6);
    const partCount = bytes.readInt32LE(start + 36);
    const pointCount = bytes.readInt32LE(start + 40);
    const partsOffset = start + 44;
    const pointsOffset = partsOffset + partCount * 4;
    if (partCount <= 0 || pointCount <= 0 || pointsOffset + pointCount * 16 > end) {
      throw new Error(`${label} record ${recordNumber} has invalid polygon counts.`);
    }
    const partStarts = Array.from({ length: partCount }, (_, index) => bytes.readInt32LE(partsOffset + index * 4));
    const rings = partStarts.map((partStart, index) => {
      const partEnd = partStarts[index + 1] ?? pointCount;
      if (partStart < 0 || partEnd <= partStart || partEnd > pointCount) {
        throw new Error(`${label} record ${recordNumber} has invalid ring offsets.`);
      }
      return Array.from({ length: partEnd - partStart }, (_, pointIndex) => {
        const pointOffset = pointsOffset + (partStart + pointIndex) * 16;
        const point = [round6(bytes.readDoubleLE(pointOffset)), round6(bytes.readDoubleLE(pointOffset + 8))];
        if (!point.every(Number.isFinite) || Math.abs(point[0]) > 180 || Math.abs(point[1]) > 90) {
          throw new Error(`${label} record ${recordNumber} contains an invalid coordinate.`);
        }
        return point;
      });
    });
    shapes.push({ recordNumber, bounds, rings });
    offset = end;
  }
  return shapes;
};

const pointOnSegment = ([x, y], [x1, y1], [x2, y2]) => {
  const epsilon = 1e-6;
  const cross = (x - x1) * (y2 - y1) - (y - y1) * (x2 - x1);
  if (Math.abs(cross) > epsilon) return false;
  return x >= Math.min(x1, x2) - epsilon && x <= Math.max(x1, x2) + epsilon &&
    y >= Math.min(y1, y2) - epsilon && y <= Math.max(y1, y2) + epsilon;
};

const pointWithinPolygonRings = (point, rings) => {
  let inside = false;
  for (const ring of rings) {
    for (let current = 0, previous = ring.length - 1; current < ring.length; previous = current, current += 1) {
      if (pointOnSegment(point, ring[previous], ring[current])) return true;
      const [x, y] = point;
      const [xi, yi] = ring[current];
      const [xj, yj] = ring[previous];
      if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
    }
  }
  return inside;
};

const polygonsHaveValidatedOverlap = (child, parent) => {
  const candidates = [
    [(child.bounds[0] + child.bounds[2]) / 2, (child.bounds[1] + child.bounds[3]) / 2],
    ...child.rings.flatMap((ring) => {
      const step = Math.max(1, Math.floor(ring.length / 8));
      return ring.filter((_, index) => index % step === 0).slice(0, 8);
    }),
  ];
  return candidates.some((point) => pointWithinPolygonRings(point, parent.rings));
};

const extractGeography = ({ zipBytes, basename, label, requiredFields }) => {
  const entries = unzip(zipBytes, label);
  const dbfBytes = requiredZipMember(entries, `${basename}.dbf`, label);
  const shpBytes = requiredZipMember(entries, `${basename}.shp`, label);
  const prjBytes = requiredZipMember(entries, `${basename}.prj`, label);
  const records = readDbfRecords(dbfBytes, requiredFields);
  const shapes = parsePolygonShapefile(shpBytes, label);
  if (records.length !== shapes.length) throw new Error(`${label} DBF and SHP record counts differ.`);
  const projection = prjBytes.toString("utf8").trim();
  if (!projection.includes("North_American_1983")) throw new Error(`${label} projection is not the accepted NAD83 source CRS.`);
  return { records, shapes, projection };
};

const stateGeographyId = (fips) => `us.geography.state.${fips}`;
const districtGeographyId = (geoid) => `us.geography.cd119.${geoid}`;

export const buildGeographyArtifacts = ({
  stateZipBytes,
  districtZipBytes,
  stateIdentityRecords,
  districtIdentityRecords,
  retrievedAt,
}) => {
  const stateByFips = new Map(stateIdentityRecords.map((record) => [record.stateFips, record]));
  const districtByGeoid = new Map(districtIdentityRecords.map((record) => [record.geoid, record]));
  const stateSource = extractGeography({
    zipBytes: stateZipBytes,
    basename: "cb_2025_us_state_500k",
    label: "2025 state cartographic source",
    requiredFields: ["STATEFP", "STUSPS", "NAME", "GEOID"],
  });
  const stateFeatures = stateSource.records.map((record, index) => ({ record, shape: stateSource.shapes[index] }))
    .filter(({ record }) => stateByFips.has(record.STATEFP))
    .map(({ record, shape }) => {
      const identity = stateByFips.get(record.STATEFP);
      if (record.GEOID !== record.STATEFP || record.STUSPS !== identity.stateUsps || record.NAME !== identity.officialName) {
        throw new Error(`State geometry identity contradicts accepted state record ${record.STATEFP}.`);
      }
      return {
        id: stateGeographyId(record.STATEFP),
        kind: "ADMINISTRATIVE_AREA",
        parentGeographyId: null,
        jurisdictionId: record.STATEFP === "11" ? "us.jurisdiction.dc.11" : `us.jurisdiction.state.${record.STATEFP}`,
        sourceFeatureId: record.GEOID,
        externalIdentifiers: { FIPS: record.STATEFP, USPS: record.STUSPS },
        geometry: { type: "POLYGON_RINGS", bounds: shape.bounds, rings: shape.rings },
        sourceArtifactId: "us.i4.geography.states-2025-500k-v1",
        effectiveLabel: "2025 Census cartographic state/equivalent geography",
        scenarioLabel: "STATIC SCENARIO GEOGRAPHY — 2025 VINTAGE",
      };
    }).sort((left, right) => left.externalIdentifiers.FIPS.localeCompare(right.externalIdentifiers.FIPS));
  if (stateFeatures.length !== 51) throw new Error(`State geography must contain 51 in-scope features; found ${stateFeatures.length}.`);

  const districtSource = extractGeography({
    zipBytes: districtZipBytes,
    basename: "cb_2025_us_cd119_500k",
    label: "2025 119th congressional-district cartographic source",
    requiredFields: ["STATEFP", "CD119FP", "GEOID"],
  });
  const stateFeatureByFips = new Map(stateFeatures.map((feature) => [feature.externalIdentifiers.FIPS, feature]));
  const districtFeatures = districtSource.records.map((record, index) => ({ record, shape: districtSource.shapes[index] }))
    .filter(({ record }) => districtByGeoid.has(record.GEOID))
    .map(({ record, shape }) => {
      const identity = districtByGeoid.get(record.GEOID);
      if (record.STATEFP !== identity.stateFips || record.CD119FP !== identity.districtCode) {
        throw new Error(`District geometry identity contradicts accepted I2 identity ${record.GEOID}.`);
      }
      const parent = stateFeatureByFips.get(record.STATEFP);
      if (parent === undefined) throw new Error(`District ${record.GEOID} has no in-scope state geography.`);
      const [minX, minY, maxX, maxY] = shape.bounds;
      const [stateMinX, stateMinY, stateMaxX, stateMaxY] = parent.geometry.bounds;
      const tolerance = 0.05;
      if (minX < stateMinX - tolerance || minY < stateMinY - tolerance || maxX > stateMaxX + tolerance || maxY > stateMaxY + tolerance) {
        throw new Error(`District ${record.GEOID} geometry contradicts identifier-based state nesting.`);
      }
      if (!polygonsHaveValidatedOverlap(shape, parent.geometry)) {
        throw new Error(`District ${record.GEOID} polygon has no validated overlap with its identifier-assigned state.`);
      }
      return {
        id: districtGeographyId(record.GEOID),
        kind: "LEGISLATIVE_CONSTITUENCY",
        parentGeographyId: stateGeographyId(record.STATEFP),
        jurisdictionId: identity.stateJurisdictionId,
        sourceFeatureId: record.GEOID,
        externalIdentifiers: { STATEFP: record.STATEFP, CD119FP: record.CD119FP, GEOID: record.GEOID },
        geometry: { type: "POLYGON_RINGS", bounds: shape.bounds, rings: shape.rings },
        sourceArtifactId: "us.i4.geography.cd119-2025-500k-v1",
        effectiveLabel: "119th Congress / January 2025–January 2027",
        scenarioLabel: "APPROXIMATED SCENARIO/FROZEN DISTRICT GEOGRAPHY — 119TH VINTAGE",
      };
    }).sort((left, right) => left.externalIdentifiers.GEOID.localeCompare(right.externalIdentifiers.GEOID));
  if (districtFeatures.length !== 435 || new Set(districtFeatures.map((feature) => feature.id)).size !== 435) {
    throw new Error("District geography must deepen exactly 435 accepted I2 identities.");
  }
  if ([...districtByGeoid.keys()].some((geoid) => !districtFeatures.some((feature) => feature.externalIdentifiers.GEOID === geoid))) {
    throw new Error("District geometry set differs from the accepted I2 district identity set.");
  }

  return {
    states: {
      metadata: {
        ...artifactMetadata({
          artifactId: "us.i4.geography.states-2025-500k-v1",
          vintage: "2025 Census Cartographic Boundary Files, 1:500,000",
          records: stateFeatures,
          sources: [sourceRecord(SOURCES.stateGeography, stateZipBytes, retrievedAt, [
            "cb_2025_us_state_500k.dbf",
            "cb_2025_us_state_500k.shp",
            "cb_2025_us_state_500k.prj",
          ])],
          limitations: ["Statistical cartographic boundaries; not legal land descriptions."],
        }),
        sourceCrs: SOURCE_CRS,
        runtimeCrs: RUNTIME_CRS,
        sourceProjection: stateSource.projection,
        coordinatePolicy: "No simplification; coordinates deterministically rounded to six decimal places.",
        featureOrdering: "ascending FIPS",
      },
      features: stateFeatures,
    },
    districts: {
      metadata: {
        ...artifactMetadata({
          artifactId: "us.i4.geography.cd119-2025-500k-v1",
          vintage: "2025 Census Cartographic Boundary Files, 119th Congress, 1:500,000",
          records: districtFeatures,
          sources: [sourceRecord(SOURCES.districtGeography, districtZipBytes, retrievedAt, [
            "cb_2025_us_cd119_500k.dbf",
            "cb_2025_us_cd119_500k.shp",
            "cb_2025_us_cd119_500k.prj",
          ])],
          limitations: ["119th-vintage constituency frame remains frozen after January 2027; no redistricting inference."],
        }),
        sourceCrs: SOURCE_CRS,
        runtimeCrs: RUNTIME_CRS,
        sourceProjection: districtSource.projection,
        coordinatePolicy: "No simplification; coordinates deterministically rounded to six decimal places.",
        featureOrdering: "ascending GEOID",
      },
      features: districtFeatures,
    },
  };
};

export const buildResidentPopulationArtifact = ({ bytes, stateIdentityRecords, retrievedAt }) => {
  const rows = parseDelimited(bytes.toString("utf8"), ",");
  const stateByFips = new Map(stateIdentityRecords.map((record) => [record.stateFips, record]));
  const controls = rows.filter((row) => row.SUMLEV === "040" && stateByFips.has(row.STATE)).map((row) => {
    const identity = stateByFips.get(row.STATE);
    if (identity.officialName !== row.NAME) throw new Error(`Population row name contradicts state identity ${row.STATE}.`);
    return {
      id: `us.population.control.${row.STATE}`,
      residenceGeographyId: stateGeographyId(row.STATE),
      stateFips: row.STATE,
      stateUsps: identity.stateUsps,
      residentWeight: parseInteger(row.POPESTIMATE2025, `${row.NAME} POPESTIMATE2025`),
      sourceField: "POPESTIMATE2025",
      referenceDate: "2025-07-01",
      sourceArtifactId: "us.i4.population.resident-controls-2025-v1",
      classification: "DIRECT",
    };
  }).sort((left, right) => left.stateFips.localeCompare(right.stateFips));
  if (controls.length !== 51 || new Set(controls.map((record) => record.stateFips)).size !== 51) {
    throw new Error("Resident population source must yield exactly 50 states plus DC.");
  }
  const published = rows.find((row) => row.SUMLEV === "010" && row.NAME === "United States");
  if (published === undefined) throw new Error("Resident population source lacks its published United States validation row.");
  const publishedNationalTotal = parseInteger(published.POPESTIMATE2025, "United States POPESTIMATE2025");
  const inScopeNationalTotal = controls.reduce((total, control) => total + control.residentWeight, 0);
  if (inScopeNationalTotal !== publishedNationalTotal) {
    throw new Error(`The 51-row population sum ${inScopeNationalTotal} differs from published scope ${publishedNationalTotal}.`);
  }
  return {
    metadata: artifactMetadata({
      artifactId: "us.i4.population.resident-controls-2025-v1",
      vintage: "Census Vintage 2025; 2025-07-01 reference date",
      records: { controls, publishedNationalTotal },
      sources: [sourceRecord(SOURCES.residentPopulation, bytes, retrievedAt, [
        "SUMLEV", "STATE", "NAME", "POPESTIMATE2025",
      ])],
      limitations: ["Resident estimates are not citizenship, eligibility, registration, turnout, or votes."],
    }),
    sourceField: "POPESTIMATE2025",
    referenceDate: "2025-07-01",
    publishedNationalTotal,
    inScopeNationalTotal,
    controls,
  };
};

export const buildTenureArtifact = ({ bytes, stateIdentityRecords, retrievedAt }) => {
  const rows = parseDelimited(bytes.toString("utf8"), "|");
  const stateFips = new Set(stateIdentityRecords.map((record) => record.stateFips));
  const records = rows.filter((row) => /^0400000US\d{2}$/.test(row.GEO_ID) && stateFips.has(row.GEO_ID.slice(-2))).map((row) => {
    const fips = row.GEO_ID.slice(-2);
    const total = parseInteger(row.B25008_E001, `${fips} B25008 total`);
    const owner = parseInteger(row.B25008_E002, `${fips} B25008 owner`);
    const renter = parseInteger(row.B25008_E003, `${fips} B25008 renter`);
    if (owner + renter !== total) throw new Error(`B25008 owner+renter does not equal total for ${fips}.`);
    return {
      stateFips: fips,
      residenceGeographyId: stateGeographyId(fips),
      totalOccupiedHousingPersonsEstimate: total,
      totalOccupiedHousingPersonsMoe: parseInteger(row.B25008_M001, `${fips} B25008 total MOE`, { positive: false }),
      ownerOccupiedHousingPersonsEstimate: owner,
      ownerOccupiedHousingPersonsMoe: parseInteger(row.B25008_M002, `${fips} B25008 owner MOE`, { positive: false }),
      renterOccupiedHousingPersonsEstimate: renter,
      renterOccupiedHousingPersonsMoe: parseInteger(row.B25008_M003, `${fips} B25008 renter MOE`, { positive: false }),
      renterShareNumerator: renter,
      renterShareDenominator: total,
      universe: "Population in occupied housing units",
      classification: "APPROXIMATED_DERIVED_WHEN_PROJECTED_TO_RESIDENT_CONTROL",
    };
  }).sort((left, right) => left.stateFips.localeCompare(right.stateFips));
  if (records.length !== 51) throw new Error(`B25008 must yield exactly 51 state/DC records; found ${records.length}.`);
  return {
    metadata: artifactMetadata({
      artifactId: "us.i4.population.tenure-input-acs2024-v1",
      vintage: "ACS 2024 five-year B25008",
      records,
      sources: [sourceRecord(SOURCES.tenure, bytes, retrievedAt, [
        "GEO_ID", "B25008_E001", "B25008_M001", "B25008_E002", "B25008_M002", "B25008_E003", "B25008_M003",
      ])],
      limitations: ["Occupied-housing-person tenure share is projected onto the different resident-population universe."],
    }),
    universe: "Population in occupied housing units",
    records,
  };
};

const roundHalfUpRatio = (multiplicand, numerator, denominator) => {
  const scaled = BigInt(multiplicand) * BigInt(numerator);
  return Number((scaled * 2n + BigInt(denominator)) / (2n * BigInt(denominator)));
};

export const buildCvapArtifact = ({ bytes, stateIdentityRecords, populationArtifact, retrievedAt }) => {
  const entries = unzip(bytes, "2020-2024 CVAP source");
  const stateCsv = requiredZipMember(entries, "State.csv", "2020-2024 CVAP source");
  const rows = parseDelimited(stateCsv.toString("utf8"), ",");
  const controls = new Map(populationArtifact.controls.map((record) => [record.stateFips, record]));
  const states = new Map(stateIdentityRecords.map((record) => [record.stateFips, record]));
  const records = rows.filter((row) => row.lnnumber === "1" && /^0400000US\d{2}$/.test(row.geoid)).map((row) => {
    const fips = row.geoid.slice(-2);
    const state = states.get(fips);
    const control = controls.get(fips);
    if (state === undefined || control === undefined) return null;
    if (state.officialName !== row.geoname || row.lntitle !== "Total") throw new Error(`CVAP row contradicts state identity ${fips}.`);
    const denominator = parseInteger(row.tot_est, `${fips} CVAP denominator`);
    const cvapEstimate = parseInteger(row.cvap_est, `${fips} CVAP estimate`);
    if (cvapEstimate > denominator) throw new Error(`CVAP estimate exceeds denominator for ${fips}.`);
    return {
      id: `us.population.eligibility-proxy.${fips}`,
      stateFips: fips,
      residenceGeographyId: control.residenceGeographyId,
      sourcePopulationEstimate: denominator,
      sourcePopulationMoe: parseInteger(row.tot_moe, `${fips} CVAP denominator MOE`, { positive: false }),
      cvapEstimate,
      cvapMoe: parseInteger(row.cvap_moe, `${fips} CVAP MOE`, { positive: false }),
      shareNumerator: cvapEstimate,
      shareDenominator: denominator,
      residentControlWeight: control.residentWeight,
      eligibleProxyWeight: roundHalfUpRatio(control.residentWeight, cvapEstimate, denominator),
      unroundedRational: `${BigInt(control.residentWeight) * BigInt(cvapEstimate)}/${denominator}`,
      integerizationPolicy: "ROUND_HALF_UP_EXACT_RATIONAL_V1",
      transformationVersion: CVAP_TRANSFORMATION_VERSION,
      universe: "Citizen voting-age population special-tab estimate divided by special-tab total population",
      classification: "APPROXIMATED_DERIVED_ELIGIBILITY_PROXY",
    };
  }).filter(Boolean).sort((left, right) => left.stateFips.localeCompare(right.stateFips));
  if (records.length !== 51) throw new Error(`CVAP source must yield exactly 51 state/DC total records; found ${records.length}.`);
  return {
    metadata: artifactMetadata({
      artifactId: "us.i4.population.cvap-proxy-2020-2024-v1",
      vintage: "2020-2024 ACS CVAP special tabulation; released 2026-01-30",
      records,
      sources: [sourceRecord(SOURCES.cvap, bytes, retrievedAt, ["State.csv"] )],
      limitations: [
        "Proxy is not exact legal eligibility, registration, turnout, or votes.",
        "One state share is applied uniformly across tenure/catchment cohorts as an explicit independence assumption.",
      ],
    }),
    transformationVersion: CVAP_TRANSFORMATION_VERSION,
    integerizationPolicy: "ROUND_HALF_UP_EXACT_RATIONAL_V1",
    records,
  };
};

const allocateLargestRemainder = (cohorts, total, stateWeight) => {
  const allocations = cohorts.map((cohort) => {
    const product = BigInt(cohort.representedWeight) * BigInt(total);
    return {
      cohort,
      allocated: Number(product / BigInt(stateWeight)),
      remainder: product % BigInt(stateWeight),
    };
  });
  let remaining = total - allocations.reduce((sum, record) => sum + record.allocated, 0);
  allocations.sort((left, right) => {
    if (left.remainder !== right.remainder) return left.remainder > right.remainder ? -1 : 1;
    return left.cohort.id.localeCompare(right.cohort.id);
  });
  for (let index = 0; index < remaining; index += 1) allocations[index].allocated += 1;
  return new Map(allocations.map((record) => [record.cohort.id, record.allocated]));
};

export const buildInitialCohortArtifact = ({ populationArtifact, tenureArtifact, cvapArtifact, projectLocatorArtifact }) => {
  const tenureByFips = new Map(tenureArtifact.records.map((record) => [record.stateFips, record]));
  const cvapByFips = new Map(cvapArtifact.records.map((record) => [record.stateFips, record]));
  const locatorByFips = new Map(projectLocatorArtifact.records.map((record) => [record.stateFips, record]));
  const cohorts = [];
  for (const control of populationArtifact.controls) {
    const tenure = tenureByFips.get(control.stateFips);
    const cvap = cvapByFips.get(control.stateFips);
    if (tenure === undefined || cvap === undefined) throw new Error(`Missing population projection input for ${control.stateFips}.`);
    const renterWeight = Number(
      BigInt(control.residentWeight) * BigInt(tenure.renterShareNumerator) / BigInt(tenure.renterShareDenominator),
    );
    const parents = [
      { materialExposureClass: "RENTER_EXPOSED", representedWeight: renterWeight },
      { materialExposureClass: "NONRENTER_EXPOSED", representedWeight: control.residentWeight - renterWeight },
    ];
    const stateCohorts = [];
    for (const parent of parents) {
      const baseId = `us.population.cohort.${control.stateFips}.${parent.materialExposureClass.toLowerCase().replaceAll("_", "-")}`;
      if (control.stateFips === CO_FIPS || control.stateFips === TX_FIPS) {
        const locator = locatorByFips.get(control.stateFips);
        if (locator === undefined) throw new Error(`Missing configured project locator for ${control.stateFips}.`);
        const catchmentWeight = Math.floor(parent.representedWeight * 0.001);
        stateCohorts.push(
          {
            id: `${baseId}.project-catchment`,
            representedWeight: catchmentWeight,
            materialExposureClass: parent.materialExposureClass,
            catchmentClass: "PROJECT_CATCHMENT",
            projectLocatorGeographyId: locator.id,
          },
          {
            id: `${baseId}.state-remainder`,
            representedWeight: parent.representedWeight - catchmentWeight,
            materialExposureClass: parent.materialExposureClass,
            catchmentClass: "STATE_REMAINDER",
            projectLocatorGeographyId: null,
          },
        );
      } else {
        stateCohorts.push({
          id: baseId,
          representedWeight: parent.representedWeight,
          materialExposureClass: parent.materialExposureClass,
          catchmentClass: "STATE_BACKGROUND",
          projectLocatorGeographyId: null,
        });
      }
    }
    if (stateCohorts.some((cohort) => cohort.representedWeight <= 0)) throw new Error(`Population scaffold produced an invalid cohort for ${control.stateFips}.`);
    const eligibleAllocations = allocateLargestRemainder(stateCohorts, cvap.eligibleProxyWeight, control.residentWeight);
    for (const cohort of stateCohorts) {
      cohorts.push({
        ...cohort,
        residenceGeographyId: control.residenceGeographyId,
        stateControlId: control.id,
        materialExposureReferences: [],
        receivedInformationReferences: [],
        politicalState: {
          belief: "UNCERTAIN_UNRESOLVED",
          attribution: "NONE_UNKNOWN",
          salience: "NEUTRAL_LOW",
          candidatePreference: "UNRESOLVED",
          turnoutDisposition: "UNRESOLVED",
          classification: "APPROXIMATED_STATIC_CONFIGURATION_NON_HISTORICAL_SCAFFOLD",
        },
        eligibilityProjection: {
          projectionId: cvap.id,
          allocatedWeight: eligibleAllocations.get(cohort.id),
          shareNumerator: cvap.shareNumerator,
          shareDenominator: cvap.shareDenominator,
          allocationPolicy: "DETERMINISTIC_LARGEST_REMAINDER_V1",
          classification: "APPROXIMATED_DERIVED_ELIGIBILITY_PROXY",
        },
        lineage: {
          version: POPULATION_SCAFFOLD_VERSION,
          generation: 0,
          parentCohortId: null,
          causeKey: "DAY_0_INITIALIZATION",
        },
      });
    }
  }
  cohorts.sort((left, right) => left.id.localeCompare(right.id));
  if (cohorts.length !== 106) throw new Error(`Population scaffold must create 106 cohorts; found ${cohorts.length}.`);
  for (const control of populationArtifact.controls) {
    const stateCohorts = cohorts.filter((cohort) => cohort.stateControlId === control.id);
    if (stateCohorts.reduce((sum, cohort) => sum + cohort.representedWeight, 0) !== control.residentWeight) {
      throw new Error(`Population cohort weight does not conserve ${control.stateFips}.`);
    }
    const cvap = cvapByFips.get(control.stateFips);
    if (stateCohorts.reduce((sum, cohort) => sum + cohort.eligibilityProjection.allocatedWeight, 0) !== cvap.eligibleProxyWeight) {
      throw new Error(`Eligibility proxy allocation does not conserve ${control.stateFips}.`);
    }
  }
  return {
    metadata: artifactMetadata({
      artifactId: "us.i4.population.initial-cohorts-2026-08-22-v1",
      vintage: "Scenario Day 0, 2026-08-22",
      records: cohorts,
      sources: [],
      derivedFrom: [
        populationArtifact.metadata.artifactId,
        tenureArtifact.metadata.artifactId,
        cvapArtifact.metadata.artifactId,
        projectLocatorArtifact.metadata.artifactId,
      ],
      limitations: [
        "Cohorts are authored aggregate scaffolds, not Census microdata.",
        "B25008 tenure share is projected onto resident population across different universes.",
        "Colorado/Texas project catchments are 0.001 modeled splits with state tenure mix retained as a non-observed independence assumption.",
        "CVAP share is uniform within each state across tenure/catchment cohorts.",
      ],
    }),
    scaffoldVersion: POPULATION_SCAFFOLD_VERSION,
    refinementSemanticVersion: REFINEMENT_SEMANTIC_VERSION,
    catchmentRatio: { numerator: 1, denominator: 1000 },
    classification: "APPROXIMATED_NON_OBSERVED_INDEPENDENCE_ASSUMPTION_STATIC_INITIALIZATION_SCAFFOLD",
    cohorts,
  };
};

const decodeHtml = (value) => value
  .replace(/&nbsp;/g, " ")
  .replace(/&amp;/g, "&")
  .replace(/&#039;/g, "'")
  .replace(/&quot;/g, '"')
  .replace(/<[^>]+>/g, "")
  .replace(/\s+/g, " ")
  .trim();

const pdfText = async (bytes) => {
  const document = await getDocument({ data: new Uint8Array(bytes), disableWorker: true }).promise;
  const pages = [];
  for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
    const page = await document.getPage(pageNumber);
    const content = await page.getTextContent();
    pages.push(content.items.map((item) => item.str).join(" "));
  }
  return pages.join("\n").replace(/\s+/g, " ").trim();
};

export const buildProjectLocatorArtifact = async ({ stablesBytes, palmsBytes, retrievedAt }) => {
  const stablesText = await pdfText(stablesBytes);
  const stablesMatch = stablesText.match(/project is located at (10850 E\. Exposition Ave\.) in (Aurora, Colorado)/i);
  if (stablesMatch === null || !stablesText.includes("Stables Affordable Housing Project")) {
    throw new Error("Authenticated Stables source lacks the accepted project/address locator.");
  }
  const palmsHtml = palmsBytes.toString("utf8");
  const palmsValues = [...palmsHtml.matchAll(/<dd>([\s\S]*?)<\/dd>/gi)].map((match) => decodeHtml(match[1]));
  for (const expected of ["Palms at Morris Apartments", "2212 Morris Avenue", "Corpus Christi, TX 78405"]) {
    if (!palmsValues.includes(expected)) throw new Error(`Authenticated Palms source lacks ${expected}.`);
  }
  const records = [
    {
      id: "us.geography.project-locator.stables",
      label: "Stables project locator",
      stateFips: CO_FIPS,
      parentGeographyId: stateGeographyId(CO_FIPS),
      locatorKind: "SOURCE_ADDRESS_REFERENCE",
      supportedAddress: `${stablesMatch[1]} ${stablesMatch[2]}`,
      geometry: null,
      sourceId: SOURCES.stables.sourceId,
      precisionLimit: "Address text only; no parcel, municipal boundary, catchment polygon, or geocoded point asserted.",
    },
    {
      id: "us.geography.project-locator.palms",
      label: "Palms project locator",
      stateFips: TX_FIPS,
      parentGeographyId: stateGeographyId(TX_FIPS),
      locatorKind: "SOURCE_ADDRESS_REFERENCE",
      supportedAddress: "2212 Morris Avenue, Corpus Christi, TX 78405",
      geometry: null,
      sourceId: SOURCES.palms.sourceId,
      precisionLimit: "Address text only; no parcel, municipal boundary, catchment polygon, or geocoded point asserted.",
    },
  ];
  return {
    metadata: artifactMetadata({
      artifactId: "us.i4.geography.project-locators-v1",
      vintage: "Accepted project evidence frozen 2026-08-22",
      records,
      sources: [
        sourceRecord(SOURCES.stables, stablesBytes, retrievedAt, ["project name", "source address", "Colorado locality"]),
        sourceRecord(SOURCES.palms, palmsBytes, retrievedAt, ["project name", "source address", "Texas locality"]),
      ],
      limitations: ["Evidence-backed address references only; no geometry or jurisdictional status is inferred."],
    }),
    records,
  };
};

export const buildElectoralAllocationArtifact = ({ bytes, stateIdentityRecords, districtIdentityRecords, retrievedAt }) => {
  const html = bytes.toString("utf8");
  const statesByName = new Map(stateIdentityRecords.map((record) => [record.officialName, record]));
  const parsed = [...html.matchAll(/<p>\s*([^<]+?)\s*-\s*([0-9]+)(?:\s|&nbsp;)*votes?\s*<\/p>/gi)].map((match) => ({
    name: decodeHtml(match[1]),
    electors: Number(match[2]),
  }));
  const allocations = parsed.map(({ name, electors }) => {
    const state = statesByName.get(name);
    if (state === undefined || !Number.isInteger(electors) || electors <= 0) throw new Error(`Unexpected NARA allocation row ${name}.`);
    const statewideGeographyId = stateGeographyId(state.stateFips);
    const split = state.stateUsps === "ME" || state.stateUsps === "NE";
    const districts = split
      ? districtIdentityRecords.filter((district) => district.stateFips === state.stateFips).sort((a, b) => a.geoid.localeCompare(b.geoid))
      : [];
    if (split && electors !== districts.length + 2) throw new Error(`${state.stateUsps} allocation contradicts its district structure.`);
    return {
      id: `us.electoral.allocation.${state.stateFips}`,
      stateFips: state.stateFips,
      stateUsps: state.stateUsps,
      geographyId: statewideGeographyId,
      totalElectors: electors,
      method: split ? "DISTRICT_AND_AT_LARGE" : "STATEWIDE_WINNER_TAKE_ALL",
      units: split
        ? [
            {
              id: `us.electoral.unit.${state.stateFips}.at-large`,
              geographyId: statewideGeographyId,
              electorCount: 2,
              role: "AT_LARGE",
              electorateProjection: "STATE_AGGREGATE",
            },
            ...districts.map((district) => ({
              id: `us.electoral.unit.${state.stateFips}.district.${district.geoid}`,
              geographyId: districtGeographyId(district.geoid),
              electorCount: 1,
              role: "DISTRICT",
              electorateProjection: "APPROXIMATED_STATE_AGGREGATE_NO_DISTRICT_POPULATION",
            })),
          ]
        : [{
            id: `us.electoral.unit.${state.stateFips}.statewide`,
            geographyId: statewideGeographyId,
            electorCount: electors,
            role: "STATEWIDE",
            electorateProjection: "STATE_AGGREGATE",
          }],
    };
  }).sort((left, right) => left.stateFips.localeCompare(right.stateFips));
  if (allocations.length !== 51 || new Set(allocations.map((record) => record.stateFips)).size !== 51) {
    throw new Error(`NARA source must yield 51 state/DC allocations; found ${allocations.length}.`);
  }
  const total = allocations.reduce((sum, record) => sum + record.totalElectors, 0);
  const summary = html.match(/Total Electoral Votes:<\/em>[^0-9]*([0-9]+)[\s\S]*?Majority Needed to Elect:<\/em>[^0-9]*([0-9]+)/i);
  if (summary === null || Number(summary[1]) !== 538 || Number(summary[2]) !== 270 || total !== 538) {
    throw new Error("NARA electoral allocation summary must authenticate 538 total and 270 majority.");
  }
  return {
    metadata: artifactMetadata({
      artifactId: "us.i4.electoral.allocation-2028-v1",
      vintage: "2020 Census allocation applicable to 2024 and 2028",
      records: { allocations, totalElectors: total, ordinaryMajority: 270 },
      sources: [sourceRecord(SOURCES.electoral, bytes, retrievedAt, [
        "state/DC allocation rows", "538 total", "270 majority", "Maine/Nebraska allocation method",
      ])],
      limitations: ["Static allocation topology only; contains no election result, certification, elector action, or successor state."],
    }),
    applicableElection: 2028,
    totalElectors: total,
    ordinaryMajority: 270,
    allocations,
  };
};

export const buildI4Artifacts = async ({
  stateZipBytes,
  districtZipBytes,
  populationBytes,
  tenureBytes,
  cvapBytes,
  electoralBytes,
  stablesBytes,
  palmsBytes,
  stateIdentityRecords,
  districtIdentityRecords,
  retrievedAt = "2026-08-23",
}) => {
  const geography = buildGeographyArtifacts({
    stateZipBytes,
    districtZipBytes,
    stateIdentityRecords,
    districtIdentityRecords,
    retrievedAt,
  });
  const population = buildResidentPopulationArtifact({ bytes: populationBytes, stateIdentityRecords, retrievedAt });
  const tenure = buildTenureArtifact({ bytes: tenureBytes, stateIdentityRecords, retrievedAt });
  const cvap = buildCvapArtifact({ bytes: cvapBytes, stateIdentityRecords, populationArtifact: population, retrievedAt });
  const projectLocators = await buildProjectLocatorArtifact({ stablesBytes, palmsBytes, retrievedAt });
  const cohorts = buildInitialCohortArtifact({
    populationArtifact: population,
    tenureArtifact: tenure,
    cvapArtifact: cvap,
    projectLocatorArtifact: projectLocators,
  });
  const electoral = buildElectoralAllocationArtifact({
    bytes: electoralBytes,
    stateIdentityRecords,
    districtIdentityRecords,
    retrievedAt,
  });
  return { geography, population, tenure, cvap, projectLocators, cohorts, electoral };
};

export const buildI4InitializationManifest = (artifacts) => {
  const artifactPairs = [
    ["GEOGRAPHY", artifacts.geography.states],
    ["GEOGRAPHY", artifacts.geography.districts],
    ["GEOGRAPHY", artifacts.projectLocators],
    ["POPULATION_CONTROL", artifacts.population],
    ["POPULATION_MEASUREMENT", artifacts.tenure],
    ["ELIGIBILITY_PROXY", artifacts.cvap],
    ["POPULATION_COHORT", artifacts.cohorts],
    ["ELECTORAL_TOPOLOGY", artifacts.electoral],
  ];
  const artifactBindings = artifactPairs.map(([kind, artifact]) => ({
    id: artifact.metadata.artifactId,
    kind,
    contentSha256: artifact.metadata.contentSha256,
    transformationVersion: artifact.metadata.transformationVersion,
    rawSourceSha256s: artifact.metadata.rawSourceSha256s,
  }));
  const artifactMetadata = artifactPairs.map(([, artifact]) => artifact.metadata);
  const records = {
    schemaVersion: 1,
    artifactBindings,
    artifactMetadata,
    geography: {
      stateArtifactId: artifacts.geography.states.metadata.artifactId,
      districtArtifactId: artifacts.geography.districts.metadata.artifactId,
      projectLocatorArtifactId: artifacts.projectLocators.metadata.artifactId,
    },
    population: {
      controlArtifactId: artifacts.population.metadata.artifactId,
      cohortArtifactId: artifacts.cohorts.metadata.artifactId,
      eligibilityProxyArtifactId: artifacts.cvap.metadata.artifactId,
      tenureMeasurementArtifactId: artifacts.tenure.metadata.artifactId,
      scaffoldVersion: POPULATION_SCAFFOLD_VERSION,
      refinementSemanticVersion: REFINEMENT_SEMANTIC_VERSION,
      catchmentRatio: { numerator: 1, denominator: 1000 },
      eligibilityIntegerizationVersion: CVAP_TRANSFORMATION_VERSION,
    },
    electoral: {
      topologyArtifactId: artifacts.electoral.metadata.artifactId,
    },
  };
  return {
    metadata: {
      artifactId: "us.i4.initialization-manifest-v1",
      vintage: "Scenario initialization authority through 2026-08-22",
      transformationVersion: I4_TRANSFORMATION_VERSION,
      contentSha256: contentHash(records),
    },
    ...records,
  };
};
