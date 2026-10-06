/**
 * Seeds districts + destinations from the TypeScript data files.
 *
 *   npx prisma db seed
 *
 * Safe to re-run: everything is upserted. BUT once the content team starts
 * editing rows in the database, re-running this will overwrite their edits
 * with the .ts values — stop reseeding existing districts at that point.
 */
import "dotenv/config";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../src/generated/prisma/client";
import { districts } from "../src/data/districts";
import { baitadiDestinations } from "./data/baitadi";
import { bajuraDestinations } from "./data/bajura";
import { bajhangDestinations } from "./data/bajhang";
import { dadeldhuraDestinations } from "./data/dadeldhura";

const allDestinations = [
  ...baitadiDestinations,
  ...bajuraDestinations,
  ...bajhangDestinations,
  ...dadeldhuraDestinations,
];

const adapter = new PrismaNeon({
  connectionString: process.env.DIRECT_URL ?? process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

const SEASONS = ["Spring", "Summer", "Monsoon", "Autumn", "Winter"];
const BUDGETS = ["Low", "Low-Medium", "Medium", "High"];

async function main() {
  const districtIds = new Set(districts.map((d) => d.id));

  for (const d of districts) {
    const data = {
      slug: d.slug,
      name: d.name,
      pcode: d.pcode,
      areaSqKm: d.areaSqKm,
      centerLat: d.center[0],
      centerLon: d.center[1],
      tagline: d.tagline,
      blurb: d.blurb,
    };
    await prisma.district.upsert({
      where: { id: d.id },
      create: { id: d.id, ...data },
      update: data,
    });
  }
  console.log(`Districts upserted: ${districts.length}`);

  const seen = new Set<string>();
  for (const x of allDestinations) {
    // Fail loudly on data mistakes instead of writing bad rows.
    if (!districtIds.has(x.districtId)) throw new Error(`${x.id}: unknown district "${x.districtId}"`);
    if (seen.has(x.id)) throw new Error(`Duplicate destination id ${x.id}`);
    seen.add(x.id);
    for (const s of x.bestSeasons) if (!SEASONS.includes(s)) throw new Error(`${x.id}: bad season "${s}"`);
    if (!BUDGETS.includes(x.budget)) throw new Error(`${x.id}: bad budget "${x.budget}"`);

    const data = {
      slug: x.slug,
      districtId: x.districtId,
      name: x.name,
      nameNepali: x.nameNepali ?? null,
      category: x.category,
      nearestTown: x.nearestTown ?? null,
      lat: x.position?.[0] ?? null,
      lon: x.position?.[1] ?? null,
      elevationM: x.elevationM ?? null,
      interestTags: x.interestTags,
      bestSeasons: x.bestSeasons,
      bestTimeNote: x.bestTimeNote ?? null,
      budget: x.budget,
      budgetNote: x.budgetNote ?? null,
      hiddenGem: x.hiddenGem,
      hiddenGemReason: x.hiddenGemReason ?? null,
      shortDescription: x.shortDescription,
      longDescription: x.longDescription ?? null,
      bestFor: x.bestFor ?? null,
      howToGetThere: x.howToGetThere ?? null,
      entryFee: x.entryFee ?? null,
      openingHours: x.openingHours ?? null,
      nearbyStaysFood: x.nearbyStaysFood ?? null,
      safetyNotes: x.safetyNotes ?? null,
      mediaPhoto: x.media?.photo ?? null,
      mediaPhotoUrl: x.media?.photoUrl ?? null,
      mediaCredit: x.media?.credit ?? null,
      sources: x.sources ?? [],
      alternateNames: x.alternateNames,
      culturalNote: x.culturalNote ?? null,
      verify: x.verify ?? [],
    };
    await prisma.destination.upsert({
      where: { id: x.id },
      create: { id: x.id, ...data },
      update: data,
    });
  }
  console.log(`Destinations upserted: ${allDestinations.length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());