import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { districts, getDistrict } from "@/data/districts";
import { DistrictMapLoader } from "@/components/district-map/DistrictMapLoader";
import {
  getDestinationsForDistrict,
  getMappableDestinations,
} from "@/lib/db/destinations";

export const revalidate = 3600;

// Prerender all nine district pages at build time.
export function generateStaticParams() {
  return districts.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const district = getDistrict(slug);
  if (!district) return { title: "District not found — Drishya" };
  return { title: `${district.name} — Drishya`, description: district.blurb };
}

export default async function DistrictPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const district = getDistrict(slug);
  if (!district) notFound();

  const [destinations, mappableDestinations] = await Promise.all([
    getDestinationsForDistrict(district.id),
    getMappableDestinations(district.id),
  ]);
  const hiddenGemCount = destinations.filter(
    (destination) => destination.hiddenGem,
  ).length;

  return (
    // The dock floats, so pages pad themselves clear of it.
    <main className="mx-auto max-w-6xl px-4 pb-16 pt-[calc(var(--header-h)+1.5rem)]">
      <Link
        href="/"
        className="text-sm text-muted transition-colors hover:text-accent-ink"
      >
        ← Back to map
      </Link>

      <header className="mt-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-ink">
          {district.tagline}
        </p>
        <h1 className="font-display mt-1.5 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          {district.name}
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink/70">
          {district.blurb}
        </p>
        <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-sm">
          <div>
            <dt className="text-muted">Area</dt>
            <dd className="font-medium text-ink">
              {district.areaSqKm.toLocaleString()} km²
            </dd>
          </div>
          <div>
            <dt className="text-muted">Center</dt>
            <dd className="font-medium text-ink">
              {district.center[0].toFixed(3)}, {district.center[1].toFixed(3)}
            </dd>
          </div>
          <div>
            <dt className="text-muted">Code</dt>
            <dd className="font-medium text-ink">{district.pcode}</dd>
          </div>
        </dl>
      </header>

      <section className="mt-6">
        <DistrictMapLoader
          district={district}
          destinations={mappableDestinations}
        />
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          ["Destinations", destinations.length],
          ["Hidden gems", hiddenGemCount],
          ["Mapped on map", mappableDestinations.length],
        ].map(([label, count]) => (
          <div key={label} className="glass glass-card rounded-2xl p-5">
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
              {label}
            </h2>
            <p className="font-display mt-1 text-3xl font-semibold text-ink">
              {count}
            </p>
          </div>
        ))}
      </section>

      <section className="mt-8">
        <h2 className="font-display text-3xl font-semibold text-ink">
          Destinations
        </h2>
        {destinations.length === 0 ? (
          <p className="glass mt-4 rounded-2xl p-5 text-sm text-ink/60">
            Content coming soon for {district.name}.
          </p>
        ) : (
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {destinations.map((destination) => (
              <Link
                key={destination.id}
                href={`/districts/${district.slug}/${destination.slug}`}
                className="glass glass-card rounded-2xl p-5 transition-transform hover:-translate-y-0.5"
              >
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-display text-2xl font-semibold text-ink">
                    {destination.name}
                  </h3>
                  {destination.hiddenGem && (
                    <span className="shrink-0 rounded-full bg-brass px-2.5 py-1 text-xs font-semibold text-forest">
                      Hidden gem
                    </span>
                  )}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {destination.category.map((category) => (
                    <span
                      key={category}
                      className="rounded-full border border-line px-2.5 py-1 text-xs text-muted"
                    >
                      {category}
                    </span>
                  ))}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-ink/70">
                  {destination.shortDescription}
                </p>
                <p className="mt-4 text-sm font-medium text-accent-ink">
                  Budget: {destination.budget} →
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
