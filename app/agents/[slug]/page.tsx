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

  const propertiesResult = await repository.getProperties({
    agentId: agent.id,
    isPublic: true,
  });

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
                  <span className="text-[#F5F2EB]">{propertiesResult.properties.length} Properties</span>
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
                  href={`mailto:${agent.email}?subject=Property%20Inquiry%20-%20Tanmiyat`}
                  className="px-5 py-2.5 bg-[#171715] hover:bg-[#25221E] text-[#C8C0B3] text-xs uppercase tracking-wider inline-flex items-center gap-2 border border-[#25221E] transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span>Email</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ACTIVE LISTINGS OF THIS AGENT */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#25221E] pb-4">
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#B79A62] font-semibold block">
                Exclusive Portfolio
              </span>
              <h2 className="font-editorial text-2xl sm:text-3xl text-[#F5F2EB]">
                Current Listings Represented by {agent.name}
              </h2>
            </div>
            <span className="text-xs text-[#8C867E]">
              {propertiesResult.properties.length} Residences
            </span>
          </div>

          {propertiesResult.properties.length === 0 ? (
            <div className="text-center py-12 bg-[#171715] border border-[#25221E] text-[#8C867E] text-sm">
              Currently, all listings assigned to this advisor are under offer or in off-market escrow.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {propertiesResult.properties.map((property) => (
                <article
                  key={property.id}
                  className="group bg-[#171715] border border-[#25221E] hover:border-[#B79A62]/40 transition-all flex flex-col justify-between overflow-hidden"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#0A0A09]">
                    <Image
                      src={property.featuredImage || property.heroImage || property.images?.[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'}
                      alt={property.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-[#B79A62] text-[10px] font-bold text-[#0A0A09] uppercase">
                      {property.purpose === 'FOR_RENT' ? 'For Rent' : 'For Sale'}
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <span className="text-[10px] uppercase text-[#8C867E] block">{property.community}</span>
                    <Link href={`/properties/${property.slug}`}>
                      <h3 className="font-editorial text-lg text-[#F5F2EB] group-hover:text-[#B79A62] transition-colors line-clamp-1">
                        {property.title}
                      </h3>
                    </Link>

                    <div className="font-editorial text-xl text-[#F5F2EB]">
                      AED {property.price.toLocaleString()}
                    </div>

                    <div className="grid grid-cols-3 gap-2 py-2 border-y border-[#22201C] text-xs text-[#8C867E]">
                      <div className="flex items-center gap-1">
                        <Bed className="w-3.5 h-3.5 text-[#B79A62]" />
                        <span>{property.bedrooms} Beds</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Bath className="w-3.5 h-3.5 text-[#B79A62]" />
                        <span>{property.bathrooms} Baths</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Maximize className="w-3.5 h-3.5 text-[#B79A62]" />
                        <span>{property.area.toLocaleString()} sqft</span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <Link
                        href={`/properties/${property.slug}`}
                        className="w-full py-2 bg-[#25221E] hover:bg-[#B79A62] hover:text-[#0A0A09] text-xs uppercase tracking-wider text-center text-[#E5DFD5] block transition-colors"
                      >
                        View Residence Details
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
