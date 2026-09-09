'use client';

import React, { useState } from 'react';
import { DealItem, DealStage } from '@/types';
import {
  Handshake,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Calendar,
  DollarSign,
  Building,
} from 'lucide-react';

interface Props {
  initialDeals: DealItem[];
}

const STAGES: { id: DealStage; label: string }[] = [
  { id: 'AGREEMENT_SIGNED', label: 'Form F Agreement Signed' },
  { id: 'ESCROW_DEPOSIT_PAID', label: 'Escrow Deposit Paid (10%)' },
  { id: 'DLD_APPOINTMENT_SCHEDULED', label: 'DLD Trustee Appointment' },
  { id: 'CLOSED_WON', label: 'Title Deed Transferred (Won)' },
];

export const DealsManager: React.FC<Props> = ({ initialDeals }) => {
  const [deals, setDeals] = useState<DealItem[]>(initialDeals);

  const handleAdvanceStage = async (dealId: string, currentStage: DealStage) => {
    const currentIndex = STAGES.findIndex((s) => s.id === currentStage);
    if (currentIndex >= STAGES.length - 1) return;
    const nextStage = STAGES[currentIndex + 1].id;

    try {
      const res = await fetch(`/api/deals/${dealId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage: nextStage }),
      });
      if (res.ok) {
        setDeals((prev) =>
          prev.map((d) => (d.id === dealId ? { ...d, stage: nextStage } : d))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const totalPipelineValue = deals.reduce((acc, cur) => acc + (cur.finalPrice || 0), 0);
  const wonDealsCount = deals.filter((d) => d.stage === 'CLOSED_WON').length;

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-editorial text-3xl text-[#F5F2EB]">Deals & Closing Pipeline</h1>
            <span className="px-2.5 py-0.5 bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-semibold">
              AED {(totalPipelineValue / 1000000).toFixed(1)}M Active Escrow Pipeline
            </span>
          </div>
          <p className="text-xs text-[#8C867E]">
            MOU Form F agreements, RERA escrow trust accounts, DLD trustee conveyancing, and title deed transfers.
          </p>
        </div>
      </div>

      {/* DEALS CARDS */}
      <div className="space-y-4">
        {deals.map((deal) => {
          const currentStageIndex = STAGES.findIndex((s) => s.id === deal.stage);
          const isClosed = deal.stage === 'CLOSED_WON';

          return (
            <div
              key={deal.id}
              className="bg-[#171715] border border-[#25221E] p-6 space-y-5 hover:border-[#332F28] transition-all"
            >
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#22201C]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-[#7A756D]">DEAL #{deal.id.slice(-6).toUpperCase()}</span>
                    <span
                      className={`text-[9px] uppercase font-bold px-2 py-0.5 border ${
                        isClosed
                          ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800'
                          : 'bg-[#B79A62]/10 text-[#D8BE8A] border-[#B79A62]/30'
                      }`}
                    >
                      {deal.stage.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <h3 className="font-editorial text-2xl text-[#F5F2EB] mt-1">
                    {deal.property?.title || 'Luxury Residence Asset'}
                  </h3>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase tracking-wider text-[#8C867E] block">
                    Transaction Value
                  </span>
                  <div className="font-editorial text-2xl text-[#B79A62]">
                    AED {deal.finalPrice.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Stepper Pipeline */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-1">
                {STAGES.map((st, idx) => {
                  const isCompleted = idx <= currentStageIndex;
                  const isCurrent = idx === currentStageIndex;

                  return (
                    <div
                      key={st.id}
                      className={`p-3 border text-xs transition-all ${
                        isCurrent
                          ? 'bg-[#1F1D19] border-[#B79A62] text-[#F5F2EB]'
                          : isCompleted
                          ? 'bg-[#121210] border-emerald-900/60 text-emerald-300'
                          : 'bg-[#0E0E0D] border-[#22201C] text-[#5A5650]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-mono">STEP 0{idx + 1}</span>
                        {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                      </div>
                      <span className="font-medium text-[11px] block">{st.label}</span>
                    </div>
                  );
                })}
              </div>

              {/* Deal Metadata & Conveyancing Details */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-2 text-[#C8C0B3]">
                <div>
                  <span className="text-[10px] uppercase text-[#7A756D] block">Buyer</span>
                  <span className="text-[#F5F2EB] font-medium">{deal.buyerName}</span>
                  <div className="text-[10px] text-[#7A756D]">{deal.buyerPhone}</div>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-[#7A756D] block">Seller</span>
                  <span className="text-[#F5F2EB] font-medium">{deal.sellerName}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-[#7A756D] block">Total Commission</span>
                  <span className="text-[#D8BE8A] font-editorial text-sm">
                    AED {(deal.commissionTotal || Math.round(deal.finalPrice * 0.02)).toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-[#7A756D] block">Closing Date</span>
                  <span className="text-[#F5F2EB]">{deal.expectedClosingDate || '30-Day Escrow'}</span>
                </div>
              </div>

              {/* Action Bar */}
              {!isClosed && (
                <div className="pt-3 border-t border-[#22201C] flex justify-end">
                  <button
                    onClick={() => handleAdvanceStage(deal.id, deal.stage)}
                    className="px-4 py-2 bg-[#B79A62] hover:bg-[#D8BE8A] text-[#0A0A09] text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-colors"
                  >
                    <span>Advance to Next Conveyancing Stage</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
