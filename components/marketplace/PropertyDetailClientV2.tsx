'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PropertyItem } from '@/types';
import { Bed, Bath, Maximize, Car, ShieldCheck, Share2, CheckCircle2, Compass, Phone, MessageCircle, Calendar, ArrowUpRight } from 'lucide-react';
import { ViewingModal } from '@/components/marketplace/ViewingModal';
import { OfferModal } from '@/components/marketplace/OfferModal';

interface Props { property: PropertyItem; similarProperties: PropertyItem[]; }

const getYouTubeEmbed = (url?: string) => {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes('youtube.com')) return parsed.searchParams.get('v') ? `https://www.youtube.com/embed/${parsed.searchParams.get('v')}` : url;
    if (parsed.hostname === 'youtu.be') return `https://www.youtube.com/embed/${parsed.pathname.slice(1)}`;
  } catch {}
  return null;
};

export const PropertyDetailClientV2: React.FC<Props> = ({ property, similarProperties }) => {
  const images = Array.from(new Set((property.images?.length ? property.images : [property.featuredImage, property.heroImage]).filter((v): v is string => Boolean(v?.trim()))));
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showViewingModal, setShowViewingModal] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const isRent = property.purpose === 'FOR_RENT';
  const videoUrl = property.videoUrl?.trim();
  const youtubeEmbed = getYouTubeEmbed(videoUrl);

  const share = () => {
    if (navigator.share) navigator.share({ title: property.title, url: window.location.href }).catch(() => {});
    else navigator.clipboard?.writeText(window.location.href);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      <nav className="flex items-center gap-2 text-xs text-[#8C867E]"><Link href="/">Home</Link><span>/</span><Link href="/properties">Marketplace</Link><span>/</span><span className="text-[#C8C0B3] truncate">{property.title}</span></nav>

      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-[#25221E]">
        <div className="space-y-2"><div className="flex flex-wrap gap-2"><span className="px-2.5 py-1 bg-[#B79A62] text-[#0A0A09] text-[10px] uppercase font-bold">{isRent ? 'For Rent' : 'For Sale'}</span><span className="px-2.5 py-1 bg-[#171715] border border-[#25221E] text-[#B79A62] text-[10px] uppercase">{property.propertyType}</span><span className="px-2.5 py-1 bg-emerald-950/40 border border-emerald-800/40 text-emerald-400 text-[10px] uppercase">RERA Verified</span></div><h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl text-[#F5F2EB]">{property.title}</h1><p className="text-sm text-[#A8A196] flex items-center gap-2"><Compass className="w-4 h-4 text-[#B79A62]" />{property.address || `${property.subCommunity || ''}, ${property.community}, Dubai, UAE`}</p></div>
        <div className="bg-[#171715] border border-[#25221E] p-5 lg:min-w-[320px]"><div className="text-[10px] uppercase tracking-wider text-[#8C867E]">{isRent ? 'Rental Price' : 'Asking Price'}</div><div className="font-editorial text-3xl text-[#F5F2EB]">AED {property.price.toLocaleString()}{isRent && <span className="text-xs text-[#A8A196]"> / {property.rentalPeriod?.toLowerCase() || 'year'}</span>}</div></div>
      </div>

      <section className="space-y-4">
        {images.length ? <><div className="relative aspect-[16/9] md:aspect-[21/9] overflow-hidden bg-[#0A0A09] border border-[#25221E]"><Image src={images[selectedImageIndex] || images[0]} alt={`${property.title} image ${selectedImageIndex + 1}`} fill priority className="object-cover" sizes="100vw" referrerPolicy="no-referrer" /><div className="absolute top-4 right-4 flex gap-2"><span className="px-2.5 py-1 bg-black/75 text-white text-[10px]">{selectedImageIndex + 1} / {images.length}</span><button onClick={share} className="p-2.5 bg-black/75 text-white"><Share2 className="w-4 h-4" /></button></div></div><div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">{images.map((img, i) => <button key={`${img}-${i}`} type="button" onClick={() => setSelectedImageIndex(i)} className={`relative aspect-[16/10] overflow-hidden border ${i === selectedImageIndex ? 'border-[#B79A62] ring-1 ring-[#B79A62]' : 'border-[#25221E]'}`}><Image src={img} alt={`${property.title} thumbnail ${i + 1}`} fill className="object-cover" sizes="20vw" referrerPolicy="no-referrer" /></button>)}</div></> : <div className="aspect-video flex items-center justify-center bg-[#171715] border border-[#25221E] text-[#8C867E]">No property image available</div>}
      </section>

      {videoUrl && <section className="space-y-4"><div className="flex items-center justify-between"><h2 className="font-editorial text-2xl text-[#F5F2EB]">Property Video</h2><span className="text-[10px] uppercase tracking-wider text-[#8C867E]">Official Listing Media</span></div><div className="relative aspect-video w-full overflow-hidden bg-black border border-[#25221E]">{youtubeEmbed ? <iframe src={youtubeEmbed} title={`${property.title} video`} className="absolute inset-0 w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen /> : <video src={videoUrl} controls playsInline preload="metadata" className="absolute inset-0 w-full h-full object-contain" />}</div></section>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-[#171715] border border-[#25221E] text-sm"><div><span className="text-[10px] text-[#8C867E] block">Bedrooms</span><span className="flex gap-2 items-center text-[#F5F2EB]"><Bed className="w-4 h-4 text-[#B79A62]" />{property.bedrooms}</span></div><div><span className="text-[10px] text-[#8C867E] block">Bathrooms</span><span className="flex gap-2 items-center text-[#F5F2EB]"><Bath className="w-4 h-4 text-[#B79A62]" />{property.bathrooms}</span></div><div><span className="text-[10px] text-[#8C867E] block">Area</span><span className="flex gap-2 items-center text-[#F5F2EB]"><Maximize className="w-4 h-4 text-[#B79A62]" />{property.area.toLocaleString()} sq.ft</span></div><div><span className="text-[10px] text-[#8C867E] block">Parking</span><span className="flex gap-2 items-center text-[#F5F2EB]"><Car className="w-4 h-4 text-[#B79A62]" />{property.parkingSpaces || 2}</span></div></div>
          <div className="bg-[#121210] border border-[#2D2A26] p-6"><div className="flex items-center gap-2 text-[#B79A62] text-xs uppercase tracking-wider font-semibold mb-4"><ShieldCheck className="w-4 h-4 text-emerald-400" />RERA & DLD Regulatory Validation</div><div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs"><div><span className="text-[#7A756D] block">Broker ORN</span><b>12048</b></div><div><span className="text-[#7A756D] block">Advertising Permit</span><b>{property.advertisingPermitNumber || '—'}</b></div><div><span className="text-[#7A756D] block">Agent BRN</span><b>{property.agent?.brn || '48219'}</b></div><div><span className="text-[#7A756D] block">Developer</span><b>{property.developer}</b></div></div></div>
          <div className="space-y-4"><h2 className="font-editorial text-2xl text-[#F5F2EB]">Architectural Overview</h2><p className="text-sm text-[#C8C0B3] leading-relaxed">{property.description}</p></div>
          {property.amenities?.length > 0 && <div className="space-y-4"><h2 className="font-editorial text-2xl text-[#F5F2EB]">Residences & Amenities</h2><div className="grid grid-cols-2 sm:grid-cols-3 gap-3">{property.amenities.map((item,i)=><div key={i} className="flex items-center gap-2 p-3 bg-[#171715] border border-[#25221E] text-xs text-[#E5DFD5]"><CheckCircle2 className="w-3.5 h-3.5 text-[#B79A62]" />{item}</div>)}</div></div>}
        </div>
        <aside>{property.agent && <div className="bg-[#171715] border border-[#25221E] p-6 space-y-4 sticky top-24"><h3 className="font-editorial text-xl text-[#F5F2EB]">{property.agent.name}</h3><p className="text-xs text-[#8C867E]">{property.agent.title || property.agent.designation}</p><button onClick={() => setShowViewingModal(true)} className="w-full py-3 bg-[#B79A62] text-[#0A0A09] text-xs uppercase font-bold"><Calendar className="inline w-4 h-4 mr-2" />Schedule Private Viewing</button><button onClick={() => setShowOfferModal(true)} className="w-full py-3 border border-[#B79A62] text-[#B79A62] text-xs uppercase font-bold">Submit Private Offer</button><div className="grid grid-cols-2 gap-2"><a href={`tel:${property.agent.phone}`} className="p-3 border border-[#25221E] text-center text-xs text-[#B79A62]"><Phone className="inline w-3.5 h-3.5 mr-1" />Call</a><a href={`https://wa.me/${property.agent.whatsApp.replace(/[^0-9]/g,'')}`} target="_blank" rel="noreferrer" className="p-3 border border-[#25221E] text-center text-xs text-[#25D366]"><MessageCircle className="inline w-3.5 h-3.5 mr-1" />WhatsApp</a></div></div>}</aside>
      </div>

      {similarProperties.length > 0 && <section className="pt-6 border-t border-[#25221E] space-y-5"><div className="flex justify-between items-end"><div><span className="text-[10px] uppercase tracking-wider text-[#B79A62]">Curated Selection</span><h2 className="font-editorial text-3xl text-[#F5F2EB]">Similar Residences</h2></div><Link href="/properties" className="text-xs text-[#8C867E]">View all <ArrowUpRight className="inline w-3 h-3" /></Link></div><div className="grid grid-cols-1 md:grid-cols-3 gap-6">{similarProperties.map(p=><Link key={p.id} href={`/properties/${p.slug}`} className="bg-[#171715] border border-[#25221E] overflow-hidden group"><div className="relative aspect-[16/10]"><Image src={p.featuredImage || p.images?.[0] || p.heroImage} alt={p.title} fill className="object-cover group-hover:scale-105 transition-transform" /></div><div className="p-4"><h3 className="font-editorial text-lg text-[#F5F2EB]">{p.title}</h3><p className="text-xs text-[#8C867E]">{p.community}</p></div></Link>)}</div></section>}

      <ViewingModal property={property} isOpen={showViewingModal} onClose={() => setShowViewingModal(false)} />
      <OfferModal property={property} isOpen={showOfferModal} onClose={() => setShowOfferModal(false)} />
    </div>
  );
};
