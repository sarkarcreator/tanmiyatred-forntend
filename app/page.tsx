export const dynamic = 'force-dynamic';
import React from 'react';
import { repository } from '@/lib/data/repository';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CookieBanner } from '@/components/layout/CookieBanner';
import { HomeClientWrapper } from '@/components/home/HomeClientWrapper';
 // ISR revalidation

export default async function HomePage() {
  const [projects, timeline, news] = await Promise.all([
    repository.getProjects(),
    repository.getTimeline(),
    repository.getNews(),
  ]);

  const featuredProject = projects.find((p) => p.slug === 'living-legends') || projects[0];

  return (
    <div className="bg-[#0A0A09] text-[#F5F2EB] min-h-screen flex flex-col selection:bg-[#B79A62] selection:text-[#0A0A09]">
      <Navbar />

      <main className="flex-grow">
        <HomeClientWrapper
          projects={projects}
          timeline={timeline}
          news={news}
          featuredProject={featuredProject}
        />
      </main>

      <Footer />
      <CookieBanner />
    </div>
  );
}
