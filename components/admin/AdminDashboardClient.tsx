'use client';

import React, { useEffect, useState } from 'react';
import {
  ProjectItem, InquiryItem, TimelineItem, NewsItem, PropertyItem, LeadItem, AgentItem,
  ViewingItem, OfferItem, DealItem, CommissionItem,
} from '@/types';
import { TanmiyatLogo } from '@/components/brand/TanmiyatLogo';
import { DashboardStats } from '@/components/admin/DashboardStats';
import { LeadsKanban } from '@/components/admin/crm/LeadsKanban';
import { PropertiesManager } from '@/components/admin/crm/PropertiesManager';
import { AgentsManager } from '@/components/admin/crm/AgentsManager';
import { ViewingsManager } from '@/components/admin/crm/ViewingsManager';
import { OffersManager } from '@/components/admin/crm/OffersManager';
import { DealsManager } from '@/components/admin/crm/DealsManager';
import { CommissionsManager } from '@/components/admin/crm/CommissionsManager';
import {
  LayoutDashboard, Building, Layers, Inbox, Clock, Newspaper, Users, ExternalLink,
  Shield, LogOut, Calendar, FileCheck, Handshake, Coins,
} from 'lucide-react';

interface AdminDashboardClientProps {
  initialProjects: ProjectItem[]; initialInquiries: InquiryItem[]; initialTimeline: TimelineItem[];
  initialNews: NewsItem[]; initialProperties?: PropertyItem[]; initialLeads?: LeadItem[];
  initialAgents?: AgentItem[]; initialViewings?: ViewingItem[]; initialOffers?: OfferItem[];
  initialDeals?: DealItem[]; initialCommissions?: CommissionItem[];
}

export type AdminTab = 'OVERVIEW' | 'LEADS_CRM' | 'PROPERTIES' | 'AGENTS' | 'VIEWINGS' | 'OFFERS' | 'DEALS' | 'COMMISSIONS' | 'DEVELOPMENTS' | 'UNITS' | 'TIMELINE' | 'NEWS' | 'USERS';

const readJson = async (res: Response): Promise<{ success?: boolean; data?: unknown; error?: string }> => {
  const text = await res.text();
  if (!text.trim()) return { success: false, error: `Empty response from server (HTTP ${res.status}).` };
  try { return JSON.parse(text); }
  catch { return { success: false, error: `Invalid server response (HTTP ${res.status}).` }; }
};

export const AdminDashboardClient: React.FC<AdminDashboardClientProps> = ({
  initialProjects, initialInquiries, initialTimeline, initialNews, initialProperties = [],
  initialLeads = [], initialAgents = [], initialViewings = [], initialOffers = [],
  initialDeals = [], initialCommissions = [],
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState<AdminTab>('OVERVIEW');
  const [projects, setProjects] = useState<ProjectItem[]>(initialProjects);
  const [inquiries, setInquiries] = useState<InquiryItem[]>(initialInquiries);
  const [timeline, setTimeline] = useState<TimelineItem[]>(initialTimeline);
  const [news, setNews] = useState<NewsItem[]>(initialNews);
  const [properties, setProperties] = useState<PropertyItem[]>(initialProperties);
  const [leads, setLeads] = useState<LeadItem[]>(initialLeads);
  const [agents, setAgents] = useState<AgentItem[]>(initialAgents);
  const [viewings, setViewings] = useState<ViewingItem[]>(initialViewings);
  const [offers, setOffers] = useState<OfferItem[]>(initialOffers);
  const [deals, setDeals] = useState<DealItem[]>(initialDeals);
  const [commissions, setCommissions] = useState<CommissionItem[]>(initialCommissions);
  const allUnits = projects.flatMap((p) => (p.units || []).map((u) => ({ ...u, projectName: p.title })));

  const loadAdminData = async () => {
    const endpoints = [
      ['projects', '/api/projects'], ['inquiries', '/api/inquiries'], ['timeline', '/api/timeline'],
      ['news', '/api/news'], ['properties', '/api/properties?limit=24'], ['leads', '/api/leads'],
      ['agents', '/api/agents'], ['viewings', '/api/viewings'], ['offers', '/api/offers'],
      ['deals', '/api/deals'], ['commissions', '/api/commissions'],
    ] as const;
    const results = await Promise.allSettled(endpoints.map(async ([, url]) => {
      const res = await fetch(url, { cache: 'no-store', credentials: 'include' });
      const json = await readJson(res);
      if (!res.ok || !json.success) throw new Error(json.error || `Failed to load CRM data (HTTP ${res.status}).`);
      return json.data;
    }));
    const data = Object.fromEntries(results.map((r, i) => [endpoints[i][0], r.status === 'fulfilled' ? r.value : []]));
    setProjects(data.projects || []); setInquiries(data.inquiries || []); setTimeline(data.timeline || []);
    setNews(data.news || []); setProperties(data.properties || []); setLeads(data.leads || []);
    setAgents(data.agents || []); setViewings(data.viewings || []); setOffers(data.offers || []);
    setDeals(data.deals || []); setCommissions(data.commissions || []);
  };

  useEffect(() => {
    let active = true;
    fetch('/api/auth/me', { cache: 'no-store', credentials: 'include' })
      .then(async (res) => {
        if (!active) return;
        const json = await readJson(res);
        if (res.ok && json.success) {
          setIsAuthenticated(true);
          await loadAdminData();
        }
      })
      .catch(() => {})
      .finally(() => { if (active) setAuthChecking(false); });
    return () => { active = false; };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setAuthError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        credentials: 'include', cache: 'no-store',
        body: JSON.stringify({ email: authEmail.trim(), password: authPassword }),
      });
      const json = await readJson(res);
      if (!res.ok || !json.success) throw new Error(json.error || `Authentication failed (HTTP ${res.status}).`);
      setIsAuthenticated(true); setAuthPassword(''); await loadAdminData();
    } catch (err) { setAuthError(err instanceof Error ? err.message : 'Authentication failed.'); }
  };

  const handleLogout = async () => {
    try { await fetch('/api/auth/logout', { method: 'POST', credentials: 'include', cache: 'no-store' }); }
    finally { setIsAuthenticated(false); setAuthPassword(''); setAuthError(''); }
  };

  const handleUpdateInquiryStatus = async (id: string, newStatus: 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'CONVERTED' | 'CLOSED') => {
    try {
      const res = await fetch(`/api/inquiries/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ status: newStatus }) });
      if (res.ok) setInquiries((prev) => prev.map((inq) => inq.id === id ? { ...inq, status: newStatus } : inq));
    } catch (err) { console.error(err); }
  };

  const handleExportInquiriesCSV = () => {
    const headers = ['ID', 'Date', 'Name', 'Email', 'Phone', 'Project', 'Status', 'Message'];
    const rows = inquiries.map((i) => [i.id, new Date(i.createdAt).toISOString(), `\"${i.name.replace(/\"/g, '\"\"')}\"`, i.email, `\"${i.phone}\"`, `\"${i.interestedProject || 'General'}\"`, i.status, `\"${(i.message || '').replace(/\"/g, '\"\"')}\"`]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const link = document.createElement('a'); link.setAttribute('href', encodeURI(csvContent)); link.setAttribute('download', `tanmiyat_leads_${new Date().toISOString().slice(0, 10)}.csv`); document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };

  if (authChecking) return <div className="min-h-screen bg-[#0A0A09] flex items-center justify-center p-6 text-[#B79A62] text-xs uppercase tracking-[0.2em]">Restoring secure session…</div>;

  if (!isAuthenticated) return (
    <div className="min-h-screen bg-[#0A0A09] flex items-center justify-center p-4"><div className="w-full max-w-md bg-[#171715] border border-[#25221E] p-8 sm:p-10 space-y-6">
      <div className="text-center space-y-4"><TanmiyatLogo variant="gold" size="md" /><div className="pt-2"><span className="text-xs uppercase tracking-[0.25em] text-[#B79A62] font-semibold">Executive Management & CRM Portal</span><p className="text-xs text-[#8C867E] mt-1">Authorized Personnel Only • RERA, DLD & Corporate Compliance</p></div></div>
      {authError && <div className="p-3 bg-red-950/50 border border-red-800 text-red-200 text-xs">{authError}</div>}
      <form onSubmit={handleLogin} className="space-y-4"><div><label className="block text-xs uppercase tracking-wider text-[#C8C0B3] mb-1">Executive Email</label><input type="email" required value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} className="w-full bg-[#0A0A09] border border-[#2D2A26] px-3.5 py-2.5 text-sm text-[#F5F2EB] focus:outline-none focus:border-[#B79A62]" /></div><div><label className="block text-xs uppercase tracking-wider text-[#C8C0B3] mb-1">Security Passcode</label><input type="password" required value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} className="w-full bg-[#0A0A09] border border-[#2D2A26] px-3.5 py-2.5 text-sm text-[#F5F2EB] focus:outline-none focus:border-[#B79A62]" /></div><button type="submit" className="w-full py-3.5 bg-[#B79A62] text-[#0A0A09] text-xs font-semibold uppercase tracking-[0.2em] hover:bg-[#D8BE8A] transition-colors cursor-pointer">AUTHENTICATE SESSION</button></form>
    </div></div>
  );

  const navGroups = [
    { group: 'MARKETPLACE & CRM', items: [
      { id: 'OVERVIEW' as AdminTab, label: 'Overview', icon: LayoutDashboard },
      { id: 'LEADS_CRM' as AdminTab, label: 'CRM Leads & Pipeline', icon: Inbox, count: leads.length || inquiries.length },
      { id: 'PROPERTIES' as AdminTab, label: 'Listing Properties', icon: Building, count: properties.length },
      { id: 'AGENTS' as AdminTab, label: 'Agents & Advisors', icon: Users, count: agents.length },
      { id: 'VIEWINGS' as AdminTab, label: 'Private Viewings', icon: Calendar, count: viewings.filter((v) => v.status === 'CONFIRMED' || v.status === 'REQUESTED').length },
      { id: 'OFFERS' as AdminTab, label: 'Offers & Negotiations', icon: FileCheck, count: offers.filter((o) => o.status === 'SUBMITTED').length },
      { id: 'DEALS' as AdminTab, label: 'Deals & Conveyancing', icon: Handshake, count: deals.length },
      { id: 'COMMISSIONS' as AdminTab, label: 'Broker Commissions', icon: Coins },
    ]},
    { group: 'DEVELOPMENT & CMS', items: [
      { id: 'DEVELOPMENTS' as AdminTab, label: 'Master Projects', icon: Building },
      { id: 'UNITS' as AdminTab, label: 'Inventory Units', icon: Layers, count: allUnits.length },
      { id: 'TIMELINE' as AdminTab, label: 'Heritage Timeline', icon: Clock },
      { id: 'NEWS' as AdminTab, label: 'News & Insights', icon: Newspaper },
      { id: 'USERS' as AdminTab, label: 'Roles & Access', icon: Users },
    ]},
  ];

  return <div className="min-h-screen bg-[#0A0A09] text-[#F5F2EB] flex flex-col"><header className="bg-[#171715] border-b border-[#25221E] px-6 py-4 flex items-center justify-between sticky top-0 z-40"><div className="flex items-center gap-6"><TanmiyatLogo variant="gold" size="sm" showDescriptor={false} /><span className="hidden sm:inline-block text-xs uppercase tracking-widest text-[#8C867E] border-l border-[#2B2925] pl-6">Luxury Real Estate OS & CRM</span></div><div className="flex items-center gap-4"><div className="flex items-center gap-2 px-3 py-1 bg-[#0A0A09] border border-[#2D2A26] text-xs"><Shield className="w-3.5 h-3.5 text-[#B79A62]" /><span className="text-[#F5F2EB] font-medium">SUPER_ADMIN</span></div><a href="/" target="_blank" className="text-xs text-[#C8C0B3] hover:text-[#B79A62] flex items-center gap-1 transition-colors"><span>Live Site</span><ExternalLink className="w-3.5 h-3.5" /></a><button onClick={handleLogout} className="text-[#8C867E] hover:text-red-400 p-1 transition-colors cursor-pointer" title="Sign Out"><LogOut className="w-4 h-4" /></button></div></header><div className="flex-grow flex flex-col md:flex-row"><aside className="w-full md:w-64 bg-[#121210] border-r border-[#25221E] p-4 flex flex-col justify-between shrink-0"><div className="space-y-6">{navGroups.map((group, gIdx) => <div key={gIdx} className="space-y-1"><span className="px-3 text-[10px] uppercase tracking-[0.2em] text-[#7A756D] font-bold block mb-2">{group.group}</span>{group.items.map((tab) => { const Icon = tab.icon; const isActive = activeTab === tab.id; return <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs uppercase tracking-wider font-medium transition-all cursor-pointer ${isActive ? 'bg-[#B79A62] text-[#0A0A09] font-semibold' : 'text-[#C8C0B3] hover:bg-[#1A1816] hover:text-[#F5F2EB]'}`}><div className="flex items-center gap-3"><Icon className="w-4 h-4 shrink-0" /><span className="truncate">{tab.label}</span></div>{tab.count !== undefined && tab.count > 0 && <span className={`text-[10px] px-1.5 py-0.2 rounded shrink-0 ${isActive ? 'bg-[#0A0A09] text-[#B79A62] font-bold' : 'bg-[#25221E] text-[#C8C0B3]'}`}>{tab.count}</span>}</button>; })}</div>)}</div><div className="p-4 bg-[#0A0A09] border border-[#22201C] text-[11px] text-[#7A756D] space-y-1 mt-6"><p className="font-semibold text-[#B79A62]">Tanmiyat CRM Core</p><p>RERA Form A & B: Verified</p><p>DLD Escrow: Active</p></div></aside><main className="flex-grow p-6 sm:p-10 overflow-x-hidden max-w-7xl">
    {activeTab === 'OVERVIEW' && <div className="space-y-8"><div><h1 className="font-editorial text-3xl text-[#F5F2EB]">Executive Overview</h1><p className="text-xs text-[#8C867E]">Real-time portfolio metrics, CRM leads velocity, marketplace listings, and escrow pipeline.</p></div><DashboardStats totalProjects={projects.length} newInquiries={inquiries.filter((i) => i.status === 'NEW').length} totalInquiries={inquiries.length} activeUnits={allUnits.filter((u) => u.status === 'AVAILABLE').length} totalUnits={allUnits.length} activeLeads={leads.length || inquiries.length} activeListings={properties.length} upcomingViewings={viewings.filter((v) => v.status === 'REQUESTED' || v.status === 'CONFIRMED').length} activeOffers={offers.filter((o) => o.status === 'SUBMITTED').length} activeDeals={deals.filter((d) => d.status !== 'COMPLETED' && d.status !== 'CANCELLED').length} totalCommissions={commissions.reduce((sum, c) => sum + Number(c.amount || 0), 0)} /></div>}
    {activeTab === 'LEADS_CRM' && <LeadsKanban leads={leads} onUpdate={async (id, stage) => { const res = await fetch(`/api/leads/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ stage }) }); if (res.ok) setLeads((prev) => prev.map((l) => l.id === id ? { ...l, stage } : l)); }} />}
    {activeTab === 'PROPERTIES' && <PropertiesManager properties={properties} agents={agents} onRefresh={loadAdminData} />}
    {activeTab === 'AGENTS' && <AgentsManager agents={agents} onRefresh={loadAdminData} />}
    {activeTab === 'VIEWINGS' && <ViewingsManager viewings={viewings} properties={properties} agents={agents} onRefresh={loadAdminData} />}
    {activeTab === 'OFFERS' && <OffersManager offers={offers} properties={properties} agents={agents} onRefresh={loadAdminData} />}
    {activeTab === 'DEALS' && <DealsManager deals={deals} properties={properties} agents={agents} onRefresh={loadAdminData} />}
    {activeTab === 'COMMISSIONS' && <CommissionsManager commissions={commissions} agents={agents} onRefresh={loadAdminData} />}
    {activeTab === 'DEVELOPMENTS' && <div>Projects management</div>}
    {activeTab === 'UNITS' && <div>Inventory units</div>}
    {activeTab === 'TIMELINE' && <div>Timeline management</div>}
    {activeTab === 'NEWS' && <div>News management</div>}
    {activeTab === 'USERS' && <div>Roles & Access</div>}
    </main></div></div>;
};
