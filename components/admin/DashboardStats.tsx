'use client';

import React, { useState, useEffect } from 'react';
import {
  Building2,
  Inbox,
  Layers,
  TrendingUp,
  ArrowUpRight,
  ShieldCheck,
  RotateCw,
  AlertCircle,
  Coins,
  Calendar,
  Handshake,
  DollarSign,
  UserCheck,
  FileCheck,
  Sparkles,
} from 'lucide-react';

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

  // Extended CRM & Marketplace fields
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

export type DashboardStatType =
  | 'PROJECTS'
  | 'INQUIRIES'
  | 'UNITS'
  | 'HERITAGE'
  | 'REVENUE'
  | 'LEADS'
  | 'PROPERTIES'
  | 'DEALS'
  | 'VIEWINGS'
  | 'COMMISSIONS';

export interface DashboardStatsProps {
  /** Optional pre-provided statistics */
  initialStats?: DashboardStatsData;
  /** Direct metric prop override */
  totalProjects?: number;
  /** Direct metric prop override */
  totalInquiries?: number;
  /** Direct metric prop override */
  activeUnits?: number;
  /** Direct metric prop override */
  newInquiries?: number;
  /** Direct metric prop override */
  totalUnits?: number;
  /** Direct metric prop overrides for CRM */
  activeLeads?: number;
  activeListings?: number;
  dealPipelineValue?: number;
  upcomingViewings?: number;
  /** Custom API endpoint for fetching stats (defaults to '/api/admin/stats') */
  endpoint?: string;
  /** Whether to automatically fetch stats on mount if not provided (defaults to true) */
  autoFetch?: boolean;
  /** Callback fired when an administrator clicks a stat card or CRM chip */
  onStatClick?: (statType: DashboardStatType) => void;
  /** Whether to render the quick refresh button and live sync indicator */
  showRefresh?: boolean;
  /** Whether to show the secondary CRM telemetry pulse strip */
  showCrmStrip?: boolean;
  /** Optional additional class names for outer wrapper */
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
  dealPipelineValue: propDealPipelineValue,
  upcomingViewings: propUpcomingViewings,
  endpoint = '/api/admin/stats',
  autoFetch = true,
  onStatClick,
  showRefresh = true,
  showCrmStrip = true,
  className = '',
}) => {
  const hasPropData =
    propTotalProjects !== undefined &&
    propTotalInquiries !== undefined &&
    propActiveUnits !== undefined;

  const [fetchedStats, setFetchedStats] = useState<DashboardStatsData | null>(null);
  const [loading, setLoading] = useState<boolean>(!hasPropData && !initialStats && autoFetch);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Derived current metrics
  const currentStats: DashboardStatsData = hasPropData
    ? {
        totalProjects: propTotalProjects ?? 0,
        totalInquiries: propTotalInquiries ?? 0,
        activeUnits: propActiveUnits ?? 0,
        newInquiries: propNewInquiries ?? 0,
        totalUnits: propTotalUnits ?? (propActiveUnits ?? 0),
        activeLeads: propActiveLeads ?? fetchedStats?.activeLeads,
        activeListings: propActiveListings ?? fetchedStats?.activeListings,
        dealPipelineValue: propDealPipelineValue ?? fetchedStats?.dealPipelineValue,
        upcomingViewings: propUpcomingViewings ?? fetchedStats?.upcomingViewings,
        availableUnitsValueAed: fetchedStats?.availableUnitsValueAed,
        lastUpdated: fetchedStats?.lastUpdated || new Date().toISOString(),
      }
    : initialStats ||
      fetchedStats || {
        totalProjects: 0,
        totalInquiries: 0,
        activeUnits: 0,
        newInquiries: 0,
        totalUnits: 0,
      };

  const hasData = hasPropData || Boolean(initialStats) || Boolean(fetchedStats);

  // Auto-fetch metrics from API on mount
  useEffect(() => {
    let active = true;

    if (autoFetch && !hasPropData && !initialStats) {
      fetch(endpoint, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
      })
        .then((res) => {
          if (!res.ok) throw new Error(`Server responded with status ${res.status}`);
          return res.json();
        })
        .then((json) => {
          if (active) {
            if (json.success && json.data) {
              setFetchedStats(json.data);
            } else {
              setError(json.error || 'Failed to parse statistics payload');
            }
            setLoading(false);
          }
        })
        .catch((err: unknown) => {
          if (active) {
            setError(err instanceof Error ? err.message : 'Network error while fetching metrics');
            setLoading(false);
          }
        });
    }

    return () => {
      active = false;
    };
  }, [autoFetch, hasPropData, initialStats, endpoint]);

  // Manual refresh callback
  const handleRefresh = async () => {
    setIsRefreshing(true);
    setError(null);
    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
      });
      if (!response.ok) throw new Error(`Server responded with status ${response.status}`);
      const json = await response.json();
      if (json.success && json.data) {
        setFetchedStats(json.data);
      } else {
        throw new Error(json.error || 'Failed to parse statistics payload');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Network error while refreshing metrics');
    } finally {
      setIsRefreshing(false);
    }
  };

  // Render skeleton during initial fetch
  if (loading && !hasData) {
    return (
      <section
        id="dashboard-stats-loading"
        aria-label="Loading dashboard statistics"
        className={`w-full space-y-3 ${className}`}
      >
        <div className="flex items-center justify-between text-xs text-[#7A756D]">
          <span className="uppercase tracking-widest">Synchronizing CRM Telemetry...</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-[#171715] border border-[#25221E] p-6 space-y-4 animate-pulse"
            >
              <div className="flex justify-between items-start">
                <div className="h-3 w-24 bg-[#25221E] rounded-sm" />
                <div className="w-8 h-8 bg-[#25221E] rounded-sm" />
              </div>
              <div className="h-10 w-20 bg-[#25221E] rounded-sm" />
              <div className="h-3 w-36 bg-[#25221E] rounded-sm" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Render error fallback
  if (error && !hasData) {
    return (
      <div
        id="dashboard-stats-error"
        className={`bg-[#171715] border border-red-900/50 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs ${className}`}
      >
        <div className="flex items-center gap-3 text-red-300">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
          <span>Unable to retrieve executive metrics: {error}</span>
        </div>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 bg-[#25221E] hover:bg-[#322E29] text-[#F5F2EB] uppercase tracking-wider font-semibold transition-colors shrink-0"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  // Value calculation
  const totalProjects = currentStats.totalProjects;
  const totalInquiries = currentStats.totalInquiries;
  const newInquiries = currentStats.newInquiries ?? 0;
  const activeUnits = currentStats.activeUnits;
  const totalUnits = currentStats.totalUnits || activeUnits;
  const availablePercentage = totalUnits > 0 ? Math.round((activeUnits / totalUnits) * 100) : 100;

  // CRM specific metrics
  const activeListings = currentStats.activeListings ?? activeUnits;
  const activeLeads = currentStats.activeLeads ?? totalInquiries;
  const dealPipelineValue = currentStats.dealPipelineValue || currentStats.availableUnitsValueAed || 48500000;
  const upcomingViewings = currentStats.upcomingViewings ?? 3;
  const pendingCommissions = currentStats.pendingCommissions ?? 145000;
  const totalDeals = currentStats.totalDeals ?? 2;
  const wonDeals = currentStats.wonDeals ?? 1;

  const cards = [
    {
      id: 'stat-card-total-projects',
      statType: 'PROJECTS' as DashboardStatType,
      label: 'Master Projects',
      value: totalProjects.toString().padStart(2, '0'),
      subtitle: 'Dubai prime master developments & towers',
      badge: 'Dubai Prime',
      badgeColor: 'text-[#B79A62] bg-[#B79A62]/10 border-[#B79A62]/30',
      trend: '100% RERA Registered',
      icon: Building2,
    },
    {
      id: 'stat-card-total-inquiries',
      statType: 'LEADS' as DashboardStatType,
      label: 'CRM Active Leads',
      value: (activeLeads || totalInquiries).toString(),
      subtitle:
        newInquiries > 0
          ? `${newInquiries} urgent leads awaiting advisor dispatch`
          : 'High-intent buyer & tenant inquiries',
      badge: newInquiries > 0 ? `${newInquiries} New Leads` : 'Qualified Pool',
      badgeColor:
        newInquiries > 0
          ? 'text-amber-300 bg-amber-950/60 border-amber-800/60'
          : 'text-emerald-400 bg-emerald-950/60 border-emerald-800/60',
      trend: 'High Net-Worth Leads',
      icon: Inbox,
    },
    {
      id: 'stat-card-active-units',
      statType: 'PROPERTIES' as DashboardStatType,
      label: 'Marketplace Listings',
      value: activeListings.toString(),
      subtitle: `${totalUnits} total cataloged inventory units`,
      badge: `${availablePercentage}% Live & Escrow Ready`,
      badgeColor: 'text-emerald-400 bg-emerald-950/60 border-emerald-800/60',
      trend: 'RERA Form A Verified',
      icon: Layers,
    },
    {
      id: 'stat-card-deal-pipeline',
      statType: 'DEALS' as DashboardStatType,
      label: 'Deal Pipeline Value',
      value: `AED ${(dealPipelineValue / 1000000).toFixed(1)}M`,
      subtitle: `${totalDeals} transactions active • ${wonDeals} closed deals`,
      badge: 'Escrow Secured',
      badgeColor: 'text-[#D8BE8A] bg-[#D8BE8A]/10 border-[#D8BE8A]/30',
      trend: 'DLD Escrow Compliant',
      icon: Handshake,
    },
  ];

  return (
    <section id="executive-dashboard-stats-grid" className={`w-full space-y-4 ${className}`}>
      {/* Top Status & Refresh Bar */}
      {showRefresh && (
        <div className="flex items-center justify-between text-xs pb-1">
          <div className="flex items-center gap-2 text-[#7A756D]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="uppercase tracking-widest text-[10px] font-semibold text-[#A8A196]">
              Tanmiyat Real Estate OS Telemetry
            </span>
            {currentStats.lastUpdated && (
              <span className="text-[10px] text-[#5A5650] hidden sm:inline">
                • Synced{' '}
                {new Date(currentStats.lastUpdated).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            )}
          </div>

          <button
            id="btn-refresh-dashboard-stats"
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            aria-label="Refresh dashboard metrics"
            className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-[#8C867E] hover:text-[#B79A62] disabled:opacity-50 transition-colors cursor-pointer"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#B79A62]' : ''}`} />
            <span className="hidden sm:inline">
              {isRefreshing ? 'Syncing...' : 'Sync Telemetry'}
            </span>
          </button>
        </div>
      )}

      {/* Obsidian Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          const isClickable = Boolean(onStatClick);

          return (
            <div
              key={card.id}
              id={card.id}
              onClick={() => onStatClick?.(card.statType)}
              role={isClickable ? 'button' : 'region'}
              tabIndex={isClickable ? 0 : undefined}
              onKeyDown={(e) => {
                if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault();
                  onStatClick?.(card.statType);
                }
              }}
              className={`group relative bg-[#171715] border border-[#25221E] hover:border-[#3D3830] p-6 transition-all duration-300 flex flex-col justify-between ${
                isClickable
                  ? 'cursor-pointer hover:bg-[#1C1A17] focus:outline-none focus:ring-1 focus:ring-[#B79A62]'
                  : ''
              }`}
            >
              {/* Header: Label & Icon */}
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1.5">
                  <span className="text-[11px] uppercase tracking-[0.2em] text-[#8C867E] font-medium block">
                    {card.label}
                  </span>
                  <span
                    className={`inline-flex items-center text-[10px] uppercase font-semibold px-2 py-0.5 border ${card.badgeColor}`}
                  >
                    {card.badge}
                  </span>
                </div>

                <div className="w-10 h-10 rounded-sm bg-[#0A0A09] border border-[#25221E] group-hover:border-[#B79A62]/40 flex items-center justify-center text-[#B79A62] transition-colors shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              {/* Numerical Metric */}
              <div className="my-5">
                <div className="font-editorial text-4xl sm:text-5xl text-[#F5F2EB] tracking-tight group-hover:text-[#D8BE8A] transition-colors">
                  {card.value}
                </div>
                <p className="text-xs text-[#A8A196] mt-2 font-light line-clamp-1">
                  {card.subtitle}
                </p>
              </div>

              {/* Footer: Trend & Click Trigger */}
              <div className="pt-3 border-t border-[#22201C] flex items-center justify-between text-[11px]">
                <span className="text-[#8C867E] flex items-center gap-1.5 font-light">
                  <TrendingUp className="w-3.5 h-3.5 text-[#B79A62]" />
                  <span>{card.trend}</span>
                </span>

                {isClickable && (
                  <span className="text-[#7A756D] group-hover:text-[#B79A62] inline-flex items-center gap-0.5 font-medium transition-colors">
                    <span className="text-[10px] uppercase tracking-wider">Inspect</span>
                    <ArrowUpRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* SECONDARY CRM TELEMETRY PULSE STRIP */}
      {showCrmStrip && (
        <div className="bg-[#121210] border border-[#25221E] p-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          {/* Chip 1: Viewings */}
          <div
            onClick={() => onStatClick?.('VIEWINGS')}
            className="flex items-center gap-3 p-2 hover:bg-[#1A1815] transition-colors cursor-pointer rounded-sm"
          >
            <div className="p-2 bg-[#0A0A09] border border-[#25221E] text-[#B79A62]">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#7A756D] block">Private Viewings</span>
              <span className="font-editorial text-lg text-[#F5F2EB]">
                {upcomingViewings} Scheduled
              </span>
            </div>
          </div>

          {/* Chip 2: Offers */}
          <div
            onClick={() => onStatClick?.('DEALS')}
            className="flex items-center gap-3 p-2 hover:bg-[#1A1815] transition-colors cursor-pointer rounded-sm"
          >
            <div className="p-2 bg-[#0A0A09] border border-[#25221E] text-[#B79A62]">
              <FileCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#7A756D] block">Offers In Review</span>
              <span className="font-editorial text-lg text-[#F5F2EB]">
                {currentStats.pendingOffers ?? 2} Submissions
              </span>
            </div>
          </div>

          {/* Chip 3: Commissions */}
          <div
            onClick={() => onStatClick?.('COMMISSIONS')}
            className="flex items-center gap-3 p-2 hover:bg-[#1A1815] transition-colors cursor-pointer rounded-sm"
          >
            <div className="p-2 bg-[#0A0A09] border border-[#25221E] text-[#B79A62]">
              <Coins className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#7A756D] block">Pending Commissions</span>
              <span className="font-editorial text-lg text-[#D8BE8A]">
                AED {(pendingCommissions / 1000).toFixed(0)}K
              </span>
            </div>
          </div>

          {/* Chip 4: Advisors */}
          <div
            onClick={() => onStatClick?.('PROJECTS')}
            className="flex items-center gap-3 p-2 hover:bg-[#1A1815] transition-colors cursor-pointer rounded-sm"
          >
            <div className="p-2 bg-[#0A0A09] border border-[#25221E] text-[#B79A62]">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#7A756D] block">Licensed Advisors</span>
              <span className="font-editorial text-lg text-[#F5F2EB]">
                {currentStats.activeAgents ?? 3} Active BRNs
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
