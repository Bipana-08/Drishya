# Drishya

Drishya is an interactive tourism platform for Sudurpaschim Province, Nepal. The project blends a scroll-driven hero map, district detail pages, and a structured destination data layer for a more compelling travel discovery experience across the nine districts of the province.

This repo already includes the core product foundation: a landing experience with the province map, district routing, a Prisma-backed destination model, and the data access layer that UI pages use instead of directly touching the database.

## What is built

- Province-wide landing experience with a pinned hero map and district listing
- District detail pages with page-level routing and structured content
- Client-side Leaflet maps for district geography and map markers
- Prisma + Postgres data model for destinations, with serializable server-safe accessors
- Seed data and map assets for Sudurpaschim province
- Prepared structure for later guide connections, blog pages, and AI assistant features

## Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- Framer Motion (`motion`)
- Leaflet + react-leaflet
- Prisma 7 + PostgreSQL/Neon

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Configure your environment variables in `.env.local`:

```bash
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
```

3. Start the app:

```bash
npm run dev
```

Open http://localhost:3000.

## Useful commands

```bash
npm run dev
npm run dev:lan
npm run build
npm run start
npx tsc --noEmit
npx prisma generate
npx prisma studio
npx prisma migrate dev --name <name>
npx prisma db seed
npm run cloudinary:seed
```

`npm run cloudinary:seed` uploads the images in
`public/destinations/<district>/<destination-slug>/` to Cloudinary and
upserts their metadata into Neon. It uses the destination slug to validate
each folder, and never deletes images from Cloudinary or Neon.

## Database and content model

The app is designed around a PostgreSQL data layer rather than scattered mock data in the UI.

- Destination records are defined in Prisma and exposed through `src/lib/db/destinations.ts`
- Pages and components consume plain serializable `Destination` objects from that layer
- The shared content shape lives in `src/lib/types.ts`
- Content data is seeded from the Prisma seed scripts and district source files under `prisma/data/`

Important rule from the project guide: UI code should only import destination data from the data-access layer, not directly from Prisma or the raw seed source files.

## Architecture overview

### 1) Hero landing map

The landing page uses a custom SVG-driven map in `src/components/hero-map/`.

- Districts are represented by SVG paths from `src/data/sudurpaschim-svg.json`
- Camera framing is calculated via `src/lib/pathBounds.ts` and `src/lib/heroCamera.ts`
- The district navigation and scroll interaction live in `src/components/hero-map/HeroMap.tsx` and `DistrictNav.tsx`
- This is intentionally separate from the district-page map, which uses real geographic geometry

### 2) District pages and map layer

District detail screens are routed under `src/app/districts/[slug]/` and use Leaflet for geo-aware map rendering.

- Map data is served from `public/data/sudurpaschim-districts.simplified.geojson`
- District map components live in `src/components/district-map/`
- Leaflet is loaded client-side with `ssr: false`

### 3) Data flow

The project follows a clear pattern:

- `prisma/schema.prisma` defines the database schema
- Prisma seed files provide content sources
- `src/lib/db/destinations.ts` converts DB rows into the app’s serializable `Destination` type
- Pages render material from that normalized layer

## Project structure

```text
.
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   ├── data/
│   │   ├── baitadi.ts
│   │   ├── bajhang.ts
│   │   ├── bajura.ts
│   │   ├── dadeldhura.ts
│   │   ├── destinations.ts
│   │   └── ...
│   └── migrations/
├── public/
│   └── data/
│       └── sudurpaschim-districts.simplified.geojson
├── src/
│   ├── app/
│   │   ├── blog/
│   │   ├── districts/
│   │   ├── guide-connect/
│   │   ├── hidden-gems/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── district-map/
│   │   ├── hero-map/
│   │   └── site/
│   ├── data/
│   │   ├── districts.ts
│   │   ├── landmarks.ts
│   │   ├── sample-pois.ts
│   │   ├── sudurpaschim-svg.json
│   │   └── ...
│   ├── lib/
│   │   ├── db/
│   │   ├── heroCamera.ts
│   │   ├── pathBounds.ts
│   │   └── types.ts
│   └── generated/prisma/
├── map-data/
├── nepal-districts/
├── next.config.ts
├── package.json
├── tsconfig.json
├── postcss.config.mjs
├── prisma.config.ts
├── README.md
└── .env.local
```

## Content and data guidance

A few rules are important for contributors:

- `position` is `[lat, lon] | null`. Do not invent coordinates.
- Most destination fields are optional; hide missing blocks instead of rendering placeholder text.
- `verify?: string[]` should be used when source details are unconfirmed.
- Do not fabricate history, fees, opening hours, or phone numbers.
- Long-form notes and descriptions are planned as future RAG corpus content, so keep them as clear prose.
- District and landmark files under `src/data/` are starter content. They are not the final runtime source of truth for destinations.

## Build and deployment notes

- The app is designed for Vercel hosting and free-tier-friendly deployment.
- Pages are prerendered with `generateStaticParams` and a revalidation strategy to remain stable when the database is briefly unavailable.
- The project uses a custom visual design system in `src/app/globals.css` with tokens like `forest`, `slate`, `brass`, `stone`, and `paper`.
- The app supports dark mode through `html[data-theme="dark"]` token overrides.

## Data provenance

The district boundary data is derived from the Nepal administrative boundary dataset used for Sudurpaschim Province. Source assets and generated map files live under `map-data/` and `nepal-districts/`.

## Open roadmap

The current project already lays the foundation for the full tourism platform, but the following phases are still planned:

- guide connections and local experts
- blog and editorial content
- hidden gems and destination discovery flows
- recommendation engine
- RAG-powered AI assistant

## Contributing

When contributing, keep changes small and consistent with the existing structure. Prefer the current data-access boundaries and avoid bypassing the intended Prisma layer.

Before wrapping up work, run:

```bash
npx tsc --noEmit
```

This repo does not yet have a dedicated lint script, and there is no test suite configured yet.
