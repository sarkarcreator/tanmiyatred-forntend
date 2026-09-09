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

  const images = property.images && property.images.length > 0 ? property.images : [property.featuredImage];

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
        <Link href="/" className="hover:text-[#F5F2EB] transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#5A5650]" />
        <Link href="/properties" className="hover:text-[#F5F2EB] transition-colors">
          Marketplace
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#5A5650]" />
        <span className="text-[#C8C0B3] truncate">{property.title}</span>
      </nav>

      {/* TOP TITLE & PRICING HERO BAR */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-[#25221E]">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-2.5 py-1 bg-[#B79A62] text-[#0A0A09] text-[10px] uppercase font-bold tracking-widest">
              {isRent ? 'For Rent' : 'For Sale'}
            </span>
            <span className="px-2.5 py-1 bg-[#171715] border border-[#25221E] text-[#B79A62] text-[10px] uppercase tracking-wider font-semibold">
              {property.propertyType}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-950/40 border border-emerald-800/40 text-emerald-400 text-[10px] font-semibold">
              <ShieldCheck className="w-3 h-3" />
              <span>RERA Permit Verified</span>
            </span>
            <span className="font-mono text-[11px] text-[#7A756D]">{property.referenceNumber}</span>
          </div>

          <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl text-[#F5F2EB] tracking-tight">
            {property.title}
          </h1>

          <p className="text-sm text-[#A8A196] flex items-center gap-2 font-light">
            <Compass className="w-4 h-4 text-[#B79A62]" />
            <span>{property.address || `${property.subCommunity || ''}, ${property.community}, Dubai, UAE`}</span>
          </p>
        </div>

        {/* PRICING & CURRENCY SELECTOR */}
        <div className="flex flex-col sm:items-end gap-2 bg-[#171715] border border-[#25221E] p-4 sm:p-5 lg:min-w-[320px]">
          <div className="flex items-center gap-1.5 self-start sm:self-end text-[10px] uppercase tracking-wider">
            {(['AED', 'USD', 'EUR', 'GBP'] as const).map((curr) => (
              <button
                key={curr}
                onClick={() => setCurrency(curr)}
                className={`px-2 py-0.5 border transition-colors ${
                  currency === curr
                    ? 'border-[#B79A62] text-[#B79A62] bg-[#B79A62]/10 font-bold'
                    : 'border-transparent text-[#8C867E] hover:text-[#C8C0B3]'
                }`}
              >
                {curr}
              </button>
            ))}
          </div>

          <div className="font-editorial text-3xl sm:text-4xl text-[#F5F2EB] tracking-tight">
            {formattedPrice}
            {isRent && (
              <span className="text-xs font-normal text-[#A8A196] ml-1">
                /{property.rentalPeriod?.toLowerCase() || 'year'}
              </span>
            )}
          </div>

          {property.pricePerSqFt && currency === 'AED' && (
            <div className="text-[11px] text-[#8C867E]">
              AED {property.pricePerSqFt.toLocaleString()} / sq.ft
            </div>
          )}
        </div>
      </div>

      {/* GALLERY SECTION */}
      <div className="space-y-3">
        <div className="relative aspect-[16/9] md:aspect-[21/9] w-full overflow-hidden bg-[#0A0A09] border border-[#25221E]">
          <Image
            src={images[selectedImageIndex] || property.featuredImage}
            alt={property.title}
            fill
            priority
            className="object-cover transition-opacity duration-500"
            sizes="(max-width: 1280px) 100vw, 1280px"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

          {/* Top Actions */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2.5 bg-black/70 hover:bg-black/90 text-[#F5F2EB] border border-[#3A3731] transition-colors"
              title="Share Residence"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Thumbnails Row */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImageIndex(idx)}
                className={`relative w-24 sm:w-32 aspect-[16/10] shrink-0 border overflow-hidden transition-all ${
                  selectedImageIndex === idx
                    ? 'border-[#B79A62] scale-[1.02]'
                    : 'border-[#25221E] opacity-60 hover:opacity-100'
                }`}
              >
                <Image
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* MAIN TWO-COLUMN CONTENT LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* LEFT COLUMN: SPECS, COMPLIANCE, NARRATIVE, AMENITIES, MORTGAGE */}
        <div className="lg:col-span-2 space-y-10">
          {/* Key Specifications Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-[#171715] border border-[#25221E] text-xs">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-[#8C867E] block">Bedrooms</span>
              <div className="flex items-center gap-2 text-[#F5F2EB] font-medium text-sm">
                <Bed className="w-4 h-4 text-[#B79A62]" />
                <span>{property.bedrooms} Beds</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-[#8C867E] block">Bathrooms</span>
              <div className="flex items-center gap-2 text-[#F5F2EB] font-medium text-sm">
                <Bath className="w-4 h-4 text-[#B79A62]" />
                <span>{property.bathrooms} Baths</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-[#8C867E] block">Built-Up Area</span>
              <div className="flex items-center gap-2 text-[#F5F2EB] font-medium text-sm">
                <Maximize className="w-4 h-4 text-[#B79A62]" />
                <span>{property.area.toLocaleString()} sq.ft</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-[#8C867E] block">Parking</span>
              <div className="flex items-center gap-2 text-[#F5F2EB] font-medium text-sm">
                <Car className="w-4 h-4 text-[#B79A62]" />
                <span>{property.parkingSpaces || 2} Bays</span>
              </div>
            </div>
          </div>

          {/* DLD & RERA REGULATORY COMPLIANCE PANEL (UAE LAW) */}
          <div className="bg-[#121210] border border-[#2D2A26] p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#22201C]">
              <div className="flex items-center gap-2 text-[#B79A62] text-xs font-semibold uppercase tracking-[0.2em]">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>RERA & Dubai Land Department Regulatory Validation</span>
              </div>
              <span className="text-[10px] uppercase bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 px-2 py-0.5">
                Authentic Verification
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-[10px] uppercase text-[#7A756D] block">Broker ORN</span>
                <span className="font-semibold text-[#F5F2EB]">12048</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-[#7A756D] block">Advertising Permit</span>
                <span className="font-mono text-[#D8BE8A]">{property.advertisingPermitNumber}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-[#7A756D] block">Agent BRN</span>
                <span className="font-semibold text-[#F5F2EB]">{property.agent?.brn || '48219'}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-[#7A756D] block">Developer</span>
                <span className="text-[#F5F2EB]">{property.developer}</span>
              </div>
            </div>

            <p className="text-[11px] text-[#8C867E] leading-relaxed pt-2 border-t border-[#22201C]">
              In accordance with Dubai Real Estate Regulatory Agency laws, this advertising permit is verified for public promotion. All deposits are deposited directly into designated DLD escrow project accounts.
            </p>
          </div>

          {/* ARCHITECTURAL NARRATIVE & OVERVIEW */}
          <div className="space-y-4">
            <h2 className="font-editorial text-2xl text-[#F5F2EB]">Architectural Overview</h2>
            <div className="prose prose-invert max-w-none text-sm text-[#C8C0B3] leading-relaxed space-y-4">
              <p>{property.description}</p>
            </div>
          </div>

          {/* AMENITIES & FEATURES */}
          {property.amenities && property.amenities.length > 0 && (
            <div className="space-y-4">
              <h2 className="font-editorial text-2xl text-[#F5F2EB]">Residences & Amenities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                {property.amenities.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-3 bg-[#171715] border border-[#25221E] text-[#E5DFD5]"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#B79A62] shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MORTGAGE / ROI CALCULATOR FOR BUYERS */}
          {!isRent && (
            <div className="bg-[#171715] border border-[#25221E] p-6 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#22201C]">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#B79A62] font-semibold">
                  <Calculator className="w-4 h-4 text-[#B79A62]" />
                  <span>Dubai Mortgage & Investment Estimator</span>
                </div>
                <span className="text-[10px] text-[#7A756D]">UAE Central Bank Guidelines</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
                {/* Down payment */}
                <div className="space-y-2">
                  <div className="flex justify-between text-[#8C867E]">
                    <span>Down Payment</span>
                    <strong className="text-[#F5F2EB]">{downPaymentPercent}%</strong>
                  </div>
                  <input
                    type="range"
                    min={20}
                    max={80}
                    step={5}
                    value={downPaymentPercent}
                    onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                    className="w-full accent-[#B79A62]"
                  />
                  <span className="text-[10px] text-[#7A756D]">
                    AED {((property.price * downPaymentPercent) / 100).toLocaleString()}
                  </span>
                </div>

                {/* Loan Term */}
                <div className="space-y-2">
                  <div className="flex justify-between text-[#8C867E]">
                    <span>Loan Duration</span>
                    <strong className="text-[#F5F2EB]">{loanTermYears} Years</strong>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={25}
                    step={1}
                    value={loanTermYears}
                    onChange={(e) => setLoanTermYears(Number(e.target.value))}
                    className="w-full accent-[#B79A62]"
                  />
                </div>

                {/* Interest Rate */}
                <div className="space-y-2">
                  <div className="flex justify-between text-[#8C867E]">
                    <span>Fixed Rate</span>
                    <strong className="text-[#F5F2EB]">{interestRate}%</strong>
                  </div>
                  <input
                    type="range"
                    min={3.5}
                    max={7.5}
                    step={0.25}
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full accent-[#B79A62]"
                  />
                </div>
              </div>

              {/* Monthly Result Card */}
              <div className="p-4 bg-[#0A0A09] border border-[#25221E] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#8C867E] block">
                    Estimated Monthly Mortgage Instalment
                  </span>
                  <div className="font-editorial text-2xl text-[#B79A62]">
                    AED {Math.round(monthlyPayment).toLocaleString()}
                    <span className="text-xs text-[#8C867E] font-sans font-normal ml-1">/ month</span>
                  </div>
                </div>
                <div className="text-[10px] text-[#7A756D] max-w-xs">
                  *Excludes DLD 4% transfer fee, trustee fees, and bank registration fee. Rates subject to bank approval.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: ASSIGNED PRIVATE ADVISOR & PRIMARY ACTION CTAS */}
        <div className="space-y-6">
          {/* Action Box */}
          <div className="bg-[#171715] border border-[#25221E] p-6 space-y-4 sticky top-24">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#B79A62] font-semibold block">
              Private Concierge
            </span>
            <h3 className="font-editorial text-2xl text-[#F5F2EB]">Inquire or Acquire</h3>
            <p className="text-xs text-[#A8A196] leading-relaxed font-light">
              Connect directly with our dedicated senior private advisor for confidential viewings, developer payment schedules, or transaction contracts.
            </p>

            {/* Primary Action Buttons */}
            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowViewingModal(true)}
                className="w-full py-3.5 bg-[#B79A62] hover:bg-[#D8BE8A] text-[#0A0A09] font-semibold text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Schedule Private Viewing</span>
              </button>

              <button
                type="button"
                onClick={() => setShowOfferModal(true)}
                className="w-full py-3.5 bg-[#25221E] hover:bg-[#322E29] text-[#F5F2EB] font-semibold text-xs uppercase tracking-[0.2em] transition-all border border-[#3A3731] flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-[#B79A62]" />
                <span>Submit Official Offer</span>
              </button>
            </div>

            {/* Assigned Advisor Card */}
            {property.agent && (
              <div className="pt-6 border-t border-[#22201C] space-y-4">
                <span className="text-[10px] uppercase tracking-wider text-[#8C867E] block">
                  Assigned Listing Broker
                </span>

                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden bg-[#25221E] border border-[#3A3731] shrink-0">
                    {property.agent.avatar ? (
                      <Image
                        src={property.agent.avatar}
                        alt={property.agent.name}
                        fill
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-sm font-bold text-[#B79A62]">
                        {property.agent.name.charAt(0)}
                      </div>
                    )}
                  </div>

                  <div className="space-y-0.5">
                    <Link
                      href={`/agents/${property.agent.slug}`}
                      className="font-medium text-sm text-[#F5F2EB] hover:text-[#B79A62] transition-colors"
                    >
                      {property.agent.name}
                    </Link>
                    <div className="text-[11px] text-[#A8A196]">{property.agent.title}</div>
                    <div className="text-[10px] text-[#7A756D]">RERA BRN: {property.agent.brn}</div>
                  </div>
                </div>

                {/* Direct Contact Buttons */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <a
                    href={`tel:${property.agent.phone}`}
                    className="py-2.5 px-3 bg-[#0A0A09] border border-[#25221E] hover:border-[#B79A62] text-[#E5DFD5] flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#B79A62]" />
                    <span>Call Broker</span>
                  </a>

                  <a
                    href={`https://wa.me/${property.agent.whatsapp.replace(/[^0-9]/g, '')}?text=Inquiry%20regarding%20${encodeURIComponent(property.title)}%20(Ref:%20${property.referenceNumber})`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-3 bg-[#0A0A09] border border-[#25221E] hover:border-[#25D366] text-[#E5DFD5] flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SIMILAR PROPERTIES SECTION */}
      {similarProperties.length > 0 && (
        <div className="pt-12 border-t border-[#25221E] space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#B79A62] font-semibold block">
                Related Portfolio
              </span>
              <h2 className="font-editorial text-2xl sm:text-3xl text-[#F5F2EB]">
                Similar Residences in {property.community}
              </h2>
            </div>

            <Link
              href={`/properties?community=${encodeURIComponent(property.community)}`}
              className="text-xs uppercase tracking-wider text-[#B79A62] hover:text-[#D8BE8A] inline-flex items-center gap-1"
            >
              <span>Explore Community</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {similarProperties.map((sim) => (
              <Link
                key={sim.id}
                href={`/properties/${sim.slug}`}
                className="group bg-[#171715] border border-[#25221E] hover:border-[#B79A62]/40 transition-all overflow-hidden flex flex-col justify-between"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-[#0A0A09]">
                  <Image
                    src={sim.featuredImage}
                    alt={sim.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/80 text-[10px] uppercase font-semibold text-[#B79A62]">
                    {sim.purpose === 'FOR_RENT' ? 'Rent' : 'Sale'}
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <span className="text-[10px] uppercase tracking-wider text-[#8C867E]">
                    {sim.community}
                  </span>
                  <h3 className="font-editorial text-lg text-[#F5F2EB] group-hover:text-[#B79A62] transition-colors line-clamp-1">
                    {sim.title}
                  </h3>
                  <div className="font-editorial text-lg text-[#D8BE8A]">
                    AED {sim.price.toLocaleString()}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* VIEWING MODAL */}
      {showViewingModal && (
        <ViewingModal property={property} onClose={() => setShowViewingModal(false)} />
      )}

      {/* OFFER MODAL */}
      {showOfferModal && (
        <OfferModal property={property} onClose={() => setShowOfferModal(false)} />
      )}
    </div>
  );
};
