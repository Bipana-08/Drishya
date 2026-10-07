/**
 * The hero SVG was generated from the province GeoJSON. These affine constants
 * are fitted from the nine district centers in districts.ts to their authored
 * SVG label centers, keeping database coordinates aligned with the existing map.
 */
const SVG_X_PER_LON = 539.8996;
const SVG_X_OFFSET = -43195.5351;
const SVG_Y_PER_LAT = -619.2308;
const SVG_Y_OFFSET = 18759.5869;

export function geographicToHeroPoint(
  position: [number, number],
): [number, number] {
  const [lat, lon] = position;
  return [
    SVG_X_PER_LON * lon + SVG_X_OFFSET,
    SVG_Y_PER_LAT * lat + SVG_Y_OFFSET,
  ];
}
