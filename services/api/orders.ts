import api from '@/lib/api';
import { Order, PaginatedResponse, OrderFilters, BulkUpdateStatusRequest, ExportOrdersRequest } from '@/lib/types';

export const getOrders = async (filters?: OrderFilters): Promise<PaginatedResponse<Order>> => {
  const params = new URLSearchParams();
  
  if (filters?.search) params.append('search', filters.search);
  if (filters?.order_status && filters.order_status !== 'all') {
    params.append('order_status', filters.order_status);
  }
  if (filters?.payment_status && filters.payment_status !== 'all') {
    params.append('payment_status', filters.payment_status);
  }
  if (filters?.date_from) params.append('date_from', filters.date_from);
  if (filters?.date_to) params.append('date_to', filters.date_to);
  if (filters?.per_page) params.append('per_page', filters.per_page.toString());
  if (filters?.page) params.append('page', filters.page.toString());
  
  const response = await api.get(`/admin/orders?${params.toString()}`);
  
  return {
    data: response.data.data,
    meta: response.data.meta,
  };
};

export const getOrderDetail = async (orderId: string): Promise<Order> => {
  const response = await api.get(`/admin/orders/${orderId}`);
  return response.data.data;
};

export const bulkUpdateOrderStatus = async (request: BulkUpdateStatusRequest): Promise<{ message: string; data: { updated_count: number; total_count: number; errors: any[] } }> => {
  const response = await api.post('/admin/orders/bulk-update-status', request);
  return response.data;
};

export const exportOrders = async (request: ExportOrdersRequest): Promise<Blob> => {
  const response = await api.post('/admin/orders/export', request, {
    responseType: 'blob',
  });
  return response.data;
};
