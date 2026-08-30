import { POP0_V0_OPERATING_CONFIGURATION } from "../content/pop0-v0/configuration";
import {
  advancePresidentialOperatingRuntimeTime,
  assertPresidentialOperatingRuntimeState,
  copyPresidentialOperatingRuntimeState,
  createPresidentialOperatingRuntimeState,
  type PresidentialOperatingRuntimeConfiguration,
  type PresidentialOperatingRuntimeState,
} from "../sim/presidential-operating-runtime";
import {
  deriveOfficeInformationView,
  type OfficeInformationView,
  type PresidentialAdministrationOwnerStates,
} from "../sim/presidential-office-information";
import {
  admitSubstantiveOfficeReceipt,
  attemptOfficeRetrieval,
  authorOfficeAssessment,
  authorOfficeSynthesis,
  createInformationIndexEntry,
  createOfficeWorkAssignment,
  deliverOfficeMetadataNotice,
  recordInstitutionPossession,
  recordPresidentialPresentation,
  reorderOfficeQueue,
  transferOfficeArtifact,
  transitionOfficeWorkAssignment,
  type AdmitSubstantiveOfficeReceiptInput,
  type AttemptOfficeRetrievalInput,
  type AuthorOfficeAssessmentInput,
  type AuthorOfficeSynthesisInput,
  type CreateInformationIndexEntryInput,
  type CreateOfficeWorkAssignmentInput,
  type DeliverOfficeMetadataNoticeInput,
  type RecordInstitutionPossessionInput,
  type RecordPresidentialPresentationInput,
  type TransferOfficeArtifactInput,
  type TransitionOfficeWorkAssignmentInput,
} from "../sim/presidential-office-information-operations";
import {
  admitOfficeInstrumentReceipt,
  attemptInstrumentDispatch,
  createAdministrationWorkstream,
  createInstrumentAuthorizedAssignment,
  createPresidentialEscalation,
  deriveAdministrationWorkstreamView,
  derivePresidentialAttention,
  derivePresidentialHistoryView,
  recordEscalationLifecycle,
  recordEscalationPresentation,
  recordPresidentialDecision,
  recordRecipientDisposition,
  recordReservedReviewLifecycle,
  transitionAdministrationWorkstream,
  type AdministrationWorkstreamView,
  type AdmitOfficeInstrumentReceiptInput,
  type AttemptInstrumentDispatchInput,
  type CreateAdministrationWorkstreamInput,
  type CreateInstrumentAuthorizedAssignmentInput,
  type CreatePresidentialEscalationInput,
  type PresidentialAttentionItem,
  type PresidentialControlBindingState,
  type PresidentialHistoryViewEntry,
  type PresidentialInterventionState,
  type RecordEscalationLifecycleInput,
  type RecordEscalationPresentationInput,
  type RecordPresidentialDecisionInput,
  type RecordRecipientDispositionInput,
  type RecordReservedReviewLifecycleInput,
  type TransitionAdministrationWorkstreamInput,
} from "../sim/presidential-operating-intervention";
import {
  parsePresidentialOperatingSave,
  serializePresidentialOperatingSave,
} from "./presidential-operating-persistence";
import {
  reconcileAdministrationControlBinding,
  type AdministrationControlBinding,
} from "./control-binding";

export type PresidentialOperatingControlBinding = AdministrationControlBinding<
  string,
  "PRESIDENTIAL_OPERATING_DECISION_SURFACE"
>;

export interface PresidentialOperatingProofSession {
  getOperatingState(): PresidentialOperatingRuntimeState;
  getOfficeInformation(officeId: string): OfficeInformationView;
  advanceTo(target: string): void;
  createOfficeAssignment(input: CreateOfficeWorkAssignmentInput): void;
  transitionOfficeAssignment(input: TransitionOfficeWorkAssignmentInput): void;
  reorderOfficeQueue(officeId: string, orderedAssignmentIds: readonly string[]): void;
  recordInstitutionPossession(input: RecordInstitutionPossessionInput): void;
  createInformationIndex(input: CreateInformationIndexEntryInput): void;
  deliverMetadataNotice(input: DeliverOfficeMetadataNoticeInput): void;
  attemptRetrieval(input: AttemptOfficeRetrievalInput): void;
  admitSubstantiveReceipt(input: AdmitSubstantiveOfficeReceiptInput): void;
  authorAssessment(input: AuthorOfficeAssessmentInput): void;
  transferOfficeArtifact(input: TransferOfficeArtifactInput): void;
  authorSynthesis(input: AuthorOfficeSynthesisInput): void;
  recordPresidentialPresentation(input: RecordPresidentialPresentationInput): void;
  getControlBinding(): PresidentialOperatingControlBinding;
  getPresidentialAttention(): readonly PresidentialAttentionItem[];
  getAdministrationWorkstream(workstreamId: string): AdministrationWorkstreamView;
  getPresidentialHistory(): readonly PresidentialHistoryViewEntry[];
  reconcilePresidentialControl(): void;
  createAdministrationWorkstream(input: CreateAdministrationWorkstreamInput): void;
  transitionAdministrationWorkstream(input: TransitionAdministrationWorkstreamInput): void;
  createPresidentialEscalation(input: CreatePresidentialEscalationInput): void;
  recordEscalationPresentation(input: RecordEscalationPresentationInput): void;
  recordPresidentialDecision(input: RecordPresidentialDecisionInput): void;
  recordEscalationLifecycle(input: RecordEscalationLifecycleInput): void;
  recordReservedReviewLifecycle(input: RecordReservedReviewLifecycleInput): void;
  attemptInstrumentDispatch(input: AttemptInstrumentDispatchInput): void;
  admitOfficeInstrumentReceipt(input: AdmitOfficeInstrumentReceiptInput): void;
  recordRecipientDisposition(input: RecordRecipientDispositionInput): void;
  createInstrumentAuthorizedAssignment(input: CreateInstrumentAuthorizedAssignmentInput): void;
  save(): string;
}

class PresidentialOperatingProofSessionImpl implements PresidentialOperatingProofSession {
  readonly #configuration: PresidentialOperatingRuntimeConfiguration;
  #state: PresidentialOperatingRuntimeState;
  #controlBinding: PresidentialOperatingControlBinding;

  constructor(
    configuration: PresidentialOperatingRuntimeConfiguration,
    state: PresidentialOperatingRuntimeState,
    controlBinding: PresidentialOperatingControlBinding,
  ) {
    this.#configuration = configuration;
    this.#state = copyPresidentialOperatingRuntimeState(state);
    this.#controlBinding = { ...controlBinding };
  }

  getOperatingState(): PresidentialOperatingRuntimeState {
    return copyPresidentialOperatingRuntimeState(this.#state);
  }

  getOfficeInformation(officeId: string): OfficeInformationView {
    return deriveOfficeInformationView(
      this.#state.ownerStates,
      this.#configuration.administration,
      officeId,
    );
  }

  advanceTo(target: string): void {
    this.#state = advancePresidentialOperatingRuntimeTime(this.#state, this.#configuration, target);
  }

  #applyAdministration(next: PresidentialAdministrationOwnerStates): void {
    this.#state = {
      ...this.#state,
      ownerStates: {
        ...this.#state.ownerStates,
        ...next,
      },
    };
    this.#assertWholeState();
  }

  #assertWholeState(): void {
    // Runtime assertion includes I2 and I3 cross-owner closure. Kept private so
    // the full canonical graph cannot become a player-facing input surface.
    assertPresidentialOperatingRuntimeState(this.#state, this.#configuration);
  }

  #operate(
    operation: (
      state: PresidentialAdministrationOwnerStates,
      configuration: PresidentialOperatingRuntimeConfiguration["administration"],
      epoch: string,
      current: string,
    ) => PresidentialAdministrationOwnerStates,
  ): void {
    this.#applyAdministration(operation(
      this.#state.ownerStates,
      this.#configuration.administration,
      this.#configuration.calendar.epoch,
      this.#state.ownerStates.calendar.state.current,
    ));
  }

  createOfficeAssignment(input: CreateOfficeWorkAssignmentInput): void {
    this.#operate((state, configuration, epoch, current) =>
      createOfficeWorkAssignment(state, configuration, epoch, current, input));
  }

  transitionOfficeAssignment(input: TransitionOfficeWorkAssignmentInput): void {
    this.#operate((state, configuration, epoch, current) =>
      transitionOfficeWorkAssignment(state, configuration, epoch, current, input));
  }

  reorderOfficeQueue(officeId: string, orderedAssignmentIds: readonly string[]): void {
    this.#operate((state, configuration, epoch, current) =>
      reorderOfficeQueue(state, configuration, epoch, current, officeId, orderedAssignmentIds));
  }

  recordInstitutionPossession(input: RecordInstitutionPossessionInput): void {
    this.#operate((state, configuration, epoch, current) =>
      recordInstitutionPossession(state, configuration, epoch, current, input));
  }

  createInformationIndex(input: CreateInformationIndexEntryInput): void {
    this.#operate((state, configuration, epoch, current) =>
      createInformationIndexEntry(state, configuration, epoch, current, input));
  }

  deliverMetadataNotice(input: DeliverOfficeMetadataNoticeInput): void {
    this.#operate((state, configuration, epoch, current) =>
      deliverOfficeMetadataNotice(state, configuration, epoch, current, input));
  }

  attemptRetrieval(input: AttemptOfficeRetrievalInput): void {
    this.#operate((state, configuration, epoch, current) =>
      attemptOfficeRetrieval(state, configuration, epoch, current, input));
  }

  admitSubstantiveReceipt(input: AdmitSubstantiveOfficeReceiptInput): void {
    this.#operate((state, configuration, epoch, current) =>
      admitSubstantiveOfficeReceipt(state, configuration, epoch, current, input));
  }

  authorAssessment(input: AuthorOfficeAssessmentInput): void {
    this.#operate((state, configuration, epoch, current) =>
      authorOfficeAssessment(state, configuration, epoch, current, input));
  }

  transferOfficeArtifact(input: TransferOfficeArtifactInput): void {
    this.#operate((state, configuration, epoch, current) =>
      transferOfficeArtifact(state, configuration, epoch, current, input));
  }

  authorSynthesis(input: AuthorOfficeSynthesisInput): void {
    this.#operate((state, configuration, epoch, current) =>
      authorOfficeSynthesis(state, configuration, epoch, current, input));
  }

  recordPresidentialPresentation(input: RecordPresidentialPresentationInput): void {
    this.#operate((state, configuration, epoch, current) =>
      recordPresidentialPresentation(state, configuration, epoch, current, input));
  }

  getControlBinding(): PresidentialOperatingControlBinding {
    return { ...this.#controlBinding };
  }

  getPresidentialAttention(): readonly PresidentialAttentionItem[] {
    return derivePresidentialAttention({
      current: this.#state.ownerStates.calendar.state.current,
      escalationState: this.#state.ownerStates.presidentialEscalations.state,
      presentations: this.#state.ownerStates.presidentialPresentations.state,
      decisions: this.#state.ownerStates.presidentialDecisions.state,
    });
  }

  getAdministrationWorkstream(workstreamId: string): AdministrationWorkstreamView {
    const workstream = this.#state.ownerStates.administrationWorkstreams.state.workstreams.find(
      (entry) => entry.id === workstreamId,
    );
    if (workstream === undefined) throw new Error(`Unknown administration workstream ${workstreamId}.`);
    return deriveAdministrationWorkstreamView({
      workstream,
      transitions: this.#state.ownerStates.administrationWorkstreams.state.transitions,
    });
  }

  getPresidentialHistory(): readonly PresidentialHistoryViewEntry[] {
    return derivePresidentialHistoryView({
      entries: this.#state.ownerStates.historicalRecordIndex.state.entries,
      decisionIds: this.#state.ownerStates.presidentialDecisions.state.map((entry) => entry.id),
      instrumentIds: this.#state.ownerStates.presidentialInstruments.state.map((entry) => entry.id),
    });
  }

  reconcilePresidentialControl(): void {
    const recipient = this.#state.ownerStates.administrationDirectory.state.presidentialRecipientBinding;
    this.#controlBinding = reconcileAdministrationControlBinding(this.#controlBinding, {
      officeId: recipient.constitutionalOfficeId,
      actorId: recipient.actorId,
      effectiveAt: this.#state.ownerStates.calendar.state.current,
    });
  }

  #operateIntervention(
    operation: (
      state: PresidentialOperatingRuntimeState["ownerStates"],
      administration: PresidentialOperatingRuntimeConfiguration["administration"],
      intervention: PresidentialOperatingRuntimeConfiguration["intervention"],
      epoch: string,
      current: string,
    ) => PresidentialInterventionState,
  ): void {
    const updated = operation(
      this.#state.ownerStates,
      this.#configuration.administration,
      this.#configuration.intervention,
      this.#configuration.calendar.epoch,
      this.#state.ownerStates.calendar.state.current,
    );
    this.#state = {
      ...this.#state,
      ownerStates: {
        ...this.#state.ownerStates,
        ...updated,
      },
    };
    this.#assertWholeState();
  }

  createAdministrationWorkstream(input: CreateAdministrationWorkstreamInput): void {
    this.#operateIntervention((state, administration, intervention, epoch, current) =>
      createAdministrationWorkstream(state, administration, intervention, epoch, current, input));
  }

  transitionAdministrationWorkstream(input: TransitionAdministrationWorkstreamInput): void {
    this.#operateIntervention((state, administration, intervention, epoch, current) =>
      transitionAdministrationWorkstream(state, administration, intervention, epoch, current, input));
  }

  createPresidentialEscalation(input: CreatePresidentialEscalationInput): void {
    this.#operateIntervention((state, administration, intervention, epoch, current) =>
      createPresidentialEscalation(state, administration, intervention, epoch, current, input));
  }

  recordEscalationPresentation(input: RecordEscalationPresentationInput): void {
    this.#operateIntervention((state, administration, intervention, epoch, current) =>
      recordEscalationPresentation(state, administration, intervention, epoch, current, input));
  }

  recordPresidentialDecision(input: RecordPresidentialDecisionInput): void {
    this.#operateIntervention((state, administration, intervention, epoch, current) =>
      recordPresidentialDecision(
        state,
        administration,
        intervention,
        epoch,
        current,
        this.#controlBinding as PresidentialControlBindingState,
        input,
      ));
  }

  recordEscalationLifecycle(input: RecordEscalationLifecycleInput): void {
    this.#operateIntervention((state, administration, intervention, epoch, current) =>
      recordEscalationLifecycle(state, administration, intervention, epoch, current, input));
  }

  recordReservedReviewLifecycle(input: RecordReservedReviewLifecycleInput): void {
    this.#operateIntervention((state, administration, intervention, epoch, current) =>
      recordReservedReviewLifecycle(state, administration, intervention, epoch, current, input));
  }

  attemptInstrumentDispatch(input: AttemptInstrumentDispatchInput): void {
    this.#operateIntervention((state, administration, intervention, epoch, current) =>
      attemptInstrumentDispatch(state, administration, intervention, epoch, current, input));
  }

  admitOfficeInstrumentReceipt(input: AdmitOfficeInstrumentReceiptInput): void {
    this.#operateIntervention((state, administration, intervention, epoch, current) =>
      admitOfficeInstrumentReceipt(state, administration, intervention, epoch, current, input));
  }

  recordRecipientDisposition(input: RecordRecipientDispositionInput): void {
    this.#operateIntervention((state, administration, intervention, epoch, current) =>
      recordRecipientDisposition(state, administration, intervention, epoch, current, input));
  }

  createInstrumentAuthorizedAssignment(input: CreateInstrumentAuthorizedAssignmentInput): void {
    this.#operateIntervention((state, administration, intervention, epoch, current) =>
      createInstrumentAuthorizedAssignment(state, administration, intervention, epoch, current, input));
  }

  save(): string {
    return serializePresidentialOperatingSave(
      this.#state,
      this.#configuration,
      this.#controlBinding,
    );
  }
}

const createInitialControlBinding = (
  configuration: PresidentialOperatingRuntimeConfiguration,
): PresidentialOperatingControlBinding => ({
  id: configuration.intervention.controlBinding.id,
  decisionSurface: configuration.intervention.controlBinding.decisionSurface,
  executiveOfficeId: configuration.administration.presidentialRecipientBinding.constitutionalOfficeId,
  boundOfficeholderActorId: configuration.administration.presidentialRecipientBinding.actorId,
  status: "ACTIVE",
  endedAt: null,
  endReason: null,
});

export const createPresidentialOperatingProofSession = (
  serializedSave?: string,
  configuration: PresidentialOperatingRuntimeConfiguration = POP0_V0_OPERATING_CONFIGURATION,
): PresidentialOperatingProofSession => {
  if (serializedSave === undefined) {
    return new PresidentialOperatingProofSessionImpl(
      configuration,
      createPresidentialOperatingRuntimeState(configuration),
      createInitialControlBinding(configuration),
    );
  }
  const restored = parsePresidentialOperatingSave(serializedSave, configuration);
  return new PresidentialOperatingProofSessionImpl(
    configuration,
    restored.operatingState,
    restored.session.controlBinding,
  );
};
