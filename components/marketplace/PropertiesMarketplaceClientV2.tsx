'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { PropertyItem, AgentItem } from '@/types';
import { Bed, Bath, Maximize, Calendar, Phone, Search, Sparkles, X, Building } from 'lucide-react';
import { ViewingModal } from '@/components/marketplace/ViewingModal';

interface Props {
  initialProperties: PropertyItem[];
  initialTotal: number;
  initialPage: number;
  totalPages: number;
  agents: AgentItem[];
  initialPurpose?: string;
  initialCommunity?: string;
  initialType?: string;
  initialBedrooms?: string;
  initialSort?: string;
  initialSearch?: string;
}

const communities = ['ALL','Downtown Dubai','Business Bay','DIFC','Dubai Creek Harbour','Dubai Hills Estate','Dubai Marina','Palm Jumeirah','Bluewaters Island','City Walk','Jumeirah 1','Jumeirah 2','Jumeirah 3','Jumeirah Village Circle (JVC)','Jumeirah Village Triangle (JVT)','Al Barsha 1','Al Barsha 2','Al Barsha South','Al Sufouh 1','Al Sufouh 2','Umm Suqeim 1','Umm Suqeim 2','Al Wasl','Al Quoz','Meydan','Mohammed Bin Rashid City (MBR City)','Nad Al Sheba','Emirates Hills','The Lakes','The Meadows','The Springs','Jumeirah Islands','Dubai Sports City','Motor City','Arabian Ranches','Arabian Ranches 2','Dubailand','Damac Hills','Damac Hills 2','Town Square Dubai','The Valley','Dubai South','Expo City Dubai','Jebel Ali','Discovery Gardens','The Gardens','Mirdif','Deira','Bur Dubai','Al Jaddaf','Ras Al Khor','Dubai Islands','Dubai Harbour','Dubai Internet City','Dubai Media City','Jumeirah Golf Estates'];
const types = ['ALL','Penthouse','Villa','Apartment','Duplex','Mansion'];

export const PropertiesMarketplaceClientV2: React.FC<Props> = ({
  initialProperties, initialTotal, initialPurpose = 'ALL', initialCommunity = 'ALL', initialType = 'ALL', initialBedrooms = 'ALL', initialSort = 'newest', initialSearch = ''
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [purpose, setPurpose] = useState(initialPurpose);
  const [community, setCommunity] = useState(initialCommunity);
  const [propertyType, setPropertyType] = useState(initialType);
  const [bedrooms, setBedrooms] = useState(initialBedrooms);
  const [search, setSearch] = useState(initialSearch);
  const [sort, setSort] = useState(initialSort);
  const [selectedPropertyForViewing, setSelectedPropertyForViewing] = useState<PropertyItem | null>(null);

  const applyFilters = (overrides: Record<string,string> = {}) => {
    const current = { purpose, community, propertyType, bedrooms, search, sort, ...overrides };
    const params = new URLSearchParams();
    if (current.purpose !== 'ALL') params.set('purpose', current.purpose);
    if (current.community !== 'ALL') params.set('community', current.community);
    if (current.propertyType !== 'ALL') params.set('propertyType', current.propertyType);
    if (current.bedrooms !== 'ALL') params.set('bedrooms', current.bedrooms);
    if (current.search.trim()) params.set('search', current.search.trim());
    if (current.sort !== 'newest') params.set('sort', current.sort);
    startTransition(() => router.push(`/properties${params.toString() ? `?${params.toString()}` : ''}`));
  };

  const reset = () => { setPurpose('ALL'); setCommunity('ALL'); setPropertyType('ALL'); setBedrooms('ALL'); setSearch(''); setSort('newest'); startTransition(() => router.push('/properties')); };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      <div className="border-b border-[#25221E] pb-8 pt-2 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#171715] border border-[#25221E] text-[#B79A62] text-[10px] tracking-[0.25em] uppercase font-semibold"><Sparkles className="w-3 h-3" />DLD & RERA Verified Portfolio</div>
          <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-[#F5F2EB] tracking-tight">Curated Residences & Estates</h1>
          <p className="text-sm sm:text-base text-[#A8A196] max-w-2xl font-light">Explore primary developer releases and premier private brokerage listings across Dubai’s most coveted addresses.</p>
        </div>
        <div className="flex items-center p-1 bg-[#171715] border border-[#25221E] self-start md:self-end">
          {['ALL','FOR_SALE','FOR_RENT'].map((value) => <button key={value} onClick={() => { setPurpose(value); applyFilters({ purpose: value }); }} className={`px-5 py-2 text-xs uppercase tracking-[0.18em] font-semibold ${purpose === value ? 'bg-[#B79A62] text-[#0A0A09]' : 'text-[#8C867E]'}`}>{value === 'ALL' ? 'All' : value === 'FOR_SALE' ? 'Buy' : 'Rent'}</button>)}
        </div>
      </div>

      <div className="bg-[#171715] border border-[#25221E] p-4 sm:p-6 space-y-4">
        <form onSubmit={(e) => { e.preventDefault(); applyFilters(); }} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1"><Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C867E]" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by community, tower name, reference ID..." className="w-full pl-11 pr-4 py-3 bg-[#0A0A09] border border-[#25221E] text-sm text-[#F5F2EB] outline-none focus:border-[#B79A62]" /></div>
          <button className="px-8 py-3 bg-[#B79A62] text-[#0A0A09] text-xs font-semibold uppercase tracking-wider">Search</button>
        </form>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 pt-2 border-t border-[#22201C] text-xs">
          <select value={community} onChange={(e) => { setCommunity(e.target.value); applyFilters({ community: e.target.value }); }} className="w-full bg-[#0A0A09] border border-[#25221E] text-[#E5DFD5] px-3 py-2">{communities.map(c => <option key={c} value={c}>{c === 'ALL' ? 'All Locations' : c}</option>)}</select>
          <select value={propertyType} onChange={(e) => { setPropertyType(e.target.value); applyFilters({ propertyType: e.target.value }); }} className="w-full bg-[#0A0A09] border border-[#25221E] text-[#E5DFD5] px-3 py-2">{types.map(t => <option key={t} value={t}>{t === 'ALL' ? 'All Types' : t}</option>)}</select>
          <select value={bedrooms} onChange={(e) => { setBedrooms(e.target.value); applyFilters({ bedrooms: e.target.value }); }} className="w-full bg-[#0A0A09] border border-[#25221E] text-[#E5DFD5] px-3 py-2"><option value="ALL">Any Bedrooms</option>{[1,2,3,4,5].map(n => <option key={n} value={String(n)}>{n}+ Bedrooms</option>)}</select>
          <select value={sort} onChange={(e) => { setSort(e.target.value); applyFilters({ sort: e.target.value }); }} className="w-full bg-[#0A0A09] border border-[#25221E] text-[#E5DFD5] px-3 py-2"><option value="newest">Newest Releases</option><option value="price-asc">Price: Low to High</option><option value="price-desc">Price: High to Low</option><option value="area">Largest Area</option><option value="featured">Featured First</option></select>
          <button type="button" onClick={reset} className="w-full py-2 bg-[#25221E] text-[#A8A196] uppercase tracking-wider text-[11px] flex items-center justify-center gap-1.5"><X className="w-3.5 h-3.5" />Reset All</button>
        </div>
      </div>

      <div className="flex justify-between text-xs text-[#8C867E]"><span>Showing <strong className="text-[#F5F2EB]">{initialProperties.length}</strong> of <strong className="text-[#F5F2EB]">{initialTotal}</strong> verified properties</span>{isPending && <span className="text-[#B79A62] animate-pulse">Updating catalogue...</span>}</div>

      {initialProperties.length === 0 ? <div className="text-center py-20 bg-[#171715] border border-[#25221E]"><Building className="w-12 h-12 text-[#5A5650] mx-auto" /><h2 className="font-editorial text-2xl text-[#E5DFD5] mt-4">No Properties Found</h2></div> :
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {initialProperties.map(property => {
            const isRent = property.purpose === 'FOR_RENT';
            const image = property.featuredImage || property.images?.[0] || property.heroImage;
            const price = new Intl.NumberFormat('en-AE', { style: 'currency', currency: property.currency || 'AED', maximumFractionDigits: 0 }).format(property.price);
            return (
              <article key={property.id} className="group bg-[#171715] border border-[#25221E] hover:border-[#B79A62]/50 transition-all overflow-hidden flex flex-col">
                <Link href={`/properties/${property.slug}`} aria-label={`View ${property.title}`} className="block">
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#0A0A09]"><Image src={image} alt={property.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" referrerPolicy="no-referrer" /><div className="absolute top-3 left-3"><span className="px-2 py-1 bg-[#0A0A09]/85 text-[#B79A62] text-[9px] font-semibold uppercase tracking-wider border border-[#B79A62]/30">{isRent ? 'For Rent' : 'For Sale'}</span></div></div>
                  <div className="p-5 space-y-3"><h3 className="font-editorial text-2xl text-[#F5F2EB] leading-tight group-hover:text-[#D8BE8A]">{property.title}</h3><p className="text-xs text-[#8C867E]">{property.community} • Dubai</p><div className="flex items-baseline justify-between gap-3"><span className="text-xl font-semibold text-[#F5F2EB]">{price}</span><span className="text-[10px] text-[#7A756D]">{property.referenceNumber}</span></div><div className="grid grid-cols-3 gap-2 py-3 border-y border-[#25221E] text-[10px] text-[#8C867E]"><span className="flex items-center gap-1.5"><Bed className="w-3.5 h-3.5 text-[#B79A62]" />{property.bedrooms}</span><span className="flex items-center gap-1.5"><Bath className="w-3.5 h-3.5 text-[#B79A62]" />{property.bathrooms}</span><span className="flex items-center gap-1.5"><Maximize className="w-3.5 h-3.5 text-[#B79A62]" />{property.area.toLocaleString()}</span></div></div>
                </Link>
                <div className="px-5 pb-5 flex gap-2"><button onClick={() => setSelectedPropertyForViewing(property)} className="flex-1 py-2.5 bg-[#B79A62] text-[#0A0A09] text-[10px] font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5"><Calendar className="w-3.5 h-3.5" />Request Viewing</button><a href="tel:+971503490817" className="p-2.5 border border-[#3A3731] text-[#C8C0B3]"><Phone className="w-4 h-4" /></a></div>
              </article>
            );
          })}
        </div>}

      {selectedPropertyForViewing && <ViewingModal property={selectedPropertyForViewing} onClose={() => setSelectedPropertyForViewing(null)} />}
    </div>
  );
};
