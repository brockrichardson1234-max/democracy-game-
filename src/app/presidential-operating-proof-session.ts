import { POP0_V0_OPERATING_CONFIGURATION } from "../content/pop0-v0/configuration";
import {
  advancePresidentialOperatingRuntimeTime,
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
  parsePresidentialOperatingSave,
  serializePresidentialOperatingSave,
} from "./presidential-operating-persistence";

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
  save(): string;
}

class PresidentialOperatingProofSessionImpl implements PresidentialOperatingProofSession {
  readonly #configuration: PresidentialOperatingRuntimeConfiguration;
  #state: PresidentialOperatingRuntimeState;

  constructor(
    configuration: PresidentialOperatingRuntimeConfiguration,
    state: PresidentialOperatingRuntimeState,
  ) {
    this.#configuration = configuration;
    this.#state = copyPresidentialOperatingRuntimeState(state);
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

  save(): string {
    return serializePresidentialOperatingSave(this.#state, this.#configuration);
  }
}

export const createPresidentialOperatingProofSession = (
  serializedSave?: string,
  configuration: PresidentialOperatingRuntimeConfiguration = POP0_V0_OPERATING_CONFIGURATION,
): PresidentialOperatingProofSession => new PresidentialOperatingProofSessionImpl(
  configuration,
  serializedSave === undefined
    ? createPresidentialOperatingRuntimeState(configuration)
    : parsePresidentialOperatingSave(serializedSave, configuration),
);
