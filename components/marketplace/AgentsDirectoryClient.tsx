'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AgentItem, PropertyItem } from '@/types';
import {
  ShieldCheck,
  Phone,
  MessageCircle,
  ArrowUpRight,
  Sparkles,
  Search,
} from 'lucide-react';

interface Props {
  agents: AgentItem[];
  properties: PropertyItem[];
}

export const AgentsDirectoryClient: React.FC<Props> = ({ agents, properties }) => {
  const [selectedArea, setSelectedArea] = useState('ALL');
  const [search, setSearch] = useState('');

  const filteredAgents = agents.filter((agent) => {
    if (selectedArea !== 'ALL' && !agent.areas.some((a) => a.toLowerCase().includes(selectedArea.toLowerCase()))) {
      return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      const matchName = agent.name.toLowerCase().includes(q);
      const matchTitle = (agent.title ?? agent.designation).toLowerCase().includes(q);
      const matchBrn = (agent.brn ?? '').toLowerCase().includes(q);
      const matchArea = agent.areas.some((a) => a.toLowerCase().includes(q));
      if (!matchName && !matchTitle && !matchBrn && !matchArea) return false;
    }
    return true;
  });

  const areasList = ['ALL', 'Business Bay', 'Dubailand', 'Palm Jumeirah', 'Dubai Water Canal', 'Downtown Dubai'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* HEADER */}
      <div className="border-b border-[#25221E] pb-8 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#171715] border border-[#25221E] text-[#B79A62] text-[10px] tracking-[0.25em] uppercase font-semibold">
          <Sparkles className="w-3 h-3 text-[#B79A62]" />
          <span>Licensed Brokerage Advisors • ORN 12048</span>
        </div>
        <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-[#F5F2EB] tracking-tight">
          Private Real Estate Advisors
        </h1>
        <p className="text-sm sm:text-base text-[#A8A196] max-w-3xl font-light leading-relaxed">
          Our senior property consultants combine institutional development acumen with intimate knowledge of Dubai’s ultra-prime residential districts. All advisors maintain active RERA Broker registration cards.
        </p>
      </div>

      {/* FILTER & SEARCH */}
      <div className="bg-[#171715] border border-[#25221E] p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#8C867E] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search advisor by name, BRN, area..."
            className="w-full bg-[#0A0A09] border border-[#25221E] focus:border-[#B79A62] pl-9 pr-3 py-2 text-[#F5F2EB] outline-none"
          />
        </div>

        {/* Area Pills */}
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {areasList.map((area) => (
            <button
              key={area}
              onClick={() => setSelectedArea(area)}
              className={`px-3 py-1.5 border text-[11px] uppercase tracking-wider transition-colors ${
                selectedArea === area
                  ? 'bg-[#B79A62] text-[#0A0A09] border-[#B79A62] font-semibold'
                  : 'bg-[#0A0A09] border-[#25221E] text-[#8C867E] hover:text-[#F5F2EB]'
              }`}
            >
              {area === 'ALL' ? 'All Districts' : area}
            </button>
          ))}
        </div>
      </div>

      {/* AGENTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredAgents.map((agent) => {
          const agentListingsCount = properties.filter((p) => p.agentId === agent.id).length;

          return (
            <div
              key={agent.id}
              className="group bg-[#171715] border border-[#25221E] hover:border-[#B79A62]/40 transition-all duration-300 flex flex-col justify-between overflow-hidden"
            >
              <div className="p-6 space-y-6">
                {/* Agent Photo & Badges */}
                <div className="flex items-start gap-4">
                  <div className="relative w-20 h-20 rounded-sm overflow-hidden bg-[#0A0A09] border border-[#25221E] shrink-0">
                    {agent.avatar ? (
                      <Image
                        src={agent.avatar}
                        alt={agent.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-editorial text-2xl text-[#B79A62]">
                        {agent.name.charAt(0)}
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <span className="inline-flex items-center gap-1 text-[10px] uppercase font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5">
                      <ShieldCheck className="w-3 h-3" />
                      <span>RERA BRN {agent.brn ?? 'N/A'}</span>
                    </span>
                    <Link href={`/agents/${agent.slug}`}>
                      <h3 className="font-editorial text-xl text-[#F5F2EB] group-hover:text-[#B79A62] transition-colors">
                        {agent.name}
                      </h3>
                    </Link>
                    <p className="text-xs text-[#A8A196]">{agent.title ?? agent.designation}</p>
                  </div>
                </div>

                {/* Bio snippet */}
                <p className="text-xs text-[#8C867E] line-clamp-2 leading-relaxed font-light">
                  {agent.bio}
                </p>

                {/* Specs / Badges */}
                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[#22201C] text-[11px]">
                  <div>
                    <span className="text-[10px] text-[#5A5650] uppercase tracking-wider block">Listings</span>
                    <span className="text-[#F5F2EB] font-medium">{agentListingsCount} Exclusive Residences</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#5A5650] uppercase tracking-wider block">Languages</span>
                    <span className="text-[#F5F2EB] font-medium truncate block">
                      {agent.languages.join(', ')}
                    </span>
                  </div>
                </div>

                {/* Specialization tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {agent.areas.map((ar, i) => (
                    <span
                      key={i}
                      className="text-[10px] bg-[#0A0A09] border border-[#25221E] text-[#A8A196] px-2 py-0.5"
                    >
                      {ar}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Footer */}
              <div className="p-4 bg-[#121210] border-t border-[#25221E] flex items-center justify-between gap-2 text-xs">
                <Link
                  href={`/agents/${agent.slug}`}
                  className="px-3 py-2 text-[#E5DFD5] hover:text-[#B79A62] uppercase tracking-wider text-[11px] font-semibold inline-flex items-center gap-1 transition-colors"
                >
                  <span>Advisor Profile</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>

                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${agent.phone}`}
                    className="p-2 bg-[#171715] hover:bg-[#25221E] border border-[#25221E] text-[#B79A62] transition-colors"
                    title={`Call ${agent.name}`}
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href={`https://wa.me/${agent.whatsApp.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(agent.name)},%20I%20am%20interested%20in%20Tanmiyat%20properties.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-[#171715] hover:bg-[#25221E] border border-[#25221E] text-[#25D366] transition-colors"
                    title={`WhatsApp ${agent.name}`}
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
