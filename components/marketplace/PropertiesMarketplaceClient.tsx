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

  // Filter states
  const [purpose, setPurpose] = useState<string>(initialPurpose);
  const [community, setCommunity] = useState<string>(initialCommunity);
  const [propertyType, setPropertyType] = useState<string>(initialType);
  const [bedrooms, setBedrooms] = useState<string>(initialBedrooms);
  const [search, setSearch] = useState<string>(initialSearch);
  const [sort, setSort] = useState<string>(initialSort);
  const [priceMax, setPriceMax] = useState<string>('');

  // Selected property for booking modal
  const [selectedPropertyForViewing, setSelectedPropertyForViewing] = useState<PropertyItem | null>(null);

  // Apply filters to URL
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

  const handlePurposeChange = (val: string) => {
    setPurpose(val);
    applyFilters({ purpose: val });
  };

  const handleCommunityChange = (val: string) => {
    setCommunity(val);
    applyFilters({ community: val });
  };

  const handleTypeChange = (val: string) => {
    setPropertyType(val);
    applyFilters({ propertyType: val });
  };

  const handleBedroomsChange = (val: string) => {
    setBedrooms(val);
    applyFilters({ bedrooms: val });
  };

  const handleSortChange = (val: string) => {
    setSort(val);
    applyFilters({ sort: val });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters();
  };

  const resetFilters = () => {
    setPurpose('ALL');
    setCommunity('ALL');
    setPropertyType('ALL');
    setBedrooms('ALL');
    setSearch('');
    setSort('newest');
    setPriceMax('');
    startTransition(() => {
      router.push('/properties');
    });
  };

  const communitiesList = [
    'ALL',
    'Business Bay',
    'Dubailand',
    'Dubai Water Canal',
    'Palm Jumeirah',
    'Downtown Dubai',
    'Dubai Marina',
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

          {/* PURPOSE TAB SELECTOR (BUY / RENT / ALL) */}
          <div className="flex items-center p-1 bg-[#171715] border border-[#25221E] self-start md:self-end">
            <button
              onClick={() => handlePurposeChange('ALL')}
              className={`px-5 py-2 text-xs uppercase tracking-[0.18em] font-semibold transition-colors ${
                purpose === 'ALL'
                  ? 'bg-[#B79A62] text-[#0A0A09]'
                  : 'text-[#8C867E] hover:text-[#E5DFD5]'
              }`}
            >
              All
            </button>
            <button
              onClick={() => handlePurposeChange('FOR_SALE')}
              className={`px-5 py-2 text-xs uppercase tracking-[0.18em] font-semibold transition-colors ${
                purpose === 'FOR_SALE' || purpose === 'BUY'
                  ? 'bg-[#B79A62] text-[#0A0A09]'
                  : 'text-[#8C867E] hover:text-[#E5DFD5]'
              }`}
            >
              Buy
            </button>
            <button
              onClick={() => handlePurposeChange('FOR_RENT')}
              className={`px-5 py-2 text-xs uppercase tracking-[0.18em] font-semibold transition-colors ${
                purpose === 'FOR_RENT' || purpose === 'RENT'
                  ? 'bg-[#B79A62] text-[#0A0A09]'
                  : 'text-[#8C867E] hover:text-[#E5DFD5]'
              }`}
            >
              Rent
            </button>
          </div>
        </div>
      </div>

      {/* SEARCH AND FILTER BAR */}
      <div className="bg-[#171715] border border-[#25221E] p-4 sm:p-6 space-y-4">
        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C867E]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by community, tower name, reference ID (e.g. Living Legends, Business Bay)..."
              className="w-full pl-11 pr-4 py-3 bg-[#0A0A09] border border-[#25221E] focus:border-[#B79A62] text-sm text-[#F5F2EB] placeholder-[#5A5650] outline-none transition-colors"
            />
          </div>
          <button
            type="submit"
            className="px-8 py-3 bg-[#B79A62] hover:bg-[#D8BE8A] text-[#0A0A09] text-xs font-semibold tracking-[0.2em] uppercase transition-colors shrink-0"
          >
            Search
          </button>
        </form>

        {/* Filters Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 pt-2 border-t border-[#22201C] text-xs">
          {/* Community */}
          <div>
            <label className="text-[10px] uppercase tracking-wider text-[#8C867E] block mb-1">Community</label>
            <select
              value={community}
              onChange={(e) => handleCommunityChange(e.target.value)}
              className="w-full bg-[#0A0A09] border border-[#25221E] text-[#E5DFD5] px-3 py-2 outline-none focus:border-[#B79A62]"
            >
              {communitiesList.map((c) => (
                <option key={c} value={c}>
                  {c === 'ALL' ? 'All Locations' : c}
                </option>
              ))}
            </select>
          </div>

          {/* Property Type */}
          <div>
            <label className="text-[10px] uppercase tracking-wider text-[#8C867E] block mb-1">Property Type</label>
            <select
              value={propertyType}
              onChange={(e) => handleTypeChange(e.target.value)}
              className="w-full bg-[#0A0A09] border border-[#25221E] text-[#E5DFD5] px-3 py-2 outline-none focus:border-[#B79A62]"
            >
              {typesList.map((t) => (
                <option key={t} value={t}>
                  {t === 'ALL' ? 'All Types' : t}
                </option>
              ))}
            </select>
          </div>

          {/* Bedrooms */}
          <div>
            <label className="text-[10px] uppercase tracking-wider text-[#8C867E] block mb-1">Bedrooms</label>
            <select
              value={bedrooms}
              onChange={(e) => handleBedroomsChange(e.target.value)}
              className="w-full bg-[#0A0A09] border border-[#25221E] text-[#E5DFD5] px-3 py-2 outline-none focus:border-[#B79A62]"
            >
              <option value="ALL">Any Bedrooms</option>
              <option value="1">1+ Bedrooms</option>
              <option value="2">2+ Bedrooms</option>
              <option value="3">3+ Bedrooms</option>
              <option value="4">4+ Bedrooms</option>
              <option value="5">5+ Bedrooms</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="text-[10px] uppercase tracking-wider text-[#8C867E] block mb-1">Sort By</label>
            <select
              value={sort}
              onChange={(e) => handleSortChange(e.target.value)}
              className="w-full bg-[#0A0A09] border border-[#25221E] text-[#E5DFD5] px-3 py-2 outline-none focus:border-[#B79A62]"
            >
              <option value="newest">Newest Releases</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="area">Largest Area (Sq.Ft)</option>
              <option value="featured">Featured First</option>
            </select>
          </div>

          {/* Reset Filters */}
          <div className="col-span-2 sm:col-span-4 lg:col-span-1 flex items-end">
            <button
              type="button"
              onClick={resetFilters}
              className="w-full py-2 bg-[#25221E] hover:bg-[#322E29] text-[#A8A196] hover:text-[#F5F2EB] uppercase tracking-wider text-[11px] font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <X className="w-3.5 h-3.5" />
              Reset All
            </button>
          </div>
        </div>
      </div>

      {/* RESULTS COUNT & STATUS */}
      <div className="flex items-center justify-between text-xs text-[#8C867E]">
        <div className="flex items-center gap-2">
          <span>
            Showing <strong className="text-[#F5F2EB]">{initialProperties.length}</strong> of{' '}
            <strong className="text-[#F5F2EB]">{initialTotal}</strong> verified properties
          </span>
          {isPending && <span className="text-[#B79A62] animate-pulse">Updating catalogue...</span>}
        </div>
        <div className="text-[11px] text-[#7A756D] hidden sm:block">
          All listings comply with UAE RERA Advertising Permit standards
        </div>
      </div>

      {/* PROPERTIES GRID */}
      {initialProperties.length === 0 ? (
        <div className="text-center py-20 bg-[#171715] border border-[#25221E] space-y-4">
          <Building className="w-12 h-12 text-[#5A5650] mx-auto" />
          <h2 className="font-editorial text-2xl text-[#E5DFD5]">No Properties Found</h2>
          <p className="text-sm text-[#8C867E] max-w-md mx-auto">
            We could not find any residences matching your specific parameters. Try widening your price range or clearing community filters.
          </p>
          <button
            onClick={resetFilters}
            className="px-6 py-2.5 bg-[#B79A62] text-[#0A0A09] text-xs font-semibold uppercase tracking-wider hover:bg-[#D8BE8A] transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {initialProperties.map((property) => {
            const isRent = property.purpose === 'FOR_RENT';
            const priceFormatted = new Intl.NumberFormat('en-AE', {
              style: 'currency',
              currency: property.currency || 'AED',
              maximumFractionDigits: 0,
            }).format(property.price);

            return (
              <article
                key={property.id}
                id={`property-card-${property.id}`}
                className="group bg-[#171715] border border-[#25221E] hover:border-[#B79A62]/40 transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                {/* Top Image Container */}
                <div className="relative aspect-[16/10] overflow-hidden bg-[#0A0A09]">
                  <Image
                    src={property.featuredImage || property.images?.[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'}
                    alt={property.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A09] via-transparent to-black/40" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                    <span
                      className={`text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 ${
                        isRent
                          ? 'bg-[#25221E]/90 text-[#D8BE8A] border border-[#B79A62]/30'
                          : 'bg-[#B79A62] text-[#0A0A09]'
                      }`}
                    >
                      {isRent ? 'For Rent' : 'For Sale'}
                    </span>

                    <span className="inline-flex items-center gap-1 text-[10px] bg-black/80 backdrop-blur-md text-[#E5DFD5] px-2 py-0.5 border border-[#3A3731]">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      <span>RERA Verified</span>
                    </span>
                  </div>

                  {/* Price Tag Overlay */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-baseline justify-between">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[#A8A196] block">
                        {isRent ? 'Rental Rate' : 'Asking Price'}
                      </span>
                      <span className="font-editorial text-2xl text-[#F5F2EB] font-medium tracking-tight">
                        {priceFormatted}
                        {isRent && (
                          <span className="text-xs font-normal text-[#A8A196] ml-1">
                            /{property.rentalPeriod?.toLowerCase() || 'yearly'}
                          </span>
                        )}
                      </span>
                    </div>
                    {property.pricePerSqFt && (
                      <span className="text-[11px] text-[#8C867E]">
                        AED {property.pricePerSqFt.toLocaleString()}/sq.ft
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 sm:p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-[#8C867E]">
                      <span className="uppercase tracking-widest">{property.community}</span>
                      <span className="font-mono text-[#5A5650]">{property.referenceNumber}</span>
                    </div>

                    <Link href={`/properties/${property.slug}`}>
                      <h3 className="font-editorial text-xl text-[#F5F2EB] hover:text-[#B79A62] transition-colors line-clamp-1">
                        {property.title}
                      </h3>
                    </Link>

                    <p className="text-xs text-[#A8A196] line-clamp-2 font-light">
                      {property.shortDescription || property.description}
                    </p>
                  </div>

                  {/* Specifications Bar */}
                  <div className="grid grid-cols-3 gap-2 py-3 border-y border-[#22201C] text-xs text-[#C8C0B3]">
                    <div className="flex items-center gap-1.5">
                      <Bed className="w-3.5 h-3.5 text-[#B79A62]" />
                      <span>{property.bedrooms} Beds</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Bath className="w-3.5 h-3.5 text-[#B79A62]" />
                      <span>{property.bathrooms} Baths</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Maximize className="w-3.5 h-3.5 text-[#B79A62]" />
                      <span>{property.area.toLocaleString()} sq.ft</span>
                    </div>
                  </div>

                  {/* Assigned Agent & Permit Info */}
                  <div className="flex items-center justify-between pt-1 text-[10px] text-[#7A756D]">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-[#25221E] flex items-center justify-center text-[9px] text-[#B79A62] uppercase font-bold">
                        {property.agent?.name?.charAt(0) || 'T'}
                      </div>
                      <span className="text-[#A8A196]">{property.agent?.name || 'Private Advisor'}</span>
                    </div>
                    <span title="DLD Advertising Permit">Permit: {property.advertisingPermitNumber}</span>
                  </div>

                  {/* Card Actions */}
                  <div className="pt-2 flex items-center gap-2">
                    <Link
                      href={`/properties/${property.slug}`}
                      className="flex-1 py-2.5 bg-[#25221E] hover:bg-[#B79A62] hover:text-[#0A0A09] text-[#E5DFD5] text-xs font-semibold uppercase tracking-wider text-center transition-all inline-flex items-center justify-center gap-1"
                    >
                      <span>Residence Details</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>

                    <button
                      type="button"
                      onClick={() => setSelectedPropertyForViewing(property)}
                      className="px-3.5 py-2.5 bg-[#171715] hover:bg-[#25221E] border border-[#25221E] text-[#B79A62] hover:text-[#D8BE8A] text-xs font-semibold uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-1"
                      title="Schedule Private Viewing"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* VIEWING MODAL */}
      {selectedPropertyForViewing && (
        <ViewingModal
          property={selectedPropertyForViewing}
          onClose={() => setSelectedPropertyForViewing(null)}
        />
      )}
    </div>
  );
};
