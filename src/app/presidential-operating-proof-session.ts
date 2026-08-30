import { POP0_V0_OPERATING_CONFIGURATION } from "../content/pop0-v0/configuration";
import {
  copyPresidentialOperatingRuntimeState,
  createPresidentialOperatingRuntimeState,
  type PresidentialOperatingRuntimeConfiguration,
  type PresidentialOperatingRuntimeState,
} from "../sim/presidential-operating-runtime";
import {
  parsePresidentialOperatingSave,
  serializePresidentialOperatingSave,
} from "./presidential-operating-persistence";

export interface PresidentialOperatingProofSession {
  getOperatingState(): PresidentialOperatingRuntimeState;
  save(): string;
}

class PresidentialOperatingProofSessionImpl implements PresidentialOperatingProofSession {
  readonly #configuration: PresidentialOperatingRuntimeConfiguration;
  readonly #state: PresidentialOperatingRuntimeState;

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
