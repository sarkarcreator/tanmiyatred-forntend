import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { repository } from '@/lib/data/repository';
import {
  ShieldCheck,
  Phone,
  MessageCircle,
  Mail,
  Building,
  Bed,
  Bath,
  Maximize,
  ChevronRight,
  ArrowUpRight,
  Calendar,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await repository.getAgentBySlug(slug);

  if (!result) {
    return {
      title: 'Advisor Not Found | Tanmiyat',
    };
  }

  return {
    title: `${result.agent.name} | RERA Licensed Advisor | Tanmiyat Real Estate`,
    description: result.agent.bio,
  };
}

export default async function AgentDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const result = await repository.getAgentBySlug(slug);

  if (!result) {
    notFound();
  }

  const { agent, properties } = result;

  return (
    <main className="min-h-screen bg-[#0A0A09] text-[#F5F2EB] pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* BREADCRUMB */}
        <nav className="flex items-center gap-2 text-xs text-[#8C867E]">
          <Link href="/" className="hover:text-[#F5F2EB] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#5A5650]" />
          <Link href="/agents" className="hover:text-[#F5F2EB] transition-colors">
            Advisors
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#5A5650]" />
          <span className="text-[#C8C0B3]">{agent.name}</span>
        </nav>

        {/* PROFILE HERO CARD */}
        <div className="bg-[#171715] border border-[#25221E] p-6 sm:p-10">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Avatar */}
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-sm overflow-hidden bg-[#0A0A09] border border-[#3A3731] shrink-0">
              {(agent.avatar || agent.photo) ? (
                <Image
                  src={agent.avatar || agent.photo}
                  alt={agent.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 128px, 160px"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-editorial text-4xl text-[#B79A62]">
                  {agent.name.charAt(0)}
                </div>
              )}
            </div>

            {/* Content */}
            <div className="space-y-4 flex-1">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-[10px] uppercase font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-0.5">
                    <ShieldCheck className="w-3 h-3" />
                    <span>RERA BRN {agent.brn}</span>
                  </span>
                  <span className="text-[10px] uppercase text-[#7A756D] bg-[#0A0A09] border border-[#25221E] px-2 py-0.5">
                    Broker ORN 12048
                  </span>
                </div>

                <h1 className="font-editorial text-3xl sm:text-4xl text-[#F5F2EB] tracking-tight">
                  {agent.name}
                </h1>
                <p className="text-sm text-[#B79A62] uppercase tracking-wider font-medium">
                  {agent.title || agent.designation}
                </p>
              </div>

              <p className="text-sm text-[#C8C0B3] leading-relaxed max-w-3xl font-light">
                {agent.bio}
              </p>

              {/* Specs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-[#22201C] text-xs">
                <div>
                  <span className="text-[10px] uppercase text-[#7A756D] block">Languages</span>
                  <span className="text-[#F5F2EB]">{agent.languages.join(', ')}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-[#7A756D] block">Specialized Areas</span>
                  <span className="text-[#F5F2EB]">{agent.areas.join(', ')}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-[#7A756D] block">Active Listings</span>
                  <span className="text-[#F5F2EB]">{properties.length} Properties</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-[#7A756D] block">Direct Contact</span>
                  <span className="text-[#F5F2EB]">{agent.phone}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap gap-3">
                <a
                  href={`https://wa.me/${(agent.whatsApp || agent.phone).replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(agent.name)},%20I%20would%20like%20to%20consult%20you%20on%20Tanmiyat%20properties.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-[#25D366] text-black font-semibold text-xs uppercase tracking-wider inline-flex items-center gap-2 hover:bg-[#20ba59] transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Advisor</span>
                </a>

                <a
                  href={`tel:${agent.phone}`}
                  className="px-5 py-2.5 bg-[#25221E] hover:bg-[#322E29] text-[#F5F2EB] font-semibold text-xs uppercase tracking-wider inline-flex items-center gap-2 border border-[#3A3731] transition-colors"
                >
                  <Phone className="w-4 h-4 text-[#B79A62]" />
                  <span>Direct Call</span>
                </a>

                <a
                  href={`mailto:${agent.email}`}
                  className="px-5 py-2.5 bg-[#25221E] hover:bg-[#322E29] text-[#F5F2EB] font-semibold text-xs uppercase tracking-wider inline-flex items-center gap-2 border border-[#3A3731] transition-colors"
                >
                  <Mail className="w-4 h-4 text-[#B79A62]" />
                  <span>Email Advisor</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* LISTINGS */}
        <section>
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-[#B79A62] mb-2">Private Portfolio</p>
              <h2 className="font-editorial text-3xl text-[#F5F2EB]">Current Listings</h2>
            </div>
            <Link href="/properties" className="text-xs uppercase tracking-wider text-[#B79A62] hover:underline inline-flex items-center gap-1">
              View All <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {properties.length === 0 ? (
            <div className="bg-[#171715] border border-[#25221E] p-10 text-center text-sm text-[#8C867E]">
              No active public listings are currently assigned to this advisor.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <Link
                  key={property.id}
                  href={`/properties/${property.slug}`}
                  className="group bg-[#171715] border border-[#25221E] overflow-hidden hover:border-[#B79A62]/50 transition-all"
                >
                  <div className="relative aspect-[4/3] bg-[#0A0A09] overflow-hidden">
                    {property.heroImage ? (
                      <Image
                        src={property.heroImage}
                        alt={property.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        referrerPolicy="no-referrer"
                      />
                    ) : null}
                    <div className="absolute top-3 left-3 bg-[#0A0A09]/90 border border-[#B79A62]/50 px-2 py-1 text-[10px] uppercase tracking-wider text-[#B79A62]">
                      {property.purpose === 'FOR_RENT' ? 'For Rent' : 'For Sale'}
                    </div>
                  </div>
                  <div className="p-5 space-y-3">
                    <h3 className="font-editorial text-xl text-[#F5F2EB] group-hover:text-[#B79A62] transition-colors line-clamp-2">
                      {property.title}
                    </h3>
                    <div className="flex items-center gap-3 text-[11px] text-[#8C867E]">
                      <span className="inline-flex items-center gap-1"><Building className="w-3.5 h-3.5" />{property.propertyType}</span>
                      <span className="inline-flex items-center gap-1"><Bed className="w-3.5 h-3.5" />{property.bedrooms}</span>
                      <span className="inline-flex items-center gap-1"><Bath className="w-3.5 h-3.5" />{property.bathrooms}</span>
                      <span className="inline-flex items-center gap-1"><Maximize className="w-3.5 h-3.5" />{property.area.toLocaleString()} sqft</span>
                    </div>
                    <div className="pt-2 border-t border-[#25221E] flex items-center justify-between">
                      <span className="text-sm font-semibold text-[#F5F2EB]">AED {property.price.toLocaleString()}</span>
                      <span className="text-[10px] uppercase tracking-wider text-[#B79A62] inline-flex items-center gap-1">Details <ArrowUpRight className="w-3 h-3" /></span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
