import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // CLI (migrate, db push) needs Neon's DIRECT (non-pooled) connection string.
    // Falls back to DATABASE_URL if you only have one.
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL!,
  },
});