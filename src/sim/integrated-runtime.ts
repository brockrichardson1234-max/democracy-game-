import type {
  ConfigurationIdentity,
  GovernmentConfiguration,
  IntegratedRuntimeConfiguration,
  LegislativeRuntimeSeed,
  RuntimeArtifactBinding,
} from "../configuration/types";
import { createLegislativeRuntimeState, type LegislativeRuntimeState } from "./legislative-runtime";
import {
  assertWeightedPopulationConservation,
  type EligibilityProxyControl,
  type ResidentPopulationControl,
  type WeightedPopulationCohort,
  type WeightedPopulationState,
} from "./population-core";
import {
  createInstitutionalRuntimeState,
  type InstitutionalRuntimeState,
} from "./institutional-runtime";
import {
  createProgramImplementationState,
  type ProgramInitializationSeed,
  type ProgramImplementationState,
} from "./program-implementation";
import {
  createIntegratedMaterialHousingState,
  type IntegratedMaterialHousingState,
  type MaterialHousingInitializationSeed,
} from "./housing";
import {
  createIntegratedInformationRuntimeState,
  type IntegratedInformationRuntimeState,
} from "./integrated-information";
import {
  createIntegratedLegalContestRuntimeState,
  type IntegratedLegalContestRuntimeState,
} from "./legal-contest-runtime";

export interface RuntimeArtifactMetadata {
  readonly artifactId: string;
  readonly transformationVersion: string;
  readonly contentSha256: string;
  readonly rawSourceSha256s: readonly string[];
}

export interface PolygonRingsGeometry {
  readonly type: "POLYGON_RINGS";
  readonly bounds: readonly [number, number, number, number];
  readonly rings: readonly (readonly (readonly [number, number])[])[];
}

export interface GeographyFeatureState {
  readonly id: string;
  readonly kind: string;
  readonly parentGeographyId: string | null;
  readonly jurisdictionId?: string;
  readonly sourceFeatureId?: string;
  readonly externalIdentifiers?: Readonly<Record<string, string>>;
  readonly geometry: PolygonRingsGeometry | null;
  readonly sourceArtifactId: string;
  readonly effectiveLabel?: string;
  readonly scenarioLabel?: string;
  readonly label?: string;
  readonly locatorKind?: string;
  readonly supportedAddress?: string;
  readonly precisionLimit?: string;
}

export interface VersionedGeographyState {
  readonly features: readonly GeographyFeatureState[];
  readonly artifactIds: readonly string[];
}

export interface StaticElectoralAllocationUnit {
  readonly id: string;
  readonly geographyId: string;
  readonly electorCount: number;
  readonly role: string;
  readonly electorateProjection: string;
}

export interface StaticElectoralAllocation {
  readonly id: string;
  readonly geographyId: string;
  readonly totalElectors: number;
  readonly method: string;
  readonly units: readonly StaticElectoralAllocationUnit[];
}

export interface StaticElectoralTopologyState {
  readonly applicableElection: number;
  readonly totalElectors: number;
  readonly ordinaryMajority: number;
  readonly allocations: readonly StaticElectoralAllocation[];
  readonly sourceArtifactId: string;
}

export interface GeographyArtifact {
  readonly metadata: RuntimeArtifactMetadata;
  readonly features: readonly GeographyFeatureState[];
}

export interface PopulationControlArtifact {
  readonly metadata: RuntimeArtifactMetadata;
  readonly controls: readonly {
    readonly id: string;
    readonly residenceGeographyId: string;
    readonly residentWeight: number;
    readonly sourceArtifactId: string;
    readonly sourceField: string;
    readonly referenceDate: string;
    readonly classification: string;
  }[];
}

export interface CohortArtifact {
  readonly metadata: RuntimeArtifactMetadata;
  readonly scaffoldVersion: string;
  readonly refinementSemanticVersion: string;
  readonly cohorts: readonly WeightedPopulationCohort[];
}

export interface EligibilityProxyArtifact {
  readonly metadata: RuntimeArtifactMetadata;
  readonly records: readonly {
    readonly id: string;
    readonly residenceGeographyId: string;
    readonly cvapEstimate: number;
    readonly sourcePopulationEstimate: number;
    readonly cvapMoe: number;
    readonly sourcePopulationMoe: number;
    readonly eligibleProxyWeight: number;
    readonly shareNumerator: number;
    readonly shareDenominator: number;
    readonly unroundedRational: string;
    readonly integerizationPolicy: string;
    readonly transformationVersion: string;
    readonly classification: string;
  }[];
}

export interface SourceMeasurementArtifact {
  readonly metadata: RuntimeArtifactMetadata;
  readonly records: readonly unknown[];
}

export interface ElectoralTopologyArtifact {
  readonly metadata: RuntimeArtifactMetadata;
  readonly applicableElection: number;
  readonly totalElectors: number;
  readonly ordinaryMajority: number;
  readonly allocations: readonly StaticElectoralAllocation[];
}

export interface ProgramInitializationArtifact extends ProgramInitializationSeed {
  readonly metadata: RuntimeArtifactMetadata;
}

export interface HousingInitializationArtifact extends MaterialHousingInitializationSeed {
  readonly metadata: RuntimeArtifactMetadata;
}

export interface IntegratedRuntimeArtifactBundle {
  readonly geography: readonly GeographyArtifact[];
  readonly populationControls: PopulationControlArtifact;
  readonly populationMeasurements: readonly SourceMeasurementArtifact[];
  readonly eligibilityProxies: EligibilityProxyArtifact;
  readonly populationCohorts: CohortArtifact;
  readonly electoralTopology: ElectoralTopologyArtifact;
  readonly programInitialization?: ProgramInitializationArtifact;
  readonly housingInitialization?: HousingInitializationArtifact;
}

export interface IntegratedPartialRuntimeState {
  readonly schemaVersion: number;
  readonly configuration: ConfigurationIdentity;
  readonly artifactBindings: readonly RuntimeArtifactBinding[];
  readonly legislative: LegislativeRuntimeState;
  readonly geography: VersionedGeographyState;
  readonly population: WeightedPopulationState;
  readonly electoralTopology: StaticElectoralTopologyState;
  readonly institutional: InstitutionalRuntimeState | null;
  readonly implementation: ProgramImplementationState | null;
  readonly housing: IntegratedMaterialHousingState | null;
  readonly information: IntegratedInformationRuntimeState | null;
  readonly legalContest: IntegratedLegalContestRuntimeState | null;
}

const allArtifacts = (bundle: IntegratedRuntimeArtifactBundle): readonly { readonly metadata: RuntimeArtifactMetadata }[] => [
  ...bundle.geography,
  bundle.populationControls,
  ...bundle.populationMeasurements,
  bundle.eligibilityProxies,
  bundle.populationCohorts,
  bundle.electoralTopology,
  ...(bundle.programInitialization === undefined ? [] : [bundle.programInitialization]),
  ...(bundle.housingInitialization === undefined ? [] : [bundle.housingInitialization]),
];

const assertArtifactBindings = (
  integrated: IntegratedRuntimeConfiguration,
  bundle: IntegratedRuntimeArtifactBundle,
): void => {
  const artifacts = allArtifacts(bundle);
  if (new Set(artifacts.map((artifact) => artifact.metadata.artifactId)).size !== artifacts.length) {
    throw new Error("Integrated runtime artifact bundle contains duplicate artifact identities.");
  }
  if (artifacts.length !== integrated.artifactBindings.length) {
    throw new Error("Integrated runtime artifact bundle does not match its configuration binding set.");
  }
  for (const binding of integrated.artifactBindings) {
    const artifact = artifacts.find((candidate) => candidate.metadata.artifactId === binding.id);
    if (
      artifact === undefined ||
      artifact.metadata.contentSha256 !== binding.contentSha256 ||
      artifact.metadata.transformationVersion !== binding.transformationVersion ||
      JSON.stringify(artifact.metadata.rawSourceSha256s) !== JSON.stringify(binding.rawSourceSha256s)
    ) throw new Error(`Integrated runtime artifact mismatch for ${binding.id}.`);
  }
};

const createGeographyState = (
  integrated: IntegratedRuntimeConfiguration,
  artifacts: readonly GeographyArtifact[],
): VersionedGeographyState => {
  const required = new Set([
    integrated.geography.stateArtifactId,
    integrated.geography.districtArtifactId,
    integrated.geography.projectLocatorArtifactId,
  ]);
  if (artifacts.length !== required.size || artifacts.some((artifact) => !required.has(artifact.metadata.artifactId))) {
    throw new Error("Integrated Geography artifacts do not match configured owners.");
  }
  const features = artifacts.flatMap((artifact) => artifact.features.map((feature) => ({ ...feature })));
  if (new Set(features.map((feature) => feature.id)).size !== features.length) {
    throw new Error("Integrated Geography features require unique identities.");
  }
  const featureIds = new Set(features.map((feature) => feature.id));
  for (const feature of features) {
    if (feature.parentGeographyId !== null && !featureIds.has(feature.parentGeographyId)) {
      throw new Error(`Geography feature ${feature.id} has an unresolved parent reference.`);
    }
    if (feature.geometry !== null) {
      if (feature.geometry.type !== "POLYGON_RINGS" || feature.geometry.rings.length === 0) {
        throw new Error(`Geography feature ${feature.id} has invalid polygon state.`);
      }
    }
  }
  return { features, artifactIds: artifacts.map((artifact) => artifact.metadata.artifactId) };
};

const createPopulationState = (
  integrated: IntegratedRuntimeConfiguration,
  geography: VersionedGeographyState,
  bundle: IntegratedRuntimeArtifactBundle,
): WeightedPopulationState => {
  if (
    bundle.populationControls.metadata.artifactId !== integrated.population.controlArtifactId ||
    bundle.populationCohorts.metadata.artifactId !== integrated.population.cohortArtifactId ||
    bundle.eligibilityProxies.metadata.artifactId !== integrated.population.eligibilityProxyArtifactId ||
    bundle.populationMeasurements.length !== 1 ||
    bundle.populationMeasurements[0].metadata.artifactId !== integrated.population.tenureMeasurementArtifactId ||
    bundle.populationCohorts.scaffoldVersion !== integrated.population.scaffoldVersion ||
    bundle.populationCohorts.refinementSemanticVersion !== integrated.population.refinementSemanticVersion
  ) throw new Error("Integrated Population artifacts do not match configured initialization semantics.");
  const geographyIds = new Set(geography.features.map((feature) => feature.id));
  const controls: readonly ResidentPopulationControl[] = bundle.populationControls.controls.map((control) => ({
    id: control.id,
    residenceGeographyId: control.residenceGeographyId,
    representedWeight: control.residentWeight,
    sourceArtifactId: control.sourceArtifactId,
    sourceField: control.sourceField,
    referenceDate: control.referenceDate,
    classification: control.classification,
  }));
  const eligibilityProxies: readonly EligibilityProxyControl[] = bundle.eligibilityProxies.records.map((record) => ({
    id: record.id,
    residenceGeographyId: record.residenceGeographyId,
    sourceEstimate: record.cvapEstimate,
    sourceDenominator: record.sourcePopulationEstimate,
    sourceEstimateMoe: record.cvapMoe,
    sourceDenominatorMoe: record.sourcePopulationMoe,
    representedWeight: record.eligibleProxyWeight,
    shareNumerator: record.shareNumerator,
    shareDenominator: record.shareDenominator,
    unroundedRational: record.unroundedRational,
    integerizationPolicy: record.integerizationPolicy,
    transformationVersion: record.transformationVersion,
    classification: record.classification,
  }));
  const cohorts = bundle.populationCohorts.cohorts.map((cohort) => ({
    ...cohort,
    materialExposureReferences: [...cohort.materialExposureReferences],
    receivedInformationReferences: [...cohort.receivedInformationReferences],
    politicalState: { ...cohort.politicalState },
    eligibilityProjection: { ...cohort.eligibilityProjection },
    lineage: { ...cohort.lineage },
  }));
  for (const reference of [
    ...controls.map((control) => control.residenceGeographyId),
    ...eligibilityProxies.map((proxy) => proxy.residenceGeographyId),
    ...cohorts.flatMap((cohort) => [cohort.residenceGeographyId, cohort.projectLocatorGeographyId].filter(Boolean) as string[]),
  ]) {
    if (!geographyIds.has(reference)) throw new Error(`Population references unresolved Geography ${reference}.`);
  }
  const state: WeightedPopulationState = {
    controls,
    cohorts,
    eligibilityProxies,
    scaffoldVersion: bundle.populationCohorts.scaffoldVersion,
    refinementSemanticVersion: bundle.populationCohorts.refinementSemanticVersion,
    sourceArtifactIds: [
      bundle.populationControls.metadata.artifactId,
      bundle.populationMeasurements[0].metadata.artifactId,
      bundle.eligibilityProxies.metadata.artifactId,
      bundle.populationCohorts.metadata.artifactId,
    ],
  };
  assertWeightedPopulationConservation(state);
  return state;
};

const createElectoralTopology = (
  integrated: IntegratedRuntimeConfiguration,
  geography: VersionedGeographyState,
  artifact: ElectoralTopologyArtifact,
): StaticElectoralTopologyState => {
  if (artifact.metadata.artifactId !== integrated.electoral.topologyArtifactId) {
    throw new Error("Static electoral topology artifact does not match configuration.");
  }
  const geographyIds = new Set(geography.features.map((feature) => feature.id));
  for (const allocation of artifact.allocations) {
    if (!geographyIds.has(allocation.geographyId)) throw new Error(`Electoral allocation ${allocation.id} has unresolved Geography.`);
    if (allocation.units.reduce((total, unit) => total + unit.electorCount, 0) !== allocation.totalElectors) {
      throw new Error(`Electoral allocation units do not conserve ${allocation.id}.`);
    }
    if (allocation.units.some((unit) => !geographyIds.has(unit.geographyId))) {
      throw new Error(`Electoral allocation ${allocation.id} contains an unresolved unit Geography.`);
    }
  }
  if (artifact.allocations.reduce((total, allocation) => total + allocation.totalElectors, 0) !== artifact.totalElectors) {
    throw new Error("Static electoral allocations do not conserve their configured total.");
  }
  return {
    applicableElection: artifact.applicableElection,
    totalElectors: artifact.totalElectors,
    ordinaryMajority: artifact.ordinaryMajority,
    allocations: artifact.allocations.map((allocation) => ({
      ...allocation,
      units: allocation.units.map((unit) => ({ ...unit })),
    })),
    sourceArtifactId: artifact.metadata.artifactId,
  };
};

export const createIntegratedPartialRuntimeState = (
  configuration: GovernmentConfiguration<LegislativeRuntimeSeed>,
  bundle: IntegratedRuntimeArtifactBundle,
): IntegratedPartialRuntimeState => {
  if (
    configuration.capability !== "INTEGRATED_PARTIAL_RUNTIME" ||
    configuration.runtimeSeed === null ||
    configuration.integratedRuntime === undefined
  ) throw new Error("Configuration does not declare an integrated partial runtime.");
  assertArtifactBindings(configuration.integratedRuntime, bundle);
  const geography = createGeographyState(configuration.integratedRuntime, bundle.geography);
  const population = createPopulationState(configuration.integratedRuntime, geography, bundle);
  const electoralTopology = createElectoralTopology(
    configuration.integratedRuntime,
    geography,
    bundle.electoralTopology,
  );
  const implementationConfiguration = configuration.integratedRuntime.implementation;
  const implementation = implementationConfiguration === undefined
    ? null
    : bundle.programInitialization === undefined ||
      bundle.programInitialization.metadata.artifactId !== implementationConfiguration.initializationArtifactId
      ? (() => { throw new Error("Integrated implementation artifact does not match configured initialization authority."); })()
      : createProgramImplementationState(
          bundle.programInitialization.metadata.artifactId,
          bundle.programInitialization,
        );
  const housingConfiguration = configuration.integratedRuntime.housing;
  const housing = housingConfiguration === undefined
    ? null
    : bundle.housingInitialization === undefined ||
      bundle.housingInitialization.metadata.artifactId !== housingConfiguration.initializationArtifactId ||
      bundle.housingInitialization.catchmentScaffoldVersion !== housingConfiguration.catchmentScaffoldVersion ||
      bundle.housingInitialization.materialCalibrationVersion !== housingConfiguration.materialCalibrationVersion
      ? (() => { throw new Error("Integrated Housing artifact does not match configured material semantics."); })()
      : createIntegratedMaterialHousingState(
          bundle.housingInitialization,
          housingConfiguration,
        );
  return {
    schemaVersion: configuration.integratedRuntime.schemaVersion,
    configuration: { ...configuration.identity },
    artifactBindings: configuration.integratedRuntime.artifactBindings.map((binding) => ({ ...binding })),
    legislative: createLegislativeRuntimeState(configuration.identity, {
      structure: configuration.structure,
      seed: configuration.runtimeSeed,
    }),
    geography,
    population,
    electoralTopology,
    institutional: configuration.integratedRuntime.temporal === undefined
      ? null
      : createInstitutionalRuntimeState(configuration.calendar.epoch, configuration.integratedRuntime.temporal),
    implementation,
    housing,
    information: configuration.integratedRuntime.information === undefined ||
      configuration.integratedRuntime.temporal === undefined
      ? null
      : createIntegratedInformationRuntimeState(
          configuration.integratedRuntime.information,
          configuration.integratedRuntime.temporal.boundaries,
        ),
    legalContest: configuration.integratedRuntime.legalContest === undefined
      ? null
      : createIntegratedLegalContestRuntimeState(configuration.integratedRuntime.legalContest),
  };
};
