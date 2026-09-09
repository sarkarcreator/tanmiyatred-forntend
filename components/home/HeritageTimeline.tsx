'use client';

import React, { useState } from 'react';
import { TimelineItem } from '@/types';
import { useI18n } from '@/lib/i18n/context';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface HeritageTimelineProps {
  timeline: TimelineItem[];
}

export const HeritageTimeline: React.FC<HeritageTimelineProps> = ({ timeline }) => {
  const { t, locale, isRTL } = useI18n();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const current = timeline[selectedIndex] || timeline[0];

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : timeline.length - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev < timeline.length - 1 ? prev + 1 : 0));
  };

  if (!timeline || timeline.length === 0) return null;

  return (
    <section id="legacy" className="py-24 sm:py-32 bg-[#0A0A09] relative border-b border-[#22201C] text-[#F5F2EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* SECTION HEADER */}
        <div className="max-w-3xl mb-16">
          <span className="text-xs font-semibold tracking-[0.25em] text-[#B79A62] uppercase block mb-3">
            {t.timeline.eyebrow}
          </span>
          <h2 className="font-editorial text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight mb-4">
            {t.timeline.headline}
          </h2>
          <p className="text-sm sm:text-base text-[#C8C0B3] font-light max-w-2xl leading-relaxed">
            {t.timeline.subtitle}
          </p>
        </div>

        {/* TIMELINE NAV STRIP */}
        <div className="relative mb-14 border-b border-[#22201C] pb-4">
          <div className="flex items-center space-x-6 sm:space-x-12 rtl:space-x-reverse overflow-x-auto no-scrollbar py-2">
            {timeline.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => setSelectedIndex(idx)}
                className={`group flex flex-col items-start transition-all shrink-0 pb-2 relative ${
                  selectedIndex === idx ? 'opacity-100' : 'opacity-40 hover:opacity-75'
                }`}
              >
                <span className="font-editorial text-2xl sm:text-3xl font-medium tracking-wider group-hover:text-[#B79A62] transition-colors">
                  {item.year}
                </span>
                <span className="text-[11px] uppercase tracking-widest text-[#8C867E]">
                  Milestone
                </span>
                {selectedIndex === idx && (
                  <span className="absolute -bottom-4 left-0 right-0 h-0.5 bg-[#B79A62]" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ACTIVE MILESTONE SPOTLIGHT */}
        <div className="bg-[#171715] border border-[#25221E] p-8 sm:p-14 transition-all">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Year & Nav */}
            <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-[#2B2925] pb-6 lg:pb-0 lg:pr-8 rtl:lg:border-r-0 rtl:lg:border-l rtl:lg:pl-8">
              <div className="flex items-center gap-2 text-[#B79A62] text-xs uppercase tracking-widest mb-3">
                <Calendar className="w-4 h-4" />
                <span>Tanmiyat Archive</span>
              </div>
              <div className="font-editorial text-6xl sm:text-7xl lg:text-8xl text-[#B79A62] font-light tracking-tighter leading-none mb-6">
                {current.year}
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrev}
                  className="w-10 h-10 border border-[#3A3731] flex items-center justify-center text-[#C8C0B3] hover:text-[#B79A62] hover:border-[#B79A62] transition-colors"
                  aria-label="Previous milestone"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNext}
                  className="w-10 h-10 border border-[#3A3731] flex items-center justify-center text-[#C8C0B3] hover:text-[#B79A62] hover:border-[#B79A62] transition-colors"
                  aria-label="Next milestone"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <span className="text-xs text-[#7A756D] tracking-widest uppercase ml-2">
                  {selectedIndex + 1} of {timeline.length}
                </span>
              </div>
            </div>

            {/* Description & Narrative */}
            <div className="lg:col-span-8 space-y-4">
              <h3 className="font-editorial text-2xl sm:text-3xl text-[#F5F2EB] tracking-wide">
                {locale === 'ar' && current.titleAr ? current.titleAr : current.title}
              </h3>
              <p className="text-base sm:text-lg text-[#C8C0B3] font-light leading-relaxed">
                {locale === 'ar' && current.descriptionAr
                  ? current.descriptionAr
                  : current.description}
              </p>
              <div className="pt-4 flex items-center gap-6 text-xs text-[#8C867E] tracking-wider uppercase">
                <span>Verified Historical Record</span>
                <span>•</span>
                <span>Tanmiyat Executive Archives</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
