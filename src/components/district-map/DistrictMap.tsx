"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import L from "leaflet";
import {
  CircleMarker,
  GeoJSON,
  MapContainer,
  Popup,
  TileLayer,
  Tooltip,
  useMap,
} from "react-leaflet";
import type { Feature, Geometry } from "geojson";
import type {
  Destination,
  District,
  DistrictFeatureCollection,
  DistrictFeatureProperties,
} from "@/lib/types";

const MARKER_COLOR = {
  destination: "var(--color-forest)",
  hiddenGem: "var(--color-brass)",
};

const MARKER_LABEL = {
  destination: "Destination",
  hiddenGem: "Hidden gem",
};

/** Fits the map viewport to the district polygon once it has loaded. */
function FitToFeature({ feature }: { feature: Feature }) {
  const map = useMap();
  useEffect(() => {
    const bounds = L.geoJSON(feature).getBounds();
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [24, 24] });
    }
  }, [feature, map]);
  return null;
}

export default function DistrictMap({
  district,
  destinations,
  compact = false,
}: {
  district: District;
  destinations: Destination[];
  compact?: boolean;
}) {
  const [feature, setFeature] = useState<Feature<
    Geometry,
    DistrictFeatureProperties
  > | null>(null);
  useEffect(() => {
    let cancelled = false;
    fetch("/data/sudurpaschim-districts.simplified.geojson")
      .then((r) => r.json())
      .then((fc: DistrictFeatureCollection) => {
        if (cancelled) return;
        setFeature(fc.features.find((f) => f.properties.id === district.id) ?? null);
      })
      .catch(() => {
        /* leave feature null — tiles + markers still render */
      });
    return () => {
      cancelled = true;
    };
  }, [district.id]);

  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl border border-line ${
        compact ? "h-72" : "h-[65vh] min-h-[420px]"
      }`}
    >
      <MapContainer
        center={district.center}
        zoom={9}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {feature && (
          <>
            <GeoJSON
              data={feature}
              style={{
                color: "var(--color-forest)",
                weight: 2,
                fillColor: "var(--color-forest)",
                fillOpacity: 0.1,
              }}
            />
            <FitToFeature feature={feature} />
          </>
        )}
        {destinations.map((destination) => (
          <CircleMarker
            key={destination.id}
            center={destination.position!}
            radius={8}
            pathOptions={{
              color: "var(--color-dock-text)",
              weight: 2,
              fillColor: destination.hiddenGem
                ? MARKER_COLOR.hiddenGem
                : MARKER_COLOR.destination,
              fillOpacity: 1,
            }}
          >
            <Tooltip direction="top" offset={[0, -6]}>
              {destination.name}
            </Tooltip>
            <Popup>
              <strong>{destination.name}</strong>
              <br />
              <span>{destination.shortDescription}</span>
              <br />
              <a
                href={`/districts/${district.slug}/${destination.slug}`}
                style={{ color: "var(--color-brass-ink)" }}
              >
                View destination
              </a>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>

      <div className="pointer-events-none absolute bottom-3 left-3 z-[1000] rounded-xl border border-line bg-paper/95 px-3 py-2 text-xs shadow-sm">
        <p className="mb-1 font-semibold uppercase tracking-[0.14em] text-muted">
          Legend
        </p>
        <ul className="space-y-1">
          {(Object.keys(MARKER_LABEL) as (keyof typeof MARKER_LABEL)[]).map(
            (c) => (
            <li key={c} className="flex items-center gap-2 text-ink/80">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: MARKER_COLOR[c] }}
              />
              {MARKER_LABEL[c]}
            </li>
            ),
          )}
        </ul>
      </div>
    </div>
  );
}
