import React from 'react';
import type { Metadata } from 'next';
import { ListPropertyClient } from '@/components/marketplace/ListPropertyClient';

export const metadata: Metadata = {
  title: 'List Your Dubai Property For Sale or Rent | Tanmiyat Real Estate',
  description:
    'Entrust your luxury residence or commercial asset to Tanmiyat. Verified RERA brokerage, private international investor network, and escrow security.',
};

export default function ListPropertyPage() {
  return (
    <main className="min-h-screen bg-[#0A0A09] text-[#F5F2EB] pt-24 pb-20">
      <ListPropertyClient />
    </main>
  );
}
