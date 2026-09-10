import React from 'react';
import type { Metadata } from 'next';
import { repository } from '@/lib/data/repository';
import { PropertiesMarketplaceClientV2 } from '@/components/marketplace/PropertiesMarketplaceClientV2';
import { BackToHome } from '@/components/layout/BackToHome';

export const metadata: Metadata = {
  title: 'Luxury Properties For Sale & Rent in Dubai | Tanmiyat Real Estate',
  description: 'Explore curated penthouses, signature villas, and waterfront residences across Business Bay, Dubailand, and prime Dubai locations. 100% RERA verified.',
  openGraph: {
    title: 'Luxury Dubai Properties | Tanmiyat Marketplace',
    description: 'Buy & rent verified luxury residences in Dubai. Direct developer and premier brokerage listings with DLD compliance.',
  },
};

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function PropertiesPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const purpose = typeof resolvedParams.purpose === 'string' ? resolvedParams.purpose : undefined;
  const community = typeof resolvedParams.community === 'string' ? resolvedParams.community : undefined;
  const propertyType = typeof resolvedParams.propertyType === 'string' ? resolvedParams.propertyType : undefined;
  const bedrooms = typeof resolvedParams.bedrooms === 'string' ? resolvedParams.bedrooms : undefined;
  const search = typeof resolvedParams.search === 'string' ? resolvedParams.search : undefined;
  const sort = typeof resolvedParams.sort === 'string' ? resolvedParams.sort : 'newest';

  const result = await repository.getProperties({ purpose, community, propertyType, bedrooms, search, sort, isPublic: true, page: 1, limit: 24 });
  const agents = await repository.getAgents({ status: 'ACTIVE' });

  return (
    <main className="min-h-screen bg-[#0A0A09] text-[#F5F2EB] pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-4 pb-5 sm:px-6 lg:px-8"><BackToHome /></div>
      <PropertiesMarketplaceClientV2
        initialProperties={result.properties}
        initialTotal={result.total}
        initialPage={result.page}
        totalPages={result.totalPages}
        agents={agents}
        initialPurpose={purpose}
        initialCommunity={community}
        initialType={propertyType}
        initialBedrooms={bedrooms}
        initialSort={sort}
        initialSearch={search}
      />
    </main>
  );
}
