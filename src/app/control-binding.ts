/** Session-owned permission to act through one administration surface. */
export interface AdministrationControlBinding<Instant, Surface extends string> {
  readonly id: string;
  readonly decisionSurface: Surface;
  readonly executiveOfficeId: string;
  readonly boundOfficeholderActorId: string;
  readonly status: "ACTIVE" | "ENDED";
  readonly endedAt: Instant | null;
  readonly endReason: "BOUND_OFFICEHOLDER_CHANGED" | "TERM_ENDED" | null;
}

export const reconcileAdministrationControlBinding = <Instant, Surface extends string>(
  binding: AdministrationControlBinding<Instant, Surface>,
  current: { readonly officeId: string; readonly actorId: string; readonly effectiveAt: Instant },
): AdministrationControlBinding<Instant, Surface> => {
  if (binding.status === "ENDED") return binding;
  if (
    binding.executiveOfficeId === current.officeId &&
    binding.boundOfficeholderActorId === current.actorId
  ) return binding;
  return {
    ...binding,
    status: "ENDED",
    endedAt: current.effectiveAt,
    endReason: "BOUND_OFFICEHOLDER_CHANGED",
  };
};

export const assertActiveAdministrationControl = <Instant, Surface extends string>(
  binding: AdministrationControlBinding<Instant, Surface>,
  current: { readonly officeId: string; readonly actorId: string; readonly effectiveAt: Instant },
): void => {
  if (reconcileAdministrationControlBinding(binding, current).status !== "ACTIVE") {
    throw new Error("No active ControlBinding: administration decision surface unavailable.");
  }
};
