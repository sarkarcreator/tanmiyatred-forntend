'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PropertyItem, AgentItem } from '@/types';
import {
  Building,
  Plus,
  Search,
  Filter,
  ShieldCheck,
  ExternalLink,
  Trash2,
  CheckCircle,
  Clock,
  X,
  Eye,
  EyeOff,
} from 'lucide-react';

interface Props {
  initialProperties: PropertyItem[];
  agents: AgentItem[];
}

export const PropertiesManager: React.FC<Props> = ({ initialProperties, agents }) => {
  const [properties, setProperties] = useState<PropertyItem[]>(initialProperties);
  const [search, setSearch] = useState('');
  const [purposeFilter, setPurposeFilter] = useState('ALL');
  const [communityFilter, setCommunityFilter] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Property Form state
  const [newTitle, setNewTitle] = useState('');
  const [newPurpose, setNewPurpose] = useState<'FOR_SALE' | 'FOR_RENT'>('FOR_SALE');
  const [newType, setNewType] = useState('Penthouse');
  const [newCommunity, setNewCommunity] = useState('Business Bay');
  const [newSubCommunity, setNewSubCommunity] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newBeds, setNewBeds] = useState('3');
  const [newBaths, setNewBaths] = useState('4');
  const [newArea, setNewArea] = useState('');
  const [newAgent, setNewAgent] = useState('');
  const [newPermit, setNewPermit] = useState('');
  const [newImage, setNewImage] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [saving, setSaving] = useState(false);

  const filteredProperties = properties.filter((p) => {
    if (purposeFilter !== 'ALL' && p.purpose !== purposeFilter) return false;
    if (communityFilter !== 'ALL' && p.community !== communityFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchRef = p.referenceNumber.toLowerCase().includes(q);
      const matchComm = p.community.toLowerCase().includes(q);
      if (!matchTitle && !matchRef && !matchComm) return false;
    }
    return true;
  });

  // Toggle publish status
  const handleTogglePublish = async (propId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    try {
      const res = await fetch(`/api/properties/${propId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workflowStatus: nextStatus }),
      });
      if (res.ok) {
        setProperties((prev) =>
          prev.map((p) => (p.id === propId ? { ...p, workflowStatus: nextStatus as any } : p))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle RERA verification
  const handleToggleVerify = async (propId: string, currentVerified: boolean) => {
    const nextVerified = !currentVerified;
    try {
      const res = await fetch(`/api/properties/${propId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          verified: nextVerified,
          verificationStatus: nextVerified ? 'VERIFIED' : 'PENDING_VERIFICATION',
        }),
      });
      if (res.ok) {
        setProperties((prev) =>
          prev.map((p) =>
            p.id === propId
              ? {
                  ...p,
                  verified: nextVerified,
                  verificationStatus: nextVerified ? 'VERIFIED' : 'PENDING_VERIFICATION',
                }
              : p
          )
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete property
  const handleDeleteProperty = async (propId: string) => {
    if (!confirm('Are you sure you want to permanently delete this property listing?')) return;
    try {
      const res = await fetch(`/api/properties/${propId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setProperties((prev) => prev.filter((p) => p.id !== propId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Create new property
  const handleCreateProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newPrice || !newArea) return;
    setSaving(true);
    try {
      const numericPrice = Number(newPrice.replace(/[^0-9.]/g, ''));
      const numericArea = Number(newArea.replace(/[^0-9.]/g, ''));
      const slug = newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-') + `-${Date.now().toString().slice(-4)}`;

      const res = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          slug,
          purpose: newPurpose,
          propertyType: newType,
          community: newCommunity,
          subCommunity: newSubCommunity || newCommunity,
          address: `${newSubCommunity || newCommunity}, Dubai, UAE`,
          price: numericPrice,
          currency: 'AED',
          bedrooms: Number(newBeds),
          bathrooms: Number(newBaths),
          area: numericArea,
          agentId: newAgent || agents[0]?.id,
          advertisingPermitNumber: newPermit || `DLD-PERMIT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          featuredImage:
            newImage ||
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
          images: [
            newImage ||
              'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
          ],
          description: newDesc || `${newTitle} located in prime ${newCommunity}, Dubai.`,
          workflowStatus: 'PUBLISHED',
          status: 'AVAILABLE',
          verified: true,
          verificationStatus: 'VERIFIED',
          amenities: ['Concierge Service', 'Swimming Pool', 'Private Parking', 'Smart Home System'],
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          setProperties((prev) => [json.data, ...prev]);
          setShowAddModal(false);
          setNewTitle('');
          setNewPrice('');
          setNewArea('');
          setNewDesc('');
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-editorial text-3xl text-[#F5F2EB]">Marketplace Properties & Listings</h1>
            <span className="px-2.5 py-0.5 bg-[#B79A62]/10 border border-[#B79A62]/30 text-[#B79A62] text-xs font-semibold">
              {properties.length} Active Assets
            </span>
          </div>
          <p className="text-xs text-[#8C867E]">
            Direct developer releases, resale brokerage, RERA advertising permit compliance, and portal statuses.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-[#B79A62] hover:bg-[#D8BE8A] text-[#0A0A09] text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Property Listing</span>
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="bg-[#171715] border border-[#25221E] p-4 flex flex-col sm:flex-row items-center gap-3 text-xs">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#8C867E] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search reference #, title, community..."
            className="w-full bg-[#0A0A09] border border-[#25221E] focus:border-[#B79A62] pl-9 pr-3 py-2 text-[#F5F2EB] outline-none"
          />
        </div>

        <select
          value={purposeFilter}
          onChange={(e) => setPurposeFilter(e.target.value)}
          className="w-full sm:w-auto bg-[#0A0A09] border border-[#25221E] px-3 py-2 text-[#C8C0B3] outline-none"
        >
          <option value="ALL">All Purposes</option>
          <option value="FOR_SALE">For Sale</option>
          <option value="FOR_RENT">For Rent</option>
        </select>

        <select
          value={communityFilter}
          onChange={(e) => setCommunityFilter(e.target.value)}
          className="w-full sm:w-auto bg-[#0A0A09] border border-[#25221E] px-3 py-2 text-[#C8C0B3] outline-none"
        >
          <option value="ALL">All Communities</option>
          <option value="Business Bay">Business Bay</option>
          <option value="Dubailand">Dubailand</option>
          <option value="Dubai Water Canal">Dubai Water Canal</option>
          <option value="Palm Jumeirah">Palm Jumeirah</option>
          <option value="Downtown Dubai">Downtown Dubai</option>
        </select>
      </div>

      {/* PROPERTIES TABLE */}
      <div className="bg-[#171715] border border-[#25221E] overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#0A0A09] text-[#7A756D] uppercase tracking-wider">
            <tr>
              <th className="py-3.5 px-4">Residence / Asset</th>
              <th className="py-3.5 px-4">Community</th>
              <th className="py-3.5 px-4">Purpose</th>
              <th className="py-3.5 px-4">Price (AED)</th>
              <th className="py-3.5 px-4">Specs</th>
              <th className="py-3.5 px-4">RERA Permit</th>
              <th className="py-3.5 px-4">Workflow</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#22201C] text-[#C8C0B3]">
            {filteredProperties.map((prop) => (
              <tr key={prop.id} className="hover:bg-[#1E1C18]">
                {/* Residence Info & Image */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-10 bg-[#0A0A09] border border-[#25221E] overflow-hidden shrink-0">
                      <Image
                        src={prop.featuredImage}
                        alt={prop.title}
                        fill
                        className="object-cover"
                        sizes="48px"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <span className="font-medium text-[#F5F2EB] hover:text-[#B79A62] block line-clamp-1">
                        {prop.title}
                      </span>
                      <span className="text-[10px] text-[#7A756D] font-mono">
                        Ref: {prop.referenceNumber}
                      </span>
                    </div>
                  </div>
                </td>

                <td className="py-3.5 px-4">{prop.community}</td>

                <td className="py-3.5 px-4">
                  <span
                    className={`px-2 py-0.5 text-[9px] uppercase font-bold ${
                      prop.purpose === 'FOR_RENT'
                        ? 'bg-[#25221E] text-[#D8BE8A] border border-[#B79A62]/30'
                        : 'bg-[#B79A62] text-[#0A0A09]'
                    }`}
                  >
                    {prop.purpose === 'FOR_RENT' ? 'Rent' : 'Sale'}
                  </span>
                </td>

                <td className="py-3.5 px-4 font-editorial text-sm text-[#F5F2EB]">
                  AED {prop.price.toLocaleString()}
                  {prop.purpose === 'FOR_RENT' && (
                    <span className="text-[10px] text-[#7A756D] font-sans ml-1">/yr</span>
                  )}
                </td>

                <td className="py-3.5 px-4">
                  <div>{prop.bedrooms} Bed • {prop.bathrooms} Bath</div>
                  <div className="text-[10px] text-[#7A756D]">{prop.area.toLocaleString()} sq.ft</div>
                </td>

                <td className="py-3.5 px-4">
                  <button
                    onClick={() => handleToggleVerify(prop.id, prop.verified)}
                    className="flex items-center gap-1.5 hover:underline"
                    title="Click to toggle RERA permit verification status"
                  >
                    <ShieldCheck
                      className={`w-3.5 h-3.5 ${prop.verified ? 'text-emerald-400' : 'text-zinc-600'}`}
                    />
                    <span className="font-mono text-[10px] text-[#A8A196]">
                      {prop.advertisingPermitNumber}
                    </span>
                  </button>
                </td>

                <td className="py-3.5 px-4">
                  <span
                    className={`px-2 py-0.5 text-[10px] font-semibold uppercase ${
                      prop.workflowStatus === 'PUBLISHED'
                        ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/60'
                        : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {prop.workflowStatus || 'PUBLISHED'}
                  </span>
                </td>

                <td className="py-3.5 px-4 text-right space-x-2">
                  {/* Toggle publish button */}
                  <button
                    onClick={() => handleTogglePublish(prop.id, prop.workflowStatus || 'PUBLISHED')}
                    className="p-1 text-[#8C867E] hover:text-[#B79A62] transition-colors"
                    title={prop.workflowStatus === 'PUBLISHED' ? 'Unpublish to Draft' : 'Publish to Live'}
                  >
                    {prop.workflowStatus === 'PUBLISHED' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>

                  {/* Public link */}
                  <Link
                    href={`/properties/${prop.slug}`}
                    target="_blank"
                    className="p-1 text-[#8C867E] hover:text-[#B79A62] transition-colors inline-block"
                    title="View live residence page"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>

                  {/* Delete button */}
                  <button
                    onClick={() => handleDeleteProperty(prop.id)}
                    className="p-1 text-[#8C867E] hover:text-red-400 transition-colors"
                    title="Delete listing"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ADD PROPERTY MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-xl bg-[#171715] border border-[#25221E] p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#22201C]">
              <h2 className="font-editorial text-2xl text-[#F5F2EB]">Create Marketplace Property Listing</h2>
              <button onClick={() => setShowAddModal(false)} className="text-[#8C867E] hover:text-[#F5F2EB]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProperty} className="space-y-4 text-xs">
              <div>
                <label className="text-[10px] uppercase tracking-wider text-[#8C867E] block mb-1">
                  Property Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. The Sky Penthouse at Canal Crown"
                  className="w-full bg-[#0A0A09] border border-[#25221E] px-3.5 py-2.5 text-[#F5F2EB] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-[#8C867E] block mb-1">
                    Listing Purpose
                  </label>
                  <select
                    value={newPurpose}
                    onChange={(e) => setNewPurpose(e.target.value as any)}
                    className="w-full bg-[#0A0A09] border border-[#25221E] px-3 py-2 text-[#F5F2EB] outline-none"
                  >
                    <option value="FOR_SALE">For Sale</option>
                    <option value="FOR_RENT">For Rent</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-[#8C867E] block mb-1">
                    Property Type
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    className="w-full bg-[#0A0A09] border border-[#25221E] px-3 py-2 text-[#F5F2EB] outline-none"
                  >
                    <option value="Penthouse">Sky Penthouse</option>
                    <option value="Villa">Signature Villa</option>
                    <option value="Apartment">Luxury Apartment</option>
                    <option value="Duplex">Duplex</option>
                    <option value="Mansion">Mansion</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-[#8C867E] block mb-1">
                    Community
                  </label>
                  <select
                    value={newCommunity}
                    onChange={(e) => setNewCommunity(e.target.value)}
                    className="w-full bg-[#0A0A09] border border-[#25221E] px-3 py-2 text-[#F5F2EB] outline-none"
                  >
                    <option value="Business Bay">Business Bay</option>
                    <option value="Dubailand">Dubailand</option>
                    <option value="Dubai Water Canal">Dubai Water Canal</option>
                    <option value="Palm Jumeirah">Palm Jumeirah</option>
                    <option value="Downtown Dubai">Downtown Dubai</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-[#8C867E] block mb-1">
                    Building / Sub-community
                  </label>
                  <input
                    type="text"
                    value={newSubCommunity}
                    onChange={(e) => setNewSubCommunity(e.target.value)}
                    placeholder="e.g. Living Legends Villa"
                    className="w-full bg-[#0A0A09] border border-[#25221E] px-3 py-2 text-[#F5F2EB] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-[#8C867E] block mb-1">
                    Price (AED) *
                  </label>
                  <input
                    type="number"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    placeholder="7500000"
                    className="w-full bg-[#0A0A09] border border-[#25221E] px-3 py-2 text-[#F5F2EB] outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-[#8C867E] block mb-1">
                    Area (Sq.Ft) *
                  </label>
                  <input
                    type="number"
                    required
                    value={newArea}
                    onChange={(e) => setNewArea(e.target.value)}
                    placeholder="3450"
                    className="w-full bg-[#0A0A09] border border-[#25221E] px-3 py-2 text-[#F5F2EB] outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-[#8C867E] block mb-1">
                    Bedrooms
                  </label>
                  <select
                    value={newBeds}
                    onChange={(e) => setNewBeds(e.target.value)}
                    className="w-full bg-[#0A0A09] border border-[#25221E] px-3 py-2 text-[#F5F2EB] outline-none"
                  >
                    <option value="1">1 Bed</option>
                    <option value="2">2 Beds</option>
                    <option value="3">3 Beds</option>
                    <option value="4">4 Beds</option>
                    <option value="5">5+ Beds</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-[#8C867E] block mb-1">
                    Assign Listing Broker
                  </label>
                  <select
                    value={newAgent}
                    onChange={(e) => setNewAgent(e.target.value)}
                    className="w-full bg-[#0A0A09] border border-[#25221E] px-3 py-2 text-[#F5F2EB] outline-none"
                  >
                    <option value="">Select Advisor</option>
                    {agents.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name} ({a.brn})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-[#8C867E] block mb-1">
                    DLD Permit Number
                  </label>
                  <input
                    type="text"
                    value={newPermit}
                    onChange={(e) => setNewPermit(e.target.value)}
                    placeholder="DLD-PERMIT-2026-XXXX"
                    className="w-full bg-[#0A0A09] border border-[#25221E] px-3 py-2 text-[#F5F2EB] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-[#8C867E] block mb-1">
                  High-Resolution Image URL
                </label>
                <input
                  type="url"
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full bg-[#0A0A09] border border-[#25221E] px-3 py-2 text-[#F5F2EB] outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-[#8C867E] block mb-1">
                  Description & Narrative
                </label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Architectural highlights, panoramic skyline vistas, finishes..."
                  className="w-full bg-[#0A0A09] border border-[#25221E] p-2.5 text-[#F5F2EB] outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full py-3.5 bg-[#B79A62] text-[#0A0A09] text-xs font-semibold uppercase tracking-[0.2em] hover:bg-[#D8BE8A] transition-colors disabled:opacity-50"
              >
                {saving ? 'Publishing Asset...' : 'Publish Property to Live Marketplace'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
