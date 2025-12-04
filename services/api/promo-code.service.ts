import api from "@/lib/api";
import { PromoCode, PromoCodeStatistics, PaginatedResponse } from "@/lib/types";

export interface GetPromoCodesParams {
  status?: 'active' | 'inactive';
  search?: string;
  per_page?: number;
  page?: number;
}

export interface CreatePromoCodeData {
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_purchase?: number | null;
  max_discount?: number | null;
  usage_limit?: number | null;
  valid_from: string;
  valid_until: string;
  is_active?: boolean;
}

export interface UpdatePromoCodeData extends CreatePromoCodeData {
  id: number;
}

/**
 * Get all promo codes with filters
 */
export const getPromoCodes = async (params?: GetPromoCodesParams) => {
  const response = await api.get<{ message: string; data: PaginatedResponse<PromoCode> }>(
    '/admin/promo-codes',
    { params }
  );
  return response.data;
};

/**
 * Get single promo code by ID
 */
export const getPromoCode = async (id: number) => {
  const response = await api.get<{ message: string; data: PromoCode }>(
    `/admin/promo-codes/${id}`
  );
  return response.data;
};

/**
 * Create new promo code
 */
export const createPromoCode = async (data: CreatePromoCodeData) => {
  const response = await api.post<{ message: string; data: PromoCode }>(
    '/admin/promo-codes',
    data
  );
  return response.data;
};

/**
 * Update existing promo code
 */
export const updatePromoCode = async (id: number, data: CreatePromoCodeData) => {
  const response = await api.put<{ message: string; data: PromoCode }>(
    `/admin/promo-codes/${id}`,
    data
  );
  return response.data;
};

/**
 * Delete promo code
 */
export const deletePromoCode = async (id: number) => {
  const response = await api.delete<{ message: string }>(
    `/admin/promo-codes/${id}`
  );
  return response.data;
};

/**
 * Toggle promo code active status
 */
export const togglePromoCodeStatus = async (id: number) => {
  const response = await api.post<{ message: string; data: PromoCode }>(
    `/admin/promo-codes/${id}/toggle-status`
  );
  return response.data;
};

/**
 * Get promo code statistics
 */
export const getPromoCodeStatistics = async () => {
  const response = await api.get<{ message: string; data: PromoCodeStatistics }>(
    '/admin/promo-codes/statistics'
  );
  return response.data;
};
