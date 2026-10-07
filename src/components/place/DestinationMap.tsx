"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

const destinationPin = L.divIcon({
  className: "destination-map-pin",
  html: `
    <span style="display:block;width:18px;height:18px;border-radius:999px 999px 999px 0;background:var(--color-brass);border:3px solid var(--color-paper);transform:rotate(-45deg);box-shadow:0 4px 12px color-mix(in srgb,var(--color-forest-deep) 35%,transparent)"></span>
  `,
  iconSize: [18, 18],
  iconAnchor: [9, 18],
});

export function DestinationMap({
  name,
  position,
}: {
  name: string;
  position: [number, number];
}) {
  return (
    <div className="h-64 overflow-hidden rounded-2xl border border-line sm:h-80">
      <MapContainer
        center={position}
        zoom={12}
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
        <Marker position={position} icon={destinationPin} title={name}>
          <Popup>{name}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
