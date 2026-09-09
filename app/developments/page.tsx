export const dynamic = 'force-dynamic';
import React from 'react';
import type { Metadata } from 'next';
import { repository } from '@/lib/data/repository';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { DevelopmentsListClient } from '@/components/developments/DevelopmentsListClient';

export const metadata: Metadata = {
  title: 'Developments & Architectural Portfolio | Tanmiyat Real Estate Development',
  description:
    'Explore Tanmiyat’s landmark developments in Dubai, UAE including Living Legends master community, The Court Tower on Dubai Canal, and The Exchange Tower.',
};


export default async function DevelopmentsPage() {
  const projects = await repository.getProjects();

  return (
    <div className="bg-[#0A0A09] text-[#F5F2EB] min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* PAGE HEADER */}
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-semibold tracking-[0.25em] text-[#B79A62] uppercase block mb-3">
              PORTFOLIO OF DEVELOPMENTS
            </span>
            <h1 className="font-editorial text-4xl sm:text-6xl font-normal tracking-tight mb-4">
              Architectural Landmarks of Dubai.
            </h1>
            <p className="text-sm sm:text-base text-[#C8C0B3] font-light leading-relaxed">
              Explore our landmark master-planned communities, waterfront residences, and
              commercial headquarters crafted with precision, enduring value, and architectural
              distinction.
            </p>
          </div>

          {/* INTERACTIVE CLIENT FILTER & GRID */}
          <DevelopmentsListClient initialProjects={projects} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
