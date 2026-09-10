'use client';

import React, { useState } from 'react';
import { DealItem, DealStage } from '@/types';
import { CheckCircle2, ArrowRight, Pencil, X } from 'lucide-react';

interface Props { initialDeals: DealItem[]; }
const STAGES: { id: DealStage; label: string }[] = [
  { id: 'AGREEMENT_SIGNED', label: 'Form F Agreement Signed' },
  { id: 'ESCROW_DEPOSIT_PAID', label: 'Escrow Deposit Paid (10%)' },
  { id: 'DLD_APPOINTMENT_SCHEDULED', label: 'DLD Trustee Appointment' },
  { id: 'CLOSED_WON', label: 'Title Deed Transferred (Won)' },
];

export const DealsManager: React.FC<Props> = ({ initialDeals }) => {
  const [deals, setDeals] = useState<DealItem[]>(initialDeals);
  const [editing, setEditing] = useState<DealItem | null>(null);
  const [editStage, setEditStage] = useState<DealStage>('AGREEMENT_SIGNED');
  const [editFinalPrice, setEditFinalPrice] = useState('');
  const [editBuyerName, setEditBuyerName] = useState('');
  const [editSellerName, setEditSellerName] = useState('');
  const [editCommission, setEditCommission] = useState('');
  const [editClosingDate, setEditClosingDate] = useState('');
  const [saving, setSaving] = useState(false);

  const handleAdvanceStage = async (dealId: string, currentStage: DealStage) => {
    const currentIndex = STAGES.findIndex((s) => s.id === currentStage);
    if (currentIndex >= STAGES.length - 1) return;
    try {
      const nextStage = STAGES[currentIndex + 1].id;
      const res = await fetch(`/api/deals/${dealId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ stage: nextStage }) });
      if (!res.ok) throw new Error('Deal stage update failed.');
      const json = await res.json();
      setDeals((prev) => prev.map((d) => d.id === dealId ? (json.data || { ...d, stage: nextStage }) : d));
    } catch (err) { alert(err instanceof Error ? err.message : 'Deal stage update failed.'); }
  };

  const openEdit = (deal: DealItem) => {
    setEditing(deal);
    setEditStage(deal.stage);
    setEditFinalPrice(String(deal.finalPrice || ''));
    setEditBuyerName(deal.buyerName || '');
    setEditSellerName(deal.sellerName || '');
    setEditCommission(String(deal.commissionTotal || ''));
    setEditClosingDate(deal.expectedClosingDate || '');
  };

  const saveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const finalPrice = Number(editFinalPrice.replace(/[^0-9.]/g, ''));
    const commissionTotal = Number(editCommission.replace(/[^0-9.]/g, ''));
    if (!finalPrice || !editBuyerName.trim() || !editSellerName.trim()) { alert('Buyer, seller and transaction value are required.'); return; }
    setSaving(true);
    try {
      const res = await fetch(`/api/deals/${editing.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ stage: editStage, finalPrice, buyerName: editBuyerName.trim(), sellerName: editSellerName.trim(), commissionTotal, expectedClosingDate: editClosingDate || undefined }) });
      if (!res.ok) throw new Error('Deal update failed.');
      const json = await res.json();
      if (json.data) setDeals((prev) => prev.map((d) => d.id === editing.id ? json.data : d));
      setEditing(null);
    } catch (err) { alert(err instanceof Error ? err.message : 'Deal update failed.'); }
    finally { setSaving(false); }
  };

  const totalPipelineValue = deals.reduce((acc, cur) => acc + (cur.finalPrice || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"><div><div className="flex items-center gap-3"><h1 className="font-editorial text-3xl text-[#F5F2EB]">Deals & Closing Pipeline</h1><span className="px-2.5 py-0.5 bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-semibold">AED {(totalPipelineValue / 1000000).toFixed(1)}M Active Escrow Pipeline</span></div><p className="text-xs text-[#8C867E]">MOU Form F agreements, RERA escrow trust accounts, DLD trustee conveyancing, and title deed transfers.</p></div></div>
      <div className="space-y-4">{deals.map((deal) => { const currentStageIndex = STAGES.findIndex((s) => s.id === deal.stage); const isClosed = deal.stage === 'CLOSED_WON'; return <div key={deal.id} className="bg-[#171715] border border-[#25221E] p-6 space-y-5 hover:border-[#332F28] transition-all"><div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#22201C]"><div><div className="flex items-center gap-2"><span className="text-[10px] font-mono text-[#7A756D]">DEAL #{deal.id.slice(-6).toUpperCase()}</span><span className={`text-[9px] uppercase font-bold px-2 py-0.5 border ${isClosed ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800' : 'bg-[#B79A62]/10 text-[#D8BE8A] border-[#B79A62]/30'}`}>{deal.stage.replace(/_/g, ' ')}</span></div><h3 className="font-editorial text-2xl text-[#F5F2EB] mt-1">{deal.property?.title || 'Luxury Residence Asset'}</h3></div><div className="text-right"><span className="text-[10px] uppercase tracking-wider text-[#8C867E] block">Transaction Value</span><div className="font-editorial text-2xl text-[#B79A62]">AED {deal.finalPrice.toLocaleString()}</div></div></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-1">{STAGES.map((st, idx) => { const isCompleted = idx <= currentStageIndex; const isCurrent = idx === currentStageIndex; return <div key={st.id} className={`p-3 border text-xs transition-all ${isCurrent ? 'bg-[#1F1D19] border-[#B79A62] text-[#F5F2EB]' : isCompleted ? 'bg-[#121210] border-emerald-900/60 text-emerald-300' : 'bg-[#0E0E0D] border-[#22201C] text-[#5A5650]'}`}><div className="flex items-center justify-between mb-1"><span className="text-[10px] font-mono">STEP 0{idx + 1}</span>{isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400"/>}</div><span className="font-medium text-[11px] block">{st.label}</span></div>; })}</div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-2 text-[#C8C0B3]"><div><span className="text-[10px] uppercase text-[#7A756D] block">Buyer</span><span className="text-[#F5F2EB] font-medium">{deal.buyerName}</span><div className="text-[10px] text-[#7A756D]">{deal.buyerPhone}</div></div><div><span className="text-[10px] uppercase text-[#7A756D] block">Seller</span><span className="text-[#F5F2EB] font-medium">{deal.sellerName}</span></div><div><span className="text-[10px] uppercase text-[#7A756D] block">Total Commission</span><span className="text-[#D8BE8A] font-editorial text-sm">AED {(deal.commissionTotal || Math.round(deal.finalPrice * 0.02)).toLocaleString()}</span></div><div><span className="text-[10px] uppercase text-[#7A756D] block">Closing Date</span><span className="text-[#F5F2EB]">{deal.expectedClosingDate || '30-Day Escrow'}</span></div></div>
      <div className="pt-3 border-t border-[#22201C] flex justify-end gap-2"><button onClick={() => openEdit(deal)} className="px-3 py-2 bg-[#171715] border border-[#3A3731] text-[#C8C0B3] hover:text-[#D8BE8A] text-xs uppercase flex items-center gap-1.5"><Pencil className="w-3.5 h-3.5"/>Edit Deal</button>{!isClosed && <button onClick={() => handleAdvanceStage(deal.id, deal.stage)} className="px-4 py-2 bg-[#B79A62] hover:bg-[#D8BE8A] text-[#0A0A09] text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-colors"><span>Advance to Next Conveyancing Stage</span><ArrowRight className="w-3.5 h-3.5"/></button>}</div>
      </div>; })}</div>
      {editing && <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4"><form onSubmit={saveEdit} className="w-full max-w-2xl bg-[#171715] border border-[#25221E] p-6 space-y-5 max-h-[92vh] overflow-y-auto"><div className="flex items-center justify-between"><div><h2 className="font-editorial text-2xl text-[#F5F2EB]">Edit Deal</h2><p className="text-[11px] text-[#8C867E]">Deal #{editing.id.slice(-6).toUpperCase()}</p></div><button type="button" onClick={() => setEditing(null)} className="text-[#8C867E] hover:text-white"><X className="w-5 h-5"/></button></div><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label className="block text-[10px] uppercase text-[#8C867E] mb-1">Stage</label><select value={editStage} onChange={(e) => setEditStage(e.target.value as DealStage)} className="w-full bg-[#0A0A09] border border-[#2D2A26] px-3 py-2 text-[#F5F2EB]">{STAGES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}</select></div><div><label className="block text-[10px] uppercase text-[#8C867E] mb-1">Transaction Value (AED)</label><input value={editFinalPrice} onChange={(e) => setEditFinalPrice(e.target.value)} inputMode="decimal" className="w-full bg-[#0A0A09] border border-[#2D2A26] px-3 py-2 text-[#F5F2EB]"/></div><div><label className="block text-[10px] uppercase text-[#8C867E] mb-1">Buyer</label><input value={editBuyerName} onChange={(e) => setEditBuyerName(e.target.value)} className="w-full bg-[#0A0A09] border border-[#2D2A26] px-3 py-2 text-[#F5F2EB]"/></div><div><label className="block text-[10px] uppercase text-[#8C867E] mb-1">Seller</label><input value={editSellerName} onChange={(e) => setEditSellerName(e.target.value)} className="w-full bg-[#0A0A09] border border-[#2D2A26] px-3 py-2 text-[#F5F2EB]"/></div><div><label className="block text-[10px] uppercase text-[#8C867E] mb-1">Commission (AED)</label><input value={editCommission} onChange={(e) => setEditCommission(e.target.value)} inputMode="decimal" className="w-full bg-[#0A0A09] border border-[#2D2A26] px-3 py-2 text-[#F5F2EB]"/></div><div><label className="block text-[10px] uppercase text-[#8C867E] mb-1">Expected Closing Date</label><input type="date" value={editClosingDate} onChange={(e) => setEditClosingDate(e.target.value)} className="w-full bg-[#0A0A09] border border-[#2D2A26] px-3 py-2 text-[#F5F2EB]"/></div></div><div className="flex justify-end gap-2"><button type="button" onClick={() => setEditing(null)} className="px-4 py-2 border border-[#3A3731] text-xs text-[#A8A196]">Cancel</button><button disabled={saving} type="submit" className="px-4 py-2 bg-[#B79A62] text-[#0A0A09] text-xs font-semibold">{saving ? 'Saving...' : 'Save Changes'}</button></div></form></div>}
    </div>
  );
};
