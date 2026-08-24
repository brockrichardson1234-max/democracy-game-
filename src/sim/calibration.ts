import type { IntegratedCalibrationConfiguration } from "../configuration/types";

export const assertIntegratedCalibrationConfiguration = (
  configuration: IntegratedCalibrationConfiguration,
): void => {
  if (
    configuration.schemaVersion !== 1 || configuration.version.trim().length === 0 ||
    configuration.ownerParameterHashes.length === 0 ||
    new Set(configuration.ownerParameterHashes).size !== configuration.ownerParameterHashes.length ||
    !Number.isSafeInteger(configuration.perturbationBasisPoints) ||
    configuration.perturbationBasisPoints <= 0 || configuration.perturbationBasisPoints > 1_000 ||
    configuration.entries.length === 0 ||
    new Set(configuration.entries.map((entry) => entry.id)).size !== configuration.entries.length
  ) throw new Error("Integrated calibration catalog has invalid identity or robustness bounds.");
  for (const entry of configuration.entries) {
    if (
      entry.id.trim().length === 0 || entry.sourcePath.trim().length === 0 || entry.domain.trim().length === 0 ||
      !configuration.ownerParameterHashes.includes(entry.ownerParameterHash) ||
      !Number.isFinite(entry.value) || !Number.isFinite(entry.lowerBound) || !Number.isFinite(entry.upperBound) ||
      entry.lowerBound > entry.value || entry.value > entry.upperBound || entry.lowerBound === entry.upperBound ||
      entry.systemWideDirectOutcome !== false || !["LOCAL", "OWNER_BOUNDED"].includes(entry.scope)
    ) throw new Error(`Calibration entry ${entry.id} is unbounded or lacks its behavior owner.`);
  }
};

/** Deterministic sensitivity probe; never mutates canonical configured parameters. */
export const perturbCalibrationValue = (
  value: number,
  lowerBound: number,
  upperBound: number,
  basisPoints: number,
  direction: "UP" | "DOWN",
): number => {
  if (
    !Number.isFinite(value) || !Number.isFinite(lowerBound) || !Number.isFinite(upperBound) ||
    lowerBound > value || value > upperBound || !Number.isSafeInteger(basisPoints) ||
    basisPoints <= 0 || basisPoints > 10_000
  ) throw new Error("Calibration perturbation requires a bounded canonical value.");
  const magnitude = Math.max(1, Math.round(Math.abs(value) * basisPoints / 10_000));
  return direction === "UP"
    ? Math.min(upperBound, value + magnitude)
    : Math.max(lowerBound, value - magnitude);
};
