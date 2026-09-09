export const dynamic = 'force-dynamic';
import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { repository } from '@/lib/data/repository';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Calendar, User, ArrowLeft, Share2 } from 'lucide-react';

interface NewsDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: NewsDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await repository.getNewsBySlug(slug);
  if (!article) return { title: 'Article Not Found | Tanmiyat' };

  return {
    title: `${article.title} | Tanmiyat Real Estate Development`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [{ url: article.featuredImage }],
    },
  };
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { slug } = await params;
  const article = await repository.getNewsBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="bg-[#0A0A09] text-[#F5F2EB] min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow pt-32 pb-24">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back link */}
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#B79A62] hover:underline mb-8"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All News</span>
          </Link>

          {/* Meta header */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3 text-xs text-[#7A756D]">
              <span className="px-2.5 py-1 bg-[#171715] border border-[#2B2925] text-[#D8BE8A] uppercase tracking-wider">
                {article.category}
              </span>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#B79A62]" />
                <span>
                  {new Date(article.publishedDate).toLocaleDateString('en-GB', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#B79A62]" />
                <span>{article.author}</span>
              </div>
            </div>

            <h1 className="font-editorial text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#F5F2EB] leading-tight">
              {article.title}
            </h1>

            <p className="text-base sm:text-xl text-[#C8C0B3] font-light leading-relaxed border-l-2 border-[#B79A62] pl-4 italic">
              {article.excerpt}
            </p>
          </div>

          {/* Featured Image */}
          <div className="relative aspect-[16/9] w-full bg-[#171715] mb-12 border border-[#25221E] overflow-hidden">
            <Image
              src={article.featuredImage}
              alt={article.title}
              fill
              priority
              sizes="100vw"
              referrerPolicy="no-referrer"
              className="object-cover"
            />
          </div>

          {/* Body Content */}
          <div className="prose prose-invert max-w-none text-[#C8C0B3] font-light leading-relaxed space-y-6 text-base sm:text-lg">
            {article.content.split('\n\n').map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>

          {/* Author footer */}
          <div className="mt-16 pt-8 border-t border-[#25221E] flex items-center justify-between">
            <div className="text-xs text-[#7A756D]">
              <span>Published by </span>
              <strong className="text-[#F5F2EB]">{article.author}</strong>
              <span> • Tanmiyat Executive Communications</span>
            </div>

            <button
              type="button"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-[#B79A62] hover:text-[#D8BE8A]"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
