'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { NewsItem } from '@/types';
import { useI18n } from '@/lib/i18n/context';
import { ArrowRight, Calendar } from 'lucide-react';

interface NewsPreviewProps {
  news: NewsItem[];
}

export const NewsPreview: React.FC<NewsPreviewProps> = ({ news }) => {
  const { t, locale, isRTL } = useI18n();

  return (
    <section className="py-24 sm:py-32 bg-[#0A0A09] relative border-b border-[#22201C] text-[#F5F2EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-xs font-semibold tracking-[0.25em] text-[#B79A62] uppercase block mb-3">
              {t.news.eyebrow}
            </span>
            <h2 className="font-editorial text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight">
              {t.news.headline}
            </h2>
          </div>
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#B79A62] hover:text-[#D8BE8A] transition-colors pb-1 border-b border-[#B79A62]"
          >
            <span>View All Insights</span>
            <ArrowRight className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {news.slice(0, 2).map((item) => {
            const title = locale === 'ar' && item.titleAr ? item.titleAr : item.title;
            const excerpt = locale === 'ar' && item.excerptAr ? item.excerptAr : item.excerpt;

            return (
              <Link
                key={item.id}
                href={`/news/${item.slug}`}
                className="group bg-[#171715] border border-[#25221E] hover:border-[#B79A62]/40 transition-all flex flex-col overflow-hidden"
              >
                <div className="relative aspect-[16/9] w-full bg-[#22201D] overflow-hidden">
                  <Image
                    src={item.featuredImage}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    referrerPolicy="no-referrer"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute top-4 left-4 px-3 py-1 bg-[#0A0A09]/80 backdrop-blur-sm text-[10px] uppercase tracking-wider text-[#D8BE8A] border border-[#332F28]">
                    {item.category}
                  </div>
                </div>

                <div className="p-8 flex flex-col justify-between flex-grow space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs text-[#7A756D]">
                      <Calendar className="w-3.5 h-3.5 text-[#B79A62]" />
                      <span>{new Date(item.publishedDate).toLocaleDateString('en-GB', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      <span>•</span>
                      <span>{item.author}</span>
                    </div>
                    <h3 className="font-editorial text-2xl text-[#F5F2EB] group-hover:text-[#B79A62] transition-colors leading-snug">
                      {title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#C8C0B3] font-light leading-relaxed line-clamp-3">
                      {excerpt}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#22201C] flex items-center justify-between text-xs text-[#B79A62] uppercase tracking-widest font-semibold">
                    <span>{t.news.readArticle}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
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
