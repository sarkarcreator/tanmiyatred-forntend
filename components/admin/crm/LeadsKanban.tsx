'use client';

import React, { useState } from 'react';
import { LeadItem, AgentItem, CustomerType, LeadPriority, LeadStage } from '@/types';
import {
  Inbox,
  Search,
  Filter,
  Plus,
  Download,
  Phone,
  MessageCircle,
  Mail,
  ChevronRight,
  User,
  Calendar,
  DollarSign,
  MapPin,
  Clock,
  X,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Columns,
  List,
} from 'lucide-react';

interface Props {
  initialLeads: LeadItem[];
  agents: AgentItem[];
}

const STAGES: { id: LeadStage; label: string; color: string }[] = [
  { id: 'NEW', label: 'New Inquiries', color: 'border-amber-500/60 text-amber-300' },
  { id: 'CONTACTED', label: 'Contacted', color: 'border-blue-500/60 text-blue-300' },
  { id: 'QUALIFIED', label: 'Qualified', color: 'border-purple-500/60 text-purple-300' },
  { id: 'VIEWING_BOOKED', label: 'Viewing Booked', color: 'border-[#B79A62] text-[#D8BE8A]' },
  { id: 'VIEWING_COMPLETED', label: 'Viewing Done', color: 'border-cyan-500/60 text-cyan-300' },
  { id: 'OFFER_SUBMITTED', label: 'Offer Received', color: 'border-emerald-500/60 text-emerald-300' },
  { id: 'UNDER_NEGOTIATION', label: 'Negotiation', color: 'border-orange-500/60 text-orange-300' },
  { id: 'WON', label: 'Closed Won', color: 'border-green-500/60 text-green-300' },
  { id: 'LOST', label: 'Closed Lost', color: 'border-zinc-700 text-zinc-500' },
];

export const LeadsKanban: React.FC<Props> = ({ initialLeads, agents }) => {
  const [leads, setLeads] = useState<LeadItem[]>(initialLeads);
  const [viewMode, setViewMode] = useState<'KANBAN' | 'TABLE'>('KANBAN');
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [agentFilter, setAgentFilter] = useState<string>('ALL');

  const [selectedLead, setSelectedLead] = useState<LeadItem | null>(null);
  const [newNoteText, setNewNoteText] = useState('');

  const [showAddModal, setShowAddModal] = useState(false);
  const [newLeadName, setNewLeadName] = useState('');
  const [newLeadPhone, setNewLeadPhone] = useState('');
  const [newLeadEmail, setNewLeadEmail] = useState('');
  const [newLeadType, setNewLeadType] = useState<CustomerType>('BUYER');
  const [newLeadPriority, setNewLeadPriority] = useState<LeadPriority>('HIGH');
  const [newLeadBudget, setNewLeadBudget] = useState('');
  const [newLeadLocation, setNewLeadLocation] = useState('Business Bay');
  const [newLeadAgent, setNewLeadAgent] = useState('');
  const [newLeadNotes, setNewLeadNotes] = useState('');
  const [savingLead, setSavingLead] = useState(false);

  const filteredLeads = leads.filter((lead) => {
    if (typeFilter !== 'ALL' && lead.customerType !== typeFilter) return false;
    if (priorityFilter !== 'ALL' && lead.priority !== priorityFilter) return false;
    if (agentFilter !== 'ALL' && lead.agentId !== agentFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = lead.customerName.toLowerCase().includes(q);
      const matchPhone = lead.customerPhone.toLowerCase().includes(q);
      const matchEmail = (lead.customerEmail || '').toLowerCase().includes(q);
      const matchProperty = (lead.propertyTitle || '').toLowerCase().includes(q);
      if (!matchName && !matchPhone && !matchEmail && !matchProperty) return false;
    }
    return true;
  });

  const handleStageChange = async (leadId: string, newStage: LeadStage) => {
    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage: newStage, newNote: `Stage moved to ${newStage}` }),
      });
      if (res.ok) {
        setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, stage: newStage, updatedAt: new Date().toISOString() } : l)));
        if (selectedLead && selectedLead.id === leadId) setSelectedLead((prev) => (prev ? { ...prev, stage: newStage } : null));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddNote = async () => {
    if (!selectedLead || !newNoteText.trim()) return;
    try {
      const res = await fetch(`/api/leads/${selectedLead.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newNote: newNoteText.trim() }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          setLeads((prev) => prev.map((l) => (l.id === selectedLead.id ? json.data : l)));
          setSelectedLead(json.data);
          setNewNoteText('');
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAssignAgent = async (agentId: string) => {
    if (!selectedLead) return;
    const targetAgent = agents.find((a) => a.id === agentId);
    try {
      const res = await fetch(`/api/leads/${selectedLead.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId, newNote: `Reassigned to advisor ${targetAgent?.name || agentId}` }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          setLeads((prev) => prev.map((l) => (l.id === selectedLead.id ? json.data : l)));
          setSelectedLead(json.data);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadName || !newLeadPhone) return;
    setSavingLead(true);
    try {
      const numericBudget = Number(newLeadBudget.replace(/[^0-9.]/g, '')) || 0;
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: newLeadName,
          customerPhone: newLeadPhone,
          customerEmail: newLeadEmail,
          customerType: newLeadType,
          priority: newLeadPriority,
          budgetMax: numericBudget,
          preferredLocation: newLeadLocation,
          agentId: newLeadAgent || agents[0]?.id,
          source: 'CRM_DIRECT_INTAKE',
          notes: newLeadNotes,
          initialNote: `Lead created manually via CRM. Notes: ${newLeadNotes || 'None'}`,
        }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          setLeads((prev) => [json.data, ...prev]);
          setShowAddModal(false);
          setNewLeadName('');
          setNewLeadPhone('');
          setNewLeadEmail('');
          setNewLeadBudget('');
          setNewLeadNotes('');
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingLead(false);
    }
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Date', 'Name', 'Phone', 'Email', 'Type', 'Stage', 'Priority', 'Budget', 'Property', 'Agent'];
    const rows = filteredLeads.map((l) => [l.id, new Date(l.createdAt).toISOString(), `"${l.customerName.replace(/"/g, '""')}"`, `"${l.customerPhone}"`, l.customerEmail || '', l.customerType, l.stage, l.priority, l.budgetMax || 0, `"${(l.propertyTitle || '').replace(/"/g, '""')}"`, `"${l.agent?.name || l.agentId || 'Unassigned'}"`]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `tanmiyat_crm_leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* TOP CONTROLS & STATS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-editorial text-3xl text-[#F5F2EB]">CRM Leads & Deal Pipeline</h1>
            <span className="px-2.5 py-0.5 bg-[#B79A62]/10 border border-[#B79A62]/30 text-[#B79A62] text-xs font-semibold">{filteredLeads.length} Active Leads</span>
          </div>
          <p className="text-xs text-[#8C867E]">End-to-end investor intake, viewing bookings, negotiations, and closing stages.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#171715] border border-[#25221E] p-1">
            <button onClick={() => setViewMode('KANBAN')} className={`p-1.5 text-xs transition-colors ${viewMode === 'KANBAN' ? 'bg-[#B79A62] text-[#0A0A09]' : 'text-[#8C867E] hover:text-[#F5F2EB]'}`} title="Kanban Board View"><Columns className="w-4 h-4" /></button>
            <button onClick={() => setViewMode('TABLE')} className={`p-1.5 text-xs transition-colors ${viewMode === 'TABLE' ? 'bg-[#B79A62] text-[#0A0A09]' : 'text-[#8C867E] hover:text-[#F5F2EB]'}`} title="Table View"><List className="w-4 h-4" /></button>
          </div>
          <button onClick={handleExportCSV} className="px-3 py-2 bg-[#171715] border border-[#25221E] text-xs uppercase tracking-wider text-[#A8A196] hover:text-[#F5F2EB] flex items-center gap-1.5"><Download className="w-3.5 h-3.5" /><span className="hidden sm:inline">Export</span></button>
          <button onClick={() => setShowAddModal(true)} className="px-4 py-2 bg-[#B79A62] hover:bg-[#D8BE8A] text-[#0A0A09] text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors"><Plus className="w-4 h-4" /><span>Add Lead</span></button>
        </div>
      </div>
      <div className="bg-[#171715] border border-[#25221E] p-4 flex flex-col sm:flex-row items-center gap-3 text-xs">
        <div className="relative w-full sm:w-72"><Search className="w-4 h-4 text-[#8C867E] absolute left-3 top-1/2 -translate-y-1/2" /><input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search lead name, phone, email, project..." className="w-full bg-[#0A0A09] border border-[#25221E] focus:border-[#B79A62] pl-9 pr-3 py-2 text-[#F5F2EB] outline-none" /></div>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="w-full sm:w-auto bg-[#0A0A09] border border-[#25221E] px-3 py-2 text-[#C8C0B3] outline-none"><option value="ALL">All Client Types</option><option value="BUYER">Buyers</option><option value="TENANT">Tenants</option><option value="SELLER">Sellers</option><option value="LANDLORD">Landlords</option><option value="INVESTOR">Institutional Investors</option></select>
        <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className="w-full sm:w-auto bg-[#0A0A09] border border-[#25221E] px-3 py-2 text-[#C8C0B3] outline-none"><option value="ALL">All Priorities</option><option value="VIP">Urgent (VIP)</option><option value="HIGH">High</option><option value="MEDIUM">Medium</option><option value="LOW">Low</option></select>
        <select value={agentFilter} onChange={(e) => setAgentFilter(e.target.value)} className="w-full sm:w-auto bg-[#0A0A09] border border-[#25221E] px-3 py-2 text-[#C8C0B3] outline-none"><option value="ALL">All Advisors</option>{agents.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}</select>
      </div>
      {viewMode === 'KANBAN' ? (
        <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-thin">
          {STAGES.map((stage) => {
            const stageLeads = filteredLeads.filter((l) => l.stage === stage.id);
            const totalStageValue = stageLeads.reduce((acc, cur) => acc + (cur.budgetMax || 0), 0);
            return (
              <div key={stage.id} className="w-72 sm:w-80 shrink-0 bg-[#121210] border border-[#25221E] flex flex-col max-h-[750px]">
                <div className="p-3.5 border-b border-[#25221E] bg-[#171715] flex items-center justify-between"><div><div className="flex items-center gap-2"><span className={`w-2 h-2 rounded-full border ${stage.color} bg-current`} /><h3 className="font-medium text-xs text-[#F5F2EB] uppercase tracking-wider">{stage.label}</h3></div>{totalStageValue > 0 && <span className="text-[10px] text-[#7A756D] block mt-0.5">AED {(totalStageValue / 1000000).toFixed(1)}M pool</span>}</div><span className="px-2 py-0.5 bg-[#0A0A09] text-[10px] font-bold text-[#B79A62]">{stageLeads.length}</span></div>
                <div className="p-3 space-y-3 overflow-y-auto flex-1 scrollbar-thin">
                  {stageLeads.length === 0 ? <div className="text-center py-8 text-[11px] text-[#5A5650] border border-dashed border-[#22201C]">No leads in this stage</div> : stageLeads.map((lead) => {
                    const priorityColor = lead.priority === 'VIP' ? 'bg-red-950/60 text-red-400 border-red-800' : lead.priority === 'HIGH' ? 'bg-amber-950/60 text-amber-300 border-amber-800' : 'bg-[#25221E] text-[#8C867E] border-[#3A3731]';
                    return <div key={lead.id} onClick={() => setSelectedLead(lead)} className="group p-4 bg-[#171715] border border-[#25221E] hover:border-[#B79A62]/50 transition-all cursor-pointer space-y-2.5 shadow-sm"><div className="flex items-start justify-between gap-2"><span className="font-medium text-xs text-[#F5F2EB] group-hover:text-[#B79A62] transition-colors">{lead.customerName}</span><span className={`text-[9px] uppercase tracking-wider px-1.5 py-0.5 border font-semibold shrink-0 ${priorityColor}`}>{lead.priority}</span></div>{lead.propertyTitle && <p className="text-[11px] text-[#C8C0B3] line-clamp-1 font-light">{lead.propertyTitle}</p>}<div className="flex items-center justify-between text-[10px] text-[#8C867E]"><span>{lead.customerType}</span>{lead.budgetMax ? <span className="font-editorial text-[#D8BE8A] text-xs">AED {lead.budgetMax.toLocaleString()}</span> : null}</div><div className="pt-2 border-t border-[#22201C] flex items-center justify-between text-[10px]"><span className="text-[#5A5650] truncate max-w-[120px]">{lead.agent?.name || 'Advisor unassigned'}</span><select value={lead.stage} onClick={(e) => e.stopPropagation()} onChange={(e) => handleStageChange(lead.id, e.target.value as LeadStage)} className="bg-[#0A0A09] border border-[#2D2A26] px-1.5 py-0.5 text-[10px] text-[#A8A196]">{STAGES.map((s) => <option key={s.id} value={s.id}>Move: {s.label}</option>)}</select></div></div>;
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-[#171715] border border-[#25221E] overflow-x-auto"><table className="w-full text-left text-xs"><thead className="bg-[#0A0A09] text-[#7A756D] uppercase tracking-wider"><tr><th className="py-3.5 px-4">Lead / Client</th><th className="py-3.5 px-4">Contact</th><th className="py-3.5 px-4">Type</th><th className="py-3.5 px-4">Property / Location</th><th className="py-3.5 px-4">Budget (AED)</th><th className="py-3.5 px-4">Priority</th><th className="py-3.5 px-4">Stage</th><th className="py-3.5 px-4 text-right">Assigned Advisor</th></tr></thead><tbody className="divide-y divide-[#22201C] text-[#C8C0B3]">{filteredLeads.map((lead) => <tr key={lead.id} onClick={() => setSelectedLead(lead)} className="hover:bg-[#1E1C18] cursor-pointer"><td className="py-3 px-4 font-medium text-[#F5F2EB]"><div>{lead.customerName}</div><div className="text-[10px] text-[#7A756D] font-mono">{new Date(lead.createdAt).toLocaleDateString()}</div></td><td className="py-3 px-4"><div>{lead.customerPhone}</div><div className="text-[10px] text-[#7A756D]">{lead.customerEmail || '—'}</div></td><td className="py-3 px-4"><span className="text-[10px] uppercase font-semibold text-[#B79A62]">{lead.customerType}</span></td><td className="py-3 px-4"><div>{lead.propertyTitle || 'General Portfolio'}</div><div className="text-[10px] text-[#7A756D]">{lead.preferredLocation || 'Dubai'}</div></td><td className="py-3 px-4 font-editorial text-sm text-[#F5F2EB]">{lead.budgetMax ? `AED ${lead.budgetMax.toLocaleString()}` : '—'}</td><td className="py-3 px-4"><span className={`px-2 py-0.5 text-[9px] uppercase font-bold border ${lead.priority === 'VIP' ? 'bg-red-950/60 text-red-300 border-red-800' : lead.priority === 'HIGH' ? 'bg-amber-950/60 text-amber-300 border-amber-800' : 'bg-[#0A0A09] text-[#8C867E] border-[#25221E]'}`}>{lead.priority}</span></td><td className="py-3 px-4"><select value={lead.stage} onClick={(e) => e.stopPropagation()} onChange={(e) => handleStageChange(lead.id, e.target.value as LeadStage)} className="bg-[#0A0A09] border border-[#2D2A26] px-2 py-1 text-[11px] text-[#F5F2EB]">{STAGES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}</select></td><td className="py-3 px-4 text-right"><span className="text-[#A8A196]">{lead.agent?.name || 'Unassigned'}</span></td></tr>)}</tbody></table></div>
      )}

      {selectedLead && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50" onClick={() => setSelectedLead(null)}>
          <div className="w-full max-w-xl h-full bg-[#121210] border-l border-[#25221E] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6"><h2 className="font-editorial text-2xl text-[#F5F2EB]">Lead Details</h2><button onClick={() => setSelectedLead(null)} className="p-2 text-[#8C867E] hover:text-[#F5F2EB]"><X className="w-5 h-5" /></button></div>
            <div className="space-y-5">
              <div><div className="text-xs uppercase tracking-wider text-[#7A756D] mb-1">Client</div><div className="text-lg text-[#F5F2EB]">{selectedLead.customerName}</div></div>
              <div className="grid grid-cols-2 gap-4"><div><div className="text-[10px] uppercase text-[#7A756D]">Phone</div><div className="text-sm text-[#C8C0B3]">{selectedLead.customerPhone}</div></div><div><div className="text-[10px] uppercase text-[#7A756D]">Email</div><div className="text-sm text-[#C8C0B3]">{selectedLead.customerEmail || '—'}</div></div></div>
              <div className="grid grid-cols-2 gap-4"><div><div className="text-[10px] uppercase text-[#7A756D]">Type</div><div className="text-sm text-[#C8C0B3]">{selectedLead.customerType}</div></div><div><div className="text-[10px] uppercase text-[#7A756D]">Priority</div><div className="text-sm text-[#C8C0B3]">{selectedLead.priority}</div></div></div>
              <div><div className="text-[10px] uppercase text-[#7A756D]">Property</div><div className="text-sm text-[#C8C0B3]">{selectedLead.propertyTitle || 'General Portfolio'}</div></div>
              <div><div className="text-[10px] uppercase text-[#7A756D]">Budget</div><div className="text-sm text-[#C8C0B3]">{selectedLead.budgetMax ? `AED ${selectedLead.budgetMax.toLocaleString()}` : '—'}</div></div>
              <div><div className="text-[10px] uppercase text-[#7A756D] mb-2">Stage</div><select value={selectedLead.stage} onChange={(e) => handleStageChange(selectedLead.id, e.target.value as LeadStage)} className="w-full bg-[#0A0A09] border border-[#25221E] px-3 py-2 text-sm text-[#F5F2EB]">{STAGES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}</select></div>
              <div><div className="text-[10px] uppercase text-[#7A756D] mb-2">Advisor</div><select value={selectedLead.agentId || ''} onChange={(e) => handleAssignAgent(e.target.value)} className="w-full bg-[#0A0A09] border border-[#25221E] px-3 py-2 text-sm text-[#F5F2EB]"><option value="">Unassigned</option>{agents.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}</select></div>
              <div><div className="text-[10px] uppercase text-[#7A756D] mb-2">Add Note</div><textarea value={newNoteText} onChange={(e) => setNewNoteText(e.target.value)} rows={4} className="w-full bg-[#0A0A09] border border-[#25221E] px-3 py-2 text-sm text-[#F5F2EB]" placeholder="Add a note..." /><button onClick={handleAddNote} className="mt-2 px-4 py-2 bg-[#B79A62] text-[#0A0A09] text-xs font-semibold">Save Note</button></div>
              <div><div className="text-[10px] uppercase text-[#7A756D] mb-2">Notes</div><div className="space-y-2">{selectedLead.notes?.length ? selectedLead.notes.map((note) => <div key={note.id} className="bg-[#171715] border border-[#25221E] p-3"><div className="text-xs text-[#C8C0B3]">{note.content}</div><div className="text-[10px] text-[#5A5650] mt-1">{new Date(note.createdAt).toLocaleString()}</div></div>) : <div className="text-xs text-[#5A5650]">No notes yet.</div>}</div></div>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setShowAddModal(false)}>
          <form onSubmit={handleCreateLead} onClick={(e) => e.stopPropagation()} className="w-full max-w-2xl bg-[#121210] border border-[#25221E] p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between"><h2 className="font-editorial text-2xl text-[#F5F2EB]">Add New Lead</h2><button type="button" onClick={() => setShowAddModal(false)} className="p-2 text-[#8C867E] hover:text-[#F5F2EB]"><X className="w-5 h-5" /></button></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input required value={newLeadName} onChange={(e) => setNewLeadName(e.target.value)} placeholder="Client Name" className="bg-[#0A0A09] border border-[#25221E] px-3 py-2 text-sm text-[#F5F2EB]" />
              <input required value={newLeadPhone} onChange={(e) => setNewLeadPhone(e.target.value)} placeholder="Phone" className="bg-[#0A0A09] border border-[#25221E] px-3 py-2 text-sm text-[#F5F2EB]" />
              <input value={newLeadEmail} onChange={(e) => setNewLeadEmail(e.target.value)} placeholder="Email" className="bg-[#0A0A09] border border-[#25221E] px-3 py-2 text-sm text-[#F5F2EB]" />
              <select value={newLeadType} onChange={(e) => setNewLeadType(e.target.value as CustomerType)} className="bg-[#0A0A09] border border-[#25221E] px-3 py-2 text-sm text-[#F5F2EB]"><option value="BUYER">Buyer</option><option value="TENANT">Tenant</option><option value="SELLER">Seller</option><option value="LANDLORD">Landlord</option><option value="INVESTOR">Investor</option></select>
              <select value={newLeadPriority} onChange={(e) => setNewLeadPriority(e.target.value as LeadPriority)} className="bg-[#0A0A09] border border-[#25221E] px-3 py-2 text-sm text-[#F5F2EB]"><option value="VIP">VIP</option><option value="HIGH">High</option><option value="MEDIUM">Medium</option><option value="LOW">Low</option></select>
              <input value={newLeadBudget} onChange={(e) => setNewLeadBudget(e.target.value)} placeholder="Budget (AED)" className="bg-[#0A0A09] border border-[#25221E] px-3 py-2 text-sm text-[#F5F2EB]" />
              <input value={newLeadLocation} onChange={(e) => setNewLeadLocation(e.target.value)} placeholder="Preferred Location" className="bg-[#0A0A09] border border-[#25221E] px-3 py-2 text-sm text-[#F5F2EB]" />
              <select value={newLeadAgent} onChange={(e) => setNewLeadAgent(e.target.value)} className="bg-[#0A0A09] border border-[#25221E] px-3 py-2 text-sm text-[#F5F2EB]"><option value="">Auto-assign first advisor</option>{agents.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}</select>
            </div>
            <textarea value={newLeadNotes} onChange={(e) => setNewLeadNotes(e.target.value)} rows={4} placeholder="Notes" className="w-full bg-[#0A0A09] border border-[#25221E] px-3 py-2 text-sm text-[#F5F2EB]" />
            <div className="flex justify-end gap-2"><button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 border border-[#25221E] text-xs text-[#A8A196]">Cancel</button><button type="submit" disabled={savingLead} className="px-4 py-2 bg-[#B79A62] text-[#0A0A09] text-xs font-semibold">{savingLead ? 'Saving...' : 'Create Lead'}</button></div>
          </form>
        </div>
      )}
    </div>
  );
};
