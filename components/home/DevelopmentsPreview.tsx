'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ProjectItem } from '@/types';
import { useI18n } from '@/lib/i18n/context';
import { ArrowRight, MapPin } from 'lucide-react';

interface DevelopmentsPreviewProps {
  projects: ProjectItem[];
}

export const DevelopmentsPreview: React.FC<DevelopmentsPreviewProps> = ({ projects }) => {
  const { t, locale, isRTL } = useI18n();

  return (
    <section className="py-24 sm:py-32 bg-[#0A0A09] relative border-b border-[#22201C] text-[#F5F2EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-xs font-semibold tracking-[0.25em] text-[#B79A62] uppercase block mb-3">
              {t.developments.eyebrow}
            </span>
            <h2 className="font-editorial text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight">
              {t.developments.headline}
            </h2>
          </div>
          <Link
            href="/developments"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#B79A62] hover:text-[#D8BE8A] transition-colors pb-1 border-b border-[#B79A62]"
          >
            <span>{t.featured.viewAll}</span>
            <ArrowRight className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
          </Link>
        </div>

        {/* PROJECTS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.slice(0, 3).map((project) => {
            const title = locale === 'ar' && project.titleAr ? project.titleAr : project.title;
            const location =
              locale === 'ar' && project.locationAr ? project.locationAr : project.location;
            const tagline =
              locale === 'ar' && project.taglineAr ? project.taglineAr : project.tagline;

            return (
              <Link
                key={project.id}
                href={`/developments/${project.slug}`}
                className="group flex flex-col bg-[#171715] border border-[#25221E] hover:border-[#B79A62]/50 transition-all duration-500 overflow-hidden"
              >
                {/* IMAGE */}
                <div className="relative aspect-[16/11] w-full overflow-hidden bg-[#22201D]">
                  <Image
                    src={project.heroImage}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    referrerPolicy="no-referrer"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Status Badge */}
                  <div className="absolute top-4 left-4 px-3 py-1 bg-[#0A0A09]/80 backdrop-blur-md border border-[#3A3731] text-[#D8BE8A] text-[10px] uppercase font-semibold tracking-wider">
                    {project.status}
                  </div>

                  {/* Category Badge */}
                  <div className="absolute top-4 right-4 text-[10px] text-[#C8C0B3] uppercase tracking-wider">
                    {project.category.replace('_', ' ')}
                  </div>
                </div>

                {/* CONTENT */}
                <div className="p-6 flex flex-col flex-grow justify-between space-y-4">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-[#8C867E] mb-2">
                      <MapPin className="w-3 h-3 text-[#B79A62]" />
                      <span className="tracking-wider uppercase">{location}</span>
                    </div>

                    <h3 className="font-editorial text-2xl text-[#F5F2EB] group-hover:text-[#B79A62] transition-colors leading-tight mb-2">
                      {title}
                    </h3>

                    <p className="text-xs text-[#C8C0B3] font-light leading-relaxed line-clamp-2">
                      {tagline}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#25221E] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[#7A756D] uppercase tracking-wider block">
                        {t.developments.startingFrom}
                      </span>
                      <span className="font-editorial text-lg text-[#B79A62]">
                        AED {project.startingPrice?.toLocaleString()}
                      </span>
                    </div>
                    <span className="text-xs text-[#E5DFD5] group-hover:text-[#B79A62] uppercase tracking-wider flex items-center gap-1 transition-colors font-medium">
                      <span>Explore</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
