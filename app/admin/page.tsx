import React from 'react';
import type { Metadata } from 'next';
import { repository } from '@/lib/data/repository';
import { AdminDashboardClient } from '@/components/admin/AdminDashboardClient';

export const metadata: Metadata = {
  title: 'Executive Admin & Lead Management Portal | Tanmiyat Real Estate Development',
  description: 'Authorized administrative management for developments, units, inquiries, and CMS.',
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = 'force-dynamic';

export default function AdminPage() {
  return (
    <AdminDashboardClient
      initialProjects={[]}
      initialInquiries={[]}
      initialTimeline={[]}
      initialNews={[]}
      initialProperties={[]}
      initialLeads={[]}
      initialAgents={[]}
      initialViewings={[]}
      initialOffers={[]}
      initialDeals={[]}
      initialCommissions={[]}
    />
  );
}
