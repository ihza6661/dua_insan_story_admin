import { useQuery } from '@tanstack/react-query';
import { getOrders, getOrderDetail } from '@/services/api/orders';
import { OrderFilters } from '@/lib/types';

export const useOrders = (filters?: OrderFilters) => {
  return useQuery({
    queryKey: ['orders', filters],
    queryFn: () => getOrders(filters),
  });
};

export const useOrderDetail = (orderId: string) => {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: () => getOrderDetail(orderId),
    enabled: !!orderId, // Only run the query if orderId is available
  });
};
