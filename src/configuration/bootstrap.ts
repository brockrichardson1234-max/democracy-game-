import { createWorldFromConfiguration, type WorldSeed, type WorldState } from "../sim/world";
import { loadGovernmentConfiguration } from "./loader";
import type {
  GovernmentConfiguration,
  LoadedGovernmentConfiguration,
} from "./types";

export interface GovernmentBootstrap {
  readonly configuration: LoadedGovernmentConfiguration<unknown>;
  readonly world: WorldState | null;
  readonly playable: boolean;
}

export const bootstrapGovernmentConfiguration = (
  configuration: GovernmentConfiguration<unknown>,
): GovernmentBootstrap => {
  const loaded = loadGovernmentConfiguration(configuration);
  if (loaded.capability === "STRUCTURAL_PROOF_ONLY") {
    return { configuration: loaded, world: null, playable: false };
  }
  const world = createWorldFromConfiguration(
    loaded as LoadedGovernmentConfiguration<WorldSeed>,
  );
  return { configuration: loaded, world, playable: true };
};
