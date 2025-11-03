import api from '@/lib/api';

export interface DashboardStats {
  total_customers: number;
  total_orders: number;
  total_revenue: number;
  pending_orders: number;
}

export interface WeeklyRevenue {
  date: string;
  revenue: number;
}

export interface DashboardData {
  stats: DashboardStats;
  weekly_revenue: WeeklyRevenue[];
}

export const getDashboardData = async (): Promise<DashboardData> => {
  try {
    const response = await api.get('/admin/dashboard');
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
};
