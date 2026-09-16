export const dynamic = 'force-dynamic';
import React from 'react';
import { repository } from '@/lib/data/repository';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CookieBanner } from '@/components/layout/CookieBanner';
import { HomeClientWrapper } from '@/components/home/HomeClientWrapper';

export default async function HomePage() {
  const [projects, timeline, news, saleResult, rentResult] = await Promise.all([
    repository.getProjects(),
    repository.getTimeline(),
    repository.getNews(),
    repository.getProperties({ purpose: 'FOR_SALE', isPublic: true, page: 1, limit: 4, sort: 'featured' }),
    repository.getProperties({ purpose: 'FOR_RENT', isPublic: true, page: 1, limit: 4, sort: 'featured' }),
  ]);

  const featuredProject = projects.find((p) => p.slug === 'living-legends') || projects[0];
  const properties = [...saleResult.properties, ...rentResult.properties];

  return (
    <div className="bg-[#0A0A09] text-[#F5F2EB] min-h-screen flex flex-col selection:bg-[#B79A62] selection:text-[#0A0A09]">
      <Navbar />

      <main className="flex-grow">
        <HomeClientWrapper
          projects={projects}
          timeline={timeline}
          news={news}
          featuredProject={featuredProject}
          properties={properties}
        />
      </main>

      <Footer />
      <CookieBanner />
    </div>
  );
}
