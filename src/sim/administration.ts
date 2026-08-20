import type { FiscalExecutionState } from "./fiscal";
import type { ParticipationCondition, ReportingRequirement } from "./legislature";
import type { EnactedLaw } from "./proposal";

/**
 * The program is administrative/operational state, not the law: `NOT_
 * ESTABLISHED` is represented by `GovernanceState.housingGrantProgram` being
 * `null` (the same pattern already used for "no proposal yet"), so this
 * status only needs to describe the state a program object actually has
 * once established. GL0 does not require a modeled setup delay, so
 * establishment produces `READY_FOR_APPLICATIONS` directly -- see
 * `establishHousingGrantProgram` in governance.ts for why that single step
 * is still causally distinct from enactment and from fiscal recognition.
 */
export type HousingGrantProgramStatus = "READY_FOR_APPLICATIONS";

/**
 * Federal administrative/program state operating the enacted housing-grant
 * law. Operational terms are read from the enacted law at establishment
 * time and are not an independently mutable copy: this program cannot
 * silently diverge from what the legislature actually passed (see
 * `04_GOVERNMENT_AUTHORITY_AND_PROCEDURE_V0.md` S14 / O-12). `fiscalAuthorityRef`
 * references the recognized fiscal-execution state rather than owning or
 * duplicating its amount.
 */
export interface HousingGrantProgram {
  readonly id: string;
  readonly sourceLawId: string;
  readonly fiscalAuthorityRef: string;
  readonly federalMatchRatePercent: number;
  readonly participationCondition: ParticipationCondition;
  readonly reportingRequirement: ReportingRequirement;
  readonly status: HousingGrantProgramStatus;
}

/**
 * Pure resolver: enacted law + recognized fiscal authority -> operational
 * program state. Does not decide whether establishment is currently
 * permitted -- that precondition belongs to the governance transition that
 * calls this.
 */
export const establishHousingGrantProgramFromLaw = (
  law: EnactedLaw,
  fiscal: FiscalExecutionState,
): HousingGrantProgram => ({
  id: `gl0-program-for-${law.id}`,
  sourceLawId: law.id,
  fiscalAuthorityRef: fiscal.sourceLawId,
  federalMatchRatePercent: law.enactedTerms.federalMatchRatePercent,
  participationCondition: law.enactedTerms.participationCondition,
  reportingRequirement: law.enactedTerms.reportingRequirement,
  status: "READY_FOR_APPLICATIONS",
});
