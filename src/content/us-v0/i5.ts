import { sha256Hex } from "../../configuration/sha256";
import type {
  ActorIdentityDescriptor,
  AssignmentCycleConfiguration,
  GovernmentStructureDescriptor,
  InstitutionalBoundaryConfiguration,
  IntegratedTemporalConfiguration,
  ScaffoldClassification,
} from "../../configuration/types";
import {
  US_INCUMBENT_ADMINISTRATION_ID,
  US_INCUMBENT_PRESIDENT_ACTOR_ID,
  US_INCUMBENT_VICE_PRESIDENT_ACTOR_ID,
  US_PRESIDENT_OFFICE_ID,
  US_V0_I4_STRUCTURE,
  US_VICE_PRESIDENT_OFFICE_ID,
} from "./topology";

export const US_V0_I5_SCHEDULE_VERSION = "us-v0-institutional-calendar-1";
export const US_V0_I5_ROLLOVER_VERSION = "us-v0-congressional-rollover-1";
export const US_V0_I5_ROLLOVER_POPULATION_SIGNAL_VERSION = "us-v0-rollover-population-signal-1";
export const US_V0_I5_ELECTION_SCAFFOLD_VERSION = "us-v0-election-readiness-1";
export const US_V0_PLAYER_TICKET_ID = "us.selection.ticket.player-aligned-2028";
export const US_V0_OPPOSITION_TICKET_ID = "us.selection.ticket.opposition-2028";
export const US_V0_OPPOSITION_PRESIDENT_ACTOR_ID = "us.actor.executive.opposition-president-2028";
export const US_V0_OPPOSITION_VICE_PRESIDENT_ACTOR_ID = "us.actor.executive.opposition-vice-president-2028";

export const US_V0_2027_TERM_BOUNDARY = "2027-01-03T12:00:00-05:00";
export const US_V0_2028_POPULAR_SELECTION = "2028-11-07T20:00:00-05:00";
export const US_V0_2028_ATTESTATION = "2028-12-13T12:00:00-05:00";
export const US_V0_2028_DELEGATE_MEETING = "2028-12-19T12:00:00-05:00";
export const US_V0_2029_TERM_BOUNDARY = "2029-01-03T12:00:00-05:00";
export const US_V0_2029_DECLARATION = "2029-01-06T13:00:00-05:00";
export const US_V0_2029_TRANSFER = "2029-01-20T12:00:00-05:00";
export const US_V0_2033_EXECUTIVE_TERM_END = "2033-01-20T12:00:00-05:00";

const CLASSIFICATION: ScaffoldClassification =
  "APPROXIMATED_NON_HISTORICAL_SIMULATION_SCAFFOLD";

export const US_V0_I5_OPPOSITION_ACTORS: readonly ActorIdentityDescriptor[] = [
  {
    id: US_V0_OPPOSITION_PRESIDENT_ACTOR_ID,
    label: "Anonymous opposition presidential candidate scaffold",
    role: "EXECUTIVE",
    classification: CLASSIFICATION,
  },
  {
    id: US_V0_OPPOSITION_VICE_PRESIDENT_ACTOR_ID,
    label: "Anonymous opposition vice-presidential candidate scaffold",
    role: "EXECUTIVE",
    classification: CLASSIFICATION,
  },
];

/** I5 deepens the actor root without changing the accepted I4 structure export. */
export const US_V0_I5_STRUCTURE: GovernmentStructureDescriptor = {
  ...US_V0_I4_STRUCTURE,
  actors: [...US_V0_I4_STRUCTURE.actors, ...US_V0_I5_OPPOSITION_ACTORS],
};

const stateGeographyForOffice = (officeId: string): string => {
  const office = US_V0_I5_STRUCTURE.offices.find((candidate) => candidate.id === officeId);
  if (office?.constituency === null || office?.constituency === undefined) {
    throw new Error(`I5 assignment cycle office ${officeId} lacks a configured constituency.`);
  }
  if (office.constituency.kind === "GEOGRAPHY") {
    const geography = US_V0_I5_STRUCTURE.geographies.find((candidate) => candidate.id === office.constituency?.id);
    if (geography?.parentGeographyId === null || geography?.parentGeographyId === undefined) {
      throw new Error(`I5 assignment cycle office ${officeId} lacks state Geography nesting.`);
    }
    return geography.parentGeographyId;
  }
  const jurisdiction = US_V0_I5_STRUCTURE.jurisdictions.find(
    (candidate) => candidate.id === office.constituency?.id,
  );
  const fips = jurisdiction?.externalIdentifiers.find((identifier) => identifier.scheme === "CENSUS_STATEFP")?.value;
  if (fips === undefined) throw new Error(`I5 assignment cycle office ${officeId} lacks a state identifier.`);
  return `us.geography.state.${fips}`;
};

const houseOfficeIds = US_V0_I5_STRUCTURE.offices
  .filter((office) => office.id.startsWith("us.office.house."))
  .map((office) => office.id)
  .sort();

const cycle = (
  id: string,
  termLabel: string,
  at: string,
  senateBoundary: string,
  houseNextBoundary: string,
  senateNextBoundary: string,
): AssignmentCycleConfiguration => {
  const senateOfficeIds = US_V0_I5_STRUCTURE.offices
    .filter((office) => office.id.startsWith("us.office.senate.") && office.term.ordinaryBoundaryAt === senateBoundary)
    .map((office) => office.id)
    .sort();
  const officeIds = [...houseOfficeIds, ...senateOfficeIds];
  return {
    id,
    termLabel,
    classification: CLASSIFICATION,
    scaffoldVersion: US_V0_I5_ROLLOVER_VERSION,
    populationSignalVersion: US_V0_I5_ROLLOVER_POPULATION_SIGNAL_VERSION,
    populationSignalIdPrefix: `us.term-population-signal.${termLabel}.`,
    stableKey: `${US_V0_I5_ROLLOVER_VERSION}|${id}|${at}`,
    officeIds,
    stateGeographyByOfficeId: Object.fromEntries(officeIds.map((officeId) => [officeId, stateGeographyForOffice(officeId)])),
    nextBoundaryByOfficeId: Object.fromEntries(officeIds.map((officeId) => [
      officeId,
      officeId.startsWith("us.office.house.") ? houseNextBoundary : senateNextBoundary,
    ])),
    assignmentIdPrefix: `us.assignment.${termLabel}.`,
    replacementActorIdPrefix: `us.actor.legislative.${termLabel}.replacement.`,
    populationInfluence: { numerator: 4, denominator: 5 },
    incumbentInfluence: { numerator: 1, denominator: 5 },
    retainThreshold: { numerator: 0, denominator: 1 },
  };
};

const cycles = [
  cycle(
    "us.term-transition.2027",
    "120th",
    US_V0_2027_TERM_BOUNDARY,
    US_V0_2027_TERM_BOUNDARY,
    US_V0_2029_TERM_BOUNDARY,
    "2033-01-03T12:00:00-05:00",
  ),
  cycle(
    "us.term-transition.2029",
    "121st",
    US_V0_2029_TERM_BOUNDARY,
    US_V0_2029_TERM_BOUNDARY,
    "2031-01-03T12:00:00-05:00",
    "2035-01-03T12:00:00-05:00",
  ),
] as const;

const termBoundaries = (
  ownerId: string,
  at: string,
): readonly InstitutionalBoundaryConfiguration[] => [
  { id: `${ownerId}.snapshot`, at, phase: 0, order: 0, stableKey: `${ownerId}:0:snapshot`, kind: "TERM_RESULT_SNAPSHOT", ownerId },
  { id: `${ownerId}.procedure-expiry`, at, phase: 1, order: 0, stableKey: `${ownerId}:1:expiry`, kind: "PROCEDURE_EXPIRY", ownerId },
  { id: `${ownerId}.assignment-end`, at, phase: 2, order: 0, stableKey: `${ownerId}:2:end`, kind: "OUTGOING_ASSIGNMENT_END", ownerId },
  { id: `${ownerId}.assignment-begin`, at, phase: 3, order: 0, stableKey: `${ownerId}:3:begin`, kind: "SUCCESSOR_ASSIGNMENT_BEGIN", ownerId },
  { id: `${ownerId}.affiliation-rebuild`, at, phase: 4, order: 0, stableKey: `${ownerId}:4:affiliations`, kind: "AFFILIATION_REBUILD", ownerId },
  { id: `${ownerId}.membership-recompute`, at, phase: 5, order: 0, stableKey: `${ownerId}:5:membership`, kind: "MEMBERSHIP_RECOMPUTE", ownerId },
];

const selectionId = "us.selection.president-2028";
const boundaries: readonly InstitutionalBoundaryConfiguration[] = [
  ...termBoundaries(cycles[0].id, US_V0_2027_TERM_BOUNDARY),
  { id: `${selectionId}.popular`, at: US_V0_2028_POPULAR_SELECTION, phase: 0, order: 0, stableKey: `${selectionId}:popular`, kind: "POPULAR_SELECTION", ownerId: selectionId },
  { id: `${selectionId}.attestation`, at: US_V0_2028_ATTESTATION, phase: 0, order: 0, stableKey: `${selectionId}:attestation`, kind: "RESULT_ATTESTATION", ownerId: selectionId },
  { id: `${selectionId}.delegate-action`, at: US_V0_2028_DELEGATE_MEETING, phase: 0, order: 0, stableKey: `${selectionId}:delegate`, kind: "DELEGATE_ACTION", ownerId: selectionId },
  ...termBoundaries(cycles[1].id, US_V0_2029_TERM_BOUNDARY),
  { id: `${selectionId}.declaration`, at: US_V0_2029_DECLARATION, phase: 0, order: 0, stableKey: `${selectionId}:declaration`, kind: "COLLEGIATE_DECLARATION", ownerId: selectionId },
  { id: `${selectionId}.transfer`, at: US_V0_2029_TRANSFER, phase: 0, order: 0, stableKey: `${selectionId}:transfer`, kind: "AUTHORITY_TRANSFER", ownerId: selectionId },
];

const stateGeographyIds = US_V0_I5_STRUCTURE.geographies
  .filter((geography) => geography.kind === "ADMINISTRATIVE_AREA")
  .map((geography) => geography.id)
  .sort();

const unhashedTemporalPayload = {
  schemaVersion: 1,
  scheduleVersion: US_V0_I5_SCHEDULE_VERSION,
  initialTermLabel: "119th",
  boundaries,
  assignmentCycles: cycles,
  selection: {
    id: selectionId,
    classification: CLASSIFICATION,
    timingClassification: "AGGREGATED_APPROXIMATED_PROCEDURAL_TIMING",
    stateGeographyIds,
    tickets: [
      {
        id: US_V0_PLAYER_TICKET_ID,
        label: "Anonymous player-aligned incumbent-administration ticket",
        alignment: "PLAYER_ALIGNED",
        headCandidate: { id: "us.candidate.president.player-aligned-2028", actorId: US_INCUMBENT_PRESIDENT_ACTOR_ID },
        deputyCandidate: { id: "us.candidate.vice-president.player-aligned-2028", actorId: US_INCUMBENT_VICE_PRESIDENT_ACTOR_ID },
        classification: CLASSIFICATION,
      },
      {
        id: US_V0_OPPOSITION_TICKET_ID,
        label: "Anonymous opposition ticket",
        alignment: "NON_PLAYER_ALIGNED",
        headCandidate: { id: "us.candidate.president.opposition-2028", actorId: US_V0_OPPOSITION_PRESIDENT_ACTOR_ID },
        deputyCandidate: { id: "us.candidate.vice-president.opposition-2028", actorId: US_V0_OPPOSITION_VICE_PRESIDENT_ACTOR_ID },
        classification: CLASSIFICATION,
      },
    ],
    populationScaffold: {
      version: US_V0_I5_ELECTION_SCAFFOLD_VERSION,
      classification: CLASSIFICATION,
      stableKey: "us-v0-2028-election-readiness-stable-key-1",
      unresolvedPreferenceValue: "UNRESOLVED",
      unresolvedTurnoutValue: "UNRESOLVED",
      preferenceAliases: {
        PLAYER_ALIGNED: US_V0_PLAYER_TICKET_ID,
        OPPOSITION: US_V0_OPPOSITION_TICKET_ID,
        UNDECIDED: null,
        BLANK: null,
      },
      turnoutWeights: {
        LOW: { numerator: 2, denominator: 5 },
        MEDIUM: { numerator: 3, denominator: 5 },
        HIGH: { numerator: 4, denominator: 5 },
      },
      fallbackTurnoutWeight: { numerator: 3, denominator: 5 },
      fallbackPreferenceThresholds: [
        { ticketId: US_V0_PLAYER_TICKET_ID, cumulativeUpperBound: { numerator: 11, denominator: 20 } },
        { ticketId: US_V0_OPPOSITION_TICKET_ID, cumulativeUpperBound: { numerator: 19, denominator: 20 } },
        { ticketId: null, cumulativeUpperBound: { numerator: 1, denominator: 1 } },
      ],
    },
    staticTopologyArtifactId: "us.i4.electoral.allocation-2028-v1",
    transfer: {
      headOfficeId: US_PRESIDENT_OFFICE_ID,
      deputyOfficeId: US_VICE_PRESIDENT_OFFICE_ID,
      scheduledAt: US_V0_2029_TRANSFER,
      successorTermEndsAt: US_V0_2033_EXECUTIVE_TERM_END,
      administrationIdPrefix: "us.administration.term-2029.",
      assignmentIdPrefix: "us.assignment.executive.term-2029.",
      bindingIdPrefix: "us.control-binding.term-2029.",
      playerAlignedTicketId: US_V0_PLAYER_TICKET_ID,
    },
    recordIds: {
      snapshotPrefix: "us.selection.snapshot.2028.",
      ballotPrefix: "us.selection.ballot.2028.",
      resultPrefix: "us.selection.result.2028.",
      attestationPrefix: "us.selection.attestation.2028.",
      appointmentPrefix: "us.selection.appointment.2028.",
      certificatePrefix: "us.selection.certificate.2028.",
      declarationPrefix: "us.selection.declaration.2028.",
      entitlementPrefix: "us.selection.entitlement.2028.",
    },
  },
  newProcedureIdPrefix: "us.proposal.new-congress.",
  initialAdministration: {
    id: US_INCUMBENT_ADMINISTRATION_ID,
    headActorId: US_INCUMBENT_PRESIDENT_ACTOR_ID,
    deputyActorId: US_INCUMBENT_VICE_PRESIDENT_ACTOR_ID,
    effectiveFrom: "2026-08-22T00:00:00-04:00",
    effectiveUntil: US_V0_2029_TRANSFER,
    classification: CLASSIFICATION,
  },
} as const;

export const US_V0_I5_SCHEDULE_HASH = sha256Hex(JSON.stringify(boundaries));
export const US_V0_I5_ASSIGNMENT_CYCLE_HASH = sha256Hex(JSON.stringify(cycles));
export const US_V0_I5_SELECTION_HASH = sha256Hex(JSON.stringify(unhashedTemporalPayload.selection));

const temporalPayload = {
  ...unhashedTemporalPayload,
  scheduleContentHash: US_V0_I5_SCHEDULE_HASH,
  assignmentCycleContentHash: US_V0_I5_ASSIGNMENT_CYCLE_HASH,
  selectionContentHash: US_V0_I5_SELECTION_HASH,
} as const;

export const US_V0_I5_PARAMETER_HASH = sha256Hex(JSON.stringify(temporalPayload));

export const US_V0_I5_TEMPORAL_CONFIGURATION: IntegratedTemporalConfiguration = {
  ...temporalPayload,
  parameterHash: US_V0_I5_PARAMETER_HASH,
};
