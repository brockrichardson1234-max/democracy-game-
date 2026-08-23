import { loadGovernmentConfiguration } from "../configuration/loader";
import type { GovernmentConfiguration, LegislativeRuntimeSeed } from "../configuration/types";
import {
  advanceIntroducedProposalToGate,
  beginSponsorSearch,
  castConfiguredTieBreakerVote,
  closeAmendmentRound,
  considerTextExchange,
  createLegislativeRuntimeState,
  expireLegislativeProcedure,
  introduceSponsoredProposal,
  presentIdenticalText,
  recordExtendedDebateThreat,
  requestFormalAmendment,
  resolveConsiderationGate,
  resolveExecutivePresentmentAction,
  resolveFinalRollCall,
  resolveFormalAmendment,
  resolveNoSignatureRoute,
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
  readonly threatenExtendedDebate: (actorId: string) => AdministrationLegislativeProjection;
  readonly resolveFinalRollCall: () => AdministrationLegislativeProjection;
  readonly castTieBreaker: (actorId: string, assignmentId: string, choice: "YEA" | "NAY") => AdministrationLegislativeProjection;
  readonly considerTextExchange: (chamberId: string, version: number) => AdministrationLegislativeProjection;
  readonly present: () => AdministrationLegislativeProjection;
  readonly executiveAction: (actorId: string, assignmentId: string, action: "SIGN" | "VETO" | "WITHHOLD") => AdministrationLegislativeProjection;
  readonly resolveNoSignature: (returnPrevented: boolean) => AdministrationLegislativeProjection;
  readonly resolveOverride: (chamberId: string) => AdministrationLegislativeProjection;
  readonly expire: () => AdministrationLegislativeProjection;
}

const deepCopy = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

export const projectAdministrationLegislativeView = (
  state: LegislativeRuntimeState,
): AdministrationLegislativeProjection => {
  const current = state.agenda.versions.find((version) => version.version === state.agenda.currentVersion);
  if (current === undefined) throw new Error("Current proposal version is missing.");
  const outlook = { likelyYea: 0, conditional: 0, uncertain: 0, likelyNay: 0, committed: 0 };
  for (const actor of state.political.actors) {
    if (actor.supportPosture === "LEAN_YEA") outlook.likelyYea += 1;
    else if (actor.supportPosture === "CONDITIONAL") outlook.conditional += 1;
    else if (actor.supportPosture === "LEAN_NAY") outlook.likelyNay += 1;
    else if (actor.supportPosture === "COMMITTED") outlook.committed += 1;
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
    knownCommitments: deepCopy(state.political.commitments),
    staffOutlook: outlook,
    enactedLegalSources: deepCopy(state.enactedLegalSources),
  };
};

const createSession = (
  initialState: LegislativeRuntimeState,
  context: LegislativeRuntimeContext,
): LegislativeSession => {
  let state = initialState;
  const commit = (next: LegislativeRuntimeState): AdministrationLegislativeProjection => {
    state = next;
    return projectAdministrationLegislativeView(state);
  };
  const proposal = () => {
    const version = state.agenda.versions.find((candidate) => candidate.version === state.agenda.currentVersion);
    if (version === undefined) throw new Error("Current proposal version is missing.");
    return { proposalId: state.agenda.proposalId, version: version.version, dimensions: version.dimensions };
  };
  return {
    getAdministrationView: () => projectAdministrationLegislativeView(state),
    getAuditState: () => deepCopy(state),
    save: () => serializeLegislativeRuntime(state),
    reviseAgenda: (dimensions) => commit(reviseLegislativeAgenda(state, context, dimensions)),
    beginSponsorSearch: () => commit(beginSponsorSearch(state)),
    seekSponsorship: (actorId) => commit(seekMemberSponsorship(state, context, actorId)),
    introduceBySponsor: (actorId, assignmentId) => commit(introduceSponsoredProposal(state, context, actorId, assignmentId)),
    advanceIntroducedProposal: () => commit(advanceIntroducedProposalToGate(state, context)),
    resolveConsiderationGate: () => commit(resolveConsiderationGate(state, context)),
    negotiateWithActor: (actorId, offer) => {
      const result = negotiateWithActor(
        state.political,
        context.seed,
        actorId,
        context.seed.executive.administrationId,
        proposal(),
        offer,
      );
      return commit({ ...state, political: result.political });
    },
    negotiateWithOrganization: (organizationId) =>
      commit({ ...state, political: negotiateWithOrganization(state.political, organizationId, proposal()) }),
    coordinateOrganization: (organizationId, chamberId, recommendation) =>
      commit({
        ...state,
        political: coordinateOrganization(
          state.political,
          context.seed,
          organizationId,
          chamberId,
          proposal(),
          recommendation,
        ),
      }),
    requestAmendment: (changes) => commit(requestFormalAmendment(state, context, changes)),
    resolveAmendment: () => commit(resolveFormalAmendment(state, context)),
    closeAmendmentRound: () => commit(closeAmendmentRound(state, context)),
    threatenExtendedDebate: (actorId) => commit(recordExtendedDebateThreat(state, context, actorId)),
    resolveFinalRollCall: () => commit(resolveFinalRollCall(state, context)),
    castTieBreaker: (actorId, assignmentId, choice) =>
      commit(castConfiguredTieBreakerVote(state, context, actorId, assignmentId, choice)),
    considerTextExchange: (chamberId, version) => commit(considerTextExchange(state, context, chamberId, version)),
    present: () => commit(presentIdenticalText(state, context)),
    executiveAction: (actorId, assignmentId, action) =>
      commit(resolveExecutivePresentmentAction(state, context, actorId, assignmentId, action)),
    resolveNoSignature: (returnPrevented) => commit(resolveNoSignatureRoute(state, context, returnPrevented)),
    resolveOverride: (chamberId) => commit(resolveVetoOverrideRollCall(state, context, chamberId)),
    expire: () => commit(expireLegislativeProcedure(state)),
  };
};

export const createLegislativeSession = (
  configuration: GovernmentConfiguration<LegislativeRuntimeSeed>,
): LegislativeSession => {
  const loaded = loadGovernmentConfiguration(configuration);
  if (loaded.capability !== "LEGISLATIVE_RUNTIME_SLICE" || loaded.runtimeSeed === null) {
    throw new Error("Configuration does not expose a legislative runtime slice.");
  }
  const context = { structure: loaded.structure, seed: loaded.runtimeSeed };
  return createSession(createLegislativeRuntimeState(loaded.identity, context), context);
};

export const createLegislativeSessionFromSave = (
  serialized: string,
  configuration: GovernmentConfiguration<LegislativeRuntimeSeed>,
): LegislativeSession => {
  const loaded = loadGovernmentConfiguration(configuration);
  if (loaded.capability !== "LEGISLATIVE_RUNTIME_SLICE" || loaded.runtimeSeed === null) {
    throw new Error("Configuration does not expose a legislative runtime slice.");
  }
  const restored = parseLegislativeRuntime(serialized, loaded.identity);
  if (restored.schemaVersion !== loaded.runtimeSeed.schemaVersion) {
    throw new Error("Legislative runtime schema version mismatch.");
  }
  return createSession(restored, { structure: loaded.structure, seed: loaded.runtimeSeed });
};
