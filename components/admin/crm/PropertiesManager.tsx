'use client';

import React, { useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PropertyItem, AgentItem } from '@/types';
import {
  Building, Plus, Search, ShieldCheck, ExternalLink, Trash2, X, Eye, EyeOff,
  Upload, ImagePlus, Video, UserRound, Phone, Mail, MessageCircle,
} from 'lucide-react';

type PropertyMedia = PropertyItem & { videoUrls?: string[] };

interface Props { initialProperties: PropertyItem[]; agents: AgentItem[]; }

const DUBAI_LOCATIONS = [
  'Downtown Dubai','Business Bay','DIFC','Dubai Design District (D3)','Dubai International Financial Centre',
  'Dubai Creek Harbour','Dubai Festival City','Dubai Hills Estate','Dubai Marina','Jumeirah Beach Residence (JBR)',
  'Palm Jumeirah','Bluewaters Island','City Walk','Jumeirah 1','Jumeirah 2','Jumeirah 3','Jumeirah Village Circle (JVC)',
  'Jumeirah Village Triangle (JVT)','Al Barsha 1','Al Barsha 2','Al Barsha 3','Al Barsha South','Barsha Heights (TECOM)',
  'Al Sufouh 1','Al Sufouh 2','Umm Suqeim 1','Umm Suqeim 2','Umm Suqeim 3','Al Wasl','Al Quoz','Meydan',
  'Mohammed Bin Rashid City (MBR City)','Nad Al Sheba','Emirates Hills','The Lakes','The Meadows','The Springs',
  'Jumeirah Islands','Dubai Sports City','Motor City','Arabian Ranches','Arabian Ranches 2','Dubai Land Residence Complex (DLRC)',
  'Dubailand','Damac Hills','Damac Hills 2','Town Square Dubai','The Valley','Dubai South','Expo City Dubai',
  'Dubai Investment Park (DIP)','Jebel Ali','Discovery Gardens','The Gardens','Dubai Production City','Dubai Studio City',
  'Dubai Science Park','Dubai Silicon Oasis (DSO)','Dubai Academic City','International City','Al Warsan','Al Warqa 1',
  'Al Warqa 2','Al Warqa 3','Al Warqa 4','Mirdif','Nad Al Hamar','Al Garhoud','Deira','Bur Dubai','Al Jaddaf',
  'Ras Al Khor','Dubai Healthcare City','Dubai Maritime City','Dubai Islands','Dubai Water Canal','Dubai Harbour',
  'Dubai Internet City','Dubai Media City','Dubai Knowledge Park','Jumeirah Golf Estates',
];

const PROPERTY_TYPES = ['Penthouse','Villa','Apartment','Townhouse','Duplex','Mansion','Studio','Office','Retail'];
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80';

export const PropertiesManager: React.FC<Props> = ({ initialProperties, agents }) => {
  const [properties, setProperties] = useState<PropertyItem[]>(initialProperties);
  const [search, setSearch] = useState('');
  const [purposeFilter, setPurposeFilter] = useState('ALL');
  const [communityFilter, setCommunityFilter] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const [newPurpose, setNewPurpose] = useState<'FOR_SALE' | 'FOR_RENT'>('FOR_SALE');
  const [newType, setNewType] = useState('Penthouse');
  const [newCommunity, setNewCommunity] = useState('Business Bay');
  const [newSubCommunity, setNewSubCommunity] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newBeds, setNewBeds] = useState('3');
  const [newBaths, setNewBaths] = useState('4');
  const [newArea, setNewArea] = useState('');
  const [newParking, setNewParking] = useState('2');
  const [newFurnished, setNewFurnished] = useState<'FURNISHED' | 'SEMI_FURNISHED' | 'UNFURNISHED'>('FURNISHED');
  const [newAgent, setNewAgent] = useState('');
  const [newPermit, setNewPermit] = useState('');
  const [newImages, setNewImages] = useState<string[]>([]);
  const [newVideos, setNewVideos] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const selectedAgent = useMemo(() => agents.find((a) => a.id === newAgent), [agents, newAgent]);

  const filteredProperties = properties.filter((p) => {
    if (purposeFilter !== 'ALL' && p.purpose !== purposeFilter) return false;
    if (communityFilter !== 'ALL' && p.community !== communityFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      if (![p.title, p.referenceNumber, p.community, p.address, p.agent?.name || ''].some((v) => v.toLowerCase().includes(q))) return false;
    }
    return true;
  });

  const uploadFiles = async (files: FileList | File[]) => {
    const selected = Array.from(files);
    if (!selected.length) return;
    setUploading(true);
    try {
      for (const file of selected) {
        const form = new FormData();
        form.append('file', file);
        const res = await fetch('/api/uploads', { method: 'POST', body: form });
        const json = await res.json().catch(() => ({}));
        if (!res.ok || !json.success || !json.data?.url) throw new Error(json.error || `Upload failed for ${file.name}`);
        if (file.type.startsWith('video/')) setNewVideos((prev) => [...prev, json.data.url]);
        else setNewImages((prev) => [...prev, json.data.url]);
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Media upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const addImageUrl = () => {
    const url = newImageUrl.trim();
    if (url) { setNewImages((prev) => [...prev, url]); setNewImageUrl(''); }
  };
  const addVideoUrl = () => {
    const url = newVideoUrl.trim();
    if (url) { setNewVideos((prev) => [...prev, url]); setNewVideoUrl(''); }
  };

  const handleTogglePublish = async (propId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    const res = await fetch(`/api/properties/${propId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ workflowStatus: nextStatus }) });
    if (res.ok) setProperties((prev) => prev.map((p) => p.id === propId ? { ...p, workflowStatus: nextStatus as PropertyItem['workflowStatus'] } : p));
  };

  const handleToggleVerify = async (propId: string, currentVerified: boolean) => {
    const nextVerified = !currentVerified;
    const res = await fetch(`/api/properties/${propId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ verified: nextVerified, verificationStatus: nextVerified ? 'VERIFIED' : 'PENDING_VERIFICATION' }) });
    if (res.ok) setProperties((prev) => prev.map((p) => p.id === propId ? { ...p, verified: nextVerified, verificationStatus: nextVerified ? 'VERIFIED' : 'PENDING_VERIFICATION' } : p));
  };

  const handleDeleteProperty = async (propId: string) => {
    if (!confirm('Are you sure you want to permanently delete this property listing?')) return;
    const res = await fetch(`/api/properties/${propId}`, { method: 'DELETE' });
    if (res.ok) setProperties((prev) => prev.filter((p) => p.id !== propId));
  };

  const resetForm = () => {
    setNewTitle(''); setNewPurpose('FOR_SALE'); setNewType('Penthouse'); setNewCommunity('Business Bay'); setNewSubCommunity('');
    setNewAddress(''); setNewPrice(''); setNewBeds('3'); setNewBaths('4'); setNewArea(''); setNewParking('2'); setNewFurnished('FURNISHED');
    setNewAgent(''); setNewPermit(''); setNewImages([]); setNewVideos([]); setNewImageUrl(''); setNewVideoUrl(''); setNewDesc('');
  };

  const handleCreateProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newPrice || !newArea) return;
    setSaving(true);
    try {
      const numericPrice = Number(newPrice.replace(/[^0-9.]/g, ''));
      const numericArea = Number(newArea.replace(/[^0-9.]/g, ''));
      const images = newImages.length ? newImages : [FALLBACK_IMAGE];
      const slug = `${newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString().slice(-5)}`;
      const agent = selectedAgent;
      const address = newAddress.trim() || `${newSubCommunity || newCommunity}, Dubai, UAE`;
      const res = await fetch('/api/properties', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          referenceNumber: `TAN-DXB-${Math.floor(1000 + Math.random() * 9000)}`,
          title: newTitle.trim(), slug, purpose: newPurpose, propertyType: newType,
          community: newCommunity, subCommunity: newSubCommunity || newCommunity, address,
          price: numericPrice, currency: 'AED', rentalPeriod: newPurpose === 'FOR_RENT' ? 'YEARLY' : undefined,
          bedrooms: Number(newBeds), bathrooms: Number(newBaths), parkingSpaces: Number(newParking), area: numericArea,
          furnished: newFurnished, developer: 'Tanmiyat Real Estate Development LLC', project: newSubCommunity || newCommunity,
          agentId: agent?.id || agents[0]?.id || '', reraBrokerId: agent?.reraBrokerId, brokerORN: agent?.reraBrokerId,
          agentBRN: agent?.brn, advertisingPermitNumber: newPermit || `DLD-PERMIT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          featured: false, exclusive: false, verified: true, verificationStatus: 'VERIFIED', workflowStatus: 'PUBLISHED', status: 'AVAILABLE',
          heroImage: images[0], featuredImage: images[0], images, videoUrl: newVideos[0], videoUrls: newVideos,
          description: newDesc.trim() || `${newTitle.trim()} located in prime ${newCommunity}, Dubai.`,
          amenities: ['Concierge Service', 'Swimming Pool', 'Private Parking', 'Smart Home System'],
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.success) throw new Error(json.error || 'Property creation failed.');
      if (json.data) setProperties((prev) => [json.data, ...prev]);
      setShowAddModal(false); resetForm();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Property creation failed.');
    } finally { setSaving(false); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><div className="flex items-center gap-3"><h1 className="font-editorial text-3xl text-[#F5F2EB]">Marketplace Properties & Listings</h1><span className="px-2.5 py-0.5 bg-[#B79A62]/10 border border-[#B79A62]/30 text-[#B79A62] text-xs font-semibold">{properties.length} Active Assets</span></div><p className="text-xs text-[#8C867E]">Direct developer releases, resale brokerage, RERA advertising permit compliance, and portal statuses.</p></div>
        <button onClick={() => setShowAddModal(true)} className="px-4 py-2.5 bg-[#B79A62] hover:bg-[#D8BE8A] text-[#0A0A09] text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5"><Plus className="w-4 h-4" />New Property Listing</button>
      </div>

      <div className="bg-[#171715] border border-[#25221E] p-4 flex flex-col sm:flex-row items-center gap-3 text-xs">
        <div className="relative w-full sm:w-72"><Search className="w-4 h-4 text-[#8C867E] absolute left-3 top-1/2 -translate-y-1/2" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search reference #, title, community, agent..." className="w-full bg-[#0A0A09] border border-[#25221E] pl-9 pr-3 py-2 text-[#F5F2EB] outline-none" /></div>
        <select value={purposeFilter} onChange={(e) => setPurposeFilter(e.target.value)} className="w-full sm:w-auto bg-[#0A0A09] border border-[#25221E] px-3 py-2 text-[#C8C0B3] outline-none"><option value="ALL">All Purposes</option><option value="FOR_SALE">For Sale</option><option value="FOR_RENT">For Rent</option></select>
        <select value={communityFilter} onChange={(e) => setCommunityFilter(e.target.value)} className="w-full sm:w-auto bg-[#0A0A09] border border-[#25221E] px-3 py-2 text-[#C8C0B3] outline-none"><option value="ALL">All Locations</option>{DUBAI_LOCATIONS.map((location) => <option key={location} value={location}>{location}</option>)}</select>
      </div>

      <div className="bg-[#171715] border border-[#25221E] overflow-x-auto"><table className="w-full text-left text-xs"><thead className="bg-[#0A0A09] text-[#7A756D] uppercase tracking-wider"><tr><th className="py-3.5 px-4">Residence / Asset</th><th className="py-3.5 px-4">Location</th><th className="py-3.5 px-4">Agent</th><th className="py-3.5 px-4">Purpose</th><th className="py-3.5 px-4">Price</th><th className="py-3.5 px-4">Workflow</th><th className="py-3.5 px-4 text-right">Actions</th></tr></thead><tbody className="divide-y divide-[#22201C] text-[#C8C0B3]">{filteredProperties.map((prop) => <tr key={prop.id} className="hover:bg-[#1E1C18]">
        <td className="py-3.5 px-4"><div className="flex items-center gap-3"><div className="relative w-12 h-10 bg-[#0A0A09] border border-[#25221E] overflow-hidden shrink-0"><Image src={prop.featuredImage || prop.heroImage} alt={prop.title} fill className="object-cover" sizes="48px" referrerPolicy="no-referrer" /></div><div><span className="font-medium text-[#F5F2EB] block line-clamp-1">{prop.title}</span><span className="text-[10px] text-[#7A756D] font-mono">Ref: {prop.referenceNumber}</span></div></div></td>
        <td className="py-3.5 px-4"><div>{prop.community}</div><div className="text-[10px] text-[#7A756D]">{prop.subCommunity || prop.address}</div></td>
        <td className="py-3.5 px-4">{prop.agent?.name || prop.agentId || 'Unassigned'}<div className="text-[10px] text-[#7A756D]">{prop.agent?.brn ? `BRN ${prop.agent.brn}` : ''}</div></td>
        <td className="py-3.5 px-4"><span className={`px-2 py-0.5 text-[9px] uppercase font-bold ${prop.purpose === 'FOR_RENT' ? 'bg-[#25221E] text-[#D8BE8A] border border-[#B79A62]/30' : 'bg-[#B79A62] text-[#0A0A09]'}`}>{prop.purpose === 'FOR_RENT' ? 'Rent' : 'Sale'}</span></td>
        <td className="py-3.5 px-4 font-editorial text-sm text-[#F5F2EB]">AED {prop.price.toLocaleString()}{prop.purpose === 'FOR_RENT' && <span className="text-[10px] text-[#7A756D] font-sans ml-1">/yr</span>}</td>
        <td className="py-3.5 px-4"><span className={`px-2 py-0.5 text-[10px] font-semibold uppercase ${prop.workflowStatus === 'PUBLISHED' ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/60' : 'bg-zinc-800 text-zinc-400'}`}>{prop.workflowStatus || 'PUBLISHED'}</span></td>
        <td className="py-3.5 px-4 text-right space-x-2"><button onClick={() => handleTogglePublish(prop.id, prop.workflowStatus || 'PUBLISHED')} className="p-1 text-[#8C867E] hover:text-[#B79A62]" title="Publish / Draft">{prop.workflowStatus === 'PUBLISHED' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button><Link href={`/properties/${prop.slug}`} target="_blank" className="p-1 text-[#8C867E] hover:text-[#B79A62] inline-block" title="View live listing"><ExternalLink className="w-4 h-4" /></Link><button onClick={() => handleDeleteProperty(prop.id)} className="p-1 text-[#8C867E] hover:text-red-400" title="Delete listing"><Trash2 className="w-4 h-4" /></button></td>
      </tr>)}</tbody></table></div>

      {showAddModal && <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"><div className="relative w-full max-w-4xl bg-[#171715] border border-[#25221E] p-6 sm:p-8 max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-[#22201C] mb-6"><div><h2 className="font-editorial text-2xl text-[#F5F2EB]">Create Marketplace Property Listing</h2><p className="text-[11px] text-[#8C867E] mt-1">Full Dubai location, advisor profile, unlimited gallery selection and video uploads.</p></div><button onClick={() => setShowAddModal(false)} className="text-[#8C867E] hover:text-[#F5F2EB]"><X className="w-5 h-5" /></button></div>
        <form onSubmit={handleCreateProperty} className="space-y-5 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label className="field-label">Property Title *</label><input required value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="e.g. The Sky Penthouse at Canal Crown" className="field-input" /></div><div><label className="field-label">Property Type</label><select value={newType} onChange={(e) => setNewType(e.target.value)} className="field-input">{PROPERTY_TYPES.map((type) => <option key={type}>{type}</option>)}</select></div></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4"><div><label className="field-label">Purpose</label><select value={newPurpose} onChange={(e) => setNewPurpose(e.target.value as 'FOR_SALE' | 'FOR_RENT')} className="field-input"><option value="FOR_SALE">For Sale</option><option value="FOR_RENT">For Rent</option></select></div><div><label className="field-label">Community / Location</label><select value={newCommunity} onChange={(e) => setNewCommunity(e.target.value)} className="field-input">{DUBAI_LOCATIONS.map((location) => <option key={location}>{location}</option>)}</select></div><div><label className="field-label">Building / Sub-community</label><input value={newSubCommunity} onChange={(e) => setNewSubCommunity(e.target.value)} placeholder="Tower / building / villa community" className="field-input" /></div></div>
          <div><label className="field-label">Full Address</label><input value={newAddress} onChange={(e) => setNewAddress(e.target.value)} placeholder="Building, street, community, Dubai, UAE" className="field-input" /></div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4"><div><label className="field-label">Price (AED) *</label><input required type="number" min="0" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} className="field-input" /></div><div><label className="field-label">Area Sq.Ft *</label><input required type="number" min="0" value={newArea} onChange={(e) => setNewArea(e.target.value)} className="field-input" /></div><div><label className="field-label">Bedrooms</label><input type="number" min="0" value={newBeds} onChange={(e) => setNewBeds(e.target.value)} className="field-input" /></div><div><label className="field-label">Bathrooms</label><input type="number" min="0" value={newBaths} onChange={(e) => setNewBaths(e.target.value)} className="field-input" /></div><div><label className="field-label">Parking</label><input type="number" min="0" value={newParking} onChange={(e) => setNewParking(e.target.value)} className="field-input" /></div></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label className="field-label">Furnished Status</label><select value={newFurnished} onChange={(e) => setNewFurnished(e.target.value as typeof newFurnished)} className="field-input"><option value="FURNISHED">Furnished</option><option value="SEMI_FURNISHED">Semi Furnished</option><option value="UNFURNISHED">Unfurnished</option></select></div><div><label className="field-label">DLD / Trakheesi Permit Number</label><input value={newPermit} onChange={(e) => setNewPermit(e.target.value)} placeholder="DLD-PERMIT-2026-XXXX" className="field-input" /></div></div>

          <div className="bg-[#0A0A09] border border-[#25221E] p-4 space-y-4"><div className="flex items-center gap-2 text-[#B79A62] font-semibold uppercase tracking-wider"><UserRound className="w-4 h-4" />Listing Advisor / Agent</div><select value={newAgent} onChange={(e) => setNewAgent(e.target.value)} className="field-input"><option value="">Select Advisor</option>{agents.map((a) => <option key={a.id} value={a.id}>{a.name} • BRN {a.brn || 'N/A'}</option>)}</select>{selectedAgent && <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-3 border border-[#25221E] bg-[#171715]"><div className="flex items-center gap-3 sm:col-span-2 lg:col-span-1">{selectedAgent.photo ? <div className="relative w-12 h-12 rounded-full overflow-hidden border border-[#B79A62]/40"><Image src={selectedAgent.photo} alt={selectedAgent.name} fill className="object-cover" sizes="48px" /></div> : <UserRound className="w-10 h-10 text-[#B79A62]" />}<div><div className="text-[#F5F2EB] font-semibold">{selectedAgent.name}</div><div className="text-[10px] text-[#8C867E]">{selectedAgent.designation}</div></div></div><div className="flex gap-2"><Phone className="w-3.5 h-3.5 text-[#B79A62]" />{selectedAgent.phone}</div><div className="flex gap-2"><MessageCircle className="w-3.5 h-3.5 text-[#B79A62]" />{selectedAgent.whatsApp}</div><div className="flex gap-2"><Mail className="w-3.5 h-3.5 text-[#B79A62]" />{selectedAgent.email}</div><div className="sm:col-span-2 lg:col-span-4 text-[10px] text-[#8C867E]">{selectedAgent.specialization} • {selectedAgent.areas.join(', ')} • {selectedAgent.languages.join(', ')} • BRN {selectedAgent.brn || 'N/A'}</div></div>}</div>

          <div className="bg-[#0A0A09] border border-[#25221E] p-4 space-y-4"><div className="flex items-center justify-between"><div className="flex items-center gap-2 text-[#B79A62] font-semibold uppercase tracking-wider"><ImagePlus className="w-4 h-4" />Property Images</div><span className="text-[10px] text-[#8C867E]">{newImages.length} selected</span></div><input ref={imageInputRef} type="file" accept="image/*" multiple hidden onChange={(e) => { if (e.target.files) void uploadFiles(e.target.files); e.currentTarget.value = ''; }} /><button type="button" disabled={uploading} onClick={() => imageInputRef.current?.click()} className="w-full py-3 border border-dashed border-[#B79A62]/50 text-[#D8BE8A] hover:bg-[#B79A62]/10 flex items-center justify-center gap-2"><Upload className="w-4 h-4" />{uploading ? 'Uploading media...' : 'Upload Images — Select as many as needed'}</button><div className="flex gap-2"><input value={newImageUrl} onChange={(e) => setNewImageUrl(e.target.value)} placeholder="Or paste an image URL" className="field-input flex-1" /><button type="button" onClick={addImageUrl} className="px-4 border border-[#25221E] text-[#C8C0B3]">Add URL</button></div>{newImages.length > 0 && <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">{newImages.map((url, index) => <div key={`${url}-${index}`} className="relative aspect-square border border-[#25221E] overflow-hidden group"><Image src={url} alt={`Property image ${index + 1}`} fill className="object-cover" sizes="160px" referrerPolicy="no-referrer" /><button type="button" onClick={() => setNewImages((prev) => prev.filter((_, i) => i !== index))} className="absolute top-1 right-1 p-1 bg-black/80 text-white"><X className="w-3 h-3" /></button></div>)}</div>}</div>

          <div className="bg-[#0A0A09] border border-[#25221E] p-4 space-y-4"><div className="flex items-center justify-between"><div className="flex items-center gap-2 text-[#B79A62] font-semibold uppercase tracking-wider"><Video className="w-4 h-4" />Property Videos</div><span className="text-[10px] text-[#8C867E]">{newVideos.length} selected</span></div><input ref={videoInputRef} type="file" accept="video/*" multiple hidden onChange={(e) => { if (e.target.files) void uploadFiles(e.target.files); e.currentTarget.value = ''; }} /><button type="button" disabled={uploading} onClick={() => videoInputRef.current?.click()} className="w-full py-3 border border-dashed border-[#B79A62]/50 text-[#D8BE8A] hover:bg-[#B79A62]/10 flex items-center justify-center gap-2"><Video className="w-4 h-4" />Upload Videos — Select as many as needed</button><div className="flex gap-2"><input value={newVideoUrl} onChange={(e) => setNewVideoUrl(e.target.value)} placeholder="Or paste a video URL" className="field-input flex-1" /><button type="button" onClick={addVideoUrl} className="px-4 border border-[#25221E] text-[#C8C0B3]">Add URL</button></div>{newVideos.length > 0 && <div className="space-y-2">{newVideos.map((url, index) => <div key={`${url}-${index}`} className="flex items-center justify-between gap-3 p-2 border border-[#25221E]"><div className="flex items-center gap-2 min-w-0"><Video className="w-4 h-4 text-[#B79A62] shrink-0" /><span className="truncate text-[10px] text-[#A8A196]">Video {index + 1}: {url}</span></div><button type="button" onClick={() => setNewVideos((prev) => prev.filter((_, i) => i !== index))} className="p-1 text-red-400"><X className="w-3.5 h-3.5" /></button></div>)}</div>}</div>

          <div><label className="field-label">Description & Narrative</label><textarea rows={4} value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="Architectural highlights, panoramic skyline vistas, finishes..." className="field-input resize-none" /></div>
          <button type="submit" disabled={saving || uploading} className="w-full py-3.5 bg-[#B79A62] text-[#0A0A09] font-semibold uppercase tracking-[0.2em] disabled:opacity-50">{saving ? 'Publishing Asset...' : 'Publish Property to Live Marketplace'}</button>
        </form>
      </div></div>}
      <style jsx>{`.field-label{display:block;margin-bottom:.35rem;font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:#8C867E}.field-input{width:100%;background:#0A0A09;border:1px solid #25221E;padding:.6rem .75rem;color:#F5F2EB;outline:none}.field-input:focus{border-color:#B79A62}`}</style>
    </div>
  );
};
