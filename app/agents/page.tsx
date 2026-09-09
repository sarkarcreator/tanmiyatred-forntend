import React from 'react';
import type { Metadata } from 'next';
import { repository } from '@/lib/data/repository';
import { AgentsDirectoryClient } from '@/components/marketplace/AgentsDirectoryClient';

export const metadata: Metadata = {
  title: 'Licensed Real Estate Advisors & Brokers in Dubai | Tanmiyat',
  description:
    'Meet our private wealth and luxury real estate advisors. Certified by the Dubai Real Estate Regulatory Agency (RERA). Broker ORN 12048.',
};

export const dynamic = 'force-dynamic';

export default async function AgentsPage() {
  const agents = await repository.getAgents();
  const allPropertiesResult = await repository.getProperties({ isPublic: true, limit: 100 });

  return (
    <main className="min-h-screen bg-[#0A0A09] text-[#F5F2EB] pt-24 pb-20">
      <AgentsDirectoryClient agents={agents} properties={allPropertiesResult.properties} />
    </main>
  );
}
