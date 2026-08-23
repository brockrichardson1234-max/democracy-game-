import { deterministicUnit, sha256Hex } from "../configuration/sha256";
import type {
  GovernmentStructureDescriptor,
  LegislativeRuntimeSeed,
  PoliticalOrganizationConfiguration,
} from "../configuration/types";
import type { VoteChoice } from "./legislature";

export type SupportPosture =
  | "UNASSESSED"
  | "LEAN_YEA"
  | "CONDITIONAL"
  | "LEAN_NAY"
  | "COMMITTED";
export type CommitmentStatus =
  | "PROPOSED"
  | "ACTIVE"
  | "FULFILLED"
  | "BREACHED"
  | "WITHDRAWN"
  | "EXPIRED";
export type CommitmentObjective = "SUPPORT" | "OPPOSE" | "SEEK_AMENDMENT" | "ACCESS";
export type LegislativeDecisionKind =
  | "SPONSORSHIP"
  | "FINAL_PASSAGE"
  | "AMENDMENT"
  | "CLOTURE"
  | "OVERRIDE";
export type CanonicalVoteChoice = VoteChoice;

export interface ActorDimensionEvaluation {
  readonly dimensionId: string;
  readonly preferredValue: number;
  readonly reservationMinimum: number;
  readonly reservationMaximum: number;
}

export interface ActorNegotiationMemory {
  readonly id: string;
  readonly proposalId: string;
  readonly proposalVersion: number;
  readonly counterpartyId: string;
  readonly outcome:
    | "REJECTED"
    | "CONDITIONAL_SUPPORT"
    | "REQUESTED_AMENDMENT"
    | "ACCEPTED_COMMITMENT"
    | "REVISED_COMMITMENT"
    | "WITHDRAWN";
  readonly communicatedConditionDimensionId: string | null;
}

export interface ActorLegislativeDecision {
  readonly proposalId: string;
  readonly proposalVersion: number;
  readonly opportunityId: string;
  readonly kind: LegislativeDecisionKind;
  readonly choice: CanonicalVoteChoice;
  readonly statedReason: string;
}

/** Actor-owned evaluation and autonomy. Organization membership is only referenced. */
export interface PoliticalActorState {
  readonly actorId: string;
  readonly membershipId: string;
  readonly evaluations: readonly ActorDimensionEvaluation[];
  readonly supportPosture: SupportPosture;
  readonly negotiationMemory: readonly ActorNegotiationMemory[];
  readonly commitmentIds: readonly string[];
  readonly accessibleOrganizationRecordIds: readonly string[];
  readonly pressureByOrganizationId: Readonly<Record<string, number>>;
  readonly lastDecision: ActorLegislativeDecision | null;
  readonly autonomyKey: string;
  readonly commitmentHonorWillingness: number;
  readonly commitmentRenegotiateWillingness: number;
  readonly commitmentBreachWillingness: number;
}

export interface OrganizationMembership {
  readonly id: string;
  readonly organizationId: string;
  readonly chamberId: string;
  readonly officeId: string;
  readonly assignmentId: string;
  readonly actorId: string;
  readonly stableRank: string;
}

export interface OrganizationDivision {
  readonly chamberId: string;
  readonly membershipIds: readonly string[];
  readonly leaderMembershipId: string;
  readonly whipMembershipId: string;
}

export interface OrganizationCoordinationAction {
  readonly id: string;
  readonly organizationId: string;
  readonly chamberId: string;
  readonly proposalId: string;
  readonly proposalVersion: number;
  readonly recommendation: "SUPPORT" | "OPPOSE";
  readonly intensity: number;
}

/** Canonical owner of organization identity, membership, divisions, and records. */
export interface PoliticalOrganizationState {
  readonly id: string;
  readonly label: string;
  readonly classification: PoliticalOrganizationConfiguration["classification"];
  readonly postureByDimension: Readonly<Record<string, number>>;
  readonly memberships: readonly OrganizationMembership[];
  readonly divisions: readonly OrganizationDivision[];
  readonly coordinationActions: readonly OrganizationCoordinationAction[];
  readonly negotiationPosture: "UNCONTACTED" | "OPEN" | "CONDITIONAL" | "REJECTING";
}

/** Canonical relationship owner; participants only retain its ID. */
export interface PoliticalCommitment {
  readonly id: string;
  readonly participantIds: readonly string[];
  readonly proposalId: string;
  readonly proposalVersion: number;
  readonly objective: CommitmentObjective;
  readonly negotiatedTerms: Readonly<Record<string, number | string>>;
  readonly conditions: readonly string[];
  readonly effectiveFromEvent: string;
  readonly effectiveUntilEvent: string | null;
  readonly visibility: "PARTICIPANTS_AND_ADMINISTRATION";
  readonly status: CommitmentStatus;
}

export interface PoliticalState {
  readonly scaffold: {
    readonly version: string;
    readonly seed: string;
    readonly classification: LegislativeRuntimeSeed["profileScaffold"]["classification"];
  };
  readonly actors: readonly PoliticalActorState[];
  readonly organizations: readonly PoliticalOrganizationState[];
  readonly commitments: readonly PoliticalCommitment[];
}

/** Runtime owner of who currently exercises an office in this canonical slice. */
export interface ActiveOfficeAssignmentState {
  readonly id: string;
  readonly officeId: string;
  readonly actorId: string;
  readonly effectiveFrom: string;
  readonly effectiveUntil: string | null;
  readonly classification: LegislativeRuntimeSeed["profileScaffold"]["classification"];
}

export interface EvaluatedProposalVersion {
  readonly proposalId: string;
  readonly version: number;
  readonly dimensions: Readonly<Record<string, number>>;
}

const currentLegislativeAssignments = (
  structure: GovernmentStructureDescriptor,
  activeAssignments: readonly ActiveOfficeAssignmentState[],
) => {
  const legislativeOfficeIds = new Set(
    structure.offices.filter((office) => office.kind === "LEGISLATIVE_MEMBER").map((office) => office.id),
  );
  return activeAssignments.filter((assignment) => legislativeOfficeIds.has(assignment.officeId));
};

const blend = (shared: number, individual: number, numerator: number, denominator: number): number =>
  (shared * numerator + individual * (denominator - numerator)) / denominator;

const deriveOrganizations = (
  structure: GovernmentStructureDescriptor,
  seed: LegislativeRuntimeSeed,
  activeAssignments: readonly ActiveOfficeAssignmentState[],
): readonly PoliticalOrganizationState[] => {
  const assignments = currentLegislativeAssignments(structure, activeAssignments);
  const byOrganization = new Map<string, OrganizationMembership[]>();
  for (const organization of seed.organizations) byOrganization.set(organization.id, []);

  for (const chamberRule of seed.procedure.chamberRules) {
    const token = seed.membershipScaffold.chamberRankTokens[chamberRule.chamberId];
    if (token === undefined) throw new Error(`Missing membership rank token for ${chamberRule.chamberId}.`);
    const ranked = structure.offices
      .filter((office) => office.chamberId === chamberRule.chamberId)
      .map((office) => ({
        office,
        rank: sha256Hex(`${seed.membershipScaffold.salt}|${token}|${office.id}`),
      }))
      .sort((left, right) => left.rank.localeCompare(right.rank) || left.office.id.localeCompare(right.office.id));
    let cursor = 0;
    for (const organizationId of seed.membershipScaffold.organizationOrder) {
      const organization = seed.organizations.find((candidate) => candidate.id === organizationId);
      if (organization === undefined) throw new Error(`Unknown organization ${organizationId}.`);
      const quota = organization.chamberQuotas[chamberRule.chamberId];
      if (!Number.isInteger(quota) || quota < 0) {
        throw new Error(`Organization ${organizationId} has an invalid chamber quota.`);
      }
      for (const entry of ranked.slice(cursor, cursor + quota)) {
        const assignment = assignments.find((candidate) => candidate.officeId === entry.office.id);
        if (assignment === undefined) continue;
        byOrganization.get(organizationId)?.push({
          id: `membership:${organizationId}:${entry.office.id}`,
          organizationId,
          chamberId: chamberRule.chamberId,
          officeId: entry.office.id,
          assignmentId: assignment.id,
          actorId: assignment.actorId,
          stableRank: entry.rank,
        });
      }
      cursor += quota;
    }
    if (cursor !== ranked.length) throw new Error(`Organization quotas do not cover ${chamberRule.chamberId}.`);
  }

  return seed.organizations.map((configuration) => {
    const memberships = byOrganization.get(configuration.id) ?? [];
    const divisions = seed.procedure.chamberRules.map((rule) => {
      const divisionMembers = memberships
        .filter((membership) => membership.chamberId === rule.chamberId)
        .sort((left, right) => left.stableRank.localeCompare(right.stableRank));
      if (divisionMembers.length < 2) throw new Error(`Organization division ${configuration.id} is too small.`);
      return {
        chamberId: rule.chamberId,
        membershipIds: divisionMembers.map((member) => member.id),
        leaderMembershipId: divisionMembers[0].id,
        whipMembershipId: divisionMembers[1].id,
      };
    });
    return {
      id: configuration.id,
      label: configuration.label,
      classification: configuration.classification,
      postureByDimension: configuration.postureByDimension,
      memberships,
      divisions,
      coordinationActions: [],
      negotiationPosture: "UNCONTACTED",
    };
  });
};

const createPoliticalActorState = (
  actorId: string,
  membership: OrganizationMembership,
  organization: PoliticalOrganizationConfiguration,
  seed: LegislativeRuntimeSeed,
): PoliticalActorState => {
  const evaluations = seed.dimensions.map((dimension): ActorDimensionEvaluation => {
    const shared = organization.postureByDimension[dimension.id];
    if (shared === undefined) throw new Error(`Organization posture omits ${dimension.id}.`);
    const unit = deterministicUnit(`${seed.profileScaffold.seed}|${actorId}|${dimension.id}`);
    const individual = Math.max(
      dimension.minimum,
      Math.min(
        dimension.maximum,
        shared + (unit * 2 - 1) * seed.decision.actorVariationRadius,
      ),
    );
    const preferredValue = blend(
      shared,
      individual,
      seed.decision.organizationBlend.numerator,
      seed.decision.organizationBlend.denominator,
    );
    return {
      dimensionId: dimension.id,
      preferredValue,
      reservationMinimum: Math.max(dimension.minimum, preferredValue - seed.decision.reservationDistance),
      reservationMaximum: Math.min(dimension.maximum, preferredValue + seed.decision.reservationDistance),
    };
  });
  return {
    actorId,
    membershipId: membership.id,
    evaluations,
    supportPosture: "UNASSESSED",
    negotiationMemory: [],
    commitmentIds: [],
    accessibleOrganizationRecordIds: [],
    pressureByOrganizationId: {},
    lastDecision: null,
    autonomyKey: sha256Hex(`${seed.profileScaffold.seed}|${actorId}|autonomy`),
    commitmentHonorWillingness: deterministicUnit(`${seed.profileScaffold.seed}|${actorId}|honor`),
    commitmentRenegotiateWillingness: deterministicUnit(`${seed.profileScaffold.seed}|${actorId}|renegotiate`),
    commitmentBreachWillingness: deterministicUnit(`${seed.profileScaffold.seed}|${actorId}|breach`),
  };
};

export const createPoliticalState = (
  structure: GovernmentStructureDescriptor,
  seed: LegislativeRuntimeSeed,
  activeAssignments: readonly ActiveOfficeAssignmentState[],
): PoliticalState => {
  const organizations = deriveOrganizations(structure, seed, activeAssignments);
  const membershipByActor = new Map(
    organizations.flatMap((organization) =>
      organization.memberships.map((membership) => [membership.actorId, { organization, membership }] as const),
    ),
  );
  const legislativeAssignments = currentLegislativeAssignments(structure, activeAssignments);
  if (membershipByActor.size !== legislativeAssignments.length) {
    throw new Error("Every current legislative actor must have exactly one organization membership.");
  }
  const actors = legislativeAssignments.map((assignment): PoliticalActorState => {
    const owned = membershipByActor.get(assignment.actorId);
    if (owned === undefined) throw new Error(`Political actor ${assignment.actorId} has no membership.`);
    const organization = seed.organizations.find((candidate) => candidate.id === owned.organization.id);
    if (organization === undefined) throw new Error(`Unknown organization ${owned.organization.id}.`);
    return createPoliticalActorState(assignment.actorId, owned.membership, organization, seed);
  });
  return {
    scaffold: { ...seed.profileScaffold },
    actors,
    organizations,
    commitments: [],
  };
};

/** Rebuild current organization references after a configured assignment transition. */
export const rebuildPoliticalStateForAssignments = (
  prior: PoliticalState,
  structure: GovernmentStructureDescriptor,
  seed: LegislativeRuntimeSeed,
  activeAssignments: readonly ActiveOfficeAssignmentState[],
  proposal: EvaluatedProposalVersion,
): PoliticalState => {
  const derived = deriveOrganizations(structure, seed, activeAssignments).map((organization) => {
    const previous = prior.organizations.find((candidate) => candidate.id === organization.id);
    return previous === undefined
      ? organization
      : {
          ...organization,
          coordinationActions: previous.coordinationActions,
          negotiationPosture: previous.negotiationPosture,
        };
  });
  const membershipByActor = new Map(
    derived.flatMap((organization) => organization.memberships.map(
      (membership) => [membership.actorId, { organization, membership }] as const,
    )),
  );
  const legislativeAssignments = currentLegislativeAssignments(structure, activeAssignments);
  if (membershipByActor.size !== legislativeAssignments.length) {
    throw new Error("Every current legislative actor must have exactly one rebuilt organization membership.");
  }
  const actors = legislativeAssignments.map((assignment) => {
    const owned = membershipByActor.get(assignment.actorId);
    if (owned === undefined) throw new Error(`Political actor ${assignment.actorId} has no rebuilt membership.`);
    const retained = prior.actors.find((candidate) => candidate.actorId === assignment.actorId);
    if (retained !== undefined) return { ...retained, membershipId: owned.membership.id };
    const configuredOrganization = seed.organizations.find((candidate) => candidate.id === owned.organization.id);
    if (configuredOrganization === undefined) throw new Error(`Unknown organization ${owned.organization.id}.`);
    return createPoliticalActorState(assignment.actorId, owned.membership, configuredOrganization, seed);
  });
  return refreshPoliticalSupport({
    ...prior,
    actors,
    organizations: derived,
  }, proposal);
};

export const replacePoliticalOfficeholder = (
  political: PoliticalState,
  seed: LegislativeRuntimeSeed,
  officeId: string,
  assignmentId: string,
  actorId: string,
  proposal: EvaluatedProposalVersion,
): PoliticalState => {
  const organization = political.organizations.find((candidate) =>
    candidate.memberships.some((membership) => membership.officeId === officeId),
  );
  const priorMembership = organization?.memberships.find((membership) => membership.officeId === officeId);
  if (organization === undefined || priorMembership === undefined) {
    throw new Error("Replacement legislative office has no configured organization membership.");
  }
  const configuredOrganization = seed.organizations.find((candidate) => candidate.id === organization.id);
  if (configuredOrganization === undefined) throw new Error(`Unknown organization ${organization.id}.`);
  const replacementMembership: OrganizationMembership = {
    ...priorMembership,
    assignmentId,
    actorId,
  };
  const organizations = political.organizations.map((candidate) =>
    candidate.id === organization.id
      ? {
          ...candidate,
          memberships: candidate.memberships.map((membership) =>
            membership.id === priorMembership.id ? replacementMembership : membership,
          ),
        }
      : candidate,
  );
  const incoming = createPoliticalActorState(actorId, replacementMembership, configuredOrganization, seed);
  return refreshPoliticalSupport({
    ...political,
    organizations,
    actors: [
      ...political.actors.filter(
        (actor) => actor.actorId !== priorMembership.actorId && actor.actorId !== actorId,
      ),
      incoming,
    ],
  }, proposal);
};

const organizationForActor = (political: PoliticalState, actor: PoliticalActorState) =>
  political.organizations.find((organization) =>
    organization.memberships.some((membership) => membership.id === actor.membershipId),
  );

const activeCommitmentFor = (
  political: PoliticalState,
  actorId: string,
  proposal: EvaluatedProposalVersion,
): PoliticalCommitment | null =>
  political.commitments.find(
    (commitment) =>
      commitment.status === "ACTIVE" &&
      commitment.participantIds.includes(actorId) &&
      commitment.proposalId === proposal.proposalId &&
      commitment.proposalVersion === proposal.version,
  ) ?? null;

const reservationBreaches = (
  actor: PoliticalActorState,
  proposal: EvaluatedProposalVersion,
): readonly ActorDimensionEvaluation[] =>
  actor.evaluations.filter((evaluation) => {
    const value = proposal.dimensions[evaluation.dimensionId];
    return value === undefined || value < evaluation.reservationMinimum || value > evaluation.reservationMaximum;
  });

export const projectActorSupportPosture = (
  political: PoliticalState,
  actor: PoliticalActorState,
  proposal: EvaluatedProposalVersion,
): SupportPosture => {
  const commitment = activeCommitmentFor(political, actor.actorId, proposal);
  if (commitment?.objective === "SUPPORT") return "COMMITTED";
  const breaches = reservationBreaches(actor, proposal).length;
  const organization = organizationForActor(political, actor);
  const pressure = organization === undefined ? 0 : actor.pressureByOrganizationId[organization.id] ?? 0;
  if (breaches === 0) return "LEAN_YEA";
  if (breaches === 1 || pressure > 0) return "CONDITIONAL";
  return "LEAN_NAY";
};

export const refreshPoliticalSupport = (
  political: PoliticalState,
  proposal: EvaluatedProposalVersion,
): PoliticalState => ({
  ...political,
  actors: political.actors.map((actor) => ({
    ...actor,
    supportPosture: projectActorSupportPosture(political, actor, proposal),
  })),
});

export const coordinateOrganization = (
  political: PoliticalState,
  seed: LegislativeRuntimeSeed,
  organizationId: string,
  chamberId: string,
  proposal: EvaluatedProposalVersion,
  recommendation: OrganizationCoordinationAction["recommendation"],
): PoliticalState => {
  const organization = political.organizations.find((candidate) => candidate.id === organizationId);
  const division = organization?.divisions.find((candidate) => candidate.chamberId === chamberId);
  if (organization === undefined || division === undefined) throw new Error("Unknown organization division.");
  const duplicate = organization.coordinationActions.some(
    (action) => action.proposalId === proposal.proposalId && action.proposalVersion === proposal.version && action.chamberId === chamberId,
  );
  if (duplicate) throw new Error("This organization division already coordinated on the proposal version.");
  const action: OrganizationCoordinationAction = {
    id: `${seed.recordIds.organizationActionPrefix}${organizationId}:${chamberId}:${proposal.version}`,
    organizationId,
    chamberId,
    proposalId: proposal.proposalId,
    proposalVersion: proposal.version,
    recommendation,
    intensity: seed.decision.coordinationPressure,
  };
  const memberIds = new Set(division.membershipIds);
  const actors = political.actors.map((actor) => {
    if (!memberIds.has(actor.membershipId)) return actor;
    return {
      ...actor,
      accessibleOrganizationRecordIds: [...actor.accessibleOrganizationRecordIds, action.id],
      pressureByOrganizationId: {
        ...actor.pressureByOrganizationId,
        [organizationId]: recommendation === "SUPPORT" ? action.intensity : -action.intensity,
      },
    };
  });
  return refreshPoliticalSupport(
    {
      ...political,
      actors,
      organizations: political.organizations.map((candidate) =>
        candidate.id === organizationId
          ? { ...candidate, coordinationActions: [...candidate.coordinationActions, action] }
          : candidate,
      ),
    },
    proposal,
  );
};

export interface NegotiationOffer {
  readonly objective: CommitmentObjective;
  readonly terms: Readonly<Record<string, number | string>>;
  readonly conditions: readonly string[];
}

export interface NegotiationResult {
  readonly political: PoliticalState;
  readonly outcome: ActorNegotiationMemory["outcome"];
  readonly commitment: PoliticalCommitment | null;
}

export const negotiateWithActor = (
  political: PoliticalState,
  seed: LegislativeRuntimeSeed,
  actorId: string,
  administrationId: string,
  proposal: EvaluatedProposalVersion,
  offer: NegotiationOffer,
): NegotiationResult => {
  const actor = political.actors.find((candidate) => candidate.actorId === actorId);
  if (actor === undefined) throw new Error(`Unknown political actor ${actorId}.`);
  const breaches = reservationBreaches(actor, proposal);
  const accepts =
    offer.objective === "SUPPORT" &&
    (breaches.length === 0 || Object.keys(offer.terms).some((key) => breaches.some((entry) => entry.dimensionId === key)));
  const priorCommitment = political.commitments.find(
    (commitment) =>
      commitment.status === "ACTIVE" &&
      commitment.participantIds.includes(actorId) &&
      commitment.proposalId === proposal.proposalId &&
      commitment.proposalVersion === proposal.version,
  );
  const revises =
    accepts &&
    priorCommitment !== undefined &&
    actor.commitmentRenegotiateWillingness >= seed.decision.commitmentHonorCutoff;
  const outcome: ActorNegotiationMemory["outcome"] = revises
    ? "REVISED_COMMITMENT"
    : accepts && priorCommitment === undefined
      ? "ACCEPTED_COMMITMENT"
      : breaches.length > 0
        ? "REQUESTED_AMENDMENT"
        : "REJECTED";
  const memory: ActorNegotiationMemory = {
    id: `negotiation:${actorId}:${proposal.version}:${actor.negotiationMemory.length + 1}`,
    proposalId: proposal.proposalId,
    proposalVersion: proposal.version,
    counterpartyId: administrationId,
    outcome,
    communicatedConditionDimensionId: breaches[0]?.dimensionId ?? null,
  };
  const commitment: PoliticalCommitment | null = revises && priorCommitment !== undefined
    ? {
        ...priorCommitment,
        negotiatedTerms: { ...priorCommitment.negotiatedTerms, ...offer.terms },
        conditions: [...priorCommitment.conditions, ...offer.conditions],
        effectiveFromEvent: memory.id,
      }
    : accepts && priorCommitment === undefined
      ? {
        id: `${seed.recordIds.commitmentPrefix}${political.commitments.length + 1}`,
        participantIds: [actorId, administrationId],
        proposalId: proposal.proposalId,
        proposalVersion: proposal.version,
        objective: offer.objective,
        negotiatedTerms: offer.terms,
        conditions: offer.conditions,
        effectiveFromEvent: memory.id,
        effectiveUntilEvent: null,
        visibility: seed.negotiation.commitmentVisibility,
        status: "ACTIVE",
        }
      : null;
  let next: PoliticalState = {
    ...political,
    commitments:
      commitment === null
        ? political.commitments
        : revises
          ? political.commitments.map((candidate) => candidate.id === commitment.id ? commitment : candidate)
          : [...political.commitments, commitment],
    actors: political.actors.map((candidate) =>
      candidate.actorId === actorId
        ? {
            ...candidate,
            negotiationMemory: [...candidate.negotiationMemory, memory].slice(
              -seed.negotiation.maximumMemoryEntriesPerActor,
            ),
            commitmentIds:
              commitment === null || candidate.commitmentIds.includes(commitment.id)
                ? candidate.commitmentIds
                : [...candidate.commitmentIds, commitment.id],
          }
        : candidate,
    ),
  };
  next = refreshPoliticalSupport(next, proposal);
  return { political: next, outcome, commitment };
};

export const negotiateWithOrganization = (
  political: PoliticalState,
  organizationId: string,
  proposal: EvaluatedProposalVersion,
): PoliticalState => {
  const organization = political.organizations.find((candidate) => candidate.id === organizationId);
  if (organization === undefined) throw new Error(`Unknown political organization ${organizationId}.`);
  const differences = Object.entries(organization.postureByDimension).filter(
    ([dimensionId, preferred]) => proposal.dimensions[dimensionId] !== preferred,
  );
  return {
    ...political,
    organizations: political.organizations.map((candidate) =>
      candidate.id === organizationId
        ? { ...candidate, negotiationPosture: differences.length === 0 ? "OPEN" : "CONDITIONAL" }
        : candidate,
    ),
  };
};

export interface ActorVoteResolution {
  readonly actor: PoliticalActorState;
  readonly commitment: PoliticalCommitment | null;
  readonly choice: CanonicalVoteChoice;
  readonly reason: string;
}

export interface ActorExtendedDebateResolution {
  readonly actorId: string;
  readonly choice: "THREATEN" | "DECLINE";
  readonly statedReason: string;
}

export const decidePoliticalActorExtendedDebate = (
  political: PoliticalState,
  seed: LegislativeRuntimeSeed,
  actorId: string,
  proposal: EvaluatedProposalVersion,
): ActorExtendedDebateResolution => {
  const actor = political.actors.find((candidate) => candidate.actorId === actorId);
  if (actor === undefined) throw new Error(`Unknown political actor ${actorId}.`);
  const breaches = reservationBreaches(actor, proposal).length;
  const autonomy = deterministicUnit(`${actor.autonomyKey}|${proposal.version}|EXTENDED_DEBATE`);
  const choice = breaches > 0 && autonomy >= seed.decision.extendedDebateThreatCutoff
    ? "THREATEN"
    : "DECLINE";
  return {
    actorId,
    choice,
    statedReason: choice === "THREATEN" ? "actor-owned reservation supports extended debate" : "actor declined extended debate",
  };
};

export const decideExecutiveDeputyTieBreak = (
  seed: LegislativeRuntimeSeed,
  actorId: string,
  proposal: EvaluatedProposalVersion,
): "YEA" | "NAY" =>
  deterministicUnit(`${seed.profileScaffold.seed}|${actorId}|${proposal.proposalId}|${proposal.version}|TIE_BREAK`) >=
    seed.decision.tieBreakerYeaCutoff
    ? "YEA"
    : "NAY";

/**
 * Actor-specific decision tree. No projected posture or single support number
 * owns the vote: reservations, exact-version commitment, organization record,
 * procedural kind, and deterministic autonomy are considered independently.
 */
export const decidePoliticalActorVote = (
  political: PoliticalState,
  seed: LegislativeRuntimeSeed,
  actorId: string,
  proposal: EvaluatedProposalVersion,
  opportunityId: string,
  kind: LegislativeDecisionKind,
): ActorVoteResolution => {
  const actor = political.actors.find((candidate) => candidate.actorId === actorId);
  if (actor === undefined) throw new Error(`Unknown political actor ${actorId}.`);
  const commitment = activeCommitmentFor(political, actorId, proposal);
  const breaches = reservationBreaches(actor, proposal);
  const organization = organizationForActor(political, actor);
  const pressure = organization === undefined ? 0 : actor.pressureByOrganizationId[organization.id] ?? 0;
  const autonomy = deterministicUnit(`${actor.autonomyKey}|${proposal.version}|${kind}`);
  let choice: CanonicalVoteChoice;
  let reason: string;

  if (kind === "CLOTURE") {
    choice = breaches.length <= 1 && autonomy + Math.max(0, pressure) >= seed.decision.commitmentHonorCutoff
      ? "YEA"
      : "NAY";
    reason = choice === "YEA" ? "procedure should reach a decision" : "extended debate reservation";
  } else if (commitment?.objective === "SUPPORT") {
    const breach =
      breaches.length > 0 &&
      actor.commitmentBreachWillingness >= seed.decision.breachCutoff &&
      actor.commitmentHonorWillingness < seed.decision.commitmentHonorCutoff;
    choice = breach ? "NAY" : "YEA";
    reason = breach ? "private reservation outweighed exact-version commitment" : "honored exact-version commitment";
  } else if (breaches.length === 0) {
    choice = "YEA";
    reason = "proposal satisfies actor reservations";
  } else if (breaches.length === 1 && pressure > 0 && autonomy >= seed.decision.commitmentHonorCutoff) {
    choice = "YEA";
    reason = "coordination pressure outweighed one reservation";
  } else {
    choice = "NAY";
    reason = "actor-owned proposal reservation";
  }

  return {
    actor: {
      ...actor,
      lastDecision: {
        proposalId: proposal.proposalId,
        proposalVersion: proposal.version,
        opportunityId,
        kind,
        choice,
        statedReason: reason,
      },
    },
    commitment,
    choice,
    reason,
  };
};

export const applyActorVoteResolution = (
  political: PoliticalState,
  resolution: ActorVoteResolution,
): PoliticalState => ({
  ...political,
  actors: political.actors.map((actor) =>
    actor.actorId === resolution.actor.actorId ? resolution.actor : actor,
  ),
  commitments:
    resolution.commitment === null
      ? political.commitments
      : political.commitments.map((commitment) =>
          commitment.id === resolution.commitment?.id
            ? {
                ...commitment,
                status:
                  resolution.choice === "YEA" && commitment.objective === "SUPPORT"
                    ? "FULFILLED"
                    : "BREACHED",
              }
            : commitment,
        ),
});
