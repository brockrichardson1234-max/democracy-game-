import { createWorldFromConfiguration, type WorldSeed, type WorldState } from "../sim/world";
import {
  createLegislativeRuntimeState,
  type LegislativeRuntimeState,
} from "../sim/legislative-runtime";
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
}

export const bootstrapGovernmentConfiguration = (
  configuration: GovernmentConfiguration<unknown>,
): GovernmentBootstrap => {
  const loaded = loadGovernmentConfiguration(configuration);
  if (loaded.capability === "STRUCTURAL_PROOF_ONLY") {
    return {
      configuration: loaded,
      world: null,
      playable: false,
      legislativeRuntime: null,
      legislativeRuntimeAvailable: false,
    };
  }
  if (loaded.capability === "LEGISLATIVE_RUNTIME_SLICE") {
    const seed = loaded.runtimeSeed as LegislativeRuntimeSeed;
    return {
      configuration: loaded,
      world: null,
      playable: false,
      legislativeRuntime: createLegislativeRuntimeState(loaded.identity, {
        structure: loaded.structure,
        seed,
      }),
      legislativeRuntimeAvailable: true,
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
  };
};
