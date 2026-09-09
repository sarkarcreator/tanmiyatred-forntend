import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { repository } from '@/lib/data/repository';
import { PropertyDetailClient } from '@/components/marketplace/PropertyDetailClient';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const property = await repository.getPropertyBySlug(slug);

  if (!property) {
    return {
      title: 'Property Not Found | Tanmiyat Real Estate',
    };
  }

  return {
    title: `${property.title} | ${property.community}, Dubai | Tanmiyat`,
    description: property.shortDescription || property.description.slice(0, 160),
    openGraph: {
      title: `${property.title} - ${property.community}`,
      description: property.shortDescription || property.description.slice(0, 160),
      images: property.featuredImage ? [{ url: property.featuredImage }] : [],
    },
  };
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const property = await repository.getPropertyBySlug(slug);

  if (!property) {
    notFound();
  }

  // Get similar properties in same community or purpose
  const similarResult = await repository.getProperties({
    community: property.community,
    purpose: property.purpose,
    isPublic: true,
    limit: 3,
  });

  const similarProperties = similarResult.properties.filter((p) => p.id !== property.id);

  return (
    <main className="min-h-screen bg-[#0A0A09] text-[#F5F2EB] pt-24 pb-20">
      <PropertyDetailClient property={property} similarProperties={similarProperties} />
    </main>
  );
}
