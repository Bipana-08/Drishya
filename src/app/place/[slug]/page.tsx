import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { getDistrict } from "@/data/districts";
import {
  getAllPlaceParams,
  getDestinationBySlug,
} from "@/lib/db/destinations";

export const revalidate = 3600;

export function generateStaticParams() {
  return getAllPlaceParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const destination = await getDestinationBySlug(slug);
  return destination
    ? {
        title: destination.name,
        description: destination.shortDescription,
        alternates: {
          canonical: `/districts/${destination.districtId}/${destination.slug}`,
        },
      }
    : { title: "Place not found" };
}

export default async function PlacePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const destination = await getDestinationBySlug(slug);
  if (!destination) notFound();

  const district = getDistrict(destination.districtId);
  if (!district) notFound();
  permanentRedirect(`/districts/${district.slug}/${destination.slug}`);
}
