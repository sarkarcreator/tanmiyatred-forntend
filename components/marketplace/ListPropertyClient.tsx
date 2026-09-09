'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Building2,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Upload,
  Coins,
  Users,
  Award,
} from 'lucide-react';

export const ListPropertyClient: React.FC = () => {
  const [purpose, setPurpose] = useState<'SALE' | 'RENT'>('SALE');
  const [ownerName, setOwnerName] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [emiratesId, setEmiratesId] = useState('');

  const [community, setCommunity] = useState('Business Bay');
  const [building, setBuilding] = useState('');
  const [propertyType, setPropertyType] = useState('Apartment');
  const [bedrooms, setBedrooms] = useState('2');
  const [bathrooms, setBathrooms] = useState('2');
  const [area, setArea] = useState('');
  const [expectedPrice, setExpectedPrice] = useState('');
  const [occupancyStatus, setOccupancyStatus] = useState('VACANT');
  const [deedStatus, setDeedStatus] = useState('TITLE_DEED');
  const [notes, setNotes] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [successReference, setSuccessReference] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownerName || !ownerPhone || !expectedPrice || !building) {
      setError('Please provide owner name, telephone, tower/building name, and asking price.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const numericPrice = Number(expectedPrice.replace(/[^0-9.]/g, ''));
      const numericArea = Number(area.replace(/[^0-9.]/g, '')) || 1200;

      // 1. Create a draft Property record for admin/broker review
      const title = `${bedrooms} Bedroom ${propertyType} in ${building}, ${community}`;
      const slug = `property-${Date.now()}`;

      const propRes = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          publicSubmission: true,
          title,
          slug,
          purpose: purpose === 'RENT' ? 'FOR_RENT' : 'FOR_SALE',
          propertyType,
          status: 'AVAILABLE',
          workflowStatus: 'IN_REVIEW',
          price: numericPrice,
          currency: 'AED',
          bedrooms: Number(bedrooms),
          bathrooms: Number(bathrooms),
          area: numericArea,
          community,
          subCommunity: building,
          address: `${building}, ${community}, Dubai, UAE`,
          developer: 'Private Resale',
          furnished: 'UNFURNISHED',
          featured: false,
          verified: false,
          verificationStatus: 'PENDING_VERIFICATION',
          featuredImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
          images: [
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
          ],
          description: `Private listing submission: ${title}. Asking price: AED ${numericPrice.toLocaleString()}. Occupancy: ${occupancyStatus}. Title deed status: ${deedStatus}. Client remarks: ${notes || 'None'}`,
        }),
      });

      const propJson = await propRes.json();
      const generatedRef = propJson.data?.referenceNumber || `TAN-DXB-${Math.floor(1000 + Math.random() * 9000)}`;

      // 2. Also create Lead in CRM
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: ownerName,
          customerPhone: ownerPhone,
          customerEmail: ownerEmail,
          customerType: purpose === 'RENT' ? 'LANDLORD' : 'SELLER',
          source: 'DIRECT_SELLER_PORTAL',
          stage: 'NEW',
          priority: 'HIGH',
          budgetMin: numericPrice,
          preferredLocation: community,
          propertyTitle: title,
          notes: `Owner listing application: ${title}. Deed: ${deedStatus}, ID: ${emiratesId || 'N/A'}. Expected: AED ${numericPrice.toLocaleString()}`,
          initialNote: `Owner registered property ${title} for ${purpose === 'RENT' ? 'leasing' : 'sale'} on portal.`,
        }),
      });

      setSuccessReference(generatedRef);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to register listing. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* HEADER */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#171715] border border-[#25221E] text-[#B79A62] text-[10px] tracking-[0.25em] uppercase font-semibold">
          <Sparkles className="w-3 h-3 text-[#B79A62]" />
          <span>Premier Dubai Brokerage & Representation</span>
        </div>
        <h1 className="font-editorial text-4xl sm:text-5xl text-[#F5F2EB] tracking-tight">
          List Your Property with Tanmiyat
        </h1>
        <p className="text-sm sm:text-base text-[#A8A196] font-light leading-relaxed">
          Leverage 25+ years of institutional developer heritage, an elite global investor roster, and comprehensive RERA compliance to sell or lease your residence at peak market valuation.
        </p>
      </div>

      {/* THREE VALUE PROPOSITIONS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
        <div className="p-6 bg-[#171715] border border-[#25221E] space-y-3">
          <ShieldCheck className="w-6 h-6 text-[#B79A62]" />
          <h3 className="font-editorial text-lg text-[#F5F2EB]">RERA Unified Form A</h3>
          <p className="text-[#8C867E] leading-relaxed">
            Full compliance with Dubai Land Department regulations. Official advertising permits procured within 24 hours.
          </p>
        </div>
        <div className="p-6 bg-[#171715] border border-[#25221E] space-y-3">
          <Users className="w-6 h-6 text-[#B79A62]" />
          <h3 className="font-editorial text-lg text-[#F5F2EB]">Private Investor Network</h3>
          <p className="text-[#8C867E] leading-relaxed">
            Direct access to verified high-net-worth family offices across the GCC, Europe, and Asia seeking Dubai prime assets.
          </p>
        </div>
        <div className="p-6 bg-[#171715] border border-[#25221E] space-y-3">
          <Coins className="w-6 h-6 text-[#B79A62]" />
          <h3 className="font-editorial text-lg text-[#F5F2EB]">Escrow Security</h3>
          <p className="text-[#8C867E] leading-relaxed">
            Protected transaction handling, legal contract drafting, and authorized Trustee office representation.
          </p>
        </div>
      </div>

      {/* FORM CONTAINER */}
      <div className="bg-[#171715] border border-[#25221E] p-6 sm:p-10 space-y-8">
        {successReference ? (
          <div className="text-center py-10 space-y-5 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-950/60 border border-emerald-800 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="font-editorial text-3xl text-[#F5F2EB]">Listing Submission Received</h2>
            <p className="text-sm text-[#A8A196] leading-relaxed">
              Your property registration has been routed to our Senior Brokerage & Compliance Division under Reference Number:
            </p>
            <div className="p-4 bg-[#0A0A09] border border-[#B79A62]/30 font-mono text-xl text-[#B79A62]">
              {successReference}
            </div>
            <p className="text-xs text-[#7A756D]">
              A licensed broker will contact you shortly to review title deed documents and execute RERA Form A for official advertising permit issuance.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/properties"
                className="px-6 py-3 bg-[#B79A62] text-[#0A0A09] text-xs font-semibold uppercase tracking-wider hover:bg-[#D8BE8A] transition-colors text-center"
              >
                Browse Marketplace
              </Link>
              <button
                onClick={() => setSuccessReference(null)}
                className="px-6 py-3 bg-[#25221E] text-[#F5F2EB] text-xs font-semibold uppercase tracking-wider hover:bg-[#322E29] transition-colors"
              >
                List Another Property
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8 text-xs">
            {error && (
              <div className="p-4 bg-red-950/50 border border-red-900/60 text-red-300 text-xs">
                {error}
              </div>
            )}

            {/* SECTION 1: PURPOSE SELECTION */}
            <div className="space-y-3">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#B79A62] font-semibold block">
                Step 1 • Representation Purpose
              </span>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setPurpose('SALE')}
                  className={`p-4 border text-center transition-all ${
                    purpose === 'SALE'
                      ? 'bg-[#25221E] border-[#B79A62] text-[#F5F2EB]'
                      : 'border-[#25221E] text-[#8C867E] hover:border-[#3A3731]'
                  }`}
                >
                  <span className="font-editorial text-lg block text-[#F5F2EB]">Sell My Property</span>
                  <span className="text-[11px] text-[#A8A196]">Full marketing, valuation, and capital transaction</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPurpose('RENT')}
                  className={`p-4 border text-center transition-all ${
                    purpose === 'RENT'
                      ? 'bg-[#25221E] border-[#B79A62] text-[#F5F2EB]'
                      : 'border-[#25221E] text-[#8C867E] hover:border-[#3A3731]'
                  }`}
                >
                  <span className="font-editorial text-lg block text-[#F5F2EB]">Lease My Property</span>
                  <span className="text-[11px] text-[#A8A196]">Tenant screening, Ejari registration & management</span>
                </button>
              </div>
            </div>

            {/* SECTION 2: OWNER / LANDLORD DETAILS */}
            <div className="space-y-4 pt-4 border-t border-[#22201C]">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#B79A62] font-semibold block">
                Step 2 • Legal Owner Information
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-[#8C867E] block mb-1">
                    Full Legal Name (Title Deed) *
                  </label>
                  <input
                    type="text"
                    required
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="e.g. Tariq Mohammed Al-Falasi"
                    className="w-full bg-[#0A0A09] border border-[#25221E] focus:border-[#B79A62] px-3.5 py-2.5 text-[#F5F2EB] outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-wider text-[#8C867E] block mb-1">
                    Emirates ID or Passport Number
                  </label>
                  <input
                    type="text"
                    value={emiratesId}
                    onChange={(e) => setEmiratesId(e.target.value)}
                    placeholder="784-XXXX-XXXXXXX-X"
                    className="w-full bg-[#0A0A09] border border-[#25221E] focus:border-[#B79A62] px-3.5 py-2.5 text-[#F5F2EB] outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-wider text-[#8C867E] block mb-1">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={ownerPhone}
                    onChange={(e) => setOwnerPhone(e.target.value)}
                    placeholder="+971 50 123 4567"
                    className="w-full bg-[#0A0A09] border border-[#25221E] focus:border-[#B79A62] px-3.5 py-2.5 text-[#F5F2EB] outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-wider text-[#8C867E] block mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={ownerEmail}
                    onChange={(e) => setOwnerEmail(e.target.value)}
                    placeholder="owner@domain.com"
                    className="w-full bg-[#0A0A09] border border-[#25221E] focus:border-[#B79A62] px-3.5 py-2.5 text-[#F5F2EB] outline-none"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 3: PROPERTY SPECIFICATIONS */}
            <div className="space-y-4 pt-4 border-t border-[#22201C]">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#B79A62] font-semibold block">
                Step 3 • Property Location & Characteristics
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-[#8C867E] block mb-1">
                    Community / District *
                  </label>
                  <select
                    value={community}
                    onChange={(e) => setCommunity(e.target.value)}
                    className="w-full bg-[#0A0A09] border border-[#25221E] focus:border-[#B79A62] px-3.5 py-2.5 text-[#F5F2EB] outline-none"
                  >
                    <option value="Business Bay">Business Bay</option>
                    <option value="Dubailand">Dubailand</option>
                    <option value="Dubai Water Canal">Dubai Water Canal</option>
                    <option value="Palm Jumeirah">Palm Jumeirah</option>
                    <option value="Downtown Dubai">Downtown Dubai</option>
                    <option value="Dubai Marina">Dubai Marina</option>
                    <option value="Emirates Hills">Emirates Hills</option>
                    <option value="Other Dubai Area">Other Dubai Area</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-wider text-[#8C867E] block mb-1">
                    Building / Project / Tower Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={building}
                    onChange={(e) => setBuilding(e.target.value)}
                    placeholder="e.g. Living Legends Villa / The Exchange Tower"
                    className="w-full bg-[#0A0A09] border border-[#25221E] focus:border-[#B79A62] px-3.5 py-2.5 text-[#F5F2EB] outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-wider text-[#8C867E] block mb-1">
                    Property Type
                  </label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full bg-[#0A0A09] border border-[#25221E] focus:border-[#B79A62] px-3.5 py-2.5 text-[#F5F2EB] outline-none"
                  >
                    <option value="Apartment">Luxury Apartment</option>
                    <option value="Penthouse">Sky Penthouse</option>
                    <option value="Villa">Signature Villa</option>
                    <option value="Townhouse">Townhouse</option>
                    <option value="Duplex">Duplex Residence</option>
                    <option value="Commercial">Commercial Office</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-[#8C867E] block mb-1">Bedrooms</label>
                  <select
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value)}
                    className="w-full bg-[#0A0A09] border border-[#25221E] focus:border-[#B79A62] px-3 py-2 text-[#F5F2EB] outline-none"
                  >
                    <option value="0">Studio</option>
                    <option value="1">1 Bedroom</option>
                    <option value="2">2 Bedrooms</option>
                    <option value="3">3 Bedrooms</option>
                    <option value="4">4 Bedrooms</option>
                    <option value="5">5+ Bedrooms</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-wider text-[#8C867E] block mb-1">Bathrooms</label>
                  <select
                    value={bathrooms}
                    onChange={(e) => setBathrooms(e.target.value)}
                    className="w-full bg-[#0A0A09] border border-[#25221E] focus:border-[#B79A62] px-3 py-2 text-[#F5F2EB] outline-none"
                  >
                    <option value="1">1 Bath</option>
                    <option value="2">2 Baths</option>
                    <option value="3">3 Baths</option>
                    <option value="4">4 Baths</option>
                    <option value="5">5+ Baths</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-wider text-[#8C867E] block mb-1">Size (Sq.Ft)</label>
                  <input
                    type="number"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="e.g. 1,650"
                    className="w-full bg-[#0A0A09] border border-[#25221E] focus:border-[#B79A62] px-3 py-2 text-[#F5F2EB] outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-wider text-[#8C867E] block mb-1">
                    Expected Price (AED) *
                  </label>
                  <input
                    type="number"
                    required
                    value={expectedPrice}
                    onChange={(e) => setExpectedPrice(e.target.value)}
                    placeholder="e.g. 3,500,000"
                    className="w-full bg-[#0A0A09] border border-[#25221E] focus:border-[#B79A62] px-3 py-2 text-[#F5F2EB] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-[#8C867E] block mb-1">
                    Current Occupancy
                  </label>
                  <select
                    value={occupancyStatus}
                    onChange={(e) => setOccupancyStatus(e.target.value)}
                    className="w-full bg-[#0A0A09] border border-[#25221E] focus:border-[#B79A62] px-3.5 py-2.5 text-[#F5F2EB] outline-none"
                  >
                    <option value="VACANT">Vacant on Transfer</option>
                    <option value="RENTED">Currently Rented (Notice Served)</option>
                    <option value="OFF_PLAN">Under Construction / Resale</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-wider text-[#8C867E] block mb-1">
                    Title Document Status
                  </label>
                  <select
                    value={deedStatus}
                    onChange={(e) => setDeedStatus(e.target.value)}
                    className="w-full bg-[#0A0A09] border border-[#25221E] focus:border-[#B79A62] px-3.5 py-2.5 text-[#F5F2EB] outline-none"
                  >
                    <option value="TITLE_DEED">Ready Dubai Land Department Title Deed</option>
                    <option value="OQOOD">Pre-Title Deed (Oqood / Off-Plan)</option>
                    <option value="MORTGAGED">Mortgaged with Bank</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-[#8C867E] block mb-1">
                  Additional Notes or Features
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Full golf course view, upgraded Italian kitchen, private pool..."
                  className="w-full bg-[#0A0A09] border border-[#25221E] focus:border-[#B79A62] px-3.5 py-2.5 text-[#F5F2EB] outline-none resize-none"
                />
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <div className="pt-4 border-t border-[#22201C] space-y-3">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-[#B79A62] hover:bg-[#D8BE8A] text-[#0A0A09] text-xs font-semibold uppercase tracking-[0.2em] transition-all disabled:opacity-50"
              >
                {submitting ? 'Submitting Property Registration...' : 'Submit Property for Representation'}
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-[#7A756D]">
                <ShieldCheck className="w-4 h-4 text-[#B79A62]" />
                <span>
                  All submissions are strictly confidential and governed by Dubai Real Estate Regulatory Agency standards.
                </span>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
