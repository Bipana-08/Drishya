"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import type { Destination } from "@/lib/types";
import type { District } from "@/lib/types";
import { DestinationMapLoader } from "./DestinationMapLoader";

interface PlaceDetailProps {
  destination: Destination;
  district: District;
  nextPlace?: Destination;
  nextDistrict?: District;
}

function imageFor(destination: Destination) {
  return destination.media?.photos?.[0]?.secureUrl;
}

function EditorialImage({
  destination,
  photo,
  index,
}: {
  destination: Destination;
  photo: NonNullable<NonNullable<Destination["media"]>["photos"]>[number];
  index: number;
}) {
  const reduced = useReducedMotion();

  return (
    <motion.img
      src={photo.secureUrl}
      alt={`${destination.name} view ${index + 2}`}
      className="h-[min(58vh,34rem)] w-full object-cover"
      initial={reduced ? undefined : { opacity: 0, y: 24 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{
        duration: reduced ? 0 : 0.7,
        ease: [0.16, 1, 0.3, 1],
      }}
    />
  );
}

function RevealSection({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function PlaceDetail({
  destination,
  district,
  nextPlace,
  nextDistrict,
}: PlaceDetailProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedMenuDetail, setSelectedMenuDetail] = useState<string | null>(
    null,
  );
  const reduced = useReducedMotion();
  const image = imageFor(destination);
  const gallery = destination.media?.photos?.filter(
    (photo) => photo.secureUrl !== image,
  ) ?? [];
  const paragraphs = destination.longDescription
    ? destination.longDescription.split(/\n+/).filter(Boolean)
    : [destination.shortDescription];
  const notes = [
    ["Cultural note", destination.culturalNote],
    ["Best for", destination.bestFor],
    ["Safety notes", destination.safetyNotes],
  ].filter((note): note is [string, string] => Boolean(note[1]));
  const info = [
    ["Entry", destination.entryFee],
    ["Best time", destination.bestSeasons.join(", ")],
    ["Budget", destination.budget],
    ["Nearest town", destination.nearestTown],
    ["Elevation", destination.elevationM ? `${destination.elevationM} m` : undefined],
    ["Hours", destination.openingHours],
  ].filter((row): row is [string, string] => Boolean(row[1]));
  const tags = [...destination.category, ...destination.interestTags];

  return (
    <main className="place-page min-h-screen bg-paper text-ink">
      <div className="place-topbar">
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="destination-menu"
          className="text-xs uppercase tracking-[0.22em] text-muted transition-colors hover:text-accent-ink"
        >
          Menu {menuOpen ? "−" : "+"}
        </button>
        <Link href="/map" className="text-xs uppercase tracking-[0.22em] text-ink">
          Map
        </Link>
      </div>

      {menuOpen && (
        <aside
          id="destination-menu"
          className="fixed left-5 top-20 z-30 max-h-[calc(100vh-6rem)] w-[min(22rem,calc(100vw-2.5rem))] overflow-y-auto border border-line bg-paper/95 p-5 text-ink shadow-[0_24px_60px_-24px_color-mix(in_srgb,var(--color-forest-deep)_45%,transparent)] backdrop-blur-xl sm:left-10"
        >
          <div className="flex items-start justify-between gap-5">
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-muted">
                {district.name}
              </p>
              <h2 className="font-display mt-2 text-3xl leading-none">
                {destination.name}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Close destination menu"
              className="text-xl leading-none text-muted hover:text-accent-ink"
            >
              ×
            </button>
          </div>
          <div className="mt-5 border-t border-line pt-4">
            <div className="grid gap-2">
              {[
                ["Description", destination.longDescription ?? destination.shortDescription],
                ["Safety notes", destination.safetyNotes],
                ["How to get there", destination.howToGetThere],
                ["Best time", destination.bestTimeNote ?? destination.bestSeasons.join(", ")],
                ["Nearby stays & food", destination.nearbyStaysFood],
                ["Cultural note", destination.culturalNote],
              ]
                .filter((item): item is [string, string] => Boolean(item[1]))
                .map(([label, value]) => (
                  <div key={label}>
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedMenuDetail((selected) =>
                          selected === label ? null : label,
                        )
                      }
                      aria-expanded={selectedMenuDetail === label}
                      className="flex w-full items-center justify-between border border-line px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-[0.14em] text-ink transition-colors hover:border-accent-ink hover:text-accent-ink"
                    >
                      {label}
                      <span aria-hidden>{selectedMenuDetail === label ? "−" : "+"}</span>
                    </button>
                    {selectedMenuDetail === label && (
                      <p className="border-x border-b border-line bg-paper/60 px-3 py-3 text-sm leading-relaxed text-muted">
                        {value}
                      </p>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </aside>
      )}

      <div className="mx-auto max-w-[90rem] px-5 pb-24 pt-32 sm:px-10 lg:px-16">
        <RevealSection className="mx-auto max-w-5xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-ink">
            {district.name}
          </p>
          <h1 className="font-display mt-5 max-w-full break-words text-[clamp(3rem,11vw,9.5rem)] font-medium uppercase leading-[0.88] tracking-[0.06em] text-ink [overflow-wrap:anywhere]">
            {destination.name}
          </h1>
          {destination.nameNepali && (
            <p className="mt-4 text-lg text-muted">{destination.nameNepali}</p>
          )}
          <div className="mx-auto mt-10 h-20 w-px bg-line" />
          <p className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            {destination.shortDescription}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="border border-line px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-muted"
              >
                {tag}
              </span>
            ))}
          </div>
          {destination.hiddenGem && (
            <p className="mx-auto mt-5 max-w-lg text-xs uppercase tracking-[0.18em] text-accent-ink">
              Hidden gem
              {destination.hiddenGemReason
                ? ` · ${destination.hiddenGemReason}`
                : ""}
            </p>
          )}
        </RevealSection>

        <div id="destination-details">
        <RevealSection
          className="mx-auto mt-32 max-w-6xl"
          delay={0.15}
        >
          <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div className="font-display text-[clamp(2rem,4vw,4.5rem)] leading-[1.05] text-ink">
              {destination.bestFor || destination.shortDescription}
            </div>
            <div className="space-y-6 text-base leading-[1.9] text-muted sm:text-lg">
              {paragraphs.map((paragraph, index) => (
                <RevealSection key={`${paragraph.slice(0, 20)}-${index}`} delay={index * 0.15}>
                  <p>{paragraph}</p>
                </RevealSection>
              ))}
            </div>
          </div>
        </RevealSection>
        </div>

        {(destination.howToGetThere ||
          destination.nearbyStaysFood ||
          destination.bestTimeNote ||
          destination.budgetNote) && (
          <RevealSection className="mx-auto mt-28 max-w-5xl" delay={0.15}>
            <div className="grid gap-8 border-y border-line py-8 sm:grid-cols-2">
              {[
                ["How to get there", destination.howToGetThere],
                ["Nearby stays & food", destination.nearbyStaysFood],
                ["Best-time note", destination.bestTimeNote],
                ["Budget note", destination.budgetNote],
              ]
                .filter((item): item is [string, string] => Boolean(item[1]))
                .map(([label, value]) => (
                  <div key={label}>
                    <h2 className="text-[11px] uppercase tracking-[0.24em] text-muted">
                      {label}
                    </h2>
                    <p className="mt-3 text-base leading-relaxed text-ink">
                      {value}
                    </p>
                  </div>
                ))}
            </div>
          </RevealSection>
        )}

        {image && (
          <RevealSection className="mx-[calc(50%-50vw)] mt-28" delay={0.15}>
            <motion.img
              layoutId={destination.slug}
              src={image}
              alt={destination.name}
              className="h-[min(70vh,48rem)] w-full object-cover"
            />
            {destination.media?.credit && (
              <p className="mt-3 text-right text-[10px] uppercase tracking-[0.16em] text-muted">
                {destination.media.credit}
              </p>
            )}
          </RevealSection>
        )}

        {gallery[0] && (
          <RevealSection className="mx-auto mt-20 max-w-5xl" delay={0.12}>
            <EditorialImage
              destination={destination}
              photo={gallery[0]}
              index={0}
            />
          </RevealSection>
        )}

        {notes.length > 0 && (
          <RevealSection className="mx-auto mt-32 max-w-3xl" delay={0.15}>
            <div className="space-y-8 border-t border-line pt-8">
              {notes.map(([label, note], index) => (
                <div key={label} className="grid grid-cols-[3rem_1fr] gap-5">
                  <span className="font-display text-2xl text-accent-ink">
                    {["I", "II", "III"][index]}
                  </span>
                  <div>
                    <h2 className="text-[11px] uppercase tracking-[0.24em] text-muted">
                      {label}
                    </h2>
                    <p className="mt-2 text-base leading-relaxed text-muted">
                      {note}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </RevealSection>
        )}

        {gallery[1] && (
          <RevealSection className="mx-auto mt-28 max-w-4xl" delay={0.12}>
            <EditorialImage
              destination={destination}
              photo={gallery[1]}
              index={1}
            />
          </RevealSection>
        )}

        {info.length > 0 && (
          <RevealSection className="mx-auto mt-32 max-w-2xl text-center" delay={0.15}>
            <dl className="border-y border-line">
              {info.map(([label, value]) => (
                <div
                  key={label}
                  className="grid grid-cols-2 gap-5 border-b border-line py-5 text-left last:border-b-0 sm:grid-cols-[1fr_1.5fr]"
                >
                  <dt className="text-[11px] uppercase tracking-[0.24em] text-muted">
                    {label}
                  </dt>
                  <dd className="text-sm uppercase tracking-[0.12em] text-ink">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </RevealSection>
        )}

        {gallery[2] && (
          <RevealSection className="mx-auto mt-28 max-w-5xl" delay={0.12}>
            <EditorialImage
              destination={destination}
              photo={gallery[2]}
              index={2}
            />
          </RevealSection>
        )}

        <DestinationMapLoader destination={destination} />

        {(destination.alternateNames.length > 0 ||
          (destination.sources?.length ?? 0) > 0 ||
          (destination.verify?.length ?? 0) > 0) && (
          <RevealSection className="mx-auto mt-28 grid max-w-5xl gap-10 border-t border-line pt-8 sm:grid-cols-2" delay={0.15}>
            {destination.alternateNames.length > 0 && (
              <div>
                <h2 className="text-[11px] uppercase tracking-[0.24em] text-muted">
                  Also known as
                </h2>
                <p className="mt-3 text-base leading-relaxed text-ink">
                  {destination.alternateNames.join(" · ")}
                </p>
              </div>
            )}
            {destination.sources && destination.sources.length > 0 && (
              <div>
                <h2 className="text-[11px] uppercase tracking-[0.24em] text-muted">
                  Sources
                </h2>
                <ul className="mt-3 space-y-2 text-sm text-ink">
                  {destination.sources.map((source) => (
                    <li key={source}>
                      <a
                        href={source}
                        target="_blank"
                        rel="noreferrer"
                        className="break-all hover:text-accent-ink"
                      >
                        {source}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {destination.verify && destination.verify.length > 0 && (
              <p className="text-xs leading-relaxed text-muted sm:col-span-2">
                Some details are still being verified:{" "}
                {destination.verify.join(", ")}.
              </p>
            )}
          </RevealSection>
        )}

        {gallery.length > 3 && (
          <RevealSection
            className="mx-auto mt-28 grid max-w-6xl gap-5 sm:grid-cols-2"
            delay={0.12}
          >
            {gallery.slice(3).map((photo, index) => (
              <EditorialImage
                key={photo.id}
                destination={destination}
                photo={photo}
                index={index + 3}
              />
            ))}
          </RevealSection>
        )}

        <RevealSection className="mx-auto mt-36 flex max-w-5xl flex-col gap-6 border-t border-line pt-8 sm:flex-row sm:items-end sm:justify-between" delay={0.15}>
          <Link href="/map" className="text-sm uppercase tracking-[0.2em] text-muted hover:text-accent-ink">
            ← Back to map
          </Link>
          {nextPlace && nextDistrict && (
            <Link
              href={`/districts/${nextDistrict.slug}/${nextPlace.slug}`}
              className="text-right"
            >
              <span className="block text-[10px] uppercase tracking-[0.22em] text-muted">
                Next place · {nextDistrict.name}
              </span>
              <span className="font-display mt-1 block text-3xl text-ink hover:text-accent-ink">
                {nextPlace.name} →
              </span>
            </Link>
          )}
        </RevealSection>
      </div>
    </main>
  );
}
