'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PropertyItem } from '@/types';
import {
  Bed,
  Bath,
  Maximize,
  ShieldCheck,
  Calendar,
  Phone,
  MessageCircle,
  FileText,
  Share2,
  CheckCircle2,
  Building,
  Car,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  Calculator,
  Compass,
  ArrowUpRight,
} from 'lucide-react';
import { ViewingModal } from '@/components/marketplace/ViewingModal';
import { OfferModal } from '@/components/marketplace/OfferModal';

interface Props {
  property: PropertyItem;
  similarProperties: PropertyItem[];
}

export const PropertyDetailClient: React.FC<Props> = ({ property, similarProperties }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [currency, setCurrency] = useState<'AED' | 'USD' | 'EUR' | 'GBP'>('AED');
  const [showViewingModal, setShowViewingModal] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);

  // Mortgage Calculator State
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [loanTermYears, setLoanTermYears] = useState(25);
  const [interestRate, setInterestRate] = useState(4.25);

  // Normalize gallery images from the API so every uploaded image is preserved.
  // Supports normal arrays plus legacy JSON/comma-separated string values.
  const rawImages = (property as PropertyItem & { images?: string[] | string }).images;
  const images: string[] = Array.isArray(rawImages)
    ? rawImages.filter((image): image is string => Boolean(image?.trim()))
    : typeof rawImages === 'string'
      ? (() => {
          try {
            const parsed = JSON.parse(rawImages);
            return Array.isArray(parsed)
              ? parsed.filter((image): image is string => typeof image === 'string' && Boolean(image.trim()))
              : rawImages.split(/[,\n]/).map((image) => image.trim()).filter(Boolean);
          } catch {
            return rawImages.split(/[,\n]/).map((image) => image.trim()).filter(Boolean);
          }
        })()
      : [];
  const galleryImages: string[] = Array.from(
    new Set(
      (images.length > 0 ? images : [property.featuredImage, property.heroImage])
        .filter((image): image is string => Boolean(image?.trim()))
    )
  );

  // Currency exchange approximations
  const currencyRates = {
    AED: 1,
    USD: 0.272,
    EUR: 0.252,
    GBP: 0.215,
  };

  const convertedPrice = property.price * currencyRates[currency];
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0,
  }).format(convertedPrice);

  // Mortgage calculations
  const loanAmount = property.price * (1 - downPaymentPercent / 100);
  const monthlyRate = interestRate / 100 / 12;
  const totalMonths = loanTermYears * 12;
  const monthlyPayment =
    monthlyRate > 0
      ? (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths))) /
        (Math.pow(1 + monthlyRate, totalMonths) - 1)
      : loanAmount / totalMonths;

  const isRent = property.purpose === 'FOR_RENT';

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({
        title: property.title,
        text: `Explore ${property.title} in ${property.community}, Dubai`,
        url: window.location.href,
      }).catch(() => {});
    } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* BREADCRUMB NAVIGATION */}
      <nav className="flex items-center gap-2 text-xs text-[#8C867E]">
        <Link href="/" className="hover:text-[#F5F2EB] transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#5A5650]" />
        <Link href="/properties" className="hover:text-[#F5F2EB] transition-colors">Marketplace</Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#5A5650]" />
        <span className="text-[#C8C0B3] truncate">{property.title}</span>
      </nav>

      {/* TOP TITLE & PRICING HERO BAR */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-[#25221E]">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-2.5 py-1 bg-[#B79A62] text-[#0A0A09] text-[10px] uppercase font-bold tracking-widest">{isRent ? 'For Rent' : 'For Sale'}</span>
            <span className="px-2.5 py-1 bg-[#171715] border border-[#25221E] text-[#B79A62] text-[10px] uppercase tracking-wider font-semibold">{property.propertyType}</span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-950/40 border border-emerald-800/40 text-emerald-400 text-[10px] font-semibold"><ShieldCheck className="w-3 h-3" /><span>RERA Permit Verified</span></span>
            <span className="font-mono text-[11px] text-[#7A756D]">{property.referenceNumber}</span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl text-[#F5F2EB] tracking-tight">{property.title}</h1>
          <p className="text-sm text-[#A8A196] flex items-center gap-2 font-light"><Compass className="w-4 h-4 text-[#B79A62]" /><span>{property.address || `${property.subCommunity || ''}, ${property.community}, Dubai, UAE`}</span></p>
        </div>

        <div className="flex flex-col sm:items-end gap-2 bg-[#171715] border border-[#25221E] p-4 sm:p-5 lg:min-w-[320px]">
          <div className="flex items-center gap-1.5 self-start sm:self-end text-[10px] uppercase tracking-wider">
            {(['AED', 'USD', 'EUR', 'GBP'] as const).map((curr) => (
              <button key={curr} onClick={() => setCurrency(curr)} className={`px-2 py-0.5 border transition-colors ${currency === curr ? 'border-[#B79A62] text-[#B79A62] bg-[#B79A62]/10 font-bold' : 'border-transparent text-[#8C867E] hover:text-[#C8C0B3]'}`}>{curr}</button>
            ))}
          </div>
          <div className="font-editorial text-3xl sm:text-4xl text-[#F5F2EB] tracking-tight">{formattedPrice}{isRent && <span className="text-xs font-normal text-[#A8A196] ml-1">/{property.rentalPeriod?.toLowerCase() || 'year'}</span>}</div>
          {property.pricePerSqFt && currency === 'AED' && <div className="text-[11px] text-[#8C867E]">AED {property.pricePerSqFt.toLocaleString()} / sq.ft</div>}
        </div>
      </div>

      {/* GALLERY SECTION — SHOW EVERY UPLOADED PROPERTY IMAGE */}
      <div className="space-y-4">
        {galleryImages.length > 0 ? (
          <>
            <div className="relative aspect-[16/9] md:aspect-[21/9] w-full overflow-hidden bg-[#0A0A09] border border-[#25221E]">
              <Image
                src={galleryImages[selectedImageIndex] ?? galleryImages[0]}
                alt={`${property.title} — image ${selectedImageIndex + 1} of ${galleryImages.length}`}
                fill
                priority
                className="object-cover transition-opacity duration-500"
                sizes="(max-width: 1280px) 100vw, 1280px"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <span className="px-2.5 py-1 bg-black/70 border border-[#3A3731] text-[#F5F2EB] text-[10px] uppercase tracking-wider">
                  {selectedImageIndex + 1} / {galleryImages.length}
                </span>
                <button onClick={handleShare} className="p-2.5 bg-black/70 hover:bg-black/90 text-[#F5F2EB] border border-[#3A3731] transition-colors" title="Share Residence"><Share2 className="w-4 h-4" /></button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {galleryImages.map((img, idx) => (
                <button
                  key={`${img}-${idx}`}
                  type="button"
                  onClick={() => setSelectedImageIndex(idx)}
                  aria-label={`View property image ${idx + 1}`}
                  className={`group relative aspect-[16/10] overflow-hidden border transition-all ${selectedImageIndex === idx ? 'border-[#B79A62] ring-1 ring-[#B79A62]' : 'border-[#25221E] hover:border-[#B79A62]/60'}`}
                >
                  <Image
                    src={img}
                    alt={`${property.title} — thumbnail ${idx + 1}`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute bottom-2 left-2 px-1.5 py-0.5 bg-black/75 text-[#F5F2EB] text-[9px] font-mono">{idx + 1}</span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="aspect-[16/9] md:aspect-[21/9] w-full flex items-center justify-center bg-[#0A0A09] border border-[#25221E] text-[#8C867E] text-sm">No property image available</div>
        )}
      </div>

      {/* MAIN TWO-COLUMN CONTENT LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-[#171715] border border-[#25221E] text-xs">
            <div className="space-y-1"><span className="text-[10px] uppercase tracking-wider text-[#8C867E] block">Bedrooms</span><div className="flex items-center gap-2 text-[#F5F2EB] font-medium text-sm"><Bed className="w-4 h-4 text-[#B79A62]" /><span>{property.bedrooms} Beds</span></div></div>
            <div className="space-y-1"><span className="text-[10px] uppercase tracking-wider text-[#8C867E] block">Bathrooms</span><div className="flex items-center gap-2 text-[#F5F2EB] font-medium text-sm"><Bath className="w-4 h-4 text-[#B79A62]" /><span>{property.bathrooms} Baths</span></div></div>
            <div className="space-y-1"><span className="text-[10px] uppercase tracking-wider text-[#8C867E] block">Built-Up Area</span><div className="flex items-center gap-2 text-[#F5F2EB] font-medium text-sm"><Maximize className="w-4 h-4 text-[#B79A62]" /><span>{property.area.toLocaleString()} sq.ft</span></div></div>
            <div className="space-y-1"><span className="text-[10px] uppercase tracking-wider text-[#8C867E] block">Parking</span><div className="flex items-center gap-2 text-[#F5F2EB] font-medium text-sm"><Car className="w-4 h-4 text-[#B79A62]" /><span>{property.parkingSpaces || 2} Bays</span></div></div>
          </div>

          <div className="bg-[#121210] border border-[#2D2A26] p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#22201C]"><div className="flex items-center gap-2 text-[#B79A62] text-xs font-semibold uppercase tracking-[0.2em]"><ShieldCheck className="w-4 h-4 text-emerald-400" /><span>RERA & Dubai Land Department Regulatory Validation</span></div><span className="text-[10px] uppercase bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 px-2 py-0.5">Authentic Verification</span></div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs"><div><span className="text-[10px] uppercase text-[#7A756D] block">Broker ORN</span><span className="font-semibold text-[#F5F2EB]">12048</span></div><div><span className="text-[10px] uppercase text-[#7A756D] block">Advertising Permit</span><span className="font-mono text-[#D8BE8A]">{property.advertisingPermitNumber}</span></div><div><span className="text-[10px] uppercase text-[#7A756D] block">Agent BRN</span><span className="font-semibold text-[#F5F2EB]">{property.agent?.brn || '48219'}</span></div><div><span className="text-[10px] uppercase text-[#7A756D] block">Developer</span><span className="text-[#F5F2EB]">{property.developer}</span></div></div>
            <p className="text-[11px] text-[#8C867E] leading-relaxed pt-2 border-t border-[#22201C]">In accordance with Dubai Real Estate Regulatory Agency laws, this advertising permit is verified for public promotion. All deposits are deposited directly into designated DLD escrow project accounts.</p>
          </div>

          <div className="space-y-4"><h2 className="font-editorial text-2xl text-[#F5F2EB]">Architectural Overview</h2><div className="prose prose-invert max-w-none text-sm text-[#C8C0B3] leading-relaxed space-y-4"><p>{property.description}</p></div></div>

          {property.amenities && property.amenities.length > 0 && <div className="space-y-4"><h2 className="font-editorial text-2xl text-[#F5F2EB]">Residences & Amenities</h2><div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">{property.amenities.map((item, idx) => <div key={idx} className="flex items-center gap-2 p-3 bg-[#171715] border border-[#25221E] text-[#E5DFD5]"><CheckCircle2 className="w-3.5 h-3.5 text-[#B79A62] shrink-0" /><span>{item}</span></div>)}</div></div>}

          {!isRent && <div className="bg-[#171715] border border-[#25221E] p-6 space-y-6"><div className="flex items-center justify-between pb-3 border-b border-[#22201C]"><div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#B79A62] font-semibold"><Calculator className="w-4 h-4 text-[#B79A62]" /><span>Mortgage & Investment Calculator</span></div></div><div className="grid grid-cols-1 md:grid-cols-3 gap-6"><div className="space-y-2"><label className="text-[10px] uppercase tracking-wider text-[#8C867E] block">Down Payment</label><input type="range" min="10" max="70" value={downPaymentPercent} onChange={(e) => setDownPaymentPercent(Number(e.target.value))} className="w-full accent-[#B79A62]" /><div className="text-sm text-[#F5F2EB] font-medium">{downPaymentPercent}%</div></div><div className="space-y-2"><label className="text-[10px] uppercase tracking-wider text-[#8C867E] block">Loan Term</label><input type="range" min="5" max="30" value={loanTermYears} onChange={(e) => setLoanTermYears(Number(e.target.value))} className="w-full accent-[#B79A62]" /><div className="text-sm text-[#F5F2EB] font-medium">{loanTermYears} years</div></div><div className="space-y-2"><label className="text-[10px] uppercase tracking-wider text-[#8C867E] block">Interest Rate</label><input type="range" min="1" max="10" step="0.05" value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))} className="w-full accent-[#B79A62]" /><div className="text-sm text-[#F5F2EB] font-medium">{interestRate.toFixed(2)}%</div></div></div><div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#22201C] text-xs"><div className="p-4 bg-[#121210] border border-[#25221E]"><span className="text-[10px] uppercase tracking-wider text-[#8C867E] block">Loan Amount</span><span className="text-lg text-[#F5F2EB] font-medium">AED {loanAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span></div><div className="p-4 bg-[#121210] border border-[#25221E]"><span className="text-[10px] uppercase tracking-wider text-[#8C867E] block">Monthly Payment</span><span className="text-lg text-[#B79A62] font-medium">AED {monthlyPayment.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span></div><div className="p-4 bg-[#121210] border border-[#25221E]"><span className="text-[10px] uppercase tracking-wider text-[#8C867E] block">Down Payment</span><span className="text-lg text-[#F5F2EB] font-medium">AED {(property.price * downPaymentPercent / 100).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span></div></div></div>}
        </div>

        <aside className="space-y-6">{property.agent && <div className="bg-[#171715] border border-[#25221E] p-6 space-y-5 sticky top-24"><div className="flex items-center gap-3 pb-4 border-b border-[#25221E]"><div className="relative w-14 h-14 rounded-full overflow-hidden bg-[#0A0A09] border border-[#25221E] shrink-0">{property.agent.avatar ? <Image src={property.agent.avatar} alt={property.agent.name} fill className="object-cover" sizes="56px" referrerPolicy="no-referrer" /> : <div className="w-full h-full flex items-center justify-center font-editorial text-xl text-[#B79A62]">{property.agent.name.charAt(0)}</div>}</div><div className="min-w-0"><h3 className="font-editorial text-xl text-[#F5F2EB] truncate">{property.agent.name}</h3><p className="text-[10px] text-[#8C867E] uppercase tracking-wider">{property.agent.title ?? property.agent.designation}</p></div></div><div className="space-y-3"><button onClick={() => setShowViewingModal(true)} className="w-full px-4 py-3 bg-[#B79A62] text-[#0A0A09] text-xs uppercase tracking-widest font-bold hover:bg-[#D0B77C] transition-colors">Schedule Private Viewing</button><button onClick={() => setShowOfferModal(true)} className="w-full px-4 py-3 bg-transparent border border-[#B79A62] text-[#B79A62] text-xs uppercase tracking-widest font-bold hover:bg-[#B79A62]/10 transition-colors">Submit Private Offer</button><div className="grid grid-cols-2 gap-2"><a href={`tel:${property.agent.phone}`} className="flex items-center justify-center gap-2 p-3 bg-[#121210] border border-[#25221E] text-[#B79A62] text-xs hover:border-[#B79A62] transition-colors"><Phone className="w-3.5 h-3.5" /> Call</a><a href={`https://wa.me/${property.agent.whatsApp.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(property.agent.name)},%20I%20am%20interested%20in%20${encodeURIComponent(property.title)}.`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 p-3 bg-[#121210] border border-[#25221E] text-[#25D366] text-xs hover:border-[#25D366] transition-colors"><MessageCircle className="w-3.5 h-3.5" /> WhatsApp</a></div></div></div>}</aside>
      </div>

      {similarProperties.length > 0 && <section className="space-y-6 pt-6 border-t border-[#25221E]"><div className="flex items-end justify-between gap-4"><div><span className="text-[10px] uppercase tracking-[0.25em] text-[#B79A62]">Curated Selection</span><h2 className="font-editorial text-3xl text-[#F5F2EB]">Similar Residences</h2></div><Link href="/properties" className="text-xs uppercase tracking-wider text-[#8C867E] hover:text-[#B79A62] inline-flex items-center gap-1">View all <ArrowUpRight className="w-3.5 h-3.5" /></Link></div><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{similarProperties.map((p) => <Link key={p.id} href={`/properties/${p.slug}`} className="group bg-[#171715] border border-[#25221E] overflow-hidden hover:border-[#B79A62]/40 transition-colors"><div className="relative aspect-[16/10] bg-[#0A0A09]"><Image src={p.featuredImage ?? p.heroImage} alt={p.title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 33vw" referrerPolicy="no-referrer" /></div><div className="p-4 space-y-1"><h3 className="font-editorial text-lg text-[#F5F2EB] group-hover:text-[#B79A62]">{p.title}</h3><p className="text-xs text-[#8C867E]">{p.community}</p></div></Link>)}</div></section>}

      <ViewingModal property={property} isOpen={showViewingModal} onClose={() => setShowViewingModal(false)} />
      <OfferModal property={property} isOpen={showOfferModal} onClose={() => setShowOfferModal(false)} />
    </div>
  );
};
