"use client";

import dynamic from "next/dynamic";
import type { Destination } from "@/lib/types";

const DestinationMap = dynamic(() => import("./DestinationMap").then((mod) => mod.DestinationMap), {
  ssr: false,
  loading: () => (
    <div className="h-64 animate-pulse rounded-2xl border border-line bg-stone/30 sm:h-80" />
  ),
});

export function DestinationMapLoader({
  destination,
}: {
  destination: Destination;
}) {
  if (!destination.position) return null;

  return (
    <section className="mx-auto mt-28 max-w-5xl">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-muted">
            Location
          </p>
          <h2 className="font-display mt-2 text-3xl text-ink">
            {destination.name}
          </h2>
        </div>
        <p className="hidden text-right text-xs text-muted sm:block">
          {destination.position[0].toFixed(4)}, {destination.position[1].toFixed(4)}
        </p>
      </div>
      <DestinationMap
        name={destination.name}
        position={destination.position}
      />
    </section>
  );
}
