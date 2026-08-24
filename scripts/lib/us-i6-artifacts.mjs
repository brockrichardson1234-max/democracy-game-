import { createHash } from "node:crypto";

import { strFromU8, unzipSync } from "fflate";
import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs";

export const I6_TRANSFORMATION_VERSION = "us-v0-i6-artifacts-v1";
export const serializeI6Artifact = (value) => `${JSON.stringify(value, null, 2)}\n`;
export const sha256 = (value) => createHash("sha256").update(value).digest("hex");
const contentHash = (value) => sha256(JSON.stringify(value));

const SOURCES = {
  appropriation: {
    sourceId: "USR-SRC-0099",
    product: "Public Law 118-42 official HTML",
    locator: "https://www.govinfo.gov/content/pkg/PLAW-118publ42/html/PLAW-118publ42.htm",
  },
  apportionment: {
    sourceId: "USR-SRC-0100",
    product: "OMB FY2024 HUD HOME apportionment JSON",
    locator: "https://apportionment-public.max.gov/Fiscal%20Year%202024/Department%20of%20Housing%20and%20Urban%20Development/JSON/FY2024_Agency%3DHUD_Bureau%3DCOMP%26D_Account%3D086-02052024-04-05-12.01.json",
  },
  arapahoeAward: {
    sourceId: "USR-SRC-0102",
    product: "USAspending Arapahoe County FY2024 HOME award API record",
    locator: "https://api.usaspending.gov/api/v2/awards/ASST_NON_M24-DC080221_086/",
  },
  arapahoePlan: {
    sourceId: "USR-SRC-0105",
    product: "Arapahoe County 2025-2029 Consolidated Plan",
    locator: "https://files.arapahoeco.gov/Community%20Resources/Housing/Arapahoe%20County%202025-2029%20ConPlan%20FINAL%20%287.31.2025%29.pdf?t=202508211558390",
  },
  consortiumAgreement: {
    sourceId: "USR-SRC-0105",
    product: "Englewood FY2025-FY2027 consortium renewal record",
    locator: "https://englewoodgov.civicweb.net/document/425043/Ordinance%20approving%20an%20amendment%20to%20the%20Intergo.pdf?handle=DF23280518B647C09F93749FBF1B7B3E",
  },
  stablesWaiver: {
    sourceId: "USR-SRC-0106",
    product: "HUD final Stables BABA nonavailability waiver W-0000102",
    locator: "https://www.hud.gov/sites/default/files/Main/documents/Final-Nonavailability-Waiver-CO-DOLA-Arapahoe-Co-HVAC-W-0000102.pdf",
  },
  corpusAward: {
    sourceId: "USR-SRC-0114",
    product: "USAspending Corpus Christi FY2024 HOME award API record",
    locator: "https://api.usaspending.gov/api/v2/awards/ASST_NON_M24-MC480502_086/",
  },
  palmsExpenditure: {
    sourceId: "USR-SRC-0117",
    product: "Corpus Christi September 2025 check register workbook",
    locator: "https://www.corpuschristitx.gov/media/d1ijy2zb/september-2025-check-register.xlsx",
  },
  consortiumGuidance: {
    sourceId: "USR-SRC-0120",
    product: "HUD Affordable Housing Programs consortia page",
    locator: "https://www.hud.gov/hud-partners/community-affordable-housing-programs",
  },
  currentStatute: {
    sourceId: "USR-SRC-0039",
    product: "Public Law 119-101 authenticated PDF",
    locator: "https://www.govinfo.gov/content/pkg/PLAW-119publ101/pdf/PLAW-119publ101.pdf",
  },
  currentRegulation: {
    sourceId: "USR-SRC-0041/0097",
    product: "24 CFR part 92 XML as of 2026-08-19",
    locator: "https://www.ecfr.gov/api/versioner/v1/full/2026-08-19/title-24.xml?part=92",
  },
  delayedAmendments: {
    sourceId: "USR-SRC-0097",
    product: "91 FR 23014 indefinite-delay notice HTML",
    locator: "https://www.federalregister.gov/documents/2026/04/29/2026-08339/home-investment-partnerships-program-further-program-updates-and-streamlining",
  },
};

const sourceRecord = (source, bytes, consumed) => ({
  ...source,
  retrievedAt: "2026-08-23",
  rawSha256: sha256(bytes),
  consumed,
});

const money = (minorUnits, purpose, ownerId, fiscalCohort) => {
  if (!Number.isSafeInteger(minorUnits) || minorUnits < 0) throw new Error("I6 money requires nonnegative safe-integer minor units.");
  return { minorUnits, currency: "USD", scale: 2, purpose, ownerId, fiscalCohort };
};

const dollarsToCents = (value) => {
  const normalized = value.replace(/[$,\s]/g, "");
  const match = normalized.match(/^([0-9]+)(?:\.([0-9]{1,2}))?$/);
  if (match === null) throw new Error(`Invalid exact dollar amount ${value}.`);
  const cents = BigInt(match[1]) * 100n + BigInt((match[2] ?? "").padEnd(2, "0"));
  const result = Number(cents);
  if (!Number.isSafeInteger(result)) throw new Error(`Dollar amount ${value} exceeds safe exact range.`);
  return result;
};

const decodeEntities = (value) => value
  .replace(/&#x([0-9a-f]+);/gi, (_, digits) => String.fromCodePoint(Number.parseInt(digits, 16)))
  .replace(/&#([0-9]+);/g, (_, digits) => String.fromCodePoint(Number.parseInt(digits, 10)))
  .replace(/&nbsp;/gi, " ")
  .replace(/&quot;/gi, '"')
  .replace(/&apos;/gi, "'")
  .replace(/&lt;/gi, "<")
  .replace(/&gt;/gi, ">")
  .replace(/&amp;/gi, "&");

const normalizedHtmlText = (bytes) => decodeEntities(bytes.toString("utf8").replace(/<[^>]*>/g, " "))
  .replace(/\s+/g, " ")
  .trim();

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

const exactJsonDecimal = (text, property) => {
  const match = text.match(new RegExp(`"${property}"\\s*:\\s*([0-9]+(?:\\.[0-9]+)?)`));
  if (match === null) throw new Error(`Award JSON lacks exact numeric property ${property}.`);
  return match[1];
};

const parseAward = (bytes, expected) => {
  const text = bytes.toString("utf8");
  const value = JSON.parse(text);
  const listing = value.cfda_info?.find((entry) => entry.cfda_number === "14.239");
  if (
    value.fain !== expected.fain ||
    value.generated_unique_award_id !== expected.generatedAwardId ||
    value.recipient?.recipient_name !== expected.recipientSourceName ||
    value.date_signed !== expected.signedAt ||
    listing === undefined
  ) throw new Error(`USAspending award ${expected.fain} contradicts accepted identity fields.`);
  const obligationMinorUnits = dollarsToCents(exactJsonDecimal(text, "total_obligation"));
  const outlayMinorUnits = dollarsToCents(exactJsonDecimal(text, "total_outlay"));
  if (obligationMinorUnits !== expected.obligationMinorUnits || outlayMinorUnits !== expected.outlayMinorUnits) {
    throw new Error(`USAspending award ${expected.fain} contradicts the frozen amount checks.`);
  }
  return {
    fain: value.fain,
    generatedAwardId: value.generated_unique_award_id,
    recipientName: expected.recipientName,
    assistanceListing: listing.cfda_number,
    signedAt: value.date_signed,
    obligationMinorUnits,
    outlayMinorUnits,
  };
};

const xmlAttribute = (attributes, name) => attributes.match(new RegExp(`(?:^|\\s)${name}="([^"]*)"`))?.[1] ?? null;

const parsePalmsWorkbook = (bytes) => {
  const entries = unzipSync(new Uint8Array(bytes));
  const sharedBytes = entries["xl/sharedStrings.xml"];
  const worksheetBytes = entries["xl/worksheets/sheet1.xml"];
  if (sharedBytes === undefined || worksheetBytes === undefined) throw new Error("Palms workbook lacks required worksheet members.");
  const shared = [...strFromU8(sharedBytes).matchAll(/<si\b[^>]*>([\s\S]*?)<\/si>/g)].map((entry) =>
    [...entry[1].matchAll(/<t\b[^>]*>([\s\S]*?)<\/t>/g)].map((text) => decodeEntities(text[1])).join(""),
  );
  const rows = [...strFromU8(worksheetBytes).matchAll(/<row\b[^>]*\br="([0-9]+)"[^>]*>([\s\S]*?)<\/row>/g)].map((row) => {
    const cells = {};
    for (const cell of row[2].matchAll(/<c\b([^>]*)>([\s\S]*?)<\/c>/g)) {
      const reference = xmlAttribute(cell[1], "r");
      const column = reference?.match(/^[A-Z]+/)?.[0];
      if (column === undefined) throw new Error("Palms workbook contains an invalid cell reference.");
      const raw = cell[2].match(/<v>([\s\S]*?)<\/v>/)?.[1] ?? "";
      cells[column] = xmlAttribute(cell[1], "t") === "s" ? shared[Number(raw)] : raw;
    }
    return { rowNumber: Number(row[1]), cells };
  });
  const matches = rows.filter((row) => row.cells.B === "Palms at Morris Apartments");
  if (matches.length !== 1) throw new Error("Palms workbook must contain exactly one accepted expenditure row.");
  const row = matches[0].cells;
  if (
    row.A !== "45917" || row.C !== "9045" || row.D !== "24" || row.E !== "9045-24-48004" ||
    row.F !== "530005" || row.G !== "Payments to Subrecipients" || row.H !== "48004" || row.I !== "117000"
  ) throw new Error("Palms workbook row contradicts the accepted expenditure fields.");
  return {
    date: "2025-09-17",
    projectRef: "us.project.palms-at-morris",
    payee: row.B,
    fund: row.C,
    department: row.D,
    organizationActivity: row.H,
    account: row.F,
    description: row.G,
    amountMinorUnits: dollarsToCents(row.I),
    sourceWorksheet: "Check Register",
    sourceRow: matches[0].rowNumber,
  };
};

const artifactMetadata = (records, sources) => ({
  artifactId: "us.i6.finance-home-initialization-v1",
  vintage: "Historical source facts frozen for scenario Day 0 at 2026-08-22",
  transformationVersion: I6_TRANSFORMATION_VERSION,
  contentSha256: contentHash(records),
  rawSourceSha256s: sources.map((source) => source.rawSha256).sort(),
  sources,
  limitations: [
    "Two detailed recipient routes do not instantiate the national HOME recipient universe.",
    "Aggregate federal outlays are not reconciled to exact project draws or the Palms recipient expenditure.",
    "Administrative and fiscal records create no physical Housing truth.",
  ],
});

export const buildI6Artifact = async ({
  appropriationBytes,
  apportionmentBytes,
  arapahoeAwardBytes,
  arapahoePlanBytes,
  consortiumAgreementBytes,
  stablesWaiverBytes,
  corpusAwardBytes,
  palmsExpenditureBytes,
  consortiumGuidanceBytes,
  currentStatuteBytes,
  currentRegulationBytes,
  delayedAmendmentsBytes,
  stateIdentityRecords,
}) => {
  const appropriationText = normalizedHtmlText(appropriationBytes);
  const appropriationMatch = appropriationText.match(
    /home investment partnerships program[\s\S]{0,500}?\$([0-9,]+), to remain available until September 30, 2027/i,
  );
  if (appropriationMatch === null || !appropriationText.includes("Public Law 118-42")) {
    throw new Error("Public Law 118-42 bytes lack the accepted HOME appropriation passage.");
  }
  const authorityMinorUnits = dollarsToCents(appropriationMatch[1]);
  if (authorityMinorUnits !== 125_000_000_000) throw new Error("HOME appropriation does not equal $1.25 billion.");

  const apportionment = JSON.parse(apportionmentBytes.toString("utf8"));
  const lines = apportionment.ScheduleData.filter((line) =>
    line.CgacAgency === "086" && line.CgacAcct === "0205" && line.BeginPoa === "2024" && line.EndPoa === "2027",
  );
  const line1100 = lines.find((line) => line.LineNumber === "1100");
  const line6011 = lines.find((line) => line.LineNumber === "6011");
  if (
    apportionment.ApprovalTimestamp !== "2024-04-05-12.01.10.372996" ||
    !apportionment.FundsProvidedBy.includes("Public Law 118-42") ||
    line1100?.ApprovedAmount !== 1_250_000_000 ||
    line6011?.ApprovedAmount !== 1_250_000_000 ||
    line6011.LineDescription !== "Home Investment Partnerships"
  ) throw new Error("OMB bytes contradict the accepted FY2024 HOME apportionment.");

  const arapahoe = parseAward(arapahoeAwardBytes, {
    fain: "M24-DC080221",
    generatedAwardId: "ASST_NON_M24-DC080221_086",
    recipientSourceName: "ARAPAHOE COUNTY GOVERNMENT",
    recipientName: "Arapahoe County",
    signedAt: "2024-09-25",
    obligationMinorUnits: 61_726_807,
    outlayMinorUnits: 6_172_681,
  });
  const corpus = parseAward(corpusAwardBytes, {
    fain: "M24-MC480502",
    generatedAwardId: "ASST_NON_M24-MC480502_086",
    recipientSourceName: "CITY OF CORPUS CHRISTI",
    recipientName: "City of Corpus Christi",
    signedAt: "2024-10-25",
    obligationMinorUnits: 111_938_626,
    outlayMinorUnits: 26_852_021,
  });
  const palms = parsePalmsWorkbook(palmsExpenditureBytes);

  const [arapahoePlanText, agreementText, waiverText, currentStatuteText] = await Promise.all([
    pdfText(arapahoePlanBytes),
    pdfText(consortiumAgreementBytes),
    pdfText(stablesWaiverBytes),
    pdfText(currentStatuteBytes),
  ]);
  for (const required of [
    "The HOME Consortium includes the Urban County",
    "city of Centennial",
    "Arapahoe County is the lead agency",
  ]) if (!arapahoePlanText.includes(required)) throw new Error(`Arapahoe plan lacks accepted consortium fact: ${required}.`);
  const agreementRoster = "CITIES OF CENTENNIAL, ENGLEWOOD, LITTLETON, SHERIDAN, AND THE TOWN OF DEER TRAIL";
  if (
    !agreementText.includes(agreementRoster) ||
    !agreementText.includes("Remove Greenwood Village and the City of Glendale from the agreement") ||
    !agreementText.includes("Federal Fiscal Years 2025, 2026, and 2027")
  ) throw new Error("Consortium agreement lacks the accepted member or qualification facts.");
  for (const required of [
    "HUD Waiver #W-0000102",
    "From August 10, 2026, until the completion of the project",
    "85 affordable housing units",
    "delay or halt construction",
    "HVAC Equipment",
  ]) if (!waiverText.includes(required)) throw new Error(`Stables waiver lacks accepted fact: ${required}.`);
  for (const required of ["PUBLIC LAW 119–101—JULY 11, 2026", "HOME Investment Partnerships Reauthorization and Reform Act"])
    if (!currentStatuteText.includes(required)) throw new Error(`P.L. 119-101 lacks accepted HOME baseline fact: ${required}.`);
  const regulationText = currentRegulationBytes.toString("utf8");
  if (!regulationText.includes("PART 92") || !regulationText.includes("HOME INVESTMENT PARTNERSHIPS PROGRAM")) {
    throw new Error("Authenticated eCFR bytes lack 24 CFR part 92.");
  }
  const delayText = normalizedHtmlText(delayedAmendmentsBytes);
  for (const required of ["92.250", "92.253", "delayed indefinitely"])
    if (!delayText.includes(required)) throw new Error(`Federal Register bytes lack delayed-amendment fact ${required}.`);
  const guidanceText = normalizedHtmlText(consortiumGuidanceBytes);
  for (const required of ["Forming a consortium", "lead entity", "long-term affordability requirements"])
    if (!guidanceText.includes(required)) throw new Error(`HUD consortium guidance lacks ${required}.`);

  const records = {
    schemaVersion: 1,
    classification: "DIRECT_REAL_HISTORICAL_SEED",
    detailCoverage: "DETAIL_COVERAGE_PARTIAL",
    nationalBalance: "NATIONAL_BALANCE_NOT_INSTANTIATED_V0",
    legalSources: [
      {
        id: "us.legal-source.pl-118-42",
        kind: "APPROPRIATION_STATUTE",
        effectiveAt: "2024-03-09",
        status: "OPERATIVE_SOURCE_SCOPED",
        provisionRefs: ["FY2024_HOME_APPROPRIATION", "AVAILABILITY_THROUGH_2027-09-30"],
        classification: "DIRECT_REAL_HISTORICAL_SEED",
        sourceId: "USR-SRC-0099",
      },
      {
        id: "us.legal-source.pl-119-101",
        kind: "CONTROLLING_STATUTE",
        effectiveAt: "2026-07-11",
        status: "OPERATIVE_SOURCE_SCOPED",
        provisionRefs: ["HOME_REAUTHORIZATION_AND_REFORM"],
        classification: "DIRECT_REAL_HISTORICAL_SEED",
        sourceId: "USR-SRC-0039",
      },
      {
        id: "us.legal-source.24-cfr-part-92",
        kind: "REGULATION",
        effectiveAt: "2026-08-19",
        status: "UNAFFECTED_PROVISIONS_OPERATIVE_SOURCE_SCOPED",
        provisionRefs: ["24_CFR_PART_92"],
        classification: "DIRECT_REAL_HISTORICAL_SEED",
        sourceId: "USR-SRC-0041/0097",
      },
      {
        id: "us.legal-source.91-fr-23014-delay",
        kind: "OPERATIVE_STATUS_NOTICE",
        effectiveAt: "2026-04-29",
        status: "INDEFINITE_DELAY_OPERATIVE",
        provisionRefs: ["24_CFR_92.250_NON_OPERATIVE", "24_CFR_92.253_NON_OPERATIVE"],
        classification: "DIRECT_REAL_HISTORICAL_SEED",
        sourceId: "USR-SRC-0097",
      },
    ],
    program: {
      id: "us.program.hud.home",
      administeringInstitutionId: "us.institution.hud",
      legalAuthorityRefs: ["us.legal-source.pl-119-101", "us.legal-source.24-cfr-part-92"],
      assistanceListing: "14.239",
    },
    legalBaseline: {
      id: "us.home.legal-baseline.2026-08-22",
      controllingStatuteId: "us.legal-source.pl-119-101",
      enactedAt: "2026-07-11",
      unaffectedRegulationId: "us.legal-source.24-cfr-part-92",
      operativeStatusNoticeId: "us.legal-source.91-fr-23014-delay",
      delayedAmendments: [
        { provision: "24 CFR 92.250", status: "NON_OPERATIVE_INDEFINITELY_DELAYED" },
        { provision: "24 CFR 92.253", status: "NON_OPERATIVE_INDEFINITELY_DELAYED" },
      ],
      olderGuidanceStatus: "SOURCE_SCOPED",
      unresolvedImplementationStatus: "UNRESOLVED_NOT_ASSUMED",
    },
    budgetAuthorities: [{
      id: "us.finance.authority.home.fy2024",
      sourceLegalId: "us.legal-source.pl-118-42",
      amount: money(authorityMinorUnits, "FY2024 HOME Investment Partnerships Program appropriation", "us.finance.public", "FY2024-2027"),
      enactedAt: "2024-03-09",
      effectiveFrom: "2024-03-09",
      availableUntil: "2027-09-30T23:59:59-04:00",
      status: "APPORTIONED",
      detailCoverage: "NATIONAL_AUTHORITY_WITH_PARTIAL_RECIPIENT_DETAIL",
      classification: "DIRECT_REAL_HISTORICAL_SEED",
      sourceId: "USR-SRC-0099",
    }],
    fiscalControls: [{
      id: "us.fiscal-control.omb.home.fy2024",
      sourceBudgetAuthorityId: "us.finance.authority.home.fy2024",
      controllerInstitutionId: "us.institution.omb",
      programId: "us.program.hud.home",
      tas: "086-0205",
      approvalAt: "2024-04-05",
      authorityLegalId: "us.legal-source.pl-118-42",
      line1100: { description: line1100.LineDescription, amount: money(125_000_000_000, "FY2024/2027 discretionary appropriation control", "us.fiscal-execution.omb", "FY2024-2027") },
      line6011: { description: line6011.LineDescription, amount: money(125_000_000_000, "HOME program control", "us.fiscal-execution.omb", "FY2024-2027") },
      classification: "DIRECT_REAL_HISTORICAL_SEED",
      sourceId: "USR-SRC-0100",
    }],
    programAllocations: [arapahoe, corpus].map((award) => ({
      id: `us.home.allocation.${award.fain}`,
      programId: "us.program.hud.home",
      recipientId: award === arapahoe ? "us.recipient.arapahoe-county" : "us.recipient.corpus-christi",
      sourceAwardEventId: award.generatedAwardId,
      amount: money(award.obligationMinorUnits, "Bounded FY2024 HOME formula award/allocation detail", "us.program.hud.home", "FY2024-2027"),
      classification: "DIRECT_REAL_HISTORICAL_SEED",
    })),
    awards: [arapahoe, corpus].map((award) => ({
      id: `us.award.${award.fain}`,
      fain: award.fain,
      sourceAwardEventId: award.generatedAwardId,
      programId: "us.program.hud.home",
      recipientId: award === arapahoe ? "us.recipient.arapahoe-county" : "us.recipient.corpus-christi",
      recipientName: award.recipientName,
      assistanceListing: award.assistanceListing,
      signedAt: award.signedAt,
      amount: money(award.obligationMinorUnits, "Federal HOME grant agreement/award", "us.program.hud.home", "FY2024-2027"),
      classification: "DIRECT_REAL_HISTORICAL_SEED",
    })),
    obligations: [arapahoe, corpus].map((award) => ({
      id: `us.obligation.${award.fain}`,
      awardId: `us.award.${award.fain}`,
      amount: money(award.obligationMinorUnits, "Federal obligation reported for HOME award", "us.fiscal-execution.hud", "FY2024-2027"),
      obligatedAt: award.signedAt,
      classification: "DIRECT_REAL_HISTORICAL_SEED",
    })),
    payments: [arapahoe, corpus].map((award) => ({
      id: `us.payment.aggregate-outlay.${award.fain}.freeze-2026-08-21`,
      awardId: `us.award.${award.fain}`,
      obligationId: `us.obligation.${award.fain}`,
      amount: money(award.outlayMinorUnits, "Freeze-checked aggregate federal award outlay", "us.fiscal-execution.hud", "FY2024-2027"),
      observedAsOf: "2026-08-21",
      projectRef: null,
      reconciliation: "NOT_RECONCILED_TO_EXACT_DOWNSTREAM_DOLLAR",
      classification: "DIRECT_REAL_HISTORICAL_SEED",
    })),
    relationships: [
      {
        id: "us.relationship.home.arapahoe-consortium.fy2025-2027",
        programId: "us.program.hud.home",
        federalInstitutionId: "us.institution.hud",
        recipientId: "us.recipient.arapahoe-county",
        relationshipKind: "CONSORTIUM_PJ",
        qualificationFrom: "2024-10-01",
        qualificationUntil: "2027-09-30T23:59:59-04:00",
        planRefs: ["us.plan.arapahoe.consolidated-2025-2029"],
        grantAgreementRefs: ["us.award.M24-DC080221"],
        members: [
          { id: "us.local.arapahoe-county", name: "Arapahoe County", participation: "LEAD_ENTITY_ACTIVE" },
          { id: "us.local.centennial", name: "City of Centennial", participation: "INCLUDED" },
          { id: "us.local.englewood", name: "City of Englewood", participation: "INCLUDED" },
          { id: "us.local.littleton", name: "City of Littleton", participation: "INCLUDED" },
          { id: "us.local.sheridan", name: "City of Sheridan", participation: "INCLUDED" },
          { id: "us.local.deer-trail", name: "Town of Deer Trail", participation: "INCLUDED" },
          { id: "us.local.greenwood-village", name: "City of Greenwood Village", participation: "EXCLUDED_FOR_NEW_FORMULA_RELATION" },
          { id: "us.local.glendale", name: "City of Glendale", participation: "EXCLUDED_FOR_NEW_FORMULA_RELATION" },
        ],
        conditions: ["FY2025-FY2027 qualification", "lead entity compliance responsibility"],
        status: "ACTIVE",
        survivingDuties: ["PROJECT_DUTIES", "AFFORDABILITY_DUTIES", "REPAYMENT_DUTIES", "PROGRAM_INCOME_DUTIES", "HISTORY"],
        classification: "DIRECT_REAL_HISTORICAL_SEED",
      },
      {
        id: "us.relationship.home.corpus-christi-pj.fy2024",
        programId: "us.program.hud.home",
        federalInstitutionId: "us.institution.hud",
        recipientId: "us.recipient.corpus-christi",
        relationshipKind: "LOCAL_PJ",
        qualificationFrom: "2024-10-25",
        qualificationUntil: null,
        planRefs: ["us.plan.corpus-christi.py2024"],
        grantAgreementRefs: ["us.award.M24-MC480502"],
        members: [],
        conditions: ["City plan and project selection remain recipient-owned"],
        status: "ACTIVE",
        survivingDuties: ["PROJECT_DUTIES", "AFFORDABILITY_DUTIES", "REPAYMENT_DUTIES", "PROGRAM_INCOME_DUTIES", "HISTORY"],
        classification: "DIRECT_REAL_HISTORICAL_SEED",
      },
    ],
    recipientExpenditures: [{
      id: "us.recipient-expenditure.corpus.palms.2025-09-17.117000",
      recipientId: "us.recipient.corpus-christi",
      relationshipId: "us.relationship.home.corpus-christi-pj.fy2024",
      ...palms,
      amount: money(palms.amountMinorUnits, "City payment to subrecipient", "us.recipient.corpus-christi", "FY2024-2027"),
      federalPaymentId: null,
      reconciliation: "NOT_RECONCILED_TO_EXACT_DOWNSTREAM_DOLLAR",
      physicalHousingEffect: null,
      classification: "DIRECT_REAL_HISTORICAL_SEED",
    }],
    waivers: [{
      id: "W-0000102",
      projectRef: "us.project.stables",
      relationshipId: "us.relationship.home.arapahoe-consortium.fy2025-2027",
      effectiveFrom: "2026-08-10",
      status: "FINAL_GRANTED",
      unitReference: 85,
      componentScope: "HVAC equipment listed in the final project-specific nonavailability waiver",
      assertedBasis: "NONAVAILABILITY",
      commentFrom: "2026-06-24",
      commentUntil: "2026-07-09",
      operativeScope: "Project-specific only; no other project may use the waiver",
      supportedFindings: ["DELAY_OR_HALT_RISK", "HABITABILITY_RISK", "OCCUPANCY_CERTIFICATION_RISK"],
      mutableByPlayer: false,
      physicalHousingEffect: null,
      classification: "DIRECT_REAL_HISTORICAL_SEED",
      sourceId: "USR-SRC-0106",
    }],
    coverage: stateIdentityRecords.map((state) => ({
      geographyId: `us.geography.state.${state.stateFips}`,
      stateFips: state.stateFips,
      detail: state.stateFips === "08" || state.stateFips === "48" ? "DETAIL_AVAILABLE" : "NOT_INSTANTIATED_V0",
    })),
  };
  if (records.coverage.length !== 51) throw new Error("I6 detail coverage requires 51 state/DC metadata records.");

  const sources = [
    sourceRecord(SOURCES.appropriation, appropriationBytes, ["HOME heading", "$1.25 billion", "availability through 2027-09-30"]),
    sourceRecord(SOURCES.apportionment, apportionmentBytes, ["TAS components", "approval timestamp", "P.L. 118-42", "lines 1100 and 6011"]),
    sourceRecord(SOURCES.arapahoeAward, arapahoeAwardBytes, ["FAIN", "recipient", "Assistance Listing", "signed date", "obligation", "aggregate outlay"]),
    sourceRecord(SOURCES.arapahoePlan, arapahoePlanBytes, ["consortium identity", "lead entity", "plan reference"]),
    sourceRecord(SOURCES.consortiumAgreement, consortiumAgreementBytes, ["FY2025-FY2027 roster", "included/excluded members", "qualification interval"]),
    sourceRecord(SOURCES.stablesWaiver, stablesWaiverBytes, ["waiver ID", "effective/comment dates", "85-unit reference", "HVAC scope", "findings"]),
    sourceRecord(SOURCES.corpusAward, corpusAwardBytes, ["FAIN", "recipient", "Assistance Listing", "signed date", "obligation", "aggregate outlay"]),
    sourceRecord(SOURCES.palmsExpenditure, palmsExpenditureBytes, ["worksheet row 4493", "date", "fund", "department", "activity", "account", "description", "amount"]),
    sourceRecord(SOURCES.consortiumGuidance, consortiumGuidanceBytes, ["consortium qualification", "lead entity", "surviving affordability responsibility"]),
    sourceRecord(SOURCES.currentStatute, currentStatuteBytes, ["P.L. 119-101 date", "HOME reform title"]),
    sourceRecord(SOURCES.currentRegulation, currentRegulationBytes, ["24 CFR part 92 source-scoped operative baseline"]),
    sourceRecord(SOURCES.delayedAmendments, delayedAmendmentsBytes, ["92.250", "92.253", "indefinite delay"]),
  ];
  return { metadata: artifactMetadata(records, sources), ...records };
};

export const buildI6Manifest = (artifact) => {
  const records = {
    schemaVersion: 1,
    artifactBindings: [{
      id: artifact.metadata.artifactId,
      kind: "PROGRAM_INITIALIZATION",
      contentSha256: artifact.metadata.contentSha256,
      transformationVersion: artifact.metadata.transformationVersion,
      rawSourceSha256s: artifact.metadata.rawSourceSha256s,
    }],
    implementation: { initializationArtifactId: artifact.metadata.artifactId },
    sourceManifest: artifact.metadata.sources,
  };
  return {
    metadata: {
      artifactId: "us.i6.initialization-manifest-v1",
      transformationVersion: I6_TRANSFORMATION_VERSION,
      contentSha256: contentHash(records),
    },
    ...records,
  };
};
