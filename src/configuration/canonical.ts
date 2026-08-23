import type { GovernmentConfiguration } from "./types";

const canonicalize = (value: unknown, path: string): unknown => {
  if (value === null || typeof value === "string" || typeof value === "boolean") {
    return value;
  }
  if (typeof value === "number") {
    if (!Number.isFinite(value)) throw new Error(`Configuration ${path} must be finite.`);
    return value;
  }
  if (Array.isArray(value)) {
    return value.map((entry, index) => canonicalize(entry, `${path}[${index}]`));
  }
  if (typeof value === "object") {
    const record = value as Record<string, unknown>;
    return Object.fromEntries(
      Object.keys(record)
        .sort()
        .map((key) => [key, canonicalize(record[key], `${path}.${key}`)]),
    );
  }
  throw new Error(`Configuration ${path} contains executable or unsupported content.`);
};

export const canonicalConfigurationContent = (
  configuration: GovernmentConfiguration,
): string => {
  const identityWithoutHash = {
    configurationId: configuration.identity.configurationId,
    configurationVersion: configuration.identity.configurationVersion,
    scenarioId: configuration.identity.scenarioId,
    scenarioVersion: configuration.identity.scenarioVersion,
  };
  return JSON.stringify(
    canonicalize(
      {
        identity: identityWithoutHash,
        capability: configuration.capability,
        calendar: configuration.calendar,
        structure: configuration.structure,
        transitions: configuration.transitions,
        runtimeSeed: configuration.runtimeSeed,
        ...(configuration.integratedRuntime === undefined
          ? {}
          : { integratedRuntime: configuration.integratedRuntime }),
      },
      "root",
    ),
  );
};
