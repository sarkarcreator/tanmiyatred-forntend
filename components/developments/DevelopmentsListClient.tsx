'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ProjectItem } from '@/types';
import { useI18n } from '@/lib/i18n/context';
import { MapPin, ArrowRight, Filter, Search } from 'lucide-react';

interface DevelopmentsListClientProps {
  initialProjects: ProjectItem[];
}

export const DevelopmentsListClient: React.FC<DevelopmentsListClientProps> = ({
  initialProjects,
}) => {
  const { t, locale, isRTL } = useI18n();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categoryFilters = [
    { id: 'ALL', label: t.developments.filterAll },
    { id: 'RESIDENTIAL', label: t.developments.filterResidential },
    { id: 'COMMERCIAL', label: t.developments.filterCommercial },
    { id: 'MIXED_USE', label: t.developments.filterMixedUse },
    { id: 'MASTER_COMMUNITY', label: 'Master Community' },
  ];

  const statusFilters = [
    { id: 'ALL', label: 'All Statuses' },
    { id: 'COMPLETED', label: t.developments.filterCompleted },
    { id: 'ONGOING', label: t.developments.filterOngoing },
    { id: 'UPCOMING', label: t.developments.filterUpcoming },
  ];

  const filteredProjects = useMemo(() => {
    return initialProjects.filter((p) => {
      const matchCat = selectedCategory === 'ALL' || p.category === selectedCategory;
      const matchStat = selectedStatus === 'ALL' || p.status === selectedStatus;
      const matchSearch =
        !searchQuery ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.location.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchStat && matchSearch;
    });
  }, [initialProjects, selectedCategory, selectedStatus, searchQuery]);

  return (
    <div>
      {/* FILTER CONTROLS */}
      <div className="bg-[#171715] border border-[#25221E] p-6 mb-12">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs uppercase tracking-widest text-[#7A756D] mr-2 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-[#B79A62]" />
              <span>Category:</span>
            </span>
            {categoryFilters.map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedCategory(f.id)}
                className={`px-3.5 py-1.5 text-xs uppercase tracking-wider transition-all font-medium ${
                  selectedCategory === f.id
                    ? 'bg-[#B79A62] text-[#0A0A09]'
                    : 'bg-[#0A0A09] text-[#C8C0B3] border border-[#2D2A26] hover:border-[#B79A62]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Status & Search */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-[#0A0A09] border border-[#2D2A26] px-3.5 py-2 text-xs uppercase tracking-wider text-[#C8C0B3] focus:outline-none focus:border-[#B79A62]"
            >
              {statusFilters.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#8C867E] absolute left-3 top-1/2 -translate-y-1/2 rtl:left-auto rtl:right-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search developments..."
                className="bg-[#0A0A09] border border-[#2D2A26] pl-9 pr-4 rtl:pl-4 rtl:pr-9 py-2 text-xs text-[#F5F2EB] focus:outline-none focus:border-[#B79A62] w-full sm:w-56"
              />
            </div>
          </div>
        </div>
      </div>

      {/* RESULTS COUNT */}
      <div className="mb-6 flex items-center justify-between text-xs text-[#8C867E] tracking-widest uppercase">
        <span>
          Showing {filteredProjects.length} of {initialProjects.length} Developments
        </span>
      </div>

      {/* PROJECTS LIST / GRID */}
      {filteredProjects.length === 0 ? (
        <div className="py-24 text-center border border-[#25221E] bg-[#171715] p-8">
          <p className="font-editorial text-2xl text-[#C8C0B3] mb-2">No developments found</p>
          <p className="text-xs text-[#8C867E] mb-6">
            Try adjusting your category or status filter criteria.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('ALL');
              setSelectedStatus('ALL');
              setSearchQuery('');
            }}
            className="px-6 py-2.5 bg-[#B79A62] text-[#0A0A09] text-xs font-semibold uppercase tracking-wider"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {filteredProjects.map((project) => {
            const title = locale === 'ar' && project.titleAr ? project.titleAr : project.title;
            const location =
              locale === 'ar' && project.locationAr ? project.locationAr : project.location;
            const overview =
              locale === 'ar' && project.overviewAr ? project.overviewAr : project.overview;

            return (
              <div
                key={project.id}
                className="group bg-[#171715] border border-[#25221E] hover:border-[#B79A62]/60 transition-all flex flex-col overflow-hidden"
              >
                {/* HERO IMAGE */}
                <div className="relative aspect-[16/10] w-full bg-[#22201D] overflow-hidden">
                  <Image
                    src={project.heroImage}
                    alt={project.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    referrerPolicy="no-referrer"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Status */}
                  <div className="absolute top-4 left-4 px-3 py-1 bg-[#0A0A09]/85 backdrop-blur-sm border border-[#3A3731] text-[#D8BE8A] text-[10px] uppercase font-semibold tracking-wider">
                    {project.status === 'COMPLETED'
                      ? 'DELIVERED'
                      : project.status === 'ONGOING'
                      ? 'UNDER CONSTRUCTION'
                      : 'ANNOUNCED'}
                  </div>

                  {/* Category */}
                  <div className="absolute top-4 right-4 px-3 py-1 bg-black/60 backdrop-blur-sm text-[10px] text-[#C8C0B3] uppercase tracking-wider">
                    {project.category.replace('_', ' ')}
                  </div>

                  {/* Price Banner */}
                  {project.startingPrice && (
                    <div className="absolute bottom-4 left-4 text-xs text-[#F5F2EB] bg-[#0A0A09]/80 backdrop-blur-sm px-3.5 py-1.5 border border-[#2B2925]">
                      <span className="text-[#8C867E] text-[10px] uppercase tracking-wider block">
                        Starting From
                      </span>
                      <span className="font-editorial text-base text-[#B79A62]">
                        AED {project.startingPrice.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>

                {/* CONTENT */}
                <div className="p-8 flex flex-col justify-between flex-grow space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-1.5 text-xs text-[#8C867E]">
                      <MapPin className="w-3.5 h-3.5 text-[#B79A62]" />
                      <span className="tracking-wider uppercase">{location}</span>
                    </div>

                    <h3 className="font-editorial text-3xl text-[#F5F2EB] group-hover:text-[#B79A62] transition-colors leading-tight">
                      {title}
                    </h3>

                    <p className="text-xs sm:text-sm text-[#C8C0B3] font-light leading-relaxed line-clamp-3">
                      {overview}
                    </p>
                  </div>

                  {/* AMENITIES PILLS */}
                  {project.amenities && project.amenities.length > 0 && (
                    <div className="pt-4 border-t border-[#25221E]">
                      <span className="text-[10px] uppercase tracking-widest text-[#7A756D] block mb-2">
                        Key Features & Amenities:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {project.amenities.slice(0, 3).map((am) => (
                          <span
                            key={am.id}
                            className="px-2.5 py-1 bg-[#0A0A09] border border-[#2D2A26] text-[#C8C0B3] text-[11px]"
                          >
                            {locale === 'ar' && am.titleAr ? am.titleAr : am.title}
                          </span>
                        ))}
                        {project.amenities.length > 3 && (
                          <span className="px-2 py-1 text-[11px] text-[#8C867E]">
                            +{project.amenities.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* CTA */}
                  <div className="pt-4 border-t border-[#25221E] flex items-center justify-between">
                    <Link
                      href={`/developments/${project.slug}`}
                      className="w-full inline-flex items-center justify-center gap-2 py-3 bg-[#B79A62] text-[#0A0A09] text-xs font-semibold tracking-[0.2em] uppercase hover:bg-[#D8BE8A] transition-all"
                    >
                      <span>{t.developments.viewDetails}</span>
                      <ArrowRight className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
