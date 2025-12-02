import api from '@/lib/api';

export interface CancellationRequest {
  id: number;
  order_id: number;
  requested_by: number;
  cancellation_reason: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewed_by?: number;
  reviewed_at?: string;
  admin_notes?: string;
  refund_initiated: boolean;
  refund_amount?: number;
  refund_transaction_id?: string;
  refund_status?: 'pending' | 'processing' | 'completed' | 'failed';
  stock_restored: boolean;
  created_at: string;
  updated_at: string;
  order?: {
    id: number;
    order_number: string;
    total_amount: number;
    order_status: string;
    customer?: {
      id: number;
      full_name: string;
      email: string;
    };
  };
  requested_by_user?: {
    id: number;
    full_name: string;
    email: string;
  };
  reviewed_by_user?: {
    id: number;
    full_name: string;
  };
}

export interface CancellationRequestsResponse {
  data: CancellationRequest[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface CancellationStatistics {
  pending: number;
  approved: number;
  rejected: number;
  total: number;
}

// Get list of cancellation requests
export const getCancellationRequests = async (
  status: 'pending' | 'approved' | 'rejected' = 'pending',
  page: number = 1
): Promise<CancellationRequestsResponse> => {
  const response = await api.get<CancellationRequestsResponse>(
    `/admin/cancellation-requests?status=${status}&page=${page}`
  );
  return response.data;
};

// Get single cancellation request
export const getCancellationRequest = async (
  id: number
): Promise<CancellationRequest> => {
  const response = await api.get<{ data: CancellationRequest }>(
    `/admin/cancellation-requests/${id}`
  );
  return response.data.data;
};

// Approve cancellation request
export const approveCancellation = async (
  id: number,
  notes?: string
): Promise<{ message: string; data: CancellationRequest }> => {
  const response = await api.post<{ message: string; data: CancellationRequest }>(
    `/admin/cancellation-requests/${id}/approve`,
    { notes }
  );
  return response.data;
};

// Reject cancellation request
export const rejectCancellation = async (
  id: number,
  notes: string
): Promise<{ message: string; data: CancellationRequest }> => {
  const response = await api.post<{ message: string; data: CancellationRequest }>(
    `/admin/cancellation-requests/${id}/reject`,
    { notes }
  );
  return response.data;
};

// Get cancellation statistics
export const getCancellationStatistics = async (): Promise<CancellationStatistics> => {
  const response = await api.get<{ data: CancellationStatistics }>(
    '/admin/cancellation-requests/statistics/summary'
  );
  return response.data.data;
};
