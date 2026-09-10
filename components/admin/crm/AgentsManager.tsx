'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { AgentItem } from '@/types';
import { Mail, Phone, MessageCircle, Plus, Upload, UserRound, X } from 'lucide-react';

interface Props {
  agents: AgentItem[];
  onAgentsChange: (agents: AgentItem[]) => void;
}

const LOCATIONS = ['Downtown Dubai','Business Bay','DIFC','Dubai Creek Harbour','Dubai Hills Estate','Dubai Marina','Palm Jumeirah','Jumeirah Beach Residence (JBR)','Jumeirah Village Circle (JVC)','Meydan','Emirates Hills','Arabian Ranches','Dubailand','Damac Hills','Dubai South','Dubai Harbour','Dubai Islands','Jumeirah Golf Estates'];

export const AgentsManager: React.FC<Props> = ({ agents, onAgentsChange }) => {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({ name: '', designation: 'Senior Real Estate Advisor', phone: '', whatsApp: '', email: '', brn: '', reraBrokerId: '12048', specialization: 'Luxury Residential', bio: '', photo: '', languages: 'English, Arabic', areas: 'Business Bay, Downtown Dubai' });

  const reset = () => setForm({ name: '', designation: 'Senior Real Estate Advisor', phone: '', whatsApp: '', email: '', brn: '', reraBrokerId: '12048', specialization: 'Luxury Residential', bio: '', photo: '', languages: 'English, Arabic', areas: 'Business Bay, Downtown Dubai' });

  const update = (key: keyof typeof form, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  const uploadPhoto = async (file: File) => {
    setUploading(true);
    try {
      const body = new FormData(); body.append('file', file);
      const res = await fetch('/api/uploads', { method: 'POST', body });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.success || !json.data?.url) throw new Error(json.error || 'Agent photo upload failed.');
      update('photo', json.data.url);
    } catch (error) { alert(error instanceof Error ? error.message : 'Agent photo upload failed.'); }
    finally { setUploading(false); }
  };

  const createAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.brn.trim()) return;
    setSaving(true);
    try {
      const slugBase = form.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      const res = await fetch('/api/agents', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
        name: form.name.trim(), slug: `${slugBase}-${Date.now().toString().slice(-5)}`, photo: form.photo, avatar: form.photo,
        designation: form.designation.trim(), title: form.designation.trim(), phone: form.phone.trim(), whatsApp: form.whatsApp.trim() || form.phone.trim(), email: form.email.trim(),
        languages: form.languages.split(',').map((v) => v.trim()).filter(Boolean), nationality: '', specialization: form.specialization.trim(),
        areas: form.areas.split(',').map((v) => v.trim()).filter(Boolean), bio: form.bio.trim() || `${form.name.trim()} is a licensed Tanmiyat real estate advisor specialising in ${form.specialization.trim()}.`,
        reraBrokerId: form.reraBrokerId.trim() || '12048', brn: form.brn.trim(), licenseInformation: '', status: 'ACTIVE', featured: false,
      }) });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.success) throw new Error(json.error || 'Agent creation failed.');
      onAgentsChange([json.data, ...agents]); setOpen(false); reset();
    } catch (error) { alert(error instanceof Error ? error.message : 'Agent creation failed.'); }
    finally { setSaving(false); }
  };

  return <div className="space-y-4">
    <div className="flex items-center justify-between"><div><h2 className="font-editorial text-2xl text-[#F5F2EB]">Listing Agents & Advisors</h2><p className="text-[11px] text-[#8C867E]">Create advisors once, then assign their names to sale and rental listings.</p></div><button type="button" onClick={() => setOpen(true)} className="px-4 py-2.5 bg-[#B79A62] text-[#0A0A09] text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5"><Plus className="w-4 h-4" />Add Agent</button></div>
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {agents.map((agent) => <div key={agent.id} className="bg-[#171715] border border-[#25221E] p-4 flex gap-3"><div className="relative w-14 h-14 rounded-full overflow-hidden bg-[#0A0A09] border border-[#25221E] shrink-0">{agent.photo || agent.avatar ? <Image src={agent.photo || agent.avatar || ''} alt={agent.name} fill className="object-cover" sizes="56px" referrerPolicy="no-referrer" /> : <div className="w-full h-full flex items-center justify-center text-[#B79A62]"><UserRound className="w-6 h-6" /></div>}</div><div className="min-w-0 flex-1"><div className="font-semibold text-[#F5F2EB] truncate">{agent.name}</div><div className="text-[10px] text-[#B79A62]">{agent.designation} • BRN {agent.brn || 'N/A'}</div><div className="text-[10px] text-[#8C867E] mt-1">{agent.areas.join(', ')}</div><div className="flex gap-3 mt-2 text-[10px] text-[#A8A196]"><span className="inline-flex items-center gap-1"><Phone className="w-3 h-3" />{agent.phone}</span><span className="inline-flex items-center gap-1"><Mail className="w-3 h-3" />{agent.email}</span></div></div></div>)}
    </div>

    {open && <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"><div className="relative w-full max-w-3xl bg-[#171715] border border-[#25221E] p-6 sm:p-8 max-h-[92vh] overflow-y-auto"><div className="flex items-center justify-between pb-4 border-b border-[#25221E] mb-6"><div><h3 className="font-editorial text-2xl text-[#F5F2EB]">Add New Agent / Advisor</h3><p className="text-[11px] text-[#8C867E] mt-1">This advisor becomes selectable on every property listing.</p></div><button type="button" onClick={() => setOpen(false)}><X className="w-5 h-5 text-[#8C867E]" /></button></div>
      <form onSubmit={createAgent} className="space-y-4 text-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4"><Field label="Full Name *" value={form.name} onChange={(v) => update('name', v)} required /><Field label="Email *" type="email" value={form.email} onChange={(v) => update('email', v)} required /><Field label="Phone" value={form.phone} onChange={(v) => update('phone', v)} /><Field label="WhatsApp" value={form.whatsApp} onChange={(v) => update('whatsApp', v)} /><Field label="Agent BRN *" value={form.brn} onChange={(v) => update('brn', v)} required /><Field label="Broker ORN" value={form.reraBrokerId} onChange={(v) => update('reraBrokerId', v)} /></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4"><Field label="Designation" value={form.designation} onChange={(v) => update('designation', v)} /><Field label="Specialization" value={form.specialization} onChange={(v) => update('specialization', v)} /></div>
        <div><label className="block mb-1 text-[10px] uppercase tracking-wider text-[#8C867E]">Agent Photo</label><input ref={photoInputRef} type="file" accept="image/*" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) void uploadPhoto(f); e.currentTarget.value = ''; }} /><button type="button" disabled={uploading} onClick={() => photoInputRef.current?.click()} className="w-full py-3 border border-dashed border-[#B79A62]/50 text-[#D8BE8A] flex items-center justify-center gap-2"><Upload className="w-4 h-4" />{uploading ? 'Uploading photo...' : 'Upload Agent Photo'}</button>{form.photo && <div className="mt-2 text-[10px] text-[#8C867E] truncate">{form.photo}</div>}</div>
        <div><label className="block mb-1 text-[10px] uppercase tracking-wider text-[#8C867E]">Specialized Locations</label><div className="flex flex-wrap gap-1.5">{LOCATIONS.map((location) => { const selected = form.areas.split(',').map((v) => v.trim()).includes(location); return <button type="button" key={location} onClick={() => { const values = form.areas.split(',').map((v) => v.trim()).filter(Boolean); update('areas', selected ? values.filter((v) => v !== location).join(', ') : [...values, location].join(', ')); }} className={`px-2 py-1 border text-[10px] ${selected ? 'bg-[#B79A62] text-[#0A0A09] border-[#B79A62]' : 'border-[#25221E] text-[#8C867E]'}`}>{location}</button>; })}</div></div>
        <Field label="Languages (comma separated)" value={form.languages} onChange={(v) => update('languages', v)} /><div><label className="block mb-1 text-[10px] uppercase tracking-wider text-[#8C867E]">Advisor Bio</label><textarea rows={4} value={form.bio} onChange={(e) => update('bio', e.target.value)} className="w-full bg-[#0A0A09] border border-[#25221E] px-3 py-2 text-[#F5F2EB] outline-none focus:border-[#B79A62]" /></div>
        <button type="submit" disabled={saving || uploading} className="w-full py-3.5 bg-[#B79A62] text-[#0A0A09] font-semibold uppercase tracking-wider disabled:opacity-50">{saving ? 'Creating Agent...' : 'Create Agent & Make Available to Listings'}</button>
      </form>
    </div></div>}
  </div>;
};

const Field = ({ label, value, onChange, type = 'text', required = false }: { label: string; value: string; onChange: (value: string) => void; type?: string; required?: boolean }) => <div><label className="block mb-1 text-[10px] uppercase tracking-wider text-[#8C867E]">{label}</label><input required={required} type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-[#0A0A09] border border-[#25221E] px-3 py-2 text-[#F5F2EB] outline-none focus:border-[#B79A62]" /></div>;
