import { createWorldFromConfiguration, type WorldSeed, type WorldState } from "../sim/world";
import {
  createLegislativeRuntimeState,
  type LegislativeRuntimeState,
} from "../sim/legislative-runtime";
import {
  createIntegratedPartialRuntimeState,
  type IntegratedPartialRuntimeState,
  type IntegratedRuntimeArtifactBundle,
} from "../sim/integrated-runtime";
import { loadGovernmentConfiguration } from "./loader";
import type {
  GovernmentConfiguration,
  LegislativeRuntimeSeed,
  LoadedGovernmentConfiguration,
} from "./types";

export interface GovernmentBootstrap {
  readonly configuration: LoadedGovernmentConfiguration<unknown>;
  readonly world: WorldState | null;
  readonly playable: boolean;
  readonly legislativeRuntime: LegislativeRuntimeState | null;
  readonly legislativeRuntimeAvailable: boolean;
  readonly integratedRuntime: IntegratedPartialRuntimeState | null;
  readonly integratedRuntimeAvailable: boolean;
}

export const bootstrapGovernmentConfiguration = (
  configuration: GovernmentConfiguration<unknown>,
  artifacts?: IntegratedRuntimeArtifactBundle,
): GovernmentBootstrap => {
  const loaded = loadGovernmentConfiguration(configuration);
  if (loaded.capability === "STRUCTURAL_PROOF_ONLY") {
    return {
      configuration: loaded,
      world: null,
      playable: false,
      legislativeRuntime: null,
      legislativeRuntimeAvailable: false,
      integratedRuntime: null,
      integratedRuntimeAvailable: false,
    };
  }
  if (
    loaded.capability === "LEGISLATIVE_RUNTIME_SLICE" ||
    loaded.capability === "INTEGRATED_PARTIAL_RUNTIME"
  ) {
    const seed = loaded.runtimeSeed as LegislativeRuntimeSeed;
    const integratedRuntime = loaded.capability === "INTEGRATED_PARTIAL_RUNTIME" && artifacts !== undefined
      ? createIntegratedPartialRuntimeState(
          loaded as GovernmentConfiguration<LegislativeRuntimeSeed>,
          artifacts,
        )
      : null;
    return {
      configuration: loaded,
      world: null,
      playable: false,
      legislativeRuntime: integratedRuntime?.legislative ?? createLegislativeRuntimeState(loaded.identity, {
          structure: loaded.structure,
          seed,
        }),
      legislativeRuntimeAvailable: true,
      integratedRuntime,
      integratedRuntimeAvailable: integratedRuntime !== null,
    };
  }
  const world = createWorldFromConfiguration(
    loaded as LoadedGovernmentConfiguration<WorldSeed>,
  );
  return {
    configuration: loaded,
    world,
    playable: true,
    legislativeRuntime: null,
    legislativeRuntimeAvailable: false,
    integratedRuntime: null,
    integratedRuntimeAvailable: false,
  };
};
