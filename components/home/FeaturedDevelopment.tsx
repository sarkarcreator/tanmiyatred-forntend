'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ProjectItem } from '@/types';
import { useI18n } from '@/lib/i18n/context';
import { ArrowRight, MapPin, Compass, Trophy } from 'lucide-react';

interface FeaturedDevelopmentProps {
  project: ProjectItem;
}

export const FeaturedDevelopment: React.FC<FeaturedDevelopmentProps> = ({ project }) => {
  const { t, isRTL, locale } = useI18n();

  const title = locale === 'ar' && project.titleAr ? project.titleAr : project.title;
  const location = locale === 'ar' && project.locationAr ? project.locationAr : project.location;
  const overview = locale === 'ar' && project.overviewAr ? project.overviewAr : project.overview;

  return (
    <section className="py-24 sm:py-32 bg-[#0A0A09] relative overflow-hidden border-b border-[#22201C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* SECTION LABEL */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#22201C]">
          <span className="text-xs font-semibold tracking-[0.25em] text-[#B79A62] uppercase">
            {t.featured.eyebrow}
          </span>
          <span className="text-xs text-[#7A756D] tracking-widest uppercase">
            DUBAILAND, DUBAI
          </span>
        </div>

        {/* MAIN EDITORIAL LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* IMAGE BLOCK (7 COLS) */}
          <div className="lg:col-span-7 relative group overflow-hidden">
            <div className="relative aspect-[16/10] w-full bg-[#171715] overflow-hidden">
              <Image
                src={project.heroImage}
                alt={project.title}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                referrerPolicy="no-referrer"
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60" />

              {/* Status Badge */}
              <div className="absolute top-4 left-4 sm:top-6 sm:left-6 px-3.5 py-1.5 bg-[#0A0A09]/85 backdrop-blur-md border border-[#3A3731] text-[#D8BE8A] text-[10px] font-semibold tracking-[0.2em] uppercase">
                {project.status === 'COMPLETED' ? 'DELIVERED & THRIVING' : project.status}
              </div>

              {/* Quick Spec Ribbon */}
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex items-center justify-between text-xs text-[#F5F2EB] bg-[#0A0A09]/80 backdrop-blur-md p-3.5 border border-[#2B2925]">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-[#B79A62]" />
                  <span className="text-[11px] tracking-wider">9-Hole Golf Course</span>
                </div>
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-[#B79A62]" />
                  <span className="text-[11px] tracking-wider">14.4M Sq. Ft. Masterplan</span>
                </div>
              </div>
            </div>
          </div>

          {/* EDITORIAL CONTENT (5 COLS) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-2 text-xs text-[#8C867E]">
              <MapPin className="w-3.5 h-3.5 text-[#B79A62]" />
              <span className="tracking-wider uppercase">{location}</span>
            </div>

            <h2 className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-[#F5F2EB] font-normal leading-tight tracking-tight">
              {title}
            </h2>

            <p className="text-sm sm:text-base text-[#C8C0B3] font-light leading-relaxed">
              {overview}
            </p>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-4 py-4 border-y border-[#22201C]">
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-[#7A756D] mb-1">
                  Residences
                </div>
                <div className="font-editorial text-2xl text-[#F5F2EB]">
                  500 Villas & 12 Towers
                </div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-[#7A756D] mb-1">
                  Starting Price
                </div>
                <div className="font-editorial text-2xl text-[#B79A62]">
                  AED {project.startingPrice?.toLocaleString()}
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
              <Link
                href={`/developments/${project.slug}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-3.5 bg-[#B79A62] text-[#0A0A09] text-xs font-semibold tracking-[0.2em] uppercase hover:bg-[#D8BE8A] transition-all"
              >
                <span>{t.featured.exploreProject}</span>
                <ArrowRight className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
              </Link>
              <Link
                href="/developments"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 text-xs text-[#C8C0B3] hover:text-[#F5F2EB] tracking-[0.15em] uppercase transition-colors"
              >
                <span>{t.featured.viewAll}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
