export interface CalendarTimeState {
  readonly current: string;
  readonly processedBoundaryIds: readonly string[];
}

export interface ConfiguredCalendarBoundary {
  readonly id: string;
  readonly at: string;
  readonly phase: number;
  readonly order: number;
  readonly stableKey: string;
  readonly kind: string;
  readonly ownerId?: string;
}

const instant = (value: string, label: string): number => {
  const parsed = Date.parse(value);
  if (!Number.isFinite(parsed)) throw new Error(`${label} must be a valid configured instant.`);
  return parsed;
};

export const compareConfiguredBoundaries = (
  left: ConfiguredCalendarBoundary,
  right: ConfiguredCalendarBoundary,
): number => instant(left.at, `${left.id} boundary`) - instant(right.at, `${right.id} boundary`) ||
  left.phase - right.phase ||
  left.order - right.order ||
  left.stableKey.localeCompare(right.stableKey) ||
  left.id.localeCompare(right.id);

export const assertConfiguredCalendar = (
  epoch: string,
  boundaries: readonly ConfiguredCalendarBoundary[],
): void => {
  const epochValue = instant(epoch, "Calendar epoch");
  if (new Set(boundaries.map((boundary) => boundary.id)).size !== boundaries.length) {
    throw new Error("Configured calendar boundaries require unique identities.");
  }
  for (const boundary of boundaries) {
    if (
      boundary.id.trim().length === 0 ||
      boundary.kind.trim().length === 0 ||
      boundary.stableKey.trim().length === 0 ||
      !Number.isSafeInteger(boundary.phase) ||
      !Number.isSafeInteger(boundary.order) ||
      instant(boundary.at, `${boundary.id} boundary`) < epochValue
    ) throw new Error(`Configured calendar boundary ${boundary.id} is invalid.`);
  }
};

export const createCalendarTimeState = (
  epoch: string,
  boundaries: readonly ConfiguredCalendarBoundary[],
): CalendarTimeState => {
  assertConfiguredCalendar(epoch, boundaries);
  return { current: epoch, processedBoundaryIds: [] };
};

export const expectedProcessedBoundaryIds = (
  current: string,
  boundaries: readonly ConfiguredCalendarBoundary[],
): readonly string[] => {
  const currentValue = instant(current, "Current calendar instant");
  return [...boundaries]
    .filter((boundary) => instant(boundary.at, `${boundary.id} boundary`) <= currentValue)
    .sort(compareConfiguredBoundaries)
    .map((boundary) => boundary.id);
};

export const assertCalendarTimeState = (
  state: CalendarTimeState,
  epoch: string,
  boundaries: readonly ConfiguredCalendarBoundary[],
): void => {
  assertConfiguredCalendar(epoch, boundaries);
  if (instant(state.current, "Current calendar instant") < instant(epoch, "Calendar epoch")) {
    throw new Error("Calendar state precedes its configured epoch.");
  }
  const expected = expectedProcessedBoundaryIds(state.current, boundaries);
  if (JSON.stringify(state.processedBoundaryIds) !== JSON.stringify(expected)) {
    throw new Error("Calendar processed-boundary identity contradicts the configured schedule.");
  }
};

export const advanceScheduledState = <T>(
  value: T,
  calendar: CalendarTimeState,
  epoch: string,
  target: string,
  boundaries: readonly ConfiguredCalendarBoundary[],
  apply: (value: T, boundary: ConfiguredCalendarBoundary) => T,
): { readonly value: T; readonly calendar: CalendarTimeState } => {
  const currentValue = instant(calendar.current, "Current calendar instant");
  const targetValue = instant(target, "Target calendar instant");
  if (targetValue < currentValue) throw new Error("Canonical calendar time cannot move backwards.");
  assertCalendarTimeState(calendar, epoch, boundaries);
  const processed = new Set(calendar.processedBoundaryIds);
  let next = value;
  const due = [...boundaries]
    .filter((boundary) => {
      const at = instant(boundary.at, `${boundary.id} boundary`);
      return at > currentValue && at <= targetValue && !processed.has(boundary.id);
    })
    .sort(compareConfiguredBoundaries);
  for (const boundary of due) {
    next = apply(next, boundary);
    processed.add(boundary.id);
  }
  return {
    value: next,
    calendar: {
      current: target,
      processedBoundaryIds: [...boundaries]
        .filter((boundary) => processed.has(boundary.id))
        .sort(compareConfiguredBoundaries)
        .map((boundary) => boundary.id),
    },
  };
};

export const nextConfiguredBoundary = (
  state: CalendarTimeState,
  boundaries: readonly ConfiguredCalendarBoundary[],
): ConfiguredCalendarBoundary | null => {
  const processed = new Set(state.processedBoundaryIds);
  return [...boundaries].filter((boundary) => !processed.has(boundary.id)).sort(compareConfiguredBoundaries)[0] ?? null;
};

export const deriveStrictMajority = (countableDenominator: number): number => {
  if (!Number.isSafeInteger(countableDenominator) || countableDenominator <= 0) {
    throw new Error("Countable denominator must be a positive safe integer.");
  }
  return Math.floor(countableDenominator / 2) + 1;
};
