export const dynamic = 'force-dynamic';
import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { repository } from '@/lib/data/repository';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Calendar, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'News & Market Insights | Tanmiyat Real Estate Development',
  description:
    'Executive perspectives, corporate milestones, and market intelligence from Tanmiyat Real Estate Development Dubai.',
};


export default async function NewsPage() {
  const news = await repository.getNews();

  return (
    <div className="bg-[#0A0A09] text-[#F5F2EB] min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-14">
            <span className="text-xs font-semibold tracking-[0.25em] text-[#B79A62] uppercase block mb-3">
              INTELLIGENCE & ANNOUNCEMENTS
            </span>
            <h1 className="font-editorial text-4xl sm:text-6xl font-normal tracking-tight mb-4">
              News & Market Perspectives.
            </h1>
            <p className="text-sm sm:text-base text-[#C8C0B3] font-light leading-relaxed">
              Official press releases, construction milestones, and architectural insights from
              Tanmiyat Real Estate Development LLC.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((item) => (
              <Link
                key={item.id}
                href={`/news/${item.slug}`}
                className="group bg-[#171715] border border-[#25221E] hover:border-[#B79A62]/40 transition-all flex flex-col overflow-hidden"
              >
                <div className="relative aspect-[16/10] w-full bg-[#22201D] overflow-hidden">
                  <Image
                    src={item.featuredImage}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    referrerPolicy="no-referrer"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute top-4 left-4 px-3 py-1 bg-[#0A0A09]/80 backdrop-blur-sm text-[10px] uppercase tracking-wider text-[#D8BE8A] border border-[#332F28]">
                    {item.category}
                  </div>
                </div>

                <div className="p-6 flex flex-col justify-between flex-grow space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs text-[#7A756D]">
                      <Calendar className="w-3.5 h-3.5 text-[#B79A62]" />
                      <span>
                        {new Date(item.publishedDate).toLocaleDateString('en-GB', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>

                    <h2 className="font-editorial text-2xl text-[#F5F2EB] group-hover:text-[#B79A62] transition-colors leading-snug">
                      {item.title}
                    </h2>

                    <p className="text-xs text-[#C8C0B3] font-light leading-relaxed line-clamp-3">
                      {item.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#22201C] flex items-center justify-between text-xs text-[#B79A62] uppercase tracking-widest font-semibold">
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
