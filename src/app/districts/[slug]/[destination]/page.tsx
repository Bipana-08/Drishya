import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { DistrictMapLoader } from "@/components/district-map/DistrictMapLoader";
import { getDistrict } from "@/data/districts";
import {
  getAllDestinationParams,
  getDestination,
} from "@/lib/db/destinations";

export const revalidate = 3600;

export function generateStaticParams() {
  return getAllDestinationParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; destination: string }>;
}): Promise<Metadata> {
  const { slug, destination: destinationSlug } = await params;
  const district = getDistrict(slug);
  if (!district) return { title: "Destination not found — Drishya" };

  const destination = await getDestination(district.id, destinationSlug);
  if (!destination) return { title: "Destination not found — Drishya" };

  return {
    title: `${destination.name} — Drishya`,
    description: destination.shortDescription,
  };
}

function DetailPanel({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="glass glass-card rounded-2xl p-5 sm:p-6">
      <h2 className="font-display text-2xl font-semibold text-ink">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-ink/75">
        {children}
      </div>
    </section>
  );
}

export default async function DestinationPage({
  params,
}: {
  params: Promise<{ slug: string; destination: string }>;
}) {
  const { slug, destination: destinationSlug } = await params;
  const district = getDistrict(slug);
  if (!district) notFound();

  const destination = await getDestination(district.id, destinationSlug);
  if (!destination) notFound();

  return (
    <main className="mx-auto max-w-6xl px-4 pb-16 pt-[calc(var(--header-h)+1.5rem)]">
      <Link
        href={`/districts/${district.slug}`}
        className="text-sm text-muted transition-colors hover:text-accent-ink"
      >
        ← Back to {district.name}
      </Link>

      <header className="glass mt-3 rounded-3xl p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-ink">
              {district.name}
            </p>
            <h1 className="font-display mt-2 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
              {destination.name}
            </h1>
            {destination.nameNepali && (
              <p className="mt-1 text-lg text-muted">{destination.nameNepali}</p>
            )}
          </div>
          {destination.hiddenGem && (
            <span className="rounded-full bg-brass px-3 py-1.5 text-sm font-semibold text-forest">
              Hidden gem
            </span>
          )}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {destination.category.map((category) => (
            <span
              key={category}
              className="rounded-full border border-line px-3 py-1 text-xs text-muted"
            >
              {category}
            </span>
          ))}
        </div>
        <p className="mt-5 max-w-3xl text-base leading-relaxed text-ink/80">
          {destination.shortDescription}
        </p>
        {destination.verify?.length ? (
          <p className="mt-4 text-xs text-muted">
            Some details are still being verified.
          </p>
        ) : null}
      </header>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          {destination.longDescription && (
            <DetailPanel title="About this destination">
              <p>{destination.longDescription}</p>
            </DetailPanel>
          )}

          {(destination.bestFor ||
            destination.elevationM !== undefined ||
            destination.nearestTown ||
            destination.budget ||
            destination.bestSeasons.length ||
            destination.interestTags.length) && (
            <DetailPanel title="At a glance">
              {destination.bestFor && (
                <p>
                  <strong className="text-ink">Best for:</strong>{" "}
                  {destination.bestFor}
                </p>
              )}
              {destination.elevationM !== undefined && (
                <p>
                  <strong className="text-ink">Elevation:</strong>{" "}
                  {destination.elevationM.toLocaleString()} m
                </p>
              )}
              {destination.nearestTown && (
                <p>
                  <strong className="text-ink">Nearest town:</strong>{" "}
                  {destination.nearestTown}
                </p>
              )}
              <p>
                <strong className="text-ink">Budget:</strong>{" "}
                {destination.budget}
                {destination.budgetNote && ` — ${destination.budgetNote}`}
              </p>
              {destination.bestSeasons.length > 0 && (
                <p>
                  <strong className="text-ink">Best seasons:</strong>{" "}
                  {destination.bestSeasons.join(", ")}
                  {destination.bestTimeNote && ` — ${destination.bestTimeNote}`}
                </p>
              )}
              {destination.interestTags.length > 0 && (
                <div>
                  <strong className="text-ink">Interests:</strong>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {destination.interestTags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-forest/10 px-2.5 py-1 text-xs text-ink"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </DetailPanel>
          )}

          {(destination.howToGetThere ||
            destination.entryFee ||
            destination.openingHours ||
            destination.nearbyStaysFood ||
            destination.safetyNotes) && (
            <DetailPanel title="Practical information">
              {destination.howToGetThere && (
                <p>
                  <strong className="text-ink">How to get there:</strong>{" "}
                  {destination.howToGetThere}
                </p>
              )}
              {destination.entryFee && (
                <p>
                  <strong className="text-ink">Entry fee:</strong>{" "}
                  {destination.entryFee}
                </p>
              )}
              {destination.openingHours && (
                <p>
                  <strong className="text-ink">Opening hours:</strong>{" "}
                  {destination.openingHours}
                </p>
              )}
              {destination.nearbyStaysFood && (
                <p>
                  <strong className="text-ink">Stays and food:</strong>{" "}
                  {destination.nearbyStaysFood}
                </p>
              )}
              {destination.safetyNotes && (
                <p>
                  <strong className="text-ink">Safety:</strong>{" "}
                  {destination.safetyNotes}
                </p>
              )}
            </DetailPanel>
          )}
        </div>

        <aside className="space-y-6">
          {destination.position && (
            <DistrictMapLoader
              district={district}
              destinations={[destination]}
              compact
            />
          )}
          {destination.culturalNote && (
            <DetailPanel title="Cultural note">
              <p>{destination.culturalNote}</p>
            </DetailPanel>
          )}
          {destination.alternateNames.length > 0 && (
            <DetailPanel title="Also known as">
              <p>{destination.alternateNames.join(", ")}</p>
            </DetailPanel>
          )}
          {destination.media?.photoUrl || destination.media?.credit ? (
            <DetailPanel title="Media">
              {destination.media.photoUrl && (
                <a
                  href={destination.media.photoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-accent-ink underline underline-offset-2"
                >
                  View photo source
                </a>
              )}
              {destination.media.credit && (
                <p>
                  <strong className="text-ink">Credit:</strong>{" "}
                  {destination.media.credit}
                </p>
              )}
            </DetailPanel>
          ) : null}
        </aside>
      </div>
    </main>
  );
}
