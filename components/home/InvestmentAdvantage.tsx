'use client';

import React from 'react';
import { useI18n } from '@/lib/i18n/context';
import { Globe2, ShieldCheck, Scale, Landmark } from 'lucide-react';

interface InvestmentAdvantageProps {
  onInquireClick: () => void;
}

export const InvestmentAdvantage: React.FC<InvestmentAdvantageProps> = ({ onInquireClick }) => {
  const { isRTL } = useI18n();

  const advantages = [
    {
      icon: Landmark,
      title: 'Sovereign Stability & RERA Protection',
      titleAr: 'استقرار سيادي وحماية قانونية من ريرا',
      desc:
        'All developments are rigorously governed under the Dubai Real Estate Regulatory Agency (RERA), escrow-protected financial guarantees, and freehold property title deeds.',
      descAr:
        'تخضع جميع المشاريع لإشراف مؤسسة التنظيم العقاري بدبي (ريرا) مع ضمانات حساب الضمان البنكي وتملك حر موثق.',
    },
    {
      icon: Scale,
      title: 'Tax-Efficient Capital Preservation',
      titleAr: 'حماية رأس المال وكفاءة ضريبية عالمية',
      desc:
        'Zero personal income tax, zero capital gains tax, and complete repatriation of investment capital and rental yields in a strong, USD-pegged currency (AED).',
      descAr:
        'إعفاء ضريبي كامل على الدخل والأرباح الرأسمالية مع حرية تحويل الأرباح والاستثمار بعملة الدرهم المرتبطة بالدولار.',
    },
    {
      icon: Globe2,
      title: 'UAE Golden Residence Opportunity',
      titleAr: 'فرصة الحصول على الإقامة الذهبية',
      desc:
        'Real estate investments exceeding AED 2,000,000 qualify purchasers and their families for 10-year renewable UAE Golden Visas, providing residency and global mobility.',
      descAr:
        'تؤهل الاستثمارات العقارية التي تتجاوز 2 مليون درهم المستثمر وعائلته للحصول على الإقامة الذهبية لمدة 10 سنوات قابلة للتجديد.',
    },
    {
      icon: ShieldCheck,
      title: 'Established Developer Track Record',
      titleAr: 'سجل حافل وموثوق منذ عام 1999',
      desc:
        'With continuous operational presence since 1999, Tanmiyat has delivered thousands of homes and commercial headquarters across high-demand Dubai corridors.',
      descAr:
        'بفضل الحضور المتواصل منذ عام 1999، سلمت تنميات آلاف الوحدات السكنية والمقار التجارية في أرقى مواقع دبي.',
    },
  ];

  return (
    <section id="investment" className="py-24 sm:py-32 bg-[#0A0A09] relative border-b border-[#22201C] text-[#F5F2EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* LEFT: EDITORIAL INTRO */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs font-semibold tracking-[0.25em] text-[#B79A62] uppercase block">
              DUBAI INVESTMENT PROPOSITION
            </span>
            <h2 className="font-editorial text-3xl sm:text-5xl font-normal leading-tight tracking-tight">
              A Global Sanctuary for Generational Wealth.
            </h2>
            <p className="text-sm sm:text-base text-[#C8C0B3] font-light leading-relaxed">
              Dubai has solidified its status as the world’s premier capital for wealth preservation,
              security, and architectural ambition. Investing with Tanmiyat secures not merely
              prestigious physical square footage, but an enduring stake in one of the most
              forward-thinking economies on earth.
            </p>

            <div className="pt-4">
              <button
                onClick={onInquireClick}
                className="px-8 py-3.5 bg-[#B79A62] text-[#0A0A09] text-xs font-semibold tracking-[0.2em] uppercase hover:bg-[#D8BE8A] transition-all"
              >
                REQUEST INVESTOR BRIEFING
              </button>
            </div>
          </div>

          {/* RIGHT: 4 PILLARS */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {advantages.map((adv, idx) => {
              const Icon = adv.icon;
              return (
                <div
                  key={idx}
                  className="bg-[#171715] border border-[#25221E] p-6 sm:p-8 space-y-3 transition-colors hover:border-[#B79A62]/40"
                >
                  <div className="w-10 h-10 flex items-center justify-center bg-[#0A0A09] border border-[#332F28] text-[#B79A62]">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-editorial text-xl text-[#F5F2EB]">
                    {adv.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#8C867E] leading-relaxed">
                    {adv.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
