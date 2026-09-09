'use client';

import React, { useState } from 'react';
import { OfferItem } from '@/types';
import {
  FileText,
  DollarSign,
  User,
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight,
  Handshake,
} from 'lucide-react';

type OfferStatus = OfferItem['status'];

interface Props {
  initialOffers: OfferItem[];
  onDealCreated?: () => void;
}

export const OffersManager: React.FC<Props> = ({ initialOffers, onDealCreated }) => {
  const [offers, setOffers] = useState<OfferItem[]>(initialOffers);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const filteredOffers = offers.filter((o) => {
    if (statusFilter !== 'ALL' && o.status !== statusFilter) return false;
    return true;
  });

  const handleUpdateStatus = async (offerId: string, status: OfferStatus) => {
    setActionLoading(offerId);
    try {
      const res = await fetch(`/api/offers/${offerId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setOffers((prev) => prev.map((o) => (o.id === offerId ? { ...o, status } : o)));

        // If offer is accepted, automatically convert into a registered closing Deal
        if (status === 'ACCEPTED') {
          const acceptedOffer = offers.find((o) => o.id === offerId);
          if (acceptedOffer) {
            await fetch('/api/deals', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                propertyId: acceptedOffer.propertyId,
                buyerName: acceptedOffer.buyerName,
                buyerEmail: acceptedOffer.buyerEmail,
                sellerName: 'Tanmiyat Real Estate Development LLC',
                finalPrice: acceptedOffer.offerAmount,
                depositAmount: Math.round(acceptedOffer.offerAmount * 0.1),
                stage: 'AGREEMENT_SIGNED',
                commissionTotal: Math.round(acceptedOffer.offerAmount * 0.02),
                expectedClosingDate: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
              }),
            });
            onDealCreated?.();
          }
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-editorial text-3xl text-[#F5F2EB]">Offers & Negotiations</h1>
            <span className="px-2.5 py-0.5 bg-[#B79A62]/10 border border-[#B79A62]/30 text-[#B79A62] text-xs font-semibold">
              {offers.filter((o) => o.status === 'SUBMITTED').length} Pending Review
            </span>
          </div>
          <p className="text-xs text-[#8C867E]">
            Buyer and tenant purchase proposals, deposit escrow pledges, and deal conversion pipeline.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#171715] border border-[#25221E] px-3 py-2 text-[#C8C0B3] outline-none"
          >
            <option value="ALL">All Offers</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="COUNTERED">Countered</option>
            <option value="ACCEPTED">Accepted (Deal Created)</option>
            <option value="REJECTED">Rejected</option>
            <option value="EXPIRED">Expired</option>
            <option value="DRAFT">Draft</option>
          </select>
        </div>
      </div>

      <div className="bg-[#171715] border border-[#25221E] overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#0A0A09] text-[#7A756D] uppercase tracking-wider">
            <tr>
              <th className="py-3.5 px-4">Offer Date</th>
              <th className="py-3.5 px-4">Investor / Buyer</th>
              <th className="py-3.5 px-4">Property Asset</th>
              <th className="py-3.5 px-4">Offer Amount</th>
              <th className="py-3.5 px-4">Financing & Terms</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#22201C] text-[#C8C0B3]">
            {filteredOffers.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-[#7A756D]">
                  No offers found matching current filters.
                </td>
              </tr>
            ) : (
              filteredOffers.map((offer) => (
                <tr key={offer.id} className="hover:bg-[#1E1C18]">
                  <td className="py-3.5 px-4 text-[#8C867E]">
                    {new Date(offer.createdAt).toLocaleDateString()}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-medium text-[#F5F2EB]">{offer.buyerName}</div>
                    <div className="text-[10px] text-[#7A756D]">{offer.buyerEmail || '—'}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="text-[#F5F2EB] line-clamp-1">{offer.propertyTitle || 'Residence'}</div>
                    <div className="text-[10px] text-[#7A756D]">Ref: {offer.propertyId}</div>
                  </td>

                  <td className="py-3.5 px-4 font-editorial text-sm text-[#B79A62]">
                    AED {offer.offerAmount.toLocaleString()}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="uppercase text-[10px] font-semibold text-[#D8BE8A]">
                      {offer.currency}
                    </div>
                    {offer.conditions && (
                      <div className="text-[10px] text-[#7A756D] line-clamp-1">
                        {offer.conditions}
                      </div>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-semibold uppercase ${
                        offer.status === 'ACCEPTED'
                          ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/60'
                          : offer.status === 'SUBMITTED'
                          ? 'bg-amber-950/60 text-amber-300 border border-amber-800/60'
                          : offer.status === 'REJECTED'
                          ? 'bg-red-950/60 text-red-300 border border-red-800/60'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {offer.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right space-x-1.5">
                    {offer.status !== 'ACCEPTED' && offer.status !== 'REJECTED' && (
                      <>
                        <button
                          disabled={actionLoading === offer.id}
                          onClick={() => handleUpdateStatus(offer.id, 'ACCEPTED')}
                          className="px-2.5 py-1 bg-[#B79A62] text-[#0A0A09] hover:bg-[#D8BE8A] text-[10px] font-semibold uppercase tracking-wider transition-colors disabled:opacity-50"
                          title="Accept and convert proposal into active Closing Deal"
                        >
                          {actionLoading === offer.id ? 'Processing...' : 'Accept & Convert'}
                        </button>
                        <button
                          disabled={actionLoading === offer.id}
                          onClick={() => handleUpdateStatus(offer.id, 'REJECTED')}
                          className="px-2 py-1 bg-zinc-900 border border-zinc-700 text-zinc-400 hover:text-red-300 text-[10px] uppercase tracking-wider"
                          title="Decline proposal"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {offer.status === 'ACCEPTED' && (
                      <span className="text-[10px] text-emerald-400 font-medium inline-flex items-center gap-1">
                        <Handshake className="w-3 h-3" />
                        <span>Converted to Deal</span>
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
