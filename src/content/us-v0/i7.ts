import type { IntegratedRuntimeArtifactBundle } from "../../sim/integrated-runtime";

import { US_V0_I6_RUNTIME_ARTIFACTS } from "./i6";
import { US_V0_I7_INITIALIZATION_SEED } from "./i7-owner-content";

export { US_V0_I6_IMPLEMENTATION_CONFIGURATION } from "./i6";
export * from "./i7-owner-content";

export const US_V0_I7_RUNTIME_ARTIFACTS = {
  ...US_V0_I6_RUNTIME_ARTIFACTS,
  housingInitialization: US_V0_I7_INITIALIZATION_SEED,
} as unknown as IntegratedRuntimeArtifactBundle;
