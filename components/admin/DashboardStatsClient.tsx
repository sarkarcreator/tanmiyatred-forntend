'use client';

import React, { useState, useEffect } from 'react';
import {
  Building2,
  Inbox,
  Layers,
  RotateCw,
  AlertCircle,
  Handshake,
} from 'lucide-react';

export type DashboardStatType =
  | 'PROJECTS' | 'INQUIRIES' | 'UNITS' | 'HERITAGE' | 'REVENUE'
  | 'LEADS' | 'PROPERTIES' | 'DEALS' | 'VIEWINGS' | 'COMMISSIONS';

export interface DashboardStatsData {
  totalProjects: number;
  activeProjects?: number;
  totalInquiries: number;
  newInquiries: number;
  activeUnits: number;
  totalUnits: number;
  availableUnitsValueAed?: number;
  totalRevenue?: number;
  currency?: string;
  lastUpdated?: string;
  totalProperties?: number;
  activeProperties?: number;
  totalListings?: number;
  activeListings?: number;
  totalLeads?: number;
  activeLeads?: number;
  newLeads?: number;
  totalDeals?: number;
  wonDeals?: number;
  dealPipelineValue?: number;
  wonDealsValue?: number;
  totalCommissions?: number;
  pendingCommissions?: number;
  paidCommissions?: number;
  totalViewings?: number;
  upcomingViewings?: number;
  totalOffers?: number;
  pendingOffers?: number;
  totalAgents?: number;
  activeAgents?: number;
}

export interface DashboardStatsProps {
  initialStats?: DashboardStatsData;
  totalProjects?: number;
  totalInquiries?: number;
  activeUnits?: number;
  newInquiries?: number;
  totalUnits?: number;
  activeLeads?: number;
  activeListings?: number;
  upcomingViewings?: number;
  activeOffers?: number;
  activeDeals?: number;
  totalCommissions?: number;
  endpoint?: string;
  autoFetch?: boolean;
  onStatClick?: (statType: DashboardStatType) => void;
  showRefresh?: boolean;
  showCrmStrip?: boolean;
  className?: string;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  initialStats,
  totalProjects: propTotalProjects,
  totalInquiries: propTotalInquiries,
  activeUnits: propActiveUnits,
  newInquiries: propNewInquiries,
  totalUnits: propTotalUnits,
  activeLeads: propActiveLeads,
  activeListings: propActiveListings,
  upcomingViewings: propUpcomingViewings,
  activeDeals: propActiveDeals,
  totalCommissions: propTotalCommissions,
  endpoint = '/api/admin/stats',
  autoFetch = true,
  onStatClick,
  showRefresh = true,
  className = '',
}) => {
  const hasPropData = propTotalProjects !== undefined && propTotalInquiries !== undefined && propActiveUnits !== undefined;
  const [fetchedStats, setFetchedStats] = useState<DashboardStatsData | null>(null);
  const [loading, setLoading] = useState(!hasPropData && !initialStats && autoFetch);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentStats: DashboardStatsData = hasPropData
    ? {
        totalProjects: propTotalProjects ?? 0,
        totalInquiries: propTotalInquiries ?? 0,
        activeUnits: propActiveUnits ?? 0,
        newInquiries: propNewInquiries ?? 0,
        totalUnits: propTotalUnits ?? propActiveUnits ?? 0,
        activeLeads: propActiveLeads ?? fetchedStats?.activeLeads,
        activeListings: propActiveListings ?? fetchedStats?.activeListings,
        upcomingViewings: propUpcomingViewings ?? fetchedStats?.upcomingViewings,
        totalDeals: fetchedStats?.totalDeals,
        dealPipelineValue: fetchedStats?.dealPipelineValue,
        totalCommissions: propTotalCommissions ?? fetchedStats?.totalCommissions,
        lastUpdated: fetchedStats?.lastUpdated || new Date().toISOString(),
      }
    : initialStats || fetchedStats || {
        totalProjects: 0, totalInquiries: 0, activeUnits: 0, newInquiries: 0, totalUnits: 0,
      };

  const hasData = hasPropData || Boolean(initialStats) || Boolean(fetchedStats);

  useEffect(() => {
    let active = true;
    if (autoFetch && !hasPropData && !initialStats) {
      fetch(endpoint, { method: 'GET', headers: { 'Content-Type': 'application/json' }, cache: 'no-store' })
        .then(async (res) => {
          if (!res.ok) throw new Error(`Server responded with status ${res.status}`);
          return res.json();
        })
        .then((json) => {
          if (!active) return;
          if (json.success && json.data) setFetchedStats(json.data);
          else setError(json.error || 'Failed to parse statistics payload');
          setLoading(false);
        })
        .catch((err: unknown) => {
          if (active) {
            setError(err instanceof Error ? err.message : 'Network error while fetching metrics');
            setLoading(false);
          }
        });
    }
    return () => { active = false; };
  }, [autoFetch, hasPropData, initialStats, endpoint]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setError(null);
    try {
      const response = await fetch(endpoint, { method: 'GET', headers: { 'Content-Type': 'application/json' }, cache: 'no-store' });
      if (!response.ok) throw new Error(`Server responded with status ${response.status}`);
      const json = await response.json();
      if (json.success && json.data) setFetchedStats(json.data);
      else throw new Error(json.error || 'Failed to parse statistics payload');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Network error while refreshing metrics');
    } finally {
      setIsRefreshing(false);
    }
  };

  if (loading && !hasData) {
    return <section id="dashboard-stats-loading" aria-label="Loading dashboard statistics" className={`w-full space-y-3 ${className}`}>
      <div className="flex items-center justify-between text-xs text-[#7A756D]"><span className="uppercase tracking-widest">Synchronizing CRM Telemetry...</span></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
        {[1, 2, 3, 4].map((i) => <div key={i} className="bg-[#171715] border border-[#25221E] p-6 space-y-4 animate-pulse"><div className="h-3 w-24 bg-[#25221E] rounded-sm" /><div className="h-10 w-20 bg-[#25221E] rounded-sm" /><div className="h-3 w-36 bg-[#25221E] rounded-sm" /></div>)}
      </div>
    </section>;
  }

  if (error && !hasData) {
    return <div id="dashboard-stats-error" className={`bg-[#171715] border border-red-900/50 p-6 flex items-center justify-between gap-4 text-xs ${className}`}>
      <div className="flex items-center gap-3 text-red-300"><AlertCircle className="w-5 h-5 shrink-0 text-red-400" /><span>Unable to retrieve executive metrics: {error}</span></div>
      <button onClick={handleRefresh} className="px-4 py-2 bg-[#25221E] hover:bg-[#322E29] text-[#F5F2EB] uppercase tracking-wider font-semibold transition-colors">Retry Connection</button>
    </div>;
  }

  const totalProjects = currentStats.totalProjects;
  const totalInquiries = currentStats.totalInquiries;
  const newInquiries = currentStats.newInquiries ?? 0;
  const activeUnits = currentStats.activeUnits;
  const totalUnits = currentStats.totalUnits || activeUnits;
  const availablePercentage = totalUnits > 0 ? Math.round((activeUnits / totalUnits) * 100) : 100;
  const activeListings = currentStats.activeListings ?? activeUnits;
  const activeLeads = currentStats.activeLeads ?? totalInquiries;
  const dealPipelineValue = currentStats.dealPipelineValue || currentStats.availableUnitsValueAed || 0;
  const upcomingViewings = currentStats.upcomingViewings ?? 0;
  const totalDeals = propActiveDeals ?? currentStats.totalDeals ?? 0;
  const totalCommissions = propTotalCommissions ?? currentStats.totalCommissions ?? 0;

  const cards = [
    { id: 'stat-card-total-projects', statType: 'PROJECTS' as DashboardStatType, label: 'Master Projects', value: totalProjects.toString().padStart(2, '0'), subtitle: 'Dubai prime master developments & towers', badge: 'Dubai Prime', icon: Building2 },
    { id: 'stat-card-total-inquiries', statType: 'LEADS' as DashboardStatType, label: 'CRM Active Leads', value: (activeLeads || totalInquiries).toString(), subtitle: newInquiries > 0 ? `${newInquiries} urgent leads awaiting advisor dispatch` : 'High-intent buyer & tenant inquiries', badge: newInquiries > 0 ? `${newInquiries} New Leads` : 'Qualified Pool', icon: Inbox },
    { id: 'stat-card-active-units', statType: 'PROPERTIES' as DashboardStatType, label: 'Marketplace Listings', value: activeListings.toString(), subtitle: `${totalUnits} total cataloged inventory units`, badge: `${availablePercentage}% Live & Escrow Ready`, icon: Layers },
    { id: 'stat-card-deal-pipeline', statType: 'DEALS' as DashboardStatType, label: 'Deal Pipeline Value', value: `AED ${(dealPipelineValue / 1000000).toFixed(1)}M`, subtitle: `${totalDeals} active deals • AED ${totalCommissions.toLocaleString()} commissions`, badge: 'Escrow Secured', icon: Handshake },
  ];

  return <section id="executive-dashboard-stats-grid" className={`w-full space-y-4 ${className}`}>
    {showRefresh && <div className="flex items-center justify-between text-xs pb-1"><div className="flex items-center gap-2 text-[#7A756D]"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /><span className="uppercase tracking-widest text-[10px] font-semibold text-[#A8A196]">Tanmiyat Real Estate OS Telemetry</span>{currentStats.lastUpdated && <span className="text-[10px] text-[#5A5650] hidden sm:inline">• Synced {new Date(currentStats.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>}</div><button id="btn-refresh-dashboard-stats" type="button" onClick={handleRefresh} disabled={isRefreshing} aria-label="Refresh dashboard metrics" className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-[#8C867E] hover:text-[#B79A62] disabled:opacity-50 transition-colors cursor-pointer"><RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#B79A62]' : ''}`} /><span className="hidden sm:inline">{isRefreshing ? 'Syncing...' : 'Sync Telemetry'}</span></button></div>}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
      {cards.map((card) => { const Icon = card.icon; const isClickable = Boolean(onStatClick); return <div key={card.id} id={card.id} onClick={() => onStatClick?.(card.statType)} role={isClickable ? 'button' : 'region'} tabIndex={isClickable ? 0 : undefined} className={`group relative bg-[#171715] border border-[#25221E] hover:border-[#3D3830] p-6 transition-all duration-300 flex flex-col justify-between ${isClickable ? 'cursor-pointer hover:bg-[#1C1A17] focus:outline-none focus:ring-1 focus:ring-[#B79A62]' : ''}`}><div className="flex items-start justify-between gap-4"><div className="space-y-1.5"><span className="text-[11px] uppercase tracking-[0.2em] text-[#8C867E]">{card.label}</span><div className="text-3xl font-semibold text-[#F5F2EB]">{card.value}</div></div><Icon className="w-8 h-8 text-[#B79A62]" /></div><div className="mt-5 space-y-3"><p className="text-xs text-[#8C867E] leading-relaxed">{card.subtitle}</p><span className="inline-flex px-2 py-1 border border-[#3D3830] text-[10px] uppercase tracking-wider text-[#B79A62]">{card.badge}</span></div></div>; })}
    </div>
  </section>;
};

export default DashboardStats;
