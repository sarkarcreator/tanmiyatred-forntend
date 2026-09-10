'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { PropertyItem, AgentItem } from '@/types';
import {
  Search,
  Filter,
  SlidersHorizontal,
  Bed,
  Bath,
  Maximize,
  ShieldCheck,
  Calendar,
  Phone,
  MessageCircle,
  ArrowUpRight,
  Sparkles,
  ChevronDown,
  X,
  Building,
} from 'lucide-react';
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

export const PropertiesMarketplaceClient: React.FC<Props> = ({
  initialProperties,
  initialTotal,
  initialPurpose = 'ALL',
  initialCommunity = 'ALL',
  initialType = 'ALL',
  initialBedrooms = 'ALL',
  initialSort = 'newest',
  initialSearch = '',
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [purpose, setPurpose] = useState<string>(initialPurpose);
  const [community, setCommunity] = useState<string>(initialCommunity);
  const [propertyType, setPropertyType] = useState<string>(initialType);
  const [bedrooms, setBedrooms] = useState<string>(initialBedrooms);
  const [search, setSearch] = useState<string>(initialSearch);
  const [sort, setSort] = useState<string>(initialSort);
  const [priceMax, setPriceMax] = useState<string>('');

  const [selectedPropertyForViewing, setSelectedPropertyForViewing] = useState<PropertyItem | null>(null);

  const applyFilters = (newOverrides?: Record<string, string>) => {
    const params = new URLSearchParams();
    const current = {
      purpose,
      community,
      propertyType,
      bedrooms,
      sort,
      search,
      priceMax,
      ...newOverrides,
    };

    if (current.purpose && current.purpose !== 'ALL') params.set('purpose', current.purpose);
    if (current.community && current.community !== 'ALL') params.set('community', current.community);
    if (current.propertyType && current.propertyType !== 'ALL') params.set('propertyType', current.propertyType);
    if (current.bedrooms && current.bedrooms !== 'ALL') params.set('bedrooms', current.bedrooms);
    if (current.priceMax) params.set('maxPrice', current.priceMax);
    if (current.sort && current.sort !== 'newest') params.set('sort', current.sort);
    if (current.search && current.search.trim()) params.set('search', current.search.trim());

    startTransition(() => {
      router.push(`/properties?${params.toString()}`);
    });
  };

  const handlePurposeChange = (val: string) => { setPurpose(val); applyFilters({ purpose: val }); };
  const handleCommunityChange = (val: string) => { setCommunity(val); applyFilters({ community: val }); };
  const handleTypeChange = (val: string) => { setPropertyType(val); applyFilters({ propertyType: val }); };
  const handleBedroomsChange = (val: string) => { setBedrooms(val); applyFilters({ bedrooms: val }); };
  const handleSortChange = (val: string) => { setSort(val); applyFilters({ sort: val }); };

  const handleSearchSubmit = (e: React.FormEvent) => { e.preventDefault(); applyFilters(); };

  const resetFilters = () => {
    setPurpose('ALL');
    setCommunity('ALL');
    setPropertyType('ALL');
    setBedrooms('ALL');
    setSearch('');
    setSort('newest');
    setPriceMax('');
    startTransition(() => { router.push('/properties'); });
  };

  const communitiesList = [
    'ALL',
    'Downtown Dubai',
    'Business Bay',
    'DIFC',
    'Dubai Design District (D3)',
    'Dubai International Financial Centre',
    'Dubai Creek Harbour',
    'Dubai Festival City',
    'Dubai Hills Estate',
    'Dubai Marina',
    'Jumeirah Beach Residence (JBR)',
    'Palm Jumeirah',
    'Bluewaters Island',
    'City Walk',
    'Jumeirah 1',
    'Jumeirah 2',
    'Jumeirah 3',
    'Jumeirah Village Circle (JVC)',
    'Jumeirah Village Triangle (JVT)',
    'Al Barsha 1',
    'Al Barsha 2',
    'Al Barsha 3',
    'Al Barsha South',
    'Barsha Heights (TECOM)',
    'Al Sufouh 1',
    'Al Sufouh 2',
    'Umm Suqeim 1',
    'Umm Suqeim 2',
    'Umm Suqeim 3',
    'Al Wasl',
    'Al Quoz',
    'Meydan',
    'Mohammed Bin Rashid City (MBR City)',
    'Nad Al Sheba',
    'Emirates Hills',
    'The Lakes',
    'The Meadows',
    'The Springs',
    'Jumeirah Islands',
    'Dubai Sports City',
    'Motor City',
    'Arabian Ranches',
    'Arabian Ranches 2',
    'Dubai Land Residence Complex (DLRC)',
    'Dubailand',
    'Damac Hills',
    'Damac Hills 2',
    'Town Square Dubai',
    'The Valley',
    'Dubai South',
    'Expo City Dubai',
    'Dubai Investment Park (DIP)',
    'Jebel Ali',
    'Discovery Gardens',
    'The Gardens',
    'Dubai Production City',
    'Dubai Studio City',
    'Dubai Science Park',
    'Dubai Silicon Oasis (DSO)',
    'Dubai Academic City',
    'International City',
    'Al Warsan',
    'Al Warqa 1',
    'Al Warqa 2',
    'Al Warqa 3',
    'Al Warqa 4',
    'Mirdif',
    'Nad Al Hamar',
    'Al Garhoud',
    'Deira',
    'Bur Dubai',
    'Al Jaddaf',
    'Ras Al Khor',
    'Dubai Healthcare City',
    'Dubai Maritime City',
    'Dubai Islands',
    'Dubai Water Canal',
    'Dubai Harbour',
    'Dubai Internet City',
    'Dubai Media City',
    'Dubai Knowledge Park',
    'Jumeirah Golf Estates',
  ];

  const typesList = ['ALL', 'Penthouse', 'Villa', 'Apartment', 'Duplex', 'Mansion'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* HEADER SECTION */}
      <div className="border-b border-[#25221E] pb-8 pt-2">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#171715] border border-[#25221E] text-[#B79A62] text-[10px] tracking-[0.25em] uppercase font-semibold">
              <Sparkles className="w-3 h-3 text-[#B79A62]" />
              <span>DLD & RERA Verified Portfolio</span>
            </div>
            <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-[#F5F2EB] tracking-tight">
              Curated Residences & Estates
            </h1>
            <p className="text-sm sm:text-base text-[#A8A196] max-w-2xl font-light">
              Explore primary developer releases and premier private brokerage listings across Dubai’s most coveted addresses.
            </p>
          </div>

          <div className="flex items-center p-1 bg-[#171715] border border-[#25221E] self-start md:self-end">
            <button onClick={() => handlePurposeChange('ALL')} className={`px-5 py-2 text-xs uppercase tracking-[0.18em] font-semibold transition-colors ${purpose === 'ALL' ? 'bg-[#B79A62] text-[#0A0A09]' : 'text-[#8C867E] hover:text-[#E5DFD5]'}`}>All</button>
            <button onClick={() => handlePurposeChange('FOR_SALE')} className={`px-5 py-2 text-xs uppercase tracking-[0.18em] font-semibold transition-colors ${purpose === 'FOR_SALE' || purpose === 'BUY' ? 'bg-[#B79A62] text-[#0A0A09]' : 'text-[#8C867E] hover:text-[#E5DFD5]'}`}>Buy</button>
            <button onClick={() => handlePurposeChange('FOR_RENT')} className={`px-5 py-2 text-xs uppercase tracking-[0.18em] font-semibold transition-colors ${purpose === 'FOR_RENT' || purpose === 'RENT' ? 'bg-[#B79A62] text-[#0A0A09]' : 'text-[#8C867E] hover:text-[#E5DFD5]'}`}>Rent</button>
          </div>
        </div>
      </div>

      <div className="bg-[#171715] border border-[#25221E] p-4 sm:p-6 space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C867E]" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by community, tower name, reference ID (e.g. Living Legends, Business Bay)..." className="w-full pl-11 pr-4 py-3 bg-[#0A0A09] border border-[#25221E] focus:border-[#B79A62] text-sm text-[#F5F2EB] placeholder-[#5A5650] outline-none transition-colors" />
          </div>
          <button type="submit" className="px-8 py-3 bg-[#B79A62] hover:bg-[#D8BE8A] text-[#0A0A09] text-xs font-semibold tracking-[0.2em] uppercase transition-colors shrink-0">Search</button>
        </form>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 pt-2 border-t border-[#22201C] text-xs">
          <div>
            <label className="text-[10px] uppercase tracking-wider text-[#8C867E] block mb-1">Community</label>
            <select value={community} onChange={(e) => handleCommunityChange(e.target.value)} className="w-full bg-[#0A0A09] border border-[#25221E] text-[#E5DFD5] px-3 py-2 outline-none focus:border-[#B79A62]">
              {communitiesList.map((c) => <option key={c} value={c}>{c === 'ALL' ? 'All Locations' : c}</option>)}
            </select>
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-wider text-[#8C867E] block mb-1">Property Type</label>
            <select value={propertyType} onChange={(e) => handleTypeChange(e.target.value)} className="w-full bg-[#0A0A09] border border-[#25221E] text-[#E5DFD5] px-3 py-2 outline-none focus:border-[#B79A62]">
              {typesList.map((t) => <option key={t} value={t}>{t === 'ALL' ? 'All Types' : t}</option>)}
            </select>
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-wider text-[#8C867E] block mb-1">Bedrooms</label>
            <select value={bedrooms} onChange={(e) => handleBedroomsChange(e.target.value)} className="w-full bg-[#0A0A09] border border-[#25221E] text-[#E5DFD5] px-3 py-2 outline-none focus:border-[#B79A62]">
              <option value="ALL">Any Bedrooms</option><option value="1">1+ Bedrooms</option><option value="2">2+ Bedrooms</option><option value="3">3+ Bedrooms</option><option value="4">4+ Bedrooms</option><option value="5">5+ Bedrooms</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-wider text-[#8C867E] block mb-1">Sort By</label>
            <select value={sort} onChange={(e) => handleSortChange(e.target.value)} className="w-full bg-[#0A0A09] border border-[#25221E] text-[#E5DFD5] px-3 py-2 outline-none focus:border-[#B79A62]">
              <option value="newest">Newest Releases</option><option value="price-asc">Price: Low to High</option><option value="price-desc">Price: High to Low</option><option value="area">Largest Area (Sq.Ft)</option><option value="featured">Featured First</option>
            </select>
          </div>

          <div className="col-span-2 sm:col-span-4 lg:col-span-1 flex items-end">
            <button type="button" onClick={resetFilters} className="w-full py-2 bg-[#25221E] hover:bg-[#322E29] text-[#A8A196] hover:text-[#F5F2EB] uppercase tracking-wider text-[11px] font-semibold transition-colors flex items-center justify-center gap-1.5"><X className="w-3.5 h-3.5" />Reset All</button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-[#8C867E]"><div className="flex items-center gap-2"><span>Showing <strong className="text-[#F5F2EB]">{initialProperties.length}</strong> of <strong className="text-[#F5F2EB]">{initialTotal}</strong> verified properties</span>{isPending && <span className="text-[#B79A62] animate-pulse">Updating catalogue...</span>}</div><div className="text-[11px] text-[#7A756D] hidden sm:block">All listings comply with UAE RERA Advertising Permit standards</div></div>

      {initialProperties.length === 0 ? (
        <div className="text-center py-20 bg-[#171715] border border-[#25221E] space-y-4"><Building className="w-12 h-12 text-[#5A5650] mx-auto" /><h2 className="font-editorial text-2xl text-[#E5DFD5]">No Properties Found</h2><p className="text-sm text-[#8C867E] max-w-md mx-auto">We could not find any residences matching your specific parameters. Try widening your price range or clearing community filters.</p><button onClick={resetFilters} className="px-6 py-2.5 bg-[#B79A62] text-[#0A0A09] text-xs font-semibold uppercase tracking-wider hover:bg-[#D8BE8A] transition-colors">Clear Filters</button></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {initialProperties.map((property) => {
            const isRent = property.purpose === 'FOR_RENT';
            const priceFormatted = new Intl.NumberFormat('en-AE', { style: 'currency', currency: property.currency || 'AED', maximumFractionDigits: 0 }).format(property.price);
            return (
              <article key={property.id} id={`property-card-${property.id}`} className="group bg-[#171715] border border-[#25221E] hover:border-[#B79A62]/40 transition-all duration-300 flex flex-col justify-between overflow-hidden">
                <div className="relative aspect-[16/10] overflow-hidden bg-[#0A0A09]"><Image src={property.featuredImage || property.images?.[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'} alt={property.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                  <div className="absolute top-3 left-3 flex gap-2"><span className="px-2 py-1 bg-[#0A0A09]/80 backdrop-blur-sm text-[#B79A62] text-[9px] font-semibold uppercase tracking-wider border border-[#B79A62]/30">{isRent ? 'For Rent' : 'For Sale'}</span>{property.featured && <span className="px-2 py-1 bg-[#B79A62] text-[#0A0A09] text-[9px] font-semibold uppercase tracking-wider">Featured</span>}</div>
                </div>
                <div className="p-5 space-y-4"><div><h3 className="font-editorial text-2xl text-[#F5F2EB] leading-tight group-hover:text-[#D8BE8A] transition-colors">{property.title}</h3><p className="text-xs text-[#8C867E] mt-1">{property.community} • Dubai</p></div><div className="flex items-baseline justify-between gap-4"><span className="text-xl font-semibold text-[#F5F2EB]">{priceFormatted}</span><span className="text-[10px] uppercase tracking-wider text-[#7A756D]">{property.referenceNumber}</span></div><div className="grid grid-cols-3 gap-2 py-3 border-y border-[#25221E] text-[10px] text-[#8C867E]"><span className="flex items-center gap-1.5"><Bed className="w-3.5 h-3.5 text-[#B79A62]" />{property.bedrooms} Beds</span><span className="flex items-center gap-1.5"><Bath className="w-3.5 h-3.5 text-[#B79A62]" />{property.bathrooms} Baths</span><span className="flex items-center gap-1.5"><Maximize className="w-3.5 h-3.5 text-[#B79A62]" />{property.area.toLocaleString()} sqft</span></div><div className="flex items-center gap-2"><button onClick={() => setSelectedPropertyForViewing(property)} className="flex-1 py-2.5 bg-[#B79A62] hover:bg-[#D8BE8A] text-[#0A0A09] text-[10px] font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"><Calendar className="w-3.5 h-3.5" />Request Viewing</button><a href="tel:+971503490817" className="p-2.5 border border-[#3A3731] text-[#C8C0B3] hover:text-[#B79A62] transition-colors" aria-label="Call Tanmiyat"><Phone className="w-4 h-4" /></a></div></div>
              </article>
            );
          })}
        </div>
      )}

      <ViewingModal property={selectedPropertyForViewing} agents={agents} onClose={() => setSelectedPropertyForViewing(null)} />
    </div>
  );
};