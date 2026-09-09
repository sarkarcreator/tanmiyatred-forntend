'use client';

import React from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n/context';
import { TanmiyatLogo } from '@/components/brand/TanmiyatLogo';
import { MapPin, Phone, Mail, Clock, MessageSquare, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t, isRTL } = useI18n();

  const whatsAppNumber = '+971480082664';
  const whatsAppUrl = `https://wa.me/${whatsAppNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    'Hello Tanmiyat Real Estate Development. I would like to inquire about your property portfolio.'
  )}`;

  return (
    <footer className="bg-[#0A0A09] border-t border-[#22201C] pt-16 pb-12 text-[#C8C0B3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* TOP BRANDING & CONTACT GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-16 border-b border-[#22201C]">
          {/* Col 1 & 2: Brand Identity */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="inline-block" aria-label="Tanmiyat Home">
              <TanmiyatLogo variant="gold" size="lg" />
            </Link>
            <p className="text-sm leading-relaxed text-[#9E978C] max-w-md pt-2">
              Established in 1999 in Dubai, United Arab Emirates. Tanmiyat Real Estate
              Development LLC crafts enduring architectural statements, integrated master
              communities, and generational investment value.
            </p>
            <div className="pt-2">
              <a
                href={whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#171715] border border-[#332F28] text-xs font-semibold tracking-wider text-[#25D366] hover:border-[#25D366]/60 transition-all uppercase"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp Private Client Advisory</span>
              </a>
            </div>
          </div>

          {/* Col 3: Portfolio Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold tracking-[0.2em] text-[#F5F2EB] uppercase">
              Portfolio
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link
                  href="/developments/living-legends"
                  className="hover:text-[#B79A62] transition-colors flex items-center justify-between"
                >
                  <span>Living Legends</span>
                  <ArrowUpRight className="w-3 h-3 text-[#B79A62]" />
                </Link>
              </li>
              <li>
                <Link
                  href="/developments/the-court-tower"
                  className="hover:text-[#B79A62] transition-colors flex items-center justify-between"
                >
                  <span>The Court Tower</span>
                  <ArrowUpRight className="w-3 h-3 text-[#B79A62]" />
                </Link>
              </li>
              <li>
                <Link
                  href="/developments/the-exchange-tower"
                  className="hover:text-[#B79A62] transition-colors flex items-center justify-between"
                >
                  <span>The Exchange Tower</span>
                  <ArrowUpRight className="w-3 h-3 text-[#B79A62]" />
                </Link>
              </li>
              <li>
                <Link
                  href="/developments/horizon-residences"
                  className="hover:text-[#B79A62] transition-colors flex items-center justify-between"
                >
                  <span>Horizon Residences</span>
                  <ArrowUpRight className="w-3 h-3 text-[#B79A62]" />
                </Link>
              </li>
              <li>
                <Link
                  href="/developments"
                  className="text-[#B79A62] hover:underline pt-1 inline-block"
                >
                  View All Developments →
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Corporate & Intelligence */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold tracking-[0.2em] text-[#F5F2EB] uppercase">
              Corporate
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/#about" className="hover:text-[#B79A62] transition-colors">
                  Philosophy & Purpose
                </Link>
              </li>
              <li>
                <Link href="/#legacy" className="hover:text-[#B79A62] transition-colors">
                  Heritage Since 1999
                </Link>
              </li>
              <li>
                <Link href="/news" className="hover:text-[#B79A62] transition-colors">
                  News & Market Insights
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-[#B79A62] transition-colors">
                  Careers & Leadership
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#B79A62] transition-colors">
                  Dubai Headquarters
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-[#8C867E] hover:text-[#B79A62] transition-colors">
                  Staff & Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Dubai Office Info */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold tracking-[0.2em] text-[#F5F2EB] uppercase">
              Dubai Office
            </h4>
            <div className="space-y-3 text-xs text-[#9E978C]">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#B79A62] shrink-0 mt-0.5" />
                <span>Business Bay, Dubai, United Arab Emirates</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#B79A62] shrink-0" />
                <a href="tel:+97143699000" className="hover:text-[#F5F2EB] transition-colors">
                  +971 4 369 9000
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#B79A62] shrink-0" />
                <a href="mailto:info@tanmiyatrealestate.com" className="hover:text-[#F5F2EB] transition-colors">
                  info@tanmiyatrealestate.com
                </a>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#B79A62] shrink-0 mt-0.5" />
                <span>Mon – Fri: 9:00 AM – 6:00 PM (GST)</span>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM LEGAL & REGULATORY */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#736E66]">
          <p className="text-center md:text-left">
            {t.footer.legal}
          </p>
          <div className="flex items-center space-x-6 rtl:space-x-reverse shrink-0">
            <Link href="/privacy" className="hover:text-[#C8C0B3] transition-colors">
              {t.footer.privacy}
            </Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-[#C8C0B3] transition-colors">
              {t.footer.terms}
            </Link>
            <span>•</span>
            <Link href="/cookies" className="hover:text-[#C8C0B3] transition-colors">
              {t.footer.cookies}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
