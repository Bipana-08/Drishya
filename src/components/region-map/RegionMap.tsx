"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
  GeoJSON,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import { useEffect, useState } from "react";
import type { FeatureCollection, Geometry } from "geojson";
import type { Destination } from "@/lib/types";

const pin = L.divIcon({
  className: "region-destination-pin",
  html: `<span style="display:block;width:18px;height:18px;border-radius:999px 999px 999px 0;background:var(--color-forest);border:3px solid var(--color-paper);transform:rotate(-45deg);box-shadow:0 4px 12px color-mix(in srgb,var(--color-forest-deep) 35%,transparent)"></span>`,
  iconSize: [18, 18],
  iconAnchor: [9, 18],
});

const gemPin = L.divIcon({
  className: "region-destination-pin",
  html: `<span style="display:block;width:18px;height:18px;border-radius:999px 999px 999px 0;background:var(--color-brass);border:3px solid var(--color-paper);transform:rotate(-45deg);box-shadow:0 4px 12px color-mix(in srgb,var(--color-forest-deep) 35%,transparent)"></span>`,
  iconSize: [18, 18],
  iconAnchor: [9, 18],
});

type DistrictBoundaries = FeatureCollection<
  Geometry,
  { id: string; name: string; province: string }
>;

function FitRegion({
  boundaries,
  destinations,
}: {
  boundaries: DistrictBoundaries | null;
  destinations: Destination[];
}) {
  const map = useMap();

  useEffect(() => {
    const bounds = boundaries
      ? L.geoJSON(boundaries as never).getBounds()
      : L.latLngBounds([]);
    const positions = destinations
      .map((destination) => destination.position)
      .filter((position): position is [number, number] => position !== null);
    positions.forEach((position) => bounds.extend(position));
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [boundaries, destinations, map]);

  return null;
}

export function RegionMap({ destinations }: { destinations: Destination[] }) {
  const [boundaries, setBoundaries] = useState<DistrictBoundaries | null>(
    null,
  );

  useEffect(() => {
    let cancelled = false;
    fetch("/data/sudurpaschim-districts.simplified.geojson")
      .then((response) => {
        if (!response.ok) throw new Error("Failed to load district boundaries");
        return response.json() as Promise<DistrictBoundaries>;
      })
      .then((data) => {
        if (!cancelled) setBoundaries(data);
      })
      .catch(() => {
        if (!cancelled) setBoundaries(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="h-[min(72vh,52rem)] min-h-[34rem] overflow-hidden rounded-3xl border border-line shadow-[0_25px_70px_-35px_color-mix(in_srgb,var(--color-forest-deep)_45%,transparent)]">
      <MapContainer
        center={[29.2, 80.9]}
        zoom={8}
        scrollWheelZoom
        dragging
        doubleClickZoom
        touchZoom
        zoomControl
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitRegion boundaries={boundaries} destinations={destinations} />
        {boundaries && (
          <>
            <GeoJSON
              data={boundaries}
              style={{
                color: "var(--color-forest-deep)",
                weight: 4,
                opacity: 0.95,
                fillColor: "var(--color-forest)",
                fillOpacity: 0.035,
              }}
            />
            <GeoJSON
              data={boundaries}
              style={(feature) => ({
                color:
                  feature?.properties?.id === "bajhang"
                    ? "var(--color-brass)"
                    : "var(--color-forest)",
                weight: 1.5,
                opacity: 0.8,
                fillColor: "var(--color-paper)",
                fillOpacity: 0.02,
              })}
              onEachFeature={(feature, layer) => {
                layer.bindTooltip(feature.properties.name, {
                  sticky: true,
                  direction: "center",
                  className: "region-district-label",
                });
              }}
            />
          </>
        )}
        {destinations.map((destination) => {
          if (!destination.position) return null;
          return (
            <Marker
              key={destination.id}
              position={destination.position}
              icon={destination.hiddenGem ? gemPin : pin}
            >
              <Popup>
                <strong>{destination.name}</strong>
                <br />
                <span>{destination.shortDescription}</span>
                <br />
                <a href={`/districts/${destination.districtId}/${destination.slug}`}>
                  View place →
                </a>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
