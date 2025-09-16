import { useQuery } from '@tanstack/react-query';
import { getOrders, getOrderDetail } from '@/services/api/orders';

export const useOrders = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: getOrders,
  });
};

export const useOrderDetail = (orderId: string) => {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: () => getOrderDetail(orderId),
    enabled: !!orderId, // Only run the query if orderId is available
  });
};
