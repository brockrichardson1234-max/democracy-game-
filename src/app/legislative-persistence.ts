import { assertConfigurationIdentityCompatible } from "../configuration/loader";
import type { ConfigurationIdentity } from "../configuration/types";
import type { LegislativeRuntimeState } from "../sim/legislative-runtime";
import type { LegislativeControlBinding } from "./legislative-session";

export const LEGISLATIVE_SAVE_FORMAT_VERSION = 2 as const;

interface LegislativeSaveEnvelope {
  readonly formatVersion: typeof LEGISLATIVE_SAVE_FORMAT_VERSION;
  readonly configuration: ConfigurationIdentity;
  readonly legislativeRuntime: LegislativeRuntimeState;
  readonly controlBinding: LegislativeControlBinding;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export const serializeLegislativeRuntime = (
  state: LegislativeRuntimeState,
  controlBinding: LegislativeControlBinding,
): string =>
  JSON.stringify({
    formatVersion: LEGISLATIVE_SAVE_FORMAT_VERSION,
    configuration: state.configuration,
    legislativeRuntime: state,
    controlBinding,
  } satisfies LegislativeSaveEnvelope);

export const parseLegislativeRuntime = (
  serialized: string,
  expectedConfiguration: ConfigurationIdentity,
): { readonly state: LegislativeRuntimeState; readonly controlBinding: LegislativeControlBinding } => {
  let parsed: unknown;
  try {
    parsed = JSON.parse(serialized) as unknown;
  } catch {
    throw new Error("Invalid legislative save: serialized data is not valid JSON.");
  }
  if (!isRecord(parsed) || parsed.formatVersion !== LEGISLATIVE_SAVE_FORMAT_VERSION) {
    throw new Error("Unsupported legislative save format version.");
  }
  if (!isRecord(parsed.configuration) || !isRecord(parsed.legislativeRuntime) || !isRecord(parsed.controlBinding)) {
    throw new Error("Invalid legislative save envelope.");
  }
  const configuration = parsed.configuration as unknown as ConfigurationIdentity;
  assertConfigurationIdentityCompatible(expectedConfiguration, configuration);
  const state = parsed.legislativeRuntime as unknown as LegislativeRuntimeState;
  const controlBinding = parsed.controlBinding as unknown as LegislativeControlBinding;
  assertConfigurationIdentityCompatible(configuration, state.configuration);
  if (
    !Number.isInteger(state.schemaVersion) ||
    !Array.isArray(state.activeAssignments) ||
    !Array.isArray(state.agenda?.versions) ||
    !Array.isArray(state.political?.actors) ||
    !Array.isArray(state.political?.organizations) ||
    !Array.isArray(state.political?.commitments) ||
    !Array.isArray(state.procedure?.voteOpportunities) ||
    !Array.isArray(state.procedure?.extendedDebateDecisionOpportunities) ||
    !Array.isArray(state.enactedLegalSources)
  ) throw new Error("Invalid legislative save canonical state shape.");
  const assignmentIds = new Set(state.activeAssignments.map((assignment) => assignment.id));
  const assignmentOfficeIds = new Set(state.activeAssignments.map((assignment) => assignment.officeId));
  const assignmentActorIds = new Set(state.activeAssignments.map((assignment) => assignment.actorId));
  if (
    assignmentIds.size !== state.activeAssignments.length ||
    assignmentOfficeIds.size !== state.activeAssignments.length ||
    assignmentActorIds.size !== state.activeAssignments.length
  ) throw new Error("Invalid legislative save active-assignment ownership.");
  for (const assignment of state.activeAssignments) {
    if (
      !isRecord(assignment) ||
      typeof assignment.id !== "string" ||
      typeof assignment.officeId !== "string" ||
      typeof assignment.actorId !== "string" ||
      typeof assignment.effectiveFrom !== "string" ||
      !Number.isFinite(Date.parse(assignment.effectiveFrom)) ||
      (assignment.effectiveUntil !== null &&
        (typeof assignment.effectiveUntil !== "string" ||
          Date.parse(assignment.effectiveUntil) <= Date.parse(assignment.effectiveFrom)))
    ) throw new Error("Invalid legislative save active-assignment record.");
  }
  for (const organization of state.political.organizations) {
    if (!Array.isArray(organization.memberships)) throw new Error("Invalid legislative save organization memberships.");
    for (const membership of organization.memberships) {
      if (!state.activeAssignments.some(
        (assignment) =>
          assignment.id === membership.assignmentId &&
          assignment.officeId === membership.officeId &&
          assignment.actorId === membership.actorId,
      )) throw new Error("Invalid legislative save organization-to-assignment reference.");
    }
  }
  if (
    typeof controlBinding.id !== "string" ||
    controlBinding.decisionSurface !== "EXECUTIVE_ADMINISTRATION_LEGISLATIVE_SURFACE" ||
    typeof controlBinding.executiveOfficeId !== "string" ||
    typeof controlBinding.boundOfficeholderActorId !== "string" ||
    (controlBinding.status !== "ACTIVE" && controlBinding.status !== "ENDED")
  ) throw new Error("Invalid legislative save ControlBinding.");
  const presentment = state.procedure.presentment;
  if (
    presentment !== null &&
    (!Number.isFinite(Date.parse(presentment.presentedAt)) ||
      !Number.isFinite(Date.parse(presentment.resolutionNotBefore)) ||
      Date.parse(presentment.resolutionNotBefore) <= Date.parse(presentment.presentedAt))
  ) throw new Error("Invalid legislative save presentment timing state.");
  return { state, controlBinding };
};
