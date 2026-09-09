'use client';

import React, { useState } from 'react';
import {
  ProjectItem,
  InquiryItem,
  TimelineItem,
  NewsItem,
  PropertyItem,
  LeadItem,
  AgentItem,
  ViewingItem,
  OfferItem,
  DealItem,
  CommissionItem,
} from '@/types';
import { TanmiyatLogo } from '@/components/brand/TanmiyatLogo';
import { DashboardStats, DashboardStatType } from '@/components/admin/DashboardStats';
import { LeadsKanban } from '@/components/admin/crm/LeadsKanban';
import { PropertiesManager } from '@/components/admin/crm/PropertiesManager';
import { ViewingsManager } from '@/components/admin/crm/ViewingsManager';
import { OffersManager } from '@/components/admin/crm/OffersManager';
import { DealsManager } from '@/components/admin/crm/DealsManager';
import { CommissionsManager } from '@/components/admin/crm/CommissionsManager';
import {
  LayoutDashboard,
  Building,
  Layers,
  Inbox,
  Clock,
  Newspaper,
  Users,
  Download,
  Plus,
  CheckCircle,
  ExternalLink,
  Shield,
  Search,
  Filter,
  LogOut,
  Calendar,
  FileCheck,
  Handshake,
  Coins,
  ArrowUpRight,
} from 'lucide-react';

interface AdminDashboardClientProps {
  initialProjects: ProjectItem[];
  initialInquiries: InquiryItem[];
  initialTimeline: TimelineItem[];
  initialNews: NewsItem[];
  initialProperties?: PropertyItem[];
  initialLeads?: LeadItem[];
  initialAgents?: AgentItem[];
  initialViewings?: ViewingItem[];
  initialOffers?: OfferItem[];
  initialDeals?: DealItem[];
  initialCommissions?: CommissionItem[];
}

export type AdminTab =
  | 'OVERVIEW'
  | 'LEADS_CRM'
  | 'PROPERTIES'
  | 'VIEWINGS'
  | 'OFFERS'
  | 'DEALS'
  | 'COMMISSIONS'
  | 'DEVELOPMENTS'
  | 'UNITS'
  | 'TIMELINE'
  | 'NEWS'
  | 'USERS';

export const AdminDashboardClient: React.FC<AdminDashboardClientProps> = ({
  initialProjects,
  initialInquiries,
  initialTimeline,
  initialNews,
  initialProperties = [],
  initialLeads = [],
  initialAgents = [],
  initialViewings = [],
  initialOffers = [],
  initialDeals = [],
  initialCommissions = [],
}) => {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<AdminTab>('OVERVIEW');

  // State collections
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

  // Units list derived from projects
  const allUnits = projects.flatMap((p) =>
    (p.units || []).map((u) => ({ ...u, projectName: p.title }))
  );

  const loadAdminData = async () => {
    const endpoints = [
      ['projects', '/api/projects'], ['inquiries', '/api/inquiries'], ['timeline', '/api/timeline'],
      ['news', '/api/news'], ['properties', '/api/properties?limit=24'], ['leads', '/api/leads'],
      ['agents', '/api/agents'], ['viewings', '/api/viewings'], ['offers', '/api/offers'],
      ['deals', '/api/deals'], ['commissions', '/api/commissions'],
    ] as const;
    const results = await Promise.allSettled(endpoints.map(async ([, url]) => {
      const res = await fetch(url, { cache: 'no-store' });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || 'Failed to load CRM data');
      return json.data;
    }));
    const data = Object.fromEntries(results.map((r, i) => [endpoints[i][0], r.status === 'fulfilled' ? r.value : []]));
    setProjects(data.projects || []); setInquiries(data.inquiries || []); setTimeline(data.timeline || []); setNews(data.news || []);
    setProperties(data.properties || []); setLeads(data.leads || []); setAgents(data.agents || []); setViewings(data.viewings || []);
    setOffers(data.offers || []); setDeals(data.deals || []); setCommissions(data.commissions || []);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: authEmail, password: authPassword }) });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || 'Authentication failed.');
      setIsAuthenticated(true);
      setAuthPassword('');
      await loadAdminData();
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Authentication failed.');
    }
  };

  const handleUpdateInquiryStatus = async (
    id: string,
    newStatus: 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'CONVERTED' | 'CLOSED'
  ) => {
    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setInquiries((prev) =>
          prev.map((inq) => (inq.id === id ? { ...inq, status: newStatus } : inq))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleExportInquiriesCSV = () => {
    const headers = ['ID', 'Date', 'Name', 'Email', 'Phone', 'Project', 'Status', 'Message'];
    const rows = inquiries.map((i) => [
      i.id,
      new Date(i.createdAt).toISOString(),
      `"${i.name.replace(/"/g, '""')}"`,
      i.email,
      `"${i.phone}"`,
      `"${i.interestedProject || 'General'}"`,
      i.status,
      `"${(i.message || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `tanmiyat_leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0A0A09] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#171715] border border-[#25221E] p-8 sm:p-10 space-y-6">
          <div className="text-center space-y-4">
            <TanmiyatLogo variant="gold" size="md" />
            <div className="pt-2">
              <span className="text-xs uppercase tracking-[0.25em] text-[#B79A62] font-semibold">
                Executive Management & CRM Portal
              </span>
              <p className="text-xs text-[#8C867E] mt-1">
                Authorized Personnel Only • RERA, DLD & Corporate Compliance
              </p>
            </div>
          </div>

          {authError && (
            <div className="p-3 bg-red-950/50 border border-red-800 text-red-200 text-xs">
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#C8C0B3] mb-1">
                Executive Email
              </label>
              <input
                type="email"
                required
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                className="w-full bg-[#0A0A09] border border-[#2D2A26] px-3.5 py-2.5 text-sm text-[#F5F2EB] focus:outline-none focus:border-[#B79A62]"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#C8C0B3] mb-1">
                Security Passcode
              </label>
              <input
                type="password"
                required
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                className="w-full bg-[#0A0A09] border border-[#2D2A26] px-3.5 py-2.5 text-sm text-[#F5F2EB] focus:outline-none focus:border-[#B79A62]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#B79A62] text-[#0A0A09] text-xs font-semibold uppercase tracking-[0.2em] hover:bg-[#D8BE8A] transition-colors cursor-pointer"
            >
              AUTHENTICATE SESSION
            </button>
          </form>

        </div>
      </div>
    );
  }

  // Navigation Items
  const navGroups = [
    {
      group: 'MARKETPLACE & CRM',
      items: [
        { id: 'OVERVIEW' as AdminTab, label: 'Overview', icon: LayoutDashboard },
        {
          id: 'LEADS_CRM' as AdminTab,
          label: 'CRM Leads & Pipeline',
          icon: Inbox,
          count: leads.length || inquiries.length,
        },
        {
          id: 'PROPERTIES' as AdminTab,
          label: 'Marketplace Properties',
          icon: Building,
          count: properties.length,
        },
        {
          id: 'VIEWINGS' as AdminTab,
          label: 'Private Viewings',
          icon: Calendar,
          count: viewings.filter((v) => v.status === 'CONFIRMED' || v.status === 'REQUESTED').length,
        },
        {
          id: 'OFFERS' as AdminTab,
          label: 'Offers & Negotiations',
          icon: FileCheck,
          count: offers.filter((o) => o.status === 'SUBMITTED').length,
        },
        {
          id: 'DEALS' as AdminTab,
          label: 'Deals & Conveyancing',
          icon: Handshake,
          count: deals.length,
        },
        {
          id: 'COMMISSIONS' as AdminTab,
          label: 'Broker Commissions',
          icon: Coins,
        },
      ],
    },
    {
      group: 'DEVELOPMENT & CMS',
      items: [
        { id: 'DEVELOPMENTS' as AdminTab, label: 'Master Projects', icon: Building },
        { id: 'UNITS' as AdminTab, label: 'Inventory Units', icon: Layers, count: allUnits.length },
        { id: 'TIMELINE' as AdminTab, label: 'Heritage Timeline', icon: Clock },
        { id: 'NEWS' as AdminTab, label: 'News & Insights', icon: Newspaper },
        { id: 'USERS' as AdminTab, label: 'Roles & Access', icon: Users },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A09] text-[#F5F2EB] flex flex-col">
      {/* TOP HEADER */}
      <header className="bg-[#171715] border-b border-[#25221E] px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-6">
          <TanmiyatLogo variant="gold" size="sm" showDescriptor={false} />
          <span className="hidden sm:inline-block text-xs uppercase tracking-widest text-[#8C867E] border-l border-[#2B2925] pl-6">
            Luxury Real Estate OS & CRM
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-[#0A0A09] border border-[#2D2A26] text-xs">
            <Shield className="w-3.5 h-3.5 text-[#B79A62]" />
            <span className="text-[#F5F2EB] font-medium">SUPER_ADMIN</span>
          </div>

          <a
            href="/"
            target="_blank"
            className="text-xs text-[#C8C0B3] hover:text-[#B79A62] flex items-center gap-1 transition-colors"
          >
            <span>Live Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={async () => { await fetch('/api/auth/logout', { method: 'POST' }); setIsAuthenticated(false); }}
            className="text-[#8C867E] hover:text-red-400 p-1 transition-colors cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* DASHBOARD BODY */}
      <div className="flex-grow flex flex-col md:flex-row">
        {/* SIDEBAR NAVIGATION */}
        <aside className="w-full md:w-64 bg-[#121210] border-r border-[#25221E] p-4 flex flex-col justify-between shrink-0">
          <div className="space-y-6">
            {navGroups.map((group, gIdx) => (
              <div key={gIdx} className="space-y-1">
                <span className="px-3 text-[10px] uppercase tracking-[0.2em] text-[#7A756D] font-bold block mb-2">
                  {group.group}
                </span>
                {group.items.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs uppercase tracking-wider font-medium transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#B79A62] text-[#0A0A09] font-semibold'
                          : 'text-[#C8C0B3] hover:bg-[#1A1816] hover:text-[#F5F2EB]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4 shrink-0" />
                        <span className="truncate">{tab.label}</span>
                      </div>
                      {tab.count !== undefined && tab.count > 0 && (
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded shrink-0 ${
                            isActive
                              ? 'bg-[#0A0A09] text-[#B79A62] font-bold'
                              : 'bg-[#25221E] text-[#C8C0B3]'
                          }`}
                        >
                          {tab.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          <div className="p-4 bg-[#0A0A09] border border-[#22201C] text-[11px] text-[#7A756D] space-y-1 mt-6">
            <p className="font-semibold text-[#B79A62]">Tanmiyat CRM Core</p>
            <p>RERA Form A & B: Verified</p>
            <p>DLD Escrow: Active</p>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-grow p-6 sm:p-10 overflow-x-hidden max-w-7xl">
          {/* 1. OVERVIEW TAB */}
          {activeTab === 'OVERVIEW' && (
            <div className="space-y-8">
              <div>
                <h1 className="font-editorial text-3xl text-[#F5F2EB]">Executive Overview</h1>
                <p className="text-xs text-[#8C867E]">
                  Real-time portfolio metrics, CRM leads velocity, marketplace listings, and escrow pipeline.
                </p>
              </div>

              {/* STAT METRICS CARDS */}
              <DashboardStats
                totalProjects={projects.length}
                newInquiries={inquiries.filter((i) => i.status === 'NEW').length}
                totalInquiries={inquiries.length}
                activeUnits={allUnits.filter((u) => u.status === 'AVAILABLE').length}
                totalUnits={allUnits.length}
                activeLeads={leads.length || inquiries.length}
                activeListings={properties.length}
                upcomingViewings={viewings.filter((v) => v.status === 'CONFIRMED' || v.status === 'REQUESTED').length}
                onStatClick={(type: DashboardStatType) => {
                  if (type === 'PROJECTS') setActiveTab('DEVELOPMENTS');
                  else if (type === 'LEADS' || type === 'INQUIRIES') setActiveTab('LEADS_CRM');
                  else if (type === 'PROPERTIES' || type === 'UNITS') setActiveTab('PROPERTIES');
                  else if (type === 'VIEWINGS') setActiveTab('VIEWINGS');
                  else if (type === 'DEALS') setActiveTab('DEALS');
                  else if (type === 'COMMISSIONS') setActiveTab('COMMISSIONS');
                  else if (type === 'HERITAGE') setActiveTab('TIMELINE');
                }}
              />

              {/* RECENT INQUIRIES PREVIEW */}
              <div className="bg-[#171715] border border-[#25221E] p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-editorial text-2xl text-[#F5F2EB]">Recent Client Inquiries</h2>
                  <button
                    onClick={() => setActiveTab('LEADS_CRM')}
                    className="text-xs uppercase tracking-wider text-[#B79A62] hover:underline cursor-pointer"
                  >
                    Open CRM Pipeline ({inquiries.length})
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#0A0A09] text-[#7A756D] uppercase tracking-wider">
                      <tr>
                        <th className="py-3 px-4">Client Name</th>
                        <th className="py-3 px-4">Email</th>
                        <th className="py-3 px-4">Phone</th>
                        <th className="py-3 px-4">Development</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#25221E] text-[#C8C0B3]">
                      {inquiries.slice(0, 5).map((inq) => (
                        <tr key={inq.id} className="hover:bg-[#1C1A17]">
                          <td className="py-3 px-4 font-medium text-[#F5F2EB]">{inq.name}</td>
                          <td className="py-3 px-4">{inq.email}</td>
                          <td className="py-3 px-4">{inq.phone}</td>
                          <td className="py-3 px-4 text-[#D8BE8A]">{inq.interestedProject || 'General'}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                                inq.status === 'NEW'
                                  ? 'bg-amber-950/60 text-amber-300'
                                  : 'bg-emerald-950/60 text-emerald-300'
                              }`}
                            >
                              {inq.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            {inq.status === 'NEW' ? (
                              <button
                                onClick={() => handleUpdateInquiryStatus(inq.id, 'CONTACTED')}
                                className="text-[11px] text-[#B79A62] hover:underline uppercase cursor-pointer"
                              >
                                Mark Contacted
                              </button>
                            ) : (
                              <span className="text-[11px] text-[#7A756D]">Logged</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 2. LEADS CRM TAB */}
          {activeTab === 'LEADS_CRM' && (
            <LeadsKanban initialLeads={leads} agents={agents} />
          )}

          {/* 3. MARKETPLACE PROPERTIES TAB */}
          {activeTab === 'PROPERTIES' && (
            <PropertiesManager initialProperties={properties} agents={agents} />
          )}

          {/* 4. VIEWINGS TAB */}
          {activeTab === 'VIEWINGS' && (
            <ViewingsManager initialViewings={viewings} />
          )}

          {/* 5. OFFERS TAB */}
          {activeTab === 'OFFERS' && (
            <OffersManager
              initialOffers={offers}
              onDealCreated={() => setActiveTab('DEALS')}
            />
          )}

          {/* 6. DEALS TAB */}
          {activeTab === 'DEALS' && (
            <DealsManager initialDeals={deals} />
          )}

          {/* 7. COMMISSIONS TAB */}
          {activeTab === 'COMMISSIONS' && (
            <CommissionsManager initialCommissions={commissions} />
          )}

          {/* 8. DEVELOPMENTS TAB (Original Preserved) */}
          {activeTab === 'DEVELOPMENTS' && (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="font-editorial text-3xl text-[#F5F2EB]">
                    Developments Management
                  </h1>
                  <p className="text-xs text-[#8C867E]">
                    Control project metadata, pricing, images, and marketing content.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map((proj) => (
                  <div key={proj.id} className="bg-[#171715] border border-[#25221E] p-6 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] uppercase tracking-widest text-[#B79A62] font-semibold">
                          {proj.category}
                        </span>
                        <h3 className="font-editorial text-2xl text-[#F5F2EB]">{proj.title}</h3>
                        <p className="text-xs text-[#8C867E]">{proj.location}</p>
                      </div>
                      <span className="px-2.5 py-1 bg-[#0A0A09] border border-[#2D2A26] text-[10px] font-semibold uppercase text-[#D8BE8A]">
                        {proj.status}
                      </span>
                    </div>

                    <p className="text-xs text-[#C8C0B3] line-clamp-2">{proj.overview}</p>

                    <div className="pt-4 border-t border-[#22201C] flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[#7A756D]">Starting:</span>{' '}
                        <strong className="text-[#B79A62]">
                          AED {proj.startingPrice?.toLocaleString()}
                        </strong>
                      </div>
                      <a
                        href={`/developments/${proj.slug}`}
                        target="_blank"
                        className="text-[#C8C0B3] hover:text-[#B79A62] flex items-center gap-1"
                      >
                        <span>Preview</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 9. UNITS TAB (Original Preserved) */}
          {activeTab === 'UNITS' && (
            <div className="space-y-8">
              <div>
                <h1 className="font-editorial text-3xl text-[#F5F2EB]">Unit Inventory & Pricing</h1>
                <p className="text-xs text-[#8C867E]">
                  Manage unit availability, floor levels, pricing, and reservation states.
                </p>
              </div>

              <div className="overflow-x-auto bg-[#171715] border border-[#25221E]">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0A0A09] text-[#7A756D] uppercase tracking-wider">
                    <tr>
                      <th className="py-4 px-6">Unit No.</th>
                      <th className="py-4 px-4">Development</th>
                      <th className="py-4 px-4">Type</th>
                      <th className="py-4 px-4">Bed / Bath</th>
                      <th className="py-4 px-4">Area (Sq.Ft.)</th>
                      <th className="py-4 px-4">Price (AED)</th>
                      <th className="py-4 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#22201C] text-[#C8C0B3]">
                    {allUnits.map((unit) => (
                      <tr key={unit.id} className="hover:bg-[#1E1C18]">
                        <td className="py-4 px-6 font-medium text-[#F5F2EB]">{unit.unitNumber}</td>
                        <td className="py-4 px-4 text-[#D8BE8A]">{unit.projectName}</td>
                        <td className="py-4 px-4">{unit.type}</td>
                        <td className="py-4 px-4">
                          {unit.bedrooms} BR / {unit.bathrooms} BA
                        </td>
                        <td className="py-4 px-4">{unit.areaSqFt.toLocaleString()}</td>
                        <td className="py-4 px-4 font-editorial text-sm text-[#B79A62]">
                          AED {unit.price.toLocaleString()}
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                              unit.status === 'AVAILABLE'
                                ? 'bg-emerald-950/60 text-emerald-300'
                                : 'bg-amber-950/60 text-amber-300'
                            }`}
                          >
                            {unit.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 10. TIMELINE CMS TAB (Original Preserved) */}
          {activeTab === 'TIMELINE' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-editorial text-3xl text-[#F5F2EB]">
                    Heritage Timeline CMS (1999–Present)
                  </h1>
                  <p className="text-xs text-[#8C867E]">
                    Verified historical corporate milestones and regional achievements.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {timeline.map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#171715] border border-[#25221E] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="font-editorial text-2xl text-[#B79A62]">
                          {item.year}
                        </span>
                        <h3 className="font-editorial text-xl text-[#F5F2EB]">{item.title}</h3>
                      </div>
                      <p className="text-xs text-[#C8C0B3]">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 11. NEWS CMS TAB (Original Preserved) */}
          {activeTab === 'NEWS' && (
            <div className="space-y-8">
              <div>
                <h1 className="font-editorial text-3xl text-[#F5F2EB]">
                  News & Insights CMS
                </h1>
                <p className="text-xs text-[#8C867E]">
                  Articles, market analyses, and press announcements.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {news.map((n) => (
                  <div key={n.id} className="bg-[#171715] border border-[#25221E] p-6 space-y-3">
                    <div className="flex items-center justify-between text-xs text-[#7A756D]">
                      <span className="text-[#B79A62] uppercase">{n.category}</span>
                      <span>{new Date(n.publishedDate).toLocaleDateString()}</span>
                    </div>
                    <h3 className="font-editorial text-xl text-[#F5F2EB]">{n.title}</h3>
                    <p className="text-xs text-[#8C867E] line-clamp-2">{n.excerpt}</p>
                    <div className="pt-2 flex items-center justify-between text-xs">
                      <span className="text-[#7A756D]">Author: {n.author}</span>
                      <a
                        href={`/news/${n.slug}`}
                        target="_blank"
                        className="text-[#B79A62] hover:underline"
                      >
                        View live
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 12. USERS TAB (Original Preserved) */}
          {activeTab === 'USERS' && (
            <div className="space-y-8">
              <div>
                <h1 className="font-editorial text-3xl text-[#F5F2EB]">
                  Role-Based Access Control (RBAC)
                </h1>
                <p className="text-xs text-[#8C867E]">
                  Authorized administrators, private client advisors, and escrow officers.
                </p>
              </div>

              <div className="bg-[#171715] border border-[#25221E] p-6 space-y-4">
                <div className="space-y-3">
                  {[
                    {
                      name: 'Executive Leadership',
                      email: 'admin@tanmiyatrealestate.com',
                      role: 'SUPER_ADMIN',
                      status: 'Active',
                    },
                    {
                      name: 'Private Client Advisory',
                      email: 'advisory@tanmiyatrealestate.com',
                      role: 'SALES_AGENT',
                      status: 'Active',
                    },
                    {
                      name: 'Corporate Communications',
                      email: 'media@tanmiyatrealestate.com',
                      role: 'CONTENT_EDITOR',
                      status: 'Active',
                    },
                    {
                      name: 'Legal & Escrow Officer',
                      email: 'escrow@tanmiyatrealestate.com',
                      role: 'ESCROW_OFFICER',
                      status: 'Active',
                    },
                  ].map((u, i) => (
                    <div
                      key={i}
                      className="p-4 bg-[#0A0A09] border border-[#22201C] flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-medium text-[#F5F2EB]">{u.name}</div>
                        <div className="text-[#8C867E]">{u.email}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="px-2.5 py-1 bg-[#171715] text-[#B79A62] font-semibold uppercase text-[10px]">
                          {u.role}
                        </span>
                        <span className="text-emerald-400 font-medium">{u.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
