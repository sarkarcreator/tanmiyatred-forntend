'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { PropertyItem } from '@/types';
import { ArrowRight, Bed, Bath, Maximize, MapPin, Home, KeyRound } from 'lucide-react';

interface Props {
  properties: PropertyItem[];
}

const PropertyCard = ({ property }: { property: PropertyItem }) => {
  const image = property.featuredImage || property.images?.[0] || property.heroImage;
  const price = new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: property.currency || 'AED',
    maximumFractionDigits: 0,
  }).format(property.price);
  const isRent = property.purpose === 'FOR_RENT';

  return (
    <Link
      href={`/properties/${property.slug}`}
      className="group bg-[#171715] border border-[#25221E] hover:border-[#B79A62]/60 transition-all duration-500 overflow-hidden flex flex-col"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-[#0A0A09]">
        <Image
          src={image}
          alt={property.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
        <div className="absolute top-3 left-3 px-2.5 py-1 bg-[#0A0A09]/85 border border-[#B79A62]/30 text-[#D8BE8A] text-[9px] uppercase tracking-wider font-semibold">
          {isRent ? 'For Rent' : 'For Sale'}
        </div>
        {property.featured && (
          <div className="absolute top-3 right-3 px-2.5 py-1 bg-[#B79A62] text-[#0A0A09] text-[9px] uppercase tracking-wider font-semibold">
            Featured
          </div>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-[#8C867E] mb-2">
          <MapPin className="w-3 h-3 text-[#B79A62]" />
          {property.community || property.address}
        </div>
        <h3 className="font-editorial text-xl text-[#F5F2EB] leading-tight group-hover:text-[#D8BE8A] transition-colors">
          {property.title}
        </h3>
        <div className="flex items-baseline justify-between gap-3 mt-3">
          <span className="text-lg font-semibold text-[#F5F2EB]">{price}</span>
          <span className="text-[9px] uppercase tracking-wider text-[#7A756D]">{property.propertyType}</span>
        </div>
        <div className="grid grid-cols-3 gap-2 border-t border-[#25221E] mt-4 pt-3 text-[10px] text-[#8C867E]">
          <span className="flex items-center gap-1.5"><Bed className="w-3.5 h-3.5 text-[#B79A62]" />{property.bedrooms}</span>
          <span className="flex items-center gap-1.5"><Bath className="w-3.5 h-3.5 text-[#B79A62]" />{property.bathrooms}</span>
          <span className="flex items-center gap-1.5"><Maximize className="w-3.5 h-3.5 text-[#B79A62]" />{property.area.toLocaleString()}</span>
        </div>
      </div>
    </Link>
  );
};

export const PropertyShowcase: React.FC<Props> = ({ properties }) => {
  const sale = properties.filter((p) => p.purpose === 'FOR_SALE').slice(0, 4);
  const rent = properties.filter((p) => p.purpose === 'FOR_RENT').slice(0, 4);

  if (!sale.length && !rent.length) return null;

  return (
    <section className="py-20 sm:py-24 bg-[#0A0A09] border-b border-[#22201C] text-[#F5F2EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-[#B79A62] text-[10px] uppercase tracking-[0.28em] font-semibold mb-3">
              <Home className="w-3.5 h-3.5" /> Dubai Property Collection
            </div>
            <h2 className="font-editorial text-3xl sm:text-5xl lg:text-6xl">Buy or Rent in Dubai</h2>
            <p className="text-sm text-[#A8A196] max-w-2xl mt-3 font-light">
              Explore verified homes available for purchase or rental, directly from the live property catalogue.
            </p>
          </div>
          <Link href="/properties" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#B79A62] border-b border-[#B79A62] pb-1 self-start md:self-end">
            View all properties <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {sale.length > 0 && (
          <div className="mb-14">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-editorial text-2xl sm:text-3xl flex items-center gap-2"><KeyRound className="w-5 h-5 text-[#B79A62]" /> Properties for Sale</h3>
              <Link href="/properties?purpose=FOR_SALE" className="text-[10px] uppercase tracking-wider text-[#8C867E] hover:text-[#B79A62]">View Buy Listings →</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {sale.map((property) => <PropertyCard key={property.id} property={property} />)}
            </div>
          </div>
        )}

        {rent.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-editorial text-2xl sm:text-3xl flex items-center gap-2"><Home className="w-5 h-5 text-[#B79A62]" /> Properties for Rent</h3>
              <Link href="/properties?purpose=FOR_RENT" className="text-[10px] uppercase tracking-wider text-[#8C867E] hover:text-[#B79A62]">View Rental Listings →</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {rent.map((property) => <PropertyCard key={property.id} property={property} />)}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
