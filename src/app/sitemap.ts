import type { MetadataRoute } from "next";
import { districts } from "@/data/districts";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.SITE_URL ||
  "https://drishya.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/blog",
    "/guide-connect",
    "/hidden-gems",
  ].map((path) => ({
    url: new URL(path, siteUrl).toString(),
    lastModified: new Date(),
  }));

  const districtRoutes = districts.map((district) => ({
    url: new URL(`/districts/${district.slug}`, siteUrl).toString(),
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...districtRoutes];
}
