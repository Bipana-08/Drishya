/**
 * Data-access layer. Pages and components import ONLY from here — never from
 * the Prisma client directly — so the database can change without touching UI.
 * Everything returned is a plain, serializable `Destination`, safe to pass
 * from server components into client components (e.g. the Leaflet map).
 */
import { prisma } from "./prisma";
import type {
  BudgetLevel,
  Destination,
  InterestTag,
  Season,
} from "@/lib/types";
import type { Destination as Row } from "@/generated/prisma/client";

function toDestination(r: Row): Destination {
  return {
    id: r.id,
    slug: r.slug,
    districtId: r.districtId,
    name: r.name,
    nameNepali: r.nameNepali ?? undefined,
    category: r.category,
    nearestTown: r.nearestTown ?? undefined,
    position: r.lat != null && r.lon != null ? [r.lat, r.lon] : null,
    elevationM: r.elevationM ?? undefined,
    interestTags: r.interestTags as InterestTag[],
    bestSeasons: r.bestSeasons as Season[],
    bestTimeNote: r.bestTimeNote ?? undefined,
    budget: r.budget as BudgetLevel,
    budgetNote: r.budgetNote ?? undefined,
    hiddenGem: r.hiddenGem,
    hiddenGemReason: r.hiddenGemReason ?? undefined,
    shortDescription: r.shortDescription,
    longDescription: r.longDescription ?? undefined,
    bestFor: r.bestFor ?? undefined,
    howToGetThere: r.howToGetThere ?? undefined,
    entryFee: r.entryFee ?? undefined,
    openingHours: r.openingHours ?? undefined,
    nearbyStaysFood: r.nearbyStaysFood ?? undefined,
    safetyNotes: r.safetyNotes ?? undefined,
    media: r.mediaPhoto
      ? {
          photo: r.mediaPhoto,
          photoUrl: r.mediaPhotoUrl ?? undefined,
          credit: r.mediaCredit ?? "",
        }
      : undefined,
    sources: r.sources.length ? r.sources : undefined,
    alternateNames: r.alternateNames,
    culturalNote: r.culturalNote ?? undefined,
    verify: r.verify.length ? r.verify : undefined,
  };
}

export async function getDestinationsForDistrict(
  districtId: string,
): Promise<Destination[]> {
  const rows = await prisma.destination.findMany({
    where: { districtId },
    orderBy: { name: "asc" },
  });
  return rows.map(toDestination);
}

export async function getDestination(
  districtId: string,
  slug: string,
): Promise<Destination | null> {
  const row = await prisma.destination.findUnique({
    where: { districtId_slug: { districtId, slug } },
  });
  return row ? toDestination(row) : null;
}

export async function getAllDestinationParams(): Promise<
  { slug: string; destination: string }[]
> {
  const rows = await prisma.destination.findMany({
    select: { districtId: true, slug: true },
  });
  return rows.map((row) => ({ slug: row.districtId, destination: row.slug }));
}

export async function getMappableDestinations(
  districtId: string,
): Promise<Destination[]> {
  const all = await getDestinationsForDistrict(districtId);
  return all.filter((destination) => destination.position !== null);
}
