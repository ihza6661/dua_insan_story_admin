import api from '@/lib/api';
import { Order } from '@/lib/types';

export const getOrders = async (): Promise<Order[]> => {
  try {
    const response = await api.get('/admin/orders');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error; // Re-throw the error so react-query can catch it
  }
};

export const getOrderDetail = async (orderId: string): Promise<Order> => {
  try {
    const response = await api.get(`/admin/orders/${orderId}`);
    console.log(`API Response for order ${orderId}:`, response.data);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching order ${orderId}:`, error);
    throw error;
  }
};
