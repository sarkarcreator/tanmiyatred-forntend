'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useI18n } from '@/lib/i18n/context';
import { ChevronDown, ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  onInquireClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onInquireClick }) => {
  const { t, isRTL } = useI18n();

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-[#0A0A09]">
      {/* BACKGROUND ARCHITECTURAL VISUAL WITH CINEMATIC ZOOM */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=2560&q=90"
          alt="Dubai Skyline & Architectural Masterpieces"
          fill
          priority
          referrerPolicy="no-referrer"
          className="object-cover object-center scale-105 animate-[pulse_10s_ease-in-out_infinite] opacity-65"
        />

        {/* DARK CINEMATIC VIGNETTE & OVERLAYS */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A09] via-[#0A0A09]/60 to-[#0A0A09]/75" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(10,10,9,0.85)_100%)]" />
      </div>

      {/* CONTENT CONTAINER */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 pb-20">
        {/* SUBTLE BRAND TAG */}
        <div className="inline-flex items-center gap-3 px-4 py-1.5 border border-[#B79A62]/30 bg-[#0A0A09]/60 backdrop-blur-sm mb-8 text-[#D8BE8A] text-[11px] sm:text-xs font-semibold tracking-[0.3em] uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-[#B79A62]" />
          <span>{t.hero.tag}</span>
        </div>

        {/* MAIN EDITORIAL HEADLINE */}
        <h1 className="font-editorial text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-[#F5F2EB] font-normal tracking-[-0.02em] leading-[1.08] mb-8 max-w-4xl mx-auto">
          {t.hero.headline}
        </h1>

        {/* SUPPORTING TEXT */}
        <p className="font-sans text-base sm:text-lg md:text-xl text-[#C8C0B3] max-w-2xl mx-auto font-light leading-relaxed mb-12">
          {t.hero.subtitle}
        </p>

        {/* ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
          <Link
            href="/developments"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-9 py-4 bg-[#B79A62] text-[#0A0A09] text-xs font-semibold tracking-[0.25em] uppercase hover:bg-[#D8BE8A] transition-all duration-300 shadow-xl"
          >
            <span>{t.hero.exploreDevelopments}</span>
            <ArrowRight className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
          </Link>

          <a
            href="#about"
            className="w-full sm:w-auto inline-flex items-center justify-center px-9 py-4 bg-transparent border border-[#7A756D] text-[#F5F2EB] text-xs font-medium tracking-[0.25em] uppercase hover:border-[#B79A62] hover:text-[#B79A62] transition-all duration-300"
          >
            <span>{t.hero.discoverTanmiyat}</span>
          </a>
        </div>
      </div>

      {/* SUBTLE SCROLL INDICATOR */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center pointer-events-none">
        <span className="text-[10px] tracking-[0.3em] text-[#8C867E] uppercase mb-2">
          {t.hero.scroll}
        </span>
        <div className="w-5 h-8 border border-[#4A463F] rounded-full flex items-start justify-center p-1">
          <div className="w-1 h-2 bg-[#B79A62] rounded-full animate-bounce mt-1" />
        </div>
      </div>
    </section>
  );
};
