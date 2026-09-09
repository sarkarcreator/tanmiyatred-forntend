'use client';

import React from 'react';
import Image from 'next/image';
import { useI18n } from '@/lib/i18n/context';
import { ShieldCheck, Award, TrendingUp, Users } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const { t } = useI18n();

  const icons = [ShieldCheck, Award, TrendingUp, Users];

  return (
    <section id="about" className="py-24 sm:py-32 bg-[#0A0A09] text-[#F5F2EB] relative border-b border-[#22201C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="max-w-3xl mb-16">
          <span className="text-xs font-semibold tracking-[0.25em] text-[#B79A62] uppercase block mb-3">
            {t.about.eyebrow}
          </span>
          <h2 className="font-editorial text-3xl sm:text-5xl lg:text-6xl font-normal leading-[1.15] whitespace-pre-line tracking-tight">
            {t.about.headline}
          </h2>
        </div>

        {/* EDITORIAL GRID WITH ARCHITECTURAL PHOTOGRAPHY */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mb-20">
          {/* Paragraphs and Manifesto */}
          <div className="lg:col-span-6 space-y-6 text-[#C8C0B3] font-light leading-relaxed text-base sm:text-lg">
            <p>{t.about.p1}</p>
            <p>{t.about.p2}</p>
            <div className="pt-4 border-t border-[#22201C] flex items-center gap-8">
              <div>
                <span className="font-editorial text-4xl text-[#B79A62] block">1999</span>
                <span className="text-[11px] uppercase tracking-widest text-[#7A756D]">
                  Established
                </span>
              </div>
              <div className="h-10 w-[1px] bg-[#22201C]" />
              <div>
                <span className="font-editorial text-4xl text-[#F5F2EB] block">Dubai</span>
                <span className="text-[11px] uppercase tracking-widest text-[#7A756D]">
                  Headquarters
                </span>
              </div>
              <div className="h-10 w-[1px] bg-[#22201C]" />
              <div>
                <span className="font-editorial text-4xl text-[#D8BE8A] block">25+</span>
                <span className="text-[11px] uppercase tracking-widest text-[#7A756D]">
                  Years Heritage
                </span>
              </div>
            </div>
          </div>

          {/* Architectural Image Collage */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="relative aspect-[3/4] w-full bg-[#171715] overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80"
                alt="Tanmiyat Architectural Detail"
                fill
                sizes="(max-width: 1024px) 50vw, 25vw"
                referrerPolicy="no-referrer"
                className="object-cover"
              />
            </div>
            <div className="relative aspect-[3/4] w-full bg-[#171715] overflow-hidden mt-8">
              <Image
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80"
                alt="The Court Tower Facade on Dubai Canal"
                fill
                sizes="(max-width: 1024px) 50vw, 25vw"
                referrerPolicy="no-referrer"
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* 4 FOUNDATIONAL PILLARS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pt-12 border-t border-[#22201C]">
          {t.about.pillars.map((pillar, idx) => {
            const Icon = icons[idx] || ShieldCheck;
            return (
              <div key={idx} className="space-y-3">
                <div className="w-10 h-10 flex items-center justify-center border border-[#332F28] bg-[#171715] text-[#B79A62]">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-editorial text-xl text-[#F5F2EB]">
                  {pillar.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#8C867E] leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
