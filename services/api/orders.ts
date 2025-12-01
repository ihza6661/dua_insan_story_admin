import api from '@/lib/api';
import { Order } from '@/lib/types';

export const getOrders = async (): Promise<Order[]> => {
  const response = await api.get('/admin/orders');
  return response.data.data;
};

export const getOrderDetail = async (orderId: string): Promise<Order> => {
  const response = await api.get(`/admin/orders/${orderId}`);
  return response.data.data;
};
