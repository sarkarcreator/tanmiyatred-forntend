'use client';

import React, { useState } from 'react';
import { PropertyItem } from '@/types';
import { X, CheckCircle2, ShieldCheck, DollarSign } from 'lucide-react';

interface OfferModalProps {
  property: PropertyItem;
  onClose: () => void;
}

export const OfferModal: React.FC<OfferModalProps> = ({ property, onClose }) => {
  const [offerAmount, setOfferAmount] = useState(property.price.toString());
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [paymentTerms, setPaymentTerms] = useState<'CASH' | 'MORTGAGE' | 'INSTALLMENTS'>('CASH');
  const [depositPercent, setDepositPercent] = useState('10');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = Number(offerAmount.replace(/[^0-9.]/g, ''));
    if (!numericAmount || numericAmount <= 0) {
      setError('Please enter a valid offer amount in AED.');
      return;
    }
    if (!buyerName || !buyerPhone) {
      setError('Buyer name and telephone contact are required.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // 1. Submit Offer
      const offerRes = await fetch('/api/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId: property.id,
          propertyTitle: property.title,
          buyerName,
          buyerEmail,
          buyerPhone,
          agentId: property.agentId || 'agent-1',
          agentName: property.agent?.name || 'Private Advisor',
          offerAmount: numericAmount,
          currency: 'AED',
          paymentTerms: `${paymentTerms} with ${depositPercent}% security deposit`,
          notes,
          status: 'SUBMITTED',
        }),
      });

      // 2. Also register/update CRM lead to OFFER_SUBMITTED stage
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: buyerName,
          customerPhone: buyerPhone,
          customerEmail: buyerEmail,
          customerType: property.purpose === 'FOR_RENT' ? 'TENANT' : 'BUYER',
          source: 'OFFICIAL_OFFER',
          propertyId: property.id,
          propertyTitle: property.title,
          agentId: property.agentId,
          stage: 'OFFER_SUBMITTED',
          priority: 'URGENT',
          budgetMax: numericAmount,
          preferredLocation: property.community,
          notes: `Formal offer of AED ${numericAmount.toLocaleString()} submitted with ${paymentTerms} terms. Notes: ${notes}`,
          initialNote: `Formal offer of AED ${numericAmount.toLocaleString()} submitted via digital portal.`,
        }),
      });

      if (!offerRes.ok) {
        throw new Error('Failed to record offer');
      }

      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred while submitting your offer.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#171715] border border-[#25221E] shadow-2xl p-6 sm:p-8 space-y-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#8C867E] hover:text-[#F5F2EB] p-1 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-950/60 border border-emerald-800 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-editorial text-2xl text-[#F5F2EB]">Formal Offer Logged</h3>
            <p className="text-xs sm:text-sm text-[#A8A196] leading-relaxed">
              Your binding offer of <strong className="text-[#B79A62]">AED {Number(offerAmount).toLocaleString()}</strong> for{' '}
              <span className="text-[#F5F2EB]">{property.title}</span> has been submitted to the compliance office and the listing advisor.
            </p>
            <p className="text-[11px] text-[#7A756D]">
              Reference: {property.referenceNumber} • RERA Brokerage Tanmiyat Real Estate LLC
            </p>
            <div className="pt-4">
              <button
                onClick={onClose}
                className="w-full py-3 bg-[#B79A62] text-[#0A0A09] text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#D8BE8A] transition-colors"
              >
                Close & Review Portfolio
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#B79A62] font-semibold block">
                Acquisition / Lease Expression
              </span>
              <h2 className="font-editorial text-2xl text-[#F5F2EB]">Submit Official Offer</h2>
              <p className="text-xs text-[#8C867E] line-clamp-1">
                {property.title} • Asking Price: AED {property.price.toLocaleString()}
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-950/50 border border-red-900/60 text-red-300 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Offer Amount */}
              <div>
                <label className="text-[10px] uppercase tracking-wider text-[#8C867E] block mb-1">
                  Proposed Offer Amount (AED) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#B79A62]">
                    AED
                  </span>
                  <input
                    type="number"
                    required
                    value={offerAmount}
                    onChange={(e) => setOfferAmount(e.target.value)}
                    className="w-full bg-[#0A0A09] border border-[#25221E] focus:border-[#B79A62] pl-14 pr-3.5 py-2.5 text-sm text-[#F5F2EB] outline-none"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="grid grid-cols-3 gap-2">
                {(['CASH', 'MORTGAGE', 'INSTALLMENTS'] as const).map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setPaymentTerms(term)}
                    className={`py-2 text-center uppercase tracking-wider text-[10px] font-semibold border transition-colors ${
                      paymentTerms === term
                        ? 'bg-[#25221E] border-[#B79A62] text-[#F5F2EB]'
                        : 'border-[#25221E] text-[#8C867E] hover:border-[#3A3731]'
                    }`}
                  >
                    {term}
                  </button>
                ))}
              </div>

              {/* Buyer Name & Contacts */}
              <div>
                <label className="text-[10px] uppercase tracking-wider text-[#8C867E] block mb-1">
                  Purchaser / Tenant Full Legal Name *
                </label>
                <input
                  type="text"
                  required
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  placeholder="As shown in Passport / Emirates ID"
                  className="w-full bg-[#0A0A09] border border-[#25221E] focus:border-[#B79A62] px-3.5 py-2.5 text-[#F5F2EB] outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-[#8C867E] block mb-1">
                    Direct Telephone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    placeholder="+971 50 000 0000"
                    className="w-full bg-[#0A0A09] border border-[#25221E] focus:border-[#B79A62] px-3.5 py-2.5 text-[#F5F2EB] outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-[#8C867E] block mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={buyerEmail}
                    onChange={(e) => setBuyerEmail(e.target.value)}
                    placeholder="purchaser@familyoffice.com"
                    className="w-full bg-[#0A0A09] border border-[#25221E] focus:border-[#B79A62] px-3.5 py-2.5 text-[#F5F2EB] outline-none"
                  />
                </div>
              </div>

              {/* Special Conditions */}
              <div>
                <label className="text-[10px] uppercase tracking-wider text-[#8C867E] block mb-1">
                  Terms or Contingencies
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Subject to mortgage approval within 14 days / Including furniture package..."
                  className="w-full bg-[#0A0A09] border border-[#25221E] focus:border-[#B79A62] px-3.5 py-2 text-[#F5F2EB] outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-[#B79A62] hover:bg-[#D8BE8A] text-[#0A0A09] font-semibold text-xs uppercase tracking-[0.2em] transition-colors disabled:opacity-50"
              >
                {submitting ? 'Transmitting Binding Offer...' : 'Submit Official Offer'}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#7A756D] text-center pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#B79A62]" />
                <span>Protected under RERA Unified Contract Form F standard principles.</span>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
