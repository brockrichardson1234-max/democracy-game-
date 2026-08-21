import type { WorldState } from "../sim/world";
import type { ControlBinding } from "./session";

export const GAME_SAVE_FORMAT_VERSION = 1 as const;

export interface GameSaveV1 {
  readonly formatVersion: typeof GAME_SAVE_FORMAT_VERSION;
  readonly world: WorldState;
  readonly session: {
    readonly controlBinding: ControlBinding;
  };
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const requireRecord = (value: unknown, field: string): Record<string, unknown> => {
  if (!isRecord(value)) throw new Error(`Invalid game save: ${field} must be an object.`);
  return value;
};

const parseControlBinding = (value: unknown): ControlBinding => {
  const binding = requireRecord(value, "session.controlBinding");
  if (
    typeof binding.id !== "string" ||
    binding.id.length === 0 ||
    binding.decisionSurface !== "EXECUTIVE_ADMINISTRATION_STRATEGIC_SURFACE" ||
    typeof binding.executiveOfficeId !== "string" ||
    binding.executiveOfficeId.length === 0 ||
    typeof binding.boundOfficeholderActorId !== "string" ||
    binding.boundOfficeholderActorId.length === 0
  ) {
    throw new Error("Invalid game save: unsupported ControlBinding decision surface or shape.");
  }

  if (binding.status === "ACTIVE") {
    if (binding.endedAtSimulationTime !== null || binding.endReason !== null) {
      throw new Error("Invalid game save: unsupported ACTIVE ControlBinding status shape.");
    }
  } else if (binding.status === "ENDED") {
    if (
      typeof binding.endedAtSimulationTime !== "number" ||
      !Number.isFinite(binding.endedAtSimulationTime) ||
      binding.endReason !== "BOUND_OFFICEHOLDER_CHANGED"
    ) {
      throw new Error("Invalid game save: unsupported ENDED ControlBinding status shape.");
    }
  } else {
    throw new Error("Invalid game save: unsupported ControlBinding status.");
  }

  return binding as unknown as ControlBinding;
};

export const serializeGameSaveV1 = (
  world: WorldState,
  controlBinding: ControlBinding,
): string =>
  JSON.stringify({
    formatVersion: GAME_SAVE_FORMAT_VERSION,
    world,
    session: { controlBinding },
  } satisfies GameSaveV1);

export const parseGameSaveV1 = (
  serializedSave: string,
): { readonly world: WorldState; readonly controlBinding: ControlBinding } => {
  let parsed: unknown;
  try {
    parsed = JSON.parse(serializedSave) as unknown;
  } catch {
    throw new Error("Invalid game save: serialized data is not valid JSON.");
  }

  const envelope = requireRecord(parsed, "save envelope");
  if (envelope.formatVersion !== GAME_SAVE_FORMAT_VERSION) {
    throw new Error(
      `Unsupported game save format version: ${String(envelope.formatVersion)}. Expected 1.`,
    );
  }

  const world = requireRecord(envelope.world, "world");
  const time = requireRecord(world.time, "world.time");
  if (
    typeof time.current !== "number" ||
    !Number.isFinite(time.current) ||
    time.current < 0
  ) {
    throw new Error("Invalid game save: world.time.current must be a finite nonnegative number.");
  }

  const session = requireRecord(envelope.session, "session");
  const controlBinding = parseControlBinding(session.controlBinding);

  return {
    world: world as unknown as WorldState,
    controlBinding,
  };
};
