declare module '@/components/admin/DashboardStats' {
  interface DashboardStatsProps {
    /** Optional live CRM offer count supplied by the admin dashboard. */
    activeOffers?: number;
    /** Optional live CRM deal count supplied by the admin dashboard. */
    activeDeals?: number;
  }
}
