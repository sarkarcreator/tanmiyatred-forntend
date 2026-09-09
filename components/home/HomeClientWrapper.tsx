'use client';

import React, { useState } from 'react';
import { ProjectItem, TimelineItem, NewsItem } from '@/types';
import { InquiryModal } from '@/components/inquiry/InquiryModal';
import { HeroSection } from '@/components/home/HeroSection';
import { FeaturedDevelopment } from '@/components/home/FeaturedDevelopment';
import { AboutSection } from '@/components/home/AboutSection';
import { DevelopmentsPreview } from '@/components/home/DevelopmentsPreview';
import { HeritageTimeline } from '@/components/home/HeritageTimeline';
import { InvestmentAdvantage } from '@/components/home/InvestmentAdvantage';
import { NewsPreview } from '@/components/home/NewsPreview';

interface HomeClientWrapperProps {
  projects: ProjectItem[];
  timeline: TimelineItem[];
  news: NewsItem[];
  featuredProject?: ProjectItem;
}

export const HomeClientWrapper: React.FC<HomeClientWrapperProps> = ({
  projects,
  timeline,
  news,
  featuredProject,
}) => {
  const [inquiryOpen, setInquiryOpen] = useState(false);

  return (
    <>
      <HeroSection onInquireClick={() => setInquiryOpen(true)} />

      {featuredProject && <FeaturedDevelopment project={featuredProject} />}

      <AboutSection />

      <DevelopmentsPreview projects={projects} />

      <HeritageTimeline timeline={timeline} />

      <InvestmentAdvantage onInquireClick={() => setInquiryOpen(true)} />

      <NewsPreview news={news} />

      <InquiryModal
        isOpen={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
      />
    </>
  );
};
