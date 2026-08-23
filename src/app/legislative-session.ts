import { loadGovernmentConfiguration } from "../configuration/loader";
import type { GovernmentConfiguration, LegislativeRuntimeSeed } from "../configuration/types";
import {
  advanceIntroducedProposalToGate,
  beginSponsorSearch,
  closeAmendmentRound,
  considerTextExchange,
  createLegislativeRuntimeState,
  introduceSponsoredProposal,
  presentIdenticalText,
  requestFormalAmendment,
  resolveConsiderationGate,
  resolveExecutivePresentmentAction,
  resolveFinalRollCall,
  resolveFormalAmendment,
  resolveVetoOverrideRollCall,
  reviseLegislativeAgenda,
  seekMemberSponsorship,
  type LegislativeRuntimeContext,
  type LegislativeRuntimeState,
} from "../sim/legislative-runtime";
import {
  coordinateOrganization,
  negotiateWithActor,
  negotiateWithOrganization,
  type NegotiationOffer,
  type OrganizationCoordinationAction,
} from "../sim/political";
import { parseLegislativeRuntime, serializeLegislativeRuntime } from "./legislative-persistence";
import {
  assertActiveAdministrationControl,
  type AdministrationControlBinding,
} from "./control-binding";

export const LEGISLATIVE_ADMINISTRATION_DECISION_SURFACE =
  "EXECUTIVE_ADMINISTRATION_LEGISLATIVE_SURFACE" as const;

export type LegislativeControlBinding = AdministrationControlBinding<
  string,
  typeof LEGISLATIVE_ADMINISTRATION_DECISION_SURFACE
>;

export interface AdministrationLegislativeProjection {
  readonly proposal: {
    readonly id: string;
    readonly title: string;
    readonly currentVersion: number;
    readonly dimensions: Readonly<Record<string, number>>;
  };
  readonly procedure: {
    readonly stage: LegislativeRuntimeState["procedure"]["stage"];
    readonly currentChamberId: string | null;
    readonly sponsorship: LegislativeRuntimeState["procedure"]["sponsorship"];
    readonly gates: LegislativeRuntimeState["procedure"]["gates"];
    readonly amendments: LegislativeRuntimeState["procedure"]["amendments"];
    readonly recordedVotes: number;
    readonly approvedVersionByChamber: Readonly<Record<string, number>>;
    readonly textExchangeCount: number;
    readonly presentment: LegislativeRuntimeState["procedure"]["presentment"];
    readonly terminalDisposition: LegislativeRuntimeState["procedure"]["terminalDisposition"];
  };
  readonly communicatedOrganizations: readonly {
    readonly id: string;
    readonly negotiationPosture: string;
    readonly coordinationActions: LegislativeRuntimeState["political"]["organizations"][number]["coordinationActions"];
  }[];
  readonly knownCommitments: LegislativeRuntimeState["political"]["commitments"];
  readonly staffOutlook: Readonly<Record<"likelyYea" | "conditional" | "uncertain" | "likelyNay" | "committed", number>>;
  readonly enactedLegalSources: LegislativeRuntimeState["enactedLegalSources"];
}

export interface LegislativeSession {
  readonly getAdministrationView: () => AdministrationLegislativeProjection;
  readonly getAuditState: () => LegislativeRuntimeState;
  readonly getControlBindingAudit: () => LegislativeControlBinding;
  readonly save: () => string;
  readonly reviseAgenda: (dimensions: Readonly<Record<string, number>>) => AdministrationLegislativeProjection;
  readonly beginSponsorSearch: () => AdministrationLegislativeProjection;
  readonly seekSponsorship: (actorId: string) => AdministrationLegislativeProjection;
  readonly introduceBySponsor: (actorId: string, assignmentId: string) => AdministrationLegislativeProjection;
  readonly advanceIntroducedProposal: () => AdministrationLegislativeProjection;
  readonly resolveConsiderationGate: () => AdministrationLegislativeProjection;
  readonly negotiateWithActor: (actorId: string, offer: NegotiationOffer) => AdministrationLegislativeProjection;
  readonly negotiateWithOrganization: (organizationId: string) => AdministrationLegislativeProjection;
  readonly coordinateOrganization: (
    organizationId: string,
    chamberId: string,
    recommendation: OrganizationCoordinationAction["recommendation"],
  ) => AdministrationLegislativeProjection;
  readonly requestAmendment: (changes: Readonly<Record<string, number>>) => AdministrationLegislativeProjection;
  readonly resolveAmendment: () => AdministrationLegislativeProjection;
  readonly closeAmendmentRound: () => AdministrationLegislativeProjection;
  readonly resolveFinalRollCall: () => AdministrationLegislativeProjection;
  readonly considerTextExchange: (chamberId: string, version: number) => AdministrationLegislativeProjection;
  readonly present: () => AdministrationLegislativeProjection;
  readonly executiveAction: (actorId: string, assignmentId: string, action: "SIGN" | "VETO" | "WITHHOLD") => AdministrationLegislativeProjection;
  readonly resolveOverride: (chamberId: string) => AdministrationLegislativeProjection;
}

const deepCopy = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

export interface LegislativeSessionOptions {
  readonly controlBinding?: LegislativeControlBinding;
  readonly authoritativeInstant?: string;
}

export const createInitialLegislativeControlBinding = (
  state: LegislativeRuntimeState,
  context: LegislativeRuntimeContext,
): LegislativeControlBinding => {
  const assignment = state.activeAssignments.find(
    (candidate) => candidate.officeId === context.seed.executive.headOfficeId,
  );
  if (assignment === undefined) throw new Error("Legislative administration binding requires an active executive-head assignment.");
  return {
    id: `${state.configuration.configurationId}.control-binding.legislative-administration`,
    decisionSurface: LEGISLATIVE_ADMINISTRATION_DECISION_SURFACE,
    executiveOfficeId: assignment.officeId,
    boundOfficeholderActorId: assignment.actorId,
    status: "ACTIVE",
    endedAt: null,
    endReason: null,
  };
};

const assertLegislativeAdministrationControl = (
  binding: LegislativeControlBinding,
  state: LegislativeRuntimeState,
  context: LegislativeRuntimeContext,
): void => {
  const assignment = state.activeAssignments.find(
    (candidate) => candidate.officeId === context.seed.executive.headOfficeId,
  );
  if (assignment === undefined) throw new Error("Legislative administration has no active executive-head assignment.");
  assertActiveAdministrationControl(binding, {
    officeId: assignment.officeId,
    actorId: assignment.actorId,
    effectiveAt: assignment.effectiveFrom,
  });
};

export const projectAdministrationLegislativeView = (
  state: LegislativeRuntimeState,
  administrationId: string,
): AdministrationLegislativeProjection => {
  const current = state.agenda.versions.find((version) => version.version === state.agenda.currentVersion);
  if (current === undefined) throw new Error("Current proposal version is missing.");
  const outlook = { likelyYea: 0, conditional: 0, uncertain: 0, likelyNay: 0, committed: 0 };
  for (const actor of state.political.actors) {
    const visibleCommitment = state.political.commitments.find(
      (commitment) =>
        commitment.status === "ACTIVE" &&
        commitment.visibility === "PARTICIPANTS_AND_ADMINISTRATION" &&
        commitment.participantIds.includes(administrationId) &&
        commitment.participantIds.includes(actor.actorId) &&
        commitment.proposalId === state.agenda.proposalId &&
        commitment.proposalVersion === current.version,
    );
    if (visibleCommitment?.objective === "SUPPORT") {
      outlook.committed += 1;
      continue;
    }
    const communicated = [...actor.negotiationMemory].reverse().find(
      (memory) =>
        memory.counterpartyId === administrationId &&
        memory.proposalId === state.agenda.proposalId &&
        memory.proposalVersion === current.version,
    );
    if (communicated?.outcome === "REQUESTED_AMENDMENT" || communicated?.outcome === "CONDITIONAL_SUPPORT") {
      outlook.conditional += 1;
      continue;
    }
    if (communicated?.outcome === "REJECTED" || communicated?.outcome === "WITHDRAWN") {
      outlook.likelyNay += 1;
      continue;
    }
    const organization = state.political.organizations.find((candidate) =>
      candidate.memberships.some((membership) => membership.actorId === actor.actorId),
    );
    const action = [...(organization?.coordinationActions ?? [])].reverse().find(
      (candidate) => candidate.proposalId === state.agenda.proposalId && candidate.proposalVersion === current.version,
    );
    if (action?.recommendation === "SUPPORT" || organization?.negotiationPosture === "OPEN") outlook.likelyYea += 1;
    else if (action?.recommendation === "OPPOSE" || organization?.negotiationPosture === "REJECTING") outlook.likelyNay += 1;
    else if (organization?.negotiationPosture === "CONDITIONAL") outlook.conditional += 1;
    else outlook.uncertain += 1;
  }
  return {
    proposal: {
      id: state.agenda.proposalId,
      title: state.agenda.title,
      currentVersion: current.version,
      dimensions: { ...current.dimensions },
    },
    procedure: {
      stage: state.procedure.stage,
      currentChamberId: state.procedure.currentChamberId,
      sponsorship: deepCopy(state.procedure.sponsorship),
      gates: deepCopy(state.procedure.gates),
      amendments: deepCopy(state.procedure.amendments),
      recordedVotes: state.procedure.voteOpportunities.reduce((total, opportunity) => total + opportunity.votes.length, 0),
      approvedVersionByChamber: { ...state.procedure.approvedVersionByChamber },
      textExchangeCount: state.procedure.textExchangeCount,
      presentment: deepCopy(state.procedure.presentment),
      terminalDisposition: state.procedure.terminalDisposition,
    },
    communicatedOrganizations: state.political.organizations
      .filter((organization) => organization.negotiationPosture !== "UNCONTACTED" || organization.coordinationActions.length > 0)
      .map((organization) => ({
        id: organization.id,
        negotiationPosture: organization.negotiationPosture,
        coordinationActions: deepCopy(organization.coordinationActions),
      })),
    knownCommitments: deepCopy(state.political.commitments.filter(
      (commitment) =>
        commitment.visibility === "PARTICIPANTS_AND_ADMINISTRATION" &&
        commitment.participantIds.includes(administrationId),
    )),
    staffOutlook: outlook,
    enactedLegalSources: deepCopy(state.enactedLegalSources),
  };
};

const createSession = (
  initialState: LegislativeRuntimeState,
  context: LegislativeRuntimeContext,
  initialBinding: LegislativeControlBinding,
  authoritativeInstant: string,
): LegislativeSession => {
  let state = initialState;
  const controlBinding = initialBinding;
  const commit = (next: LegislativeRuntimeState): AdministrationLegislativeProjection => {
    state = next;
    return projectAdministrationLegislativeView(state, context.seed.executive.administrationId);
  };
  const authorized = (
    transition: () => LegislativeRuntimeState,
  ): AdministrationLegislativeProjection => {
    assertLegislativeAdministrationControl(controlBinding, state, context);
    return commit(transition());
  };
  const proposal = () => {
    const version = state.agenda.versions.find((candidate) => candidate.version === state.agenda.currentVersion);
    if (version === undefined) throw new Error("Current proposal version is missing.");
    return { proposalId: state.agenda.proposalId, version: version.version, dimensions: version.dimensions };
  };
  return {
    getAdministrationView: () => projectAdministrationLegislativeView(state, context.seed.executive.administrationId),
    getAuditState: () => deepCopy(state),
    getControlBindingAudit: () => deepCopy(controlBinding),
    save: () => serializeLegislativeRuntime(state, controlBinding),
    reviseAgenda: (dimensions) => authorized(() => reviseLegislativeAgenda(state, context, dimensions)),
    beginSponsorSearch: () => authorized(() => beginSponsorSearch(state)),
    seekSponsorship: (actorId) => authorized(() => seekMemberSponsorship(state, context, actorId)),
    introduceBySponsor: (actorId, assignmentId) => authorized(() => introduceSponsoredProposal(state, context, actorId, assignmentId)),
    advanceIntroducedProposal: () => authorized(() => advanceIntroducedProposalToGate(state, context)),
    resolveConsiderationGate: () => authorized(() => resolveConsiderationGate(state, context)),
    negotiateWithActor: (actorId, offer) => {
      return authorized(() => {
        const result = negotiateWithActor(
          state.political,
          context.seed,
          actorId,
          context.seed.executive.administrationId,
          proposal(),
          offer,
        );
        return { ...state, political: result.political };
      });
    },
    negotiateWithOrganization: (organizationId) =>
      authorized(() => ({ ...state, political: negotiateWithOrganization(state.political, organizationId, proposal()) })),
    coordinateOrganization: (organizationId, chamberId, recommendation) =>
      authorized(() => ({
        ...state,
        political: coordinateOrganization(
          state.political,
          context.seed,
          organizationId,
          chamberId,
          proposal(),
          recommendation,
        ),
      })),
    requestAmendment: (changes) => authorized(() => requestFormalAmendment(state, context, changes)),
    resolveAmendment: () => authorized(() => resolveFormalAmendment(state, context)),
    closeAmendmentRound: () => authorized(() => closeAmendmentRound(state, context)),
    resolveFinalRollCall: () => authorized(() => resolveFinalRollCall(state, context)),
    considerTextExchange: (chamberId, version) => authorized(() => considerTextExchange(state, context, chamberId, version)),
    present: () => authorized(() => presentIdenticalText(state, context, authoritativeInstant)),
    executiveAction: (actorId, assignmentId, action) =>
      authorized(() => resolveExecutivePresentmentAction(state, context, actorId, assignmentId, action)),
    resolveOverride: (chamberId) => authorized(() => resolveVetoOverrideRollCall(state, context, chamberId)),
  };
};

export const createLegislativeSession = (
  configuration: GovernmentConfiguration<LegislativeRuntimeSeed>,
  options: LegislativeSessionOptions = {},
): LegislativeSession => {
  const loaded = loadGovernmentConfiguration(configuration);
  if (
    (loaded.capability !== "LEGISLATIVE_RUNTIME_SLICE" && loaded.capability !== "INTEGRATED_PARTIAL_RUNTIME") ||
    loaded.runtimeSeed === null
  ) {
    throw new Error("Configuration does not expose a legislative runtime slice.");
  }
  const context = { structure: loaded.structure, seed: loaded.runtimeSeed };
  const state = createLegislativeRuntimeState(loaded.identity, context);
  const binding = options.controlBinding ?? createInitialLegislativeControlBinding(state, context);
  return createSession(state, context, binding, options.authoritativeInstant ?? loaded.calendar.epoch);
};

export const createLegislativeSessionFromSave = (
  serialized: string,
  configuration: GovernmentConfiguration<LegislativeRuntimeSeed>,
  options: Pick<LegislativeSessionOptions, "authoritativeInstant"> = {},
): LegislativeSession => {
  const loaded = loadGovernmentConfiguration(configuration);
  if (
    (loaded.capability !== "LEGISLATIVE_RUNTIME_SLICE" && loaded.capability !== "INTEGRATED_PARTIAL_RUNTIME") ||
    loaded.runtimeSeed === null
  ) {
    throw new Error("Configuration does not expose a legislative runtime slice.");
  }
  const restored = parseLegislativeRuntime(serialized, loaded.identity);
  if (restored.state.schemaVersion !== loaded.runtimeSeed.schemaVersion) {
    throw new Error("Legislative runtime schema version mismatch.");
  }
  return createSession(
    restored.state,
    { structure: loaded.structure, seed: loaded.runtimeSeed },
    restored.controlBinding,
    options.authoritativeInstant ?? loaded.calendar.epoch,
  );
};
