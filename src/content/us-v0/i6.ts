import type { IntegratedRuntimeArtifactBundle } from "../../sim/integrated-runtime";

import { US_V0_I4_RUNTIME_ARTIFACTS } from "./i4";
import { US_V0_I6_INITIALIZATION_SEED } from "./i6-owner-content";

export * from "./i6-owner-content";

/** One offline bundle composes accepted I4 initialization with authenticated I6 seeds. */
export const US_V0_I6_RUNTIME_ARTIFACTS = {
  ...US_V0_I4_RUNTIME_ARTIFACTS,
  programInitialization: US_V0_I6_INITIALIZATION_SEED,
} as unknown as IntegratedRuntimeArtifactBundle;
