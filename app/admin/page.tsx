"use client";

import { useAuthStore } from "@/store/auth.store";
import { useQuery } from "@tanstack/react-query";
import { getDashboardData } from "@/services/api/dashboard";
import { DollarSign, Users, CreditCard, Activity, ShoppingCart, TrendingUp, XCircle } from "lucide-react";
import { formatRupiah } from "@/lib/utils";
import dynamic from "next/dynamic";
import { useState, useMemo } from "react";
import { DateRange } from "react-day-picker";
import { format, subDays } from "date-fns";
import { DateRangeSelector } from "@/components/dashboard/DateRangeSelector";
import { StatCard } from "@/components/dashboard/StatCard";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load heavy components to reduce initial bundle size
const DashboardCharts = dynamic(
  () => import("@/components/dashboard/DashboardCharts").then((mod) => ({ default: mod.DashboardCharts })),
  {
    ssr: false,
    loading: () => (
      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-[400px]" />
        <Skeleton className="h-[400px]" />
      </div>
    ),
  }
);

const RecentOrdersWidget = dynamic(
  () => import("@/components/dashboard/RecentOrdersWidget").then((mod) => ({ default: mod.RecentOrdersWidget })),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[400px]" />,
  }
);

const TopProductsWidget = dynamic(
  () => import("@/components/dashboard/TopProductsWidget").then((mod) => ({ default: mod.TopProductsWidget })),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[300px]" />,
  }
);

const LowStockWidget = dynamic(
  () => import("@/components/dashboard/LowStockWidget").then((mod) => ({ default: mod.LowStockWidget })),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[300px]" />,
  }
);

const STATUS_COLORS: { [key: string]: string } = {
  "Pending Payment": "#f59e0b",
  "Partially Paid": "#3b82f6",
  "Paid": "#10b981",
  "Processing": "#8b5cf6",
  "Design Approval": "#ec4899",
  "In Production": "#6366f1",
  "Shipped": "#14b8a6",
  "Delivered": "#22c55e",
  "Completed": "#059669",
  "Cancelled": "#ef4444",
  "Failed": "#dc2626",
  "Refunded": "#f97316",
};

export default function AdminDashboardPage() {
  const user = useAuthStore((state) => state.user);
  
  // Default to last 30 days
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 29),
    to: new Date(),
  });

  const filters = useMemo(() => {
    if (!dateRange?.from || !dateRange?.to) return undefined;
    return {
      date_from: format(dateRange.from, "yyyy-MM-dd"),
      date_to: format(dateRange.to, "yyyy-MM-dd"),
    };
  }, [dateRange]);

  const { data, isLoading } = useQuery({
    queryKey: ["dashboardData", filters],
    queryFn: () => getDashboardData(filters),
  });

  const stats = data?.stats;
  const revenueTrend = data?.revenue_trend || [];
  const statusBreakdown = data?.status_breakdown || {};
  const recentOrders = data?.recent_orders || [];
  const topProducts = data?.top_products || [];
  const lowStockProducts = data?.low_stock_products || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Selamat Datang, {user?.full_name}!
          </h1>
          <p className="text-muted-foreground">
            Ini adalah halaman dashboard panel admin Anda.
          </p>
        </div>
        <DateRangeSelector value={dateRange} onChange={setDateRange} />
      </div>

      {/* Stats Grid */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Pendapatan"
            value={formatRupiah(stats?.total_revenue ?? 0)}
            icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
            description="Dari pesanan selesai"
          />
          <StatCard
            title="Total Pelanggan"
            value={stats?.total_customers ?? 0}
            icon={<Users className="h-4 w-4 text-muted-foreground" />}
          />
          <StatCard
            title="Total Pesanan"
            value={stats?.total_orders ?? 0}
            icon={<CreditCard className="h-4 w-4 text-muted-foreground" />}
            description="Dalam periode terpilih"
          />
          <StatCard
            title="Pesanan Tertunda"
            value={stats?.pending_orders ?? 0}
            icon={<Activity className="h-4 w-4 text-muted-foreground" />}
            description="Menunggu pembayaran"
          />
          <StatCard
            title="Pesanan Selesai"
            value={stats?.completed_orders ?? 0}
            icon={<ShoppingCart className="h-4 w-4 text-muted-foreground" />}
            description="Dalam periode terpilih"
          />
          <StatCard
            title="Rata-rata Order"
            value={formatRupiah(stats?.avg_order_value ?? 0)}
            icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
            description="Nilai rata-rata pesanan"
          />
          <StatCard
            title="Tingkat Pembatalan"
            value={`${stats?.cancellation_rate ?? 0}%`}
            icon={<XCircle className="h-4 w-4 text-muted-foreground" />}
            description={`${stats?.cancelled_orders ?? 0} pesanan dibatalkan`}
          />
          <StatCard
            title="Stok Rendah"
            value={lowStockProducts.length}
            icon={<Activity className="h-4 w-4 text-amber-500" />}
            description="Produk perlu restock"
          />
        </div>
      )}

      {/* Charts Row - Lazy loaded */}
      {isLoading ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-[400px]" />
          <Skeleton className="h-[400px]" />
        </div>
      ) : (
        <DashboardCharts
          revenueTrend={revenueTrend}
          statusBreakdown={statusBreakdown}
          statusColors={STATUS_COLORS}
        />
      )}

      {/* Widgets Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        {isLoading ? (
          <Skeleton className="h-[400px]" />
        ) : (
          <RecentOrdersWidget orders={recentOrders} />
        )}

        {/* Top Products */}
        {isLoading ? (
          <Skeleton className="h-[400px]" />
        ) : (
          <TopProductsWidget products={topProducts} />
        )}
      </div>

      {/* Low Stock Alert */}
      {!isLoading && lowStockProducts.length > 0 && (
        <LowStockWidget products={lowStockProducts} />
      )}
    </div>
  );
}
