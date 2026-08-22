/** Geography owns only the spatial identities required by Commit 13. */
export interface GeographyRegion {
  readonly id: string;
}

export interface GeographyState {
  readonly regions: readonly GeographyRegion[];
}

export const createGeographyState = (
  regions: readonly GeographyRegion[],
): GeographyState => {
  if (regions.length === 0 || new Set(regions.map((region) => region.id)).size !== regions.length) {
    throw new Error("Geography requires nonempty, unique region identities.");
  }
  return { regions: regions.map((region) => ({ ...region })) };
};
