'use client';

import React, { useState } from 'react';
import type { ProjectItem, TimelineItem, NewsItem, PropertyItem } from '@/types';
import { InquiryModal } from '@/components/inquiry/InquiryModal';
import { HeroSection } from '@/components/home/HeroSection';
import { PropertyShowcase } from '@/components/home/PropertyShowcase';
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
  properties: PropertyItem[];
  featuredProject?: ProjectItem;
}

export const HomeClientWrapper: React.FC<HomeClientWrapperProps> = ({
  projects,
  timeline,
  news,
  properties,
  featuredProject,
}) => {
  const [inquiryOpen, setInquiryOpen] = useState(false);

  return (
    <>
      <HeroSection onInquireClick={() => setInquiryOpen(true)} />

      <PropertyShowcase properties={properties} />

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
