import type { GovernmentStructureDescriptor, TopologyReference } from "./types";

const SHA_256_PATTERN = /^[a-f0-9]{64}$/;

const requireNonempty = (value: string, field: string): void => {
  if (value.trim().length === 0) throw new Error(`Configuration ${field} is required.`);
};

const requireUnique = (values: readonly string[], field: string): void => {
  values.forEach((value) => requireNonempty(value, field));
  if (new Set(values).size !== values.length) {
    throw new Error(`Configuration ${field} must contain unique IDs.`);
  }
};

const validateExternalIdentifiers = (
  records: readonly {
    readonly id: string;
    readonly externalIdentifiers: readonly { readonly scheme: string; readonly value: string }[];
  }[],
  field: string,
): void => {
  for (const record of records) {
    requireUnique(
      record.externalIdentifiers.map((identifier) => identifier.scheme),
      `${field}.${record.id}.externalIdentifierSchemes`,
    );
    record.externalIdentifiers.forEach((identifier) =>
      requireNonempty(identifier.value, `${field}.${record.id}.externalIdentifierValue`),
    );
  }
};

export const validateGovernmentStructure = (structure: GovernmentStructureDescriptor): void => {
  const collections = [
    ["provenanceArtifacts", structure.provenanceArtifacts],
    ["jurisdictions", structure.jurisdictions],
    ["institutions", structure.institutions],
    ["legislatures", structure.legislatures],
    ["chambers", structure.chambers],
    ["geographies", structure.geographies],
    ["staggerGroups", structure.staggerGroups],
    ["offices", structure.offices],
    ["actors", structure.actors],
    ["assignments", structure.assignments],
    ["administrations", structure.administrations],
    ["relations", structure.relations],
  ] as const;
  for (const [name, records] of collections) {
    requireUnique(records.map((record) => record.id), `structure.${name}`);
  }
  const allIds = collections.flatMap(([, records]) => records.map((record) => record.id));
  if (new Set(allIds).size !== allIds.length) {
    throw new Error("Configuration structural identities must not collide across topology kinds.");
  }
  if (structure.jurisdictions.length === 0) {
    throw new Error("Configuration must declare at least one jurisdiction.");
  }
  if (structure.chambers.length === 0) {
    throw new Error("Configuration must declare at least one legislative chamber.");
  }

  validateExternalIdentifiers(structure.jurisdictions, "structure.jurisdictions");
  validateExternalIdentifiers(structure.geographies, "structure.geographies");

  const artifactIds = new Set(structure.provenanceArtifacts.map((artifact) => artifact.id));
  for (const artifact of structure.provenanceArtifacts) {
    requireNonempty(artifact.vintage, `structure.provenanceArtifacts.${artifact.id}.vintage`);
    requireNonempty(
      artifact.transformationVersion,
      `structure.provenanceArtifacts.${artifact.id}.transformationVersion`,
    );
    if (!SHA_256_PATTERN.test(artifact.contentSha256)) {
      throw new Error(`Configuration provenance artifact ${artifact.id} needs a SHA-256 content hash.`);
    }
    if (artifact.sources.length === 0) {
      throw new Error(`Configuration provenance artifact ${artifact.id} requires a source.`);
    }
    for (const source of artifact.sources) {
      requireNonempty(source.sourceId, `structure.provenanceArtifacts.${artifact.id}.sourceId`);
      requireNonempty(source.product, `structure.provenanceArtifacts.${artifact.id}.product`);
      requireNonempty(source.locator, `structure.provenanceArtifacts.${artifact.id}.locator`);
      requireNonempty(source.retrievedAt, `structure.provenanceArtifacts.${artifact.id}.retrievedAt`);
      if (source.rawSha256 !== null && !SHA_256_PATTERN.test(source.rawSha256)) {
        throw new Error(`Configuration provenance source ${source.sourceId} has an invalid raw hash.`);
      }
    }
  }

  const jurisdictionIds = new Set(structure.jurisdictions.map((record) => record.id));
  const institutionIds = new Set(structure.institutions.map((record) => record.id));
  const legislatureIds = new Set(structure.legislatures.map((record) => record.id));
  const chamberIds = new Set(structure.chambers.map((record) => record.id));
  const geographyIds = new Set(structure.geographies.map((record) => record.id));
  const staggerGroupIds = new Set(structure.staggerGroups.map((record) => record.id));
  const officeIds = new Set(structure.offices.map((record) => record.id));
  const actorIds = new Set(structure.actors.map((record) => record.id));

  const requireArtifact = (artifactId: string | null, owner: string): void => {
    if (artifactId !== null && !artifactIds.has(artifactId)) {
      throw new Error(`Configuration ${owner} references unknown provenance artifact ${artifactId}.`);
    }
  };
  structure.jurisdictions.forEach((record) =>
    requireArtifact(record.provenanceArtifactId, `jurisdiction ${record.id}`),
  );
  structure.geographies.forEach((record) =>
    requireArtifact(record.provenanceArtifactId, `geography ${record.id}`),
  );
  structure.staggerGroups.forEach((record) =>
    requireArtifact(record.provenanceArtifactId, `stagger group ${record.id}`),
  );

  for (const institution of structure.institutions) {
    if (!jurisdictionIds.has(institution.jurisdictionId)) {
      throw new Error(`Configuration institution ${institution.id} references unknown jurisdiction.`);
    }
  }
  for (const legislature of structure.legislatures) {
    const institution = structure.institutions.find(
      (candidate) => candidate.id === legislature.institutionId,
    );
    if (institution?.kind !== "LEGISLATURE") {
      throw new Error(`Configuration legislature ${legislature.id} references unknown institution.`);
    }
    requireUnique(legislature.chamberIds, `legislature.${legislature.id}.chamberIds`);
    for (const chamberId of legislature.chamberIds) {
      const chamber = structure.chambers.find((candidate) => candidate.id === chamberId);
      if (chamber === undefined || chamber.legislatureId !== legislature.id) {
        throw new Error(`Configuration legislature ${legislature.id} has an invalid chamber reference.`);
      }
    }
    const ownedChambers = structure.chambers
      .filter((chamber) => chamber.legislatureId === legislature.id)
      .map((chamber) => chamber.id);
    if (
      ownedChambers.length !== legislature.chamberIds.length ||
      ownedChambers.some((chamberId) => !legislature.chamberIds.includes(chamberId))
    ) {
      throw new Error(`Configuration legislature ${legislature.id} does not enumerate its chambers.`);
    }
  }
  for (const chamber of structure.chambers) {
    const institution = structure.institutions.find(
      (candidate) => candidate.id === chamber.institutionId,
    );
    if (!legislatureIds.has(chamber.legislatureId) || institution?.kind !== "LEGISLATIVE_CHAMBER") {
      throw new Error(`Configuration chamber ${chamber.id} has an unresolved owner.`);
    }
    if (!Number.isInteger(chamber.seatCount) || chamber.seatCount <= 0) {
      throw new Error(`Configuration chamber ${chamber.id} has an invalid seat count.`);
    }
  }
  for (const geography of structure.geographies) {
    if (!jurisdictionIds.has(geography.parentJurisdictionId)) {
      throw new Error(`Configuration geography ${geography.id} references unknown parent jurisdiction.`);
    }
  }
  for (const staggerGroup of structure.staggerGroups) {
    requireNonempty(staggerGroup.ordinaryBoundaryAt, `staggerGroup.${staggerGroup.id}.ordinaryBoundaryAt`);
  }

  const resolveReference = (reference: TopologyReference, owner: string): void => {
    const ids =
      reference.kind === "JURISDICTION"
        ? jurisdictionIds
        : reference.kind === "INSTITUTION"
          ? institutionIds
          : reference.kind === "OFFICE"
            ? officeIds
            : geographyIds;
    if (!ids.has(reference.id)) {
      throw new Error(`Configuration ${owner} has unresolved ${reference.kind} reference ${reference.id}.`);
    }
  };

  for (const office of structure.offices) {
    if (!institutionIds.has(office.institutionId)) {
      throw new Error(`Configuration office ${office.id} references unknown institution.`);
    }
    if (office.kind === "LEGISLATIVE_MEMBER") {
      if (office.chamberId === null || !chamberIds.has(office.chamberId)) {
        throw new Error(`Configuration legislative office ${office.id} requires a chamber.`);
      }
      const chamber = structure.chambers.find((candidate) => candidate.id === office.chamberId);
      if (chamber?.institutionId !== office.institutionId) {
        throw new Error(`Configuration legislative office ${office.id} conflicts with its chamber owner.`);
      }
    } else if (office.chamberId !== null) {
      throw new Error(`Configuration non-legislative office ${office.id} cannot reference a chamber.`);
    }
    if (office.constituency !== null) {
      if (office.constituency.kind !== "JURISDICTION" && office.constituency.kind !== "GEOGRAPHY") {
        throw new Error(`Configuration office ${office.id} has an invalid constituency kind.`);
      }
      resolveReference(office.constituency, `office ${office.id}`);
    }
    if (!Number.isInteger(office.term.duration.value) || office.term.duration.value <= 0) {
      throw new Error(`Configuration office ${office.id} has an invalid term duration.`);
    }
    requireNonempty(office.term.ordinaryBoundaryAt, `office.${office.id}.ordinaryBoundaryAt`);
    if (office.term.staggerGroupId !== null) {
      if (!staggerGroupIds.has(office.term.staggerGroupId)) {
        throw new Error(`Configuration office ${office.id} references unknown stagger group.`);
      }
      const group = structure.staggerGroups.find(
        (candidate) => candidate.id === office.term.staggerGroupId,
      );
      if (group?.ordinaryBoundaryAt !== office.term.ordinaryBoundaryAt) {
        throw new Error(`Configuration office ${office.id} conflicts with its stagger-group boundary.`);
      }
    }
  }
  for (const chamber of structure.chambers) {
    const representedSeats = structure.offices.filter(
      (office) => office.kind === "LEGISLATIVE_MEMBER" && office.chamberId === chamber.id,
    ).length;
    if (representedSeats !== chamber.seatCount) {
      throw new Error(
        `Configuration chamber ${chamber.id} declares ${chamber.seatCount} seats but has ${representedSeats} offices.`,
      );
    }
  }

  const currentAssignmentsByOffice = new Map<string, number>();
  for (const assignment of structure.assignments) {
    if (!officeIds.has(assignment.officeId) || !actorIds.has(assignment.actorId)) {
      throw new Error(`Configuration assignment ${assignment.id} has an unresolved office or actor.`);
    }
    requireNonempty(assignment.effectiveFrom, `assignment.${assignment.id}.effectiveFrom`);
    if (assignment.effectiveUntil !== null && assignment.effectiveUntil <= assignment.effectiveFrom) {
      throw new Error(`Configuration assignment ${assignment.id} has an invalid effective window.`);
    }
    if (assignment.currentAtScenarioStart) {
      currentAssignmentsByOffice.set(
        assignment.officeId,
        (currentAssignmentsByOffice.get(assignment.officeId) ?? 0) + 1,
      );
    }
  }
  for (const [officeId, count] of currentAssignmentsByOffice) {
    if (count > 1) {
      throw new Error(`Configuration office ${officeId} has multiple current assignments.`);
    }
  }

  for (const administration of structure.administrations) {
    if (
      !institutionIds.has(administration.institutionId) ||
      !officeIds.has(administration.headOfficeId) ||
      !actorIds.has(administration.headActorId)
    ) {
      throw new Error(`Configuration administration ${administration.id} has an unresolved reference.`);
    }
    const assignment = structure.assignments.find(
      (candidate) =>
        candidate.currentAtScenarioStart &&
        candidate.officeId === administration.headOfficeId &&
        candidate.actorId === administration.headActorId,
    );
    if (assignment === undefined) {
      throw new Error(`Configuration administration ${administration.id} lacks its head assignment.`);
    }
    const headOffice = structure.offices.find(
      (candidate) => candidate.id === administration.headOfficeId,
    );
    if (headOffice?.institutionId !== administration.institutionId) {
      throw new Error(`Configuration administration ${administration.id} conflicts with its head office.`);
    }
  }
  for (const relation of structure.relations) {
    resolveReference(relation.from, `relation ${relation.id}`);
    resolveReference(relation.to, `relation ${relation.id}`);
    if (
      relation.kind === "APPEALS_TO" &&
      (relation.from.kind !== "INSTITUTION" || relation.to.kind !== "INSTITUTION")
    ) {
      throw new Error(`Configuration appellate relation ${relation.id} requires institution endpoints.`);
    }
    if (relation.kind === "APPEALS_TO") {
      const from = structure.institutions.find((candidate) => candidate.id === relation.from.id);
      const to = structure.institutions.find((candidate) => candidate.id === relation.to.id);
      if (from?.kind !== "COURT" || to?.kind !== "COURT") {
        throw new Error(`Configuration appellate relation ${relation.id} requires court endpoints.`);
      }
    } else if (relation.from.kind !== "JURISDICTION" || relation.to.kind !== "JURISDICTION") {
      throw new Error(`Configuration jurisdiction relation ${relation.id} requires jurisdiction endpoints.`);
    }
  }
};
