import { createHash } from "node:crypto";

import { strFromU8, unzipSync } from "fflate";
import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs";

export const I7_TRANSFORMATION_VERSION = "us-v0-i7-artifacts-v1";
export const I7_CATCHMENT_SCAFFOLD_VERSION = "us-v0-housing-catchment-scaffold-1";
export const I7_MATERIAL_CALIBRATION_VERSION = "us-v0-housing-material-calibration-1";
export const serializeI7Artifact = (value) => `${JSON.stringify(value, null, 2)}\n`;
export const sha256 = (value) => createHash("sha256").update(value).digest("hex");
const contentHash = (value) => sha256(JSON.stringify(value));

const decodeEntities = (value) => value
  .replace(/&#x([0-9a-f]+);/gi, (_, digits) => String.fromCodePoint(Number.parseInt(digits, 16)))
  .replace(/&#([0-9]+);/g, (_, digits) => String.fromCodePoint(Number.parseInt(digits, 10)))
  .replace(/&nbsp;/gi, " ")
  .replace(/&quot;/gi, '"')
  .replace(/&apos;/gi, "'")
  .replace(/&lt;/gi, "<")
  .replace(/&gt;/gi, ">")
  .replace(/&amp;/gi, "&");

const pdfText = async (bytes) => {
  const document = await pdfjs.getDocument({ data: new Uint8Array(bytes), disableWorker: true }).promise;
  const pages = [];
  for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
    const page = await document.getPage(pageNumber);
    const content = await page.getTextContent();
    pages.push(content.items.map((item) => item.str).join(" "));
  }
  return pages.join(" ").replace(/\s+/g, " ").trim();
};

const sourceRecord = (source, bytes, consumed) => ({
  ...source,
  retrievedAt: "2026-08-24",
  rawSha256: sha256(bytes),
  consumed,
});

const parseNonnegativeInteger = (value, label) => {
  if (!/^-?[0-9]+$/.test(String(value))) throw new Error(`${label} is not an integer.`);
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed < 0) throw new Error(`${label} is outside the supported nonnegative range.`);
  return parsed;
};

const parseSignedInteger = (value, label) => {
  if (!/^-?[0-9]+$/.test(String(value))) throw new Error(`${label} is not an integer.`);
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed)) throw new Error(`${label} is outside the supported integer range.`);
  return parsed;
};

const selectedAcsFields = [
  "B25001_E001", "B25001_M001",
  "B25002_E001", "B25002_M001", "B25002_E003", "B25002_M003",
  "B25070_E001", "B25070_M001",
  "B25070_E007", "B25070_M007", "B25070_E008", "B25070_M008",
  "B25070_E009", "B25070_M009", "B25070_E010", "B25070_M010",
  "B25106_E001", "B25106_M001", "B25106_E002", "B25106_M002",
  "B25106_E006", "B25106_M006", "B25106_E010", "B25106_M010",
  "B25106_E014", "B25106_M014", "B25106_E018", "B25106_M018",
  "B25106_E022", "B25106_M022", "B25106_E023", "B25106_M023",
  "B25106_E024", "B25106_M024", "B25106_E028", "B25106_M028",
  "B25106_E032", "B25106_M032", "B25106_E036", "B25106_M036",
  "B25106_E040", "B25106_M040", "B25106_E044", "B25106_M044",
  "B25106_E045", "B25106_M045", "B25106_E046", "B25106_M046",
];

const parsePipeTable = (bytes, requiredFields) => {
  const lines = bytes.toString("utf8").replace(/^\uFEFF/, "").split(/\r?\n/).filter((line) => line.length > 0);
  const header = lines[0].split("|");
  if (header[0] !== "GEO_ID" || requiredFields.some((field) => !header.includes(field))) {
    throw new Error("ACS table-based summary file lacks configured fields.");
  }
  return new Map(lines.slice(1)
    .map((line) => line.split("|"))
    .filter((row) => /^0400000US[0-9]{2}$/.test(row[0]))
    .map((row) => [row[0].slice(-2), Object.fromEntries(header.map((field, index) => [field, row[index]]))]));
};

const parseAcs = (acsTables, stateIdentityRecords) => {
  const tables = {
    B25001: parsePipeTable(acsTables.B25001, ["B25001_E001", "B25001_M001"]),
    B25002: parsePipeTable(acsTables.B25002, ["B25002_E001", "B25002_M001", "B25002_E003", "B25002_M003"]),
    B25070: parsePipeTable(acsTables.B25070, selectedAcsFields.filter((field) => field.startsWith("B25070"))),
    B25106: parsePipeTable(acsTables.B25106, selectedAcsFields.filter((field) => field.startsWith("B25106"))),
  };
  return stateIdentityRecords.map((identity) => {
    if (Object.values(tables).some((table) => !table.has(identity.stateFips))) {
      throw new Error(`ACS Housing input lacks state/DC ${identity.stateFips}.`);
    }
    const value = (field) => tables[field.slice(0, 6)].get(identity.stateFips)[field];
    const estimate = (field) => parseNonnegativeInteger(value(`${field.slice(0, 6)}_E${field.slice(7)}`), `${identity.stateFips} ${field}E`);
    const moe = (field) => parseSignedInteger(value(`${field.slice(0, 6)}_M${field.slice(7)}`), `${identity.stateFips} ${field}M`);
    const stock = estimate("B25001_001");
    const total = estimate("B25002_001");
    const vacant = estimate("B25002_003");
    if (stock !== total || vacant > total) throw new Error(`ACS Housing stock/vacancy identity fails for ${identity.stateFips}.`);
    const rentDenominator = estimate("B25070_001");
    const rentBurdenComponents = ["B25070_007", "B25070_008", "B25070_009", "B25070_010"].map((field) => ({
      field: `${field}E`,
      estimate: estimate(field),
      marginOfErrorField: `${field}M`,
      marginOfError: moe(field),
    }));
    const rentBurdenNumerator = rentBurdenComponents.reduce((sum, entry) => sum + entry.estimate, 0);
    if (rentDenominator <= 0 || rentBurdenNumerator > rentDenominator) {
      throw new Error(`ACS rent-burden universe is invalid for ${identity.stateFips}.`);
    }
    const ownerBurdenFields = ["B25106_006", "B25106_010", "B25106_014", "B25106_018", "B25106_022"];
    const renterBurdenFields = ["B25106_028", "B25106_032", "B25106_036", "B25106_040", "B25106_044"];
    const exposureComponents = (fields) => fields.map((field) => ({
      field: `${field}E`, estimate: estimate(field), marginOfErrorField: `${field}M`, marginOfError: moe(field),
    }));
    const ownerComponents = exposureComponents(ownerBurdenFields);
    const renterComponents = exposureComponents(renterBurdenFields);
    const ownerDenominator = estimate("B25106_002");
    const renterDenominator = estimate("B25106_024");
    return {
      id: `us.housing.control.${identity.stateFips}`,
      sourceGeographyCode: identity.stateFips,
      stateUsps: identity.stateUsps,
      stateName: identity.officialName,
      geographyId: `us.geography.state.${identity.stateFips}`,
      housingStock: { estimate: stock, marginOfError: moe("B25001_001"), sourceField: "B25001_001E", marginOfErrorField: "B25001_001M" },
      vacancy: {
        totalEstimate: total,
        totalMarginOfError: moe("B25002_001"),
        vacantEstimate: vacant,
        vacantMarginOfError: moe("B25002_003"),
        exactShare: `${vacant}/${total}`,
      },
      cashRentBurden30Plus: {
        numerator: rentBurdenNumerator,
        denominator: rentDenominator,
        exactShare: `${rentBurdenNumerator}/${rentDenominator}`,
        denominatorMarginOfError: moe("B25070_001"),
        components: rentBurdenComponents,
        universe: "RENTER_OCCUPIED_HOUSING_UNITS_PAYING_CASH_RENT",
      },
      tenureCostExposure: {
        universe: "OCCUPIED_HOUSING_UNITS_BY_TENURE_HOUSEHOLD_INCOME_AND_SELECTED_MONTHLY_OWNER_COSTS_OR_GROSS_RENT",
        totalEstimate: estimate("B25106_001"),
        totalMarginOfError: moe("B25106_001"),
        owner: {
          denominator: ownerDenominator,
          denominatorMarginOfError: moe("B25106_002"),
          burden30PlusEstimate: ownerComponents.reduce((sum, entry) => sum + entry.estimate, 0),
          components: ownerComponents,
          zeroOrNegativeIncome: { estimate: estimate("B25106_023"), marginOfError: moe("B25106_023") },
        },
        renter: {
          denominator: renterDenominator,
          denominatorMarginOfError: moe("B25106_024"),
          burden30PlusEstimate: renterComponents.reduce((sum, entry) => sum + entry.estimate, 0),
          components: renterComponents,
          zeroOrNegativeIncome: { estimate: estimate("B25106_045"), marginOfError: moe("B25106_045") },
          noCashRent: { estimate: estimate("B25106_046"), marginOfError: moe("B25106_046") },
        },
      },
      observationPeriod: "2020-01-01/2024-12-31",
      classification: "APPROXIMATED_REAL_DATA_LATENT_SEED",
      sourceId: "USR-SRC-0077/0078/0094/0111",
    };
  });
};

const xmlAttribute = (attributes, name) => attributes.match(new RegExp(`(?:^|\\s)${name}="([^"]*)"`))?.[1] ?? null;
const columnIndex = (letters) => [...letters].reduce((value, letter) => value * 26 + letter.charCodeAt(0) - 64, 0) - 1;

const parseWorksheet = (bytes) => {
  const entries = unzipSync(new Uint8Array(bytes));
  const sharedBytes = entries["xl/sharedStrings.xml"];
  const sheetBytes = entries["xl/worksheets/sheet1.xml"];
  if (sharedBytes === undefined || sheetBytes === undefined) throw new Error("BPS workbook lacks Total Units worksheet members.");
  const shared = [...strFromU8(sharedBytes).matchAll(/<si\b[^>]*>([\s\S]*?)<\/si>/g)].map((entry) =>
    [...entry[1].matchAll(/<t\b[^>]*>([\s\S]*?)<\/t>/g)].map((text) => decodeEntities(text[1])).join(""),
  );
  const rows = new Map();
  for (const row of strFromU8(sheetBytes).matchAll(/<row\b[^>]*\br="([0-9]+)"[^>]*>([\s\S]*?)<\/row>/g)) {
    const cells = new Map();
    const populatedCells = row[2].replace(/<c\b[^>]*\/>/g, "");
    for (const cell of populatedCells.matchAll(/<c\b([^>]*)>([\s\S]*?)<\/c>/g)) {
      const reference = xmlAttribute(cell[1], "r");
      const letters = reference?.match(/^[A-Z]+/)?.[0];
      if (letters === undefined) throw new Error("BPS workbook contains an invalid cell reference.");
      const raw = cell[2].match(/<v>([\s\S]*?)<\/v>/)?.[1] ?? "";
      cells.set(columnIndex(letters), xmlAttribute(cell[1], "t") === "s" ? shared[Number(raw)] : raw);
    }
    rows.set(Number(row[1]), cells);
  }
  return rows;
};

const parseBps = (bytes, controls) => {
  const rows = parseWorksheet(bytes);
  const header = rows.get(5);
  const metricHeader = rows.get(6);
  const year = [...rows.values()].find((row) => row.get(0) === "2025" && row.get(1) === "2025");
  if (header === undefined || metricHeader === undefined || year === undefined) {
    throw new Error("BPS workbook lacks the configured final annual 2025 Total Units row.");
  }
  const uspsToUnits = new Map();
  for (const [column, value] of header) {
    if (!/^[A-Z]{2}$/.test(value)) continue;
    if (metricHeader.get(column + 1) !== "Units") throw new Error(`BPS state ${value} lacks its Units column.`);
    uspsToUnits.set(value, parseNonnegativeInteger(year.get(column + 1), `BPS ${value} 2025 units`));
  }
  return controls.map((control) => {
    const units = uspsToUnits.get(control.stateUsps);
    if (units === undefined) throw new Error(`BPS workbook lacks state/DC ${control.stateUsps}; parsed ${[...uspsToUnits.keys()].join(",")}.`);
    return {
      sourceGeographyCode: control.sourceGeographyCode,
      annualPermittedUnits: units,
      sourceWorksheet: "Total Units",
      sourceYear: 2025,
      sourceMeasure: "Residential housing units authorized by building permits",
      classification: "DIRECT_OFFICIAL_MEASURE_CAPACITY_PRIOR_INPUT",
    };
  });
};

const pressureBasisPoints = (control) => {
  const vacancyScarcity = Math.round((control.vacancy.totalEstimate - control.vacancy.vacantEstimate) * 10_000 / control.vacancy.totalEstimate);
  const rentBurden = Math.round(control.cashRentBurden30Plus.numerator * 10_000 / control.cashRentBurden30Plus.denominator);
  return Math.round((vacancyScarcity + rentBurden) / 2);
};

const buildRegions = (controls, residentControls, bps) => {
  const residentByFips = new Map(residentControls.map((control) => [control.residenceGeographyId.slice(-2), control.residentWeight]));
  const permitByFips = new Map(bps.map((record) => [record.sourceGeographyCode, record.annualPermittedUnits]));
  return controls.flatMap((control) => {
    const residentWeight = residentByFips.get(control.sourceGeographyCode);
    if (residentWeight === undefined) throw new Error(`Housing control ${control.sourceGeographyCode} lacks its canonical resident control.`);
    const annualPermittedUnits = permitByFips.get(control.sourceGeographyCode);
    const base = {
      stateGeographyId: control.geographyId,
      sourceGeographyCode: control.sourceGeographyCode,
      sourceControlId: control.id,
      pressureBasisPoints: pressureBasisPoints(control),
      annualPermittedUnits,
      permitsPerThousandResidentsExact: `${annualPermittedUnits * 1000}/${residentWeight}`,
      deliveryCapacityPrior: "DERIVED_STATE_BPS_ORDINAL_INPUT",
      classification: "APPROXIMATED_REGION_PARTITION_FROM_REAL_STATE_CONTROL",
    };
    if (control.sourceGeographyCode !== "08" && control.sourceGeographyCode !== "48") {
      return [{
        id: `us.housing.region.${control.sourceGeographyCode}.background`,
        kind: "STATE_BACKGROUND",
        ...base,
        housingStockUnits: control.housingStock.estimate,
        vacantUnits: control.vacancy.vacantEstimate,
        representedExposureWeight: residentWeight,
        projectLocatorGeographyId: null,
      }];
    }
    const stockCatchment = Math.floor(control.housingStock.estimate * 1 / 1000);
    const vacancyCatchment = Math.floor(control.vacancy.vacantEstimate * 1 / 1000);
    const exposureCatchment = Math.floor(residentWeight * 1 / 1000);
    const project = control.sourceGeographyCode === "08" ? "stables" : "palms";
    return [
      {
        id: `us.housing.region.${control.sourceGeographyCode}.${project}-catchment`, kind: "PROJECT_CATCHMENT", ...base,
        housingStockUnits: stockCatchment, vacantUnits: vacancyCatchment,
        representedExposureWeight: exposureCatchment,
        projectLocatorGeographyId: `us.geography.project-locator.${project}`,
      },
      {
        id: `us.housing.region.${control.sourceGeographyCode}.remainder`, kind: "STATE_REMAINDER", ...base,
        housingStockUnits: control.housingStock.estimate - stockCatchment,
        vacantUnits: control.vacancy.vacantEstimate - vacancyCatchment,
        representedExposureWeight: residentWeight - exposureCatchment,
        projectLocatorGeographyId: null,
      },
    ];
  });
};

export const buildI7Artifact = async ({
  acsTables,
  bpsBytes,
  palmsPermitBytes,
  stablesWaiverBytes,
  palmsProjectBytes,
  stateIdentityRecords,
  residentControls,
}) => {
  const controls = parseAcs(acsTables, stateIdentityRecords);
  const permitting = parseBps(bpsBytes, controls);
  const permitText = await pdfText(palmsPermitBytes);
  if (!["C226687", "C226685", "PALMS AT MORRIS", "2212", "MORRIS", "4,057,128"].every((value) => permitText.includes(value))) {
    throw new Error("Palms permit bytes lack the accepted project/permit identity.");
  }
  const stablesText = await pdfText(stablesWaiverBytes);
  if (!["W-0000102", "Stables", "85-unit"].every((value) => stablesText.includes(value))) {
    throw new Error("Stables waiver bytes lack the accepted project/unit identity.");
  }
  const palmsText = decodeEntities(palmsProjectBytes.toString("utf8").replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ");
  if (!["TABS2025005871", "Palms at Morris Apartments", "4/1/2025", "10/1/2026"].every((value) => palmsText.includes(value))) {
    throw new Error("Palms physical-project bytes lack the accepted identity and planned interval.");
  }
  const regions = buildRegions(controls, residentControls, permitting);
  if (regions.length !== 53) throw new Error("I7 requires exactly 53 initialized Housing regions.");
  for (const control of controls) {
    const stateRegions = regions.filter((region) => region.sourceGeographyCode === control.sourceGeographyCode);
    if (stateRegions.reduce((sum, region) => sum + region.housingStockUnits, 0) !== control.housingStock.estimate ||
        stateRegions.reduce((sum, region) => sum + region.vacantUnits, 0) !== control.vacancy.vacantEstimate) {
      throw new Error(`I7 region partition does not conserve ${control.sourceGeographyCode} controls.`);
    }
  }
  const sources = [
    ...Object.entries(acsTables).map(([table, bytes]) => sourceRecord({
      sourceId: table === "B25070" ? "USR-SRC-0077/0078/0094" : "USR-SRC-0077/0094/0111",
      product: `ACS 2024 five-year table-based summary file ${table}`,
      locator: `https://www2.census.gov/programs-surveys/acs/summary_file/2024/table-based-SF/data/5YRData/acsdt5y2024-${table.toLowerCase()}.dat`,
      vintage: "2024 ACS five-year",
    }, bytes, selectedAcsFields.filter((field) => field.startsWith(table)))),
    sourceRecord({ sourceId: "USR-SRC-0075/0098", product: "BPS state history workbook, final annual 2025 Total Units", locator: "https://www.census.gov/construction/bps/xls/state_history.xlsx", vintage: "final annual 2025 posted 2026-05-14" }, bpsBytes, ["Total Units worksheet", "2025 row", "state/DC Units columns"]),
    sourceRecord({ sourceId: "USR-SRC-0118", product: "Corpus Christi February 2025 permit report", locator: "https://www.corpuschristitx.gov/media/3p2dsj2m/permit-report-feb-2025-pdf.pdf", vintage: "February 2025" }, palmsPermitBytes, ["C226687", "C226685", "Palms at Morris", "2212 Morris"]),
    sourceRecord({ sourceId: "USR-SRC-0106", product: "HUD final Stables waiver W-0000102", locator: "https://www.hud.gov/sites/default/files/Main/documents/Final-Nonavailability-Waiver-CO-DOLA-Arapahoe-Co-HVAC-W-0000102.pdf", vintage: "effective 2026-08-10" }, stablesWaiverBytes, ["W-0000102", "Stables", "85-unit"]),
    sourceRecord({ sourceId: "USR-SRC-0119", product: "Texas TABS2025005871 Palms physical-project record", locator: "https://www.tdlr.texas.gov/TABS/Search/Print/TABS2025005871", vintage: "registered 2024-11-19; frozen 2026-08-22" }, palmsProjectBytes, ["project identity", "planned start", "planned completion"]),
  ];
  const records = {
    schemaVersion: 1,
    catchmentScaffoldVersion: I7_CATCHMENT_SCAFFOLD_VERSION,
    materialCalibrationVersion: I7_MATERIAL_CALIBRATION_VERSION,
    controls,
    permitting,
    regions,
    projects: [
      {
        id: "us.project.stables", housingRegionId: "us.housing.region.08.stables-catchment",
        stateGeographyId: "us.geography.state.08", projectLocatorGeographyId: "us.geography.project-locator.stables",
        relationshipId: "us.relationship.home.arapahoe-consortium.fy2025-2027", activityType: "NEW_CONSTRUCTION",
        expectedUnits: 85, stage: "ACTIVE", physicalProgressUnits: 0, requiredProgressUnits: 10_000,
        baseProgressUnitsPerDay: 25, earliestTransitionAt: "2026-08-22T00:00:00-04:00",
        plannedOrAnticipatedCompletionAt: "2027-09-30T00:00:00-04:00", completionEvidence: "ANTICIPATED_DATE_NOT_PHYSICAL_COMPLETION",
        financingReadiness: "HISTORICAL_ACTIVE_PROJECT_INPUT", inputAvailability: "INPUT_AVAILABLE_UNDER_FINAL_SCOPED_WAIVER",
        complianceHold: false, acceptedGovernmentInputRefs: ["W-0000102"], classification: "DIRECT_PROJECT_FACTS_PLUS_APPROXIMATED_LATENT_MATERIAL_STATE",
      },
      {
        id: "us.project.palms-at-morris", housingRegionId: "us.housing.region.48.palms-catchment",
        stateGeographyId: "us.geography.state.48", projectLocatorGeographyId: "us.geography.project-locator.palms",
        relationshipId: "us.relationship.home.corpus-christi-pj.fy2024", activityType: "NEW_CONSTRUCTION",
        expectedUnits: 72, stage: "ACTIVE", physicalProgressUnits: 0, requiredProgressUnits: 10_000,
        baseProgressUnitsPerDay: 250, earliestTransitionAt: "2026-08-22T00:00:00-04:00",
        plannedOrAnticipatedCompletionAt: "2026-10-01T00:00:00-04:00", completionEvidence: "PLANNED_DATE_COMPLETION_UNPROVEN",
        financingReadiness: "RECIPIENT_EXPENDITURE_AND_PERMITS_ARE_INPUTS_NOT_COMPLETION", inputAvailability: "NO_SUPPORTED_INPUT_HOLD_AT_DAY_0",
        complianceHold: false, acceptedGovernmentInputRefs: ["C226687", "C226685", "us.recipient-expenditure.corpus.palms.2025-09-17.117000"], classification: "DIRECT_PROJECT_FACTS_PLUS_APPROXIMATED_LATENT_MATERIAL_STATE",
      },
    ],
    calibration: {
      classification: "APPROXIMATED_SIMULATION_SCAFFOLD",
      pressureFormula: "ROUND_HALF_UP((VACANCY_SCARCITY_BASIS_POINTS + CASH_RENT_BURDEN_30_PLUS_BASIS_POINTS) / 2)",
      catchmentRatio: { numerator: 1, denominator: 1000 },
      usableVacancyContributionNumerator: 1,
      usableVacancyContributionDenominator: 1,
      delayedRateNumerator: 1,
      delayedRateDenominator: 2,
    },
  };
  return {
    ...records,
    metadata: {
      artifactId: "us.i7.housing-initialization-v1",
      vintage: "ACS 2024 five-year / BPS final annual 2025 / project evidence frozen 2026-08-22",
      transformationVersion: I7_TRANSFORMATION_VERSION,
      contentSha256: contentHash(records),
      rawSourceSha256s: sources.map((source) => source.rawSha256).sort(),
      sources,
      limitations: [
        "ACS state/DC estimates initialize latent material state; they are not point-in-time administrative counts.",
        "Colorado and Texas catchments are 0.10% modeled partitions, not observed local baselines or legal geography.",
        "BPS permits are an ordinal capacity prior, not starts or completions.",
        "Project progress coefficients are approximated simulation scaffolds; planned dates do not prove completion.",
      ],
    },
  };
};

export const buildI7Manifest = (artifact) => ({
  schemaVersion: 1,
  transformationVersion: I7_TRANSFORMATION_VERSION,
  artifactBindings: [{
    id: artifact.metadata.artifactId,
    kind: "HOUSING_INITIALIZATION",
    contentSha256: artifact.metadata.contentSha256,
    transformationVersion: artifact.metadata.transformationVersion,
    rawSourceSha256s: artifact.metadata.rawSourceSha256s,
  }],
  housing: {
    initializationArtifactId: artifact.metadata.artifactId,
    controlCount: artifact.controls.length,
    regionCount: artifact.regions.length,
    projectCount: artifact.projects.length,
    catchmentScaffoldVersion: artifact.catchmentScaffoldVersion,
    materialCalibrationVersion: artifact.materialCalibrationVersion,
  },
  sources: artifact.metadata.sources,
  contentSha256: contentHash({
    transformationVersion: I7_TRANSFORMATION_VERSION,
    artifactBindings: [{ id: artifact.metadata.artifactId, contentSha256: artifact.metadata.contentSha256 }],
    housing: { controlCount: artifact.controls.length, regionCount: artifact.regions.length, projectCount: artifact.projects.length },
  }),
});
