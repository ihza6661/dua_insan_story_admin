import api from '@/lib/api';

export interface DashboardStats {
  total_customers: number;
  total_orders: number;
  pending_orders: number;
  completed_orders: number;
  total_revenue: number;
  avg_order_value: number;
  cancellation_rate: number;
  cancelled_orders: number;
}

export interface RevenueTrend {
  date: string;
  revenue: number;
  order_count: number;
}

export interface StatusBreakdown {
  [status: string]: number;
}

export interface RecentOrder {
  id: number;
  order_number: string;
  customer_name: string;
  total_amount: number;
  order_status: string;
  payment_status: string;
  created_at: string;
}

export interface TopProduct {
  id: number;
  name: string;
  total_quantity: number;
  total_revenue: number;
}

export interface LowStockProduct {
  id: number;
  name: string;
  variant_id: number;
  stock: number;
  price: number;
}

export interface DashboardData {
  stats: DashboardStats;
  revenue_trend: RevenueTrend[];
  status_breakdown: StatusBreakdown;
  recent_orders: RecentOrder[];
  top_products: TopProduct[];
  low_stock_products: LowStockProduct[];
  date_range: {
    from: string;
    to: string;
  };
}

export interface DashboardFilters {
  date_from?: string;
  date_to?: string;
}

export const getDashboardData = async (filters?: DashboardFilters): Promise<DashboardData> => {
  try {
    const params = new URLSearchParams();
    if (filters?.date_from) params.append('date_from', filters.date_from);
    if (filters?.date_to) params.append('date_to', filters.date_to);
    
    const response = await api.get(`/admin/dashboard?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
};
