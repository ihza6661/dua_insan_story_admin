/**
 * Order Status Constants
 * These match the backend database enum values exactly
 */

export const ORDER_STATUS = {
  PENDING_PAYMENT: 'Pending Payment',
  PARTIALLY_PAID: 'Partially Paid',
  PAID: 'Paid',
  PROCESSING: 'Processing',
  DESIGN_APPROVAL: 'Design Approval',
  IN_PRODUCTION: 'In Production',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  FAILED: 'Failed',
  REFUNDED: 'Refunded',
} as const;

export type OrderStatus = typeof ORDER_STATUS[keyof typeof ORDER_STATUS];

/**
 * Get Indonesian label for order status
 */
export function getOrderStatusLabel(status: string): string {
  const lowerCaseStatus = status ? status.toLowerCase() : '';

  switch (lowerCaseStatus) {
    case 'pending payment':
      return 'Menunggu Pembayaran';
    case 'partially paid':
      return 'DP Lunas';
    case 'paid':
      return 'Lunas';
    case 'processing':
      return 'Diproses';
    case 'design approval':
      return 'Persetujuan Desain';
    case 'in production':
      return 'Dalam Produksi';
    case 'shipped':
      return 'Dikirim';
    case 'delivered':
      return 'Terkirim';
    case 'completed':
      return 'Selesai';
    case 'cancelled':
      return 'Dibatalkan';
    case 'failed':
      return 'Gagal';
    case 'refunded':
      return 'Dikembalikan';
    default:
      return 'Status Tidak Diketahui';
  }
}

/**
 * Get badge variant for order status
 */
export function getOrderStatusVariant(
  status: string
): 'default' | 'secondary' | 'success' | 'destructive' {
  const lowerCaseStatus = status ? status.toLowerCase() : '';

  switch (lowerCaseStatus) {
    case 'pending payment':
    case 'partially paid':
      return 'secondary';
    case 'paid':
    case 'completed':
      return 'success';
    case 'cancelled':
    case 'failed':
    case 'refunded':
      return 'destructive';
    case 'processing':
    case 'design approval':
    case 'in production':
    case 'shipped':
    case 'delivered':
    default:
      return 'default';
  }
}
