import type { StyleSpecification, Map as LibreMap } from "maplibre-gl";

export function eventMapStyle(satellite: boolean, key: string | undefined): StyleSpecification | string {
  if (!satellite && key) return `https://api.maptiler.com/maps/streets-v2/style.json?key=${encodeURIComponent(key)}`;
  if (!satellite) return { version: 8, sources: {}, layers: [] };
  return { version: 8, sources: { satellite: { type: "raster", tiles: ["https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"], tileSize: 256, attribution: "Tiles © Esri World Imagery" } }, layers: [{ id: "satellite", type: "raster", source: "satellite" }] };
}

export type WardBoundary = {
  type: "FeatureCollection";
  features: Array<GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon>>;
};

// Vector place/admin labels can carry obsolete district names. Preserve street/POI labels.
export function isAdministrativeLayer(layer: { id: string; "source-layer"?: string }): boolean {
  return ["boundary", "place"].includes(layer["source-layer"] || "") || /(^|[-_])(district|ward|administrative)([-_]|$)/i.test(layer.id);
}

export function boundaryBounds(boundary: WardBoundary): [[number, number], [number, number]] | null {
  const points = boundary.features.flatMap(f => f.geometry.type === "Polygon" ? f.geometry.coordinates.flat() : f.geometry.coordinates.flat(2));
  if (!points.length) return null;
  return [[Math.min(...points.map(p => p[0])), Math.min(...points.map(p => p[1]))], [Math.max(...points.map(p => p[0])), Math.max(...points.map(p => p[1]))]];
}

export function addWardBoundary(map: LibreMap, boundary: WardBoundary) {
  if (!boundary.features.length) return;
  for (const layer of map.getStyle().layers) if (isAdministrativeLayer(layer)) map.setLayoutProperty(layer.id, "visibility", "none");
  map.addSource("current-ward", { type: "geojson", data: boundary });
  map.addLayer({ id: "current-ward-fill", type: "fill", source: "current-ward", paint: { "fill-color": "#0f766e", "fill-opacity": 0.07 } });
  map.addLayer({ id: "current-ward-line", type: "line", source: "current-ward", paint: { "line-color": "#0f766e", "line-width": 2 } });
}
