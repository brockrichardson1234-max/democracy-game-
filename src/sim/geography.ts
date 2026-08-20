/** Geography owns only the spatial identities required by Commit 13. */
export interface GeographyRegion {
  readonly id: string;
}

export interface GeographyState {
  readonly regions: readonly GeographyRegion[];
}

export const GEOGRAPHY_REGION_A_ID = "geo-region-a";
export const GEOGRAPHY_REGION_B_ID = "geo-region-b";
export const GEOGRAPHY_REGION_C_ID = "geo-region-c";

/** Synthetic spatial fixture: identity only, with no map, borders, or population. */
export const createInitialGeographyState = (): GeographyState => ({
  regions: [
    { id: GEOGRAPHY_REGION_A_ID },
    { id: GEOGRAPHY_REGION_B_ID },
    { id: GEOGRAPHY_REGION_C_ID },
  ],
});
