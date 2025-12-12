import api from "@/lib/api";
import { SuccessResponse } from "@/lib/types";

export interface UGCItem {
  id: number;
  user_id: number;
  product_id: number | null;
  order_id: number | null;
  digital_invitation_id: number | null;
  image_path: string;
  image_url: string;
  caption: string | null;
  instagram_url: string | null;
  instagram_handle: string | null;
  is_approved: boolean;
  is_featured: boolean;
  approved_at: string | null;
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  product?: {
    id: number;
    name: string;
    slug: string;
  };
  order?: {
    id: number;
    order_number: string;
  };
}

interface UGCResponse {
  data: UGCItem[];
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

interface GetUGCParams {
  page?: number;
  per_page?: number;
  is_approved?: boolean;
  is_featured?: boolean;
  user_id?: number;
  product_id?: number;
}

export async function getAllUGC(params?: GetUGCParams): Promise<UGCResponse> {
  const response = await api.get<UGCResponse>("/admin/ugc", { params });
  return response.data;
}

export async function approveUGC(id: number): Promise<SuccessResponse> {
  const response = await api.post<SuccessResponse>(`/admin/ugc/${id}/approve`);
  return response.data;
}

export async function unapproveUGC(id: number): Promise<SuccessResponse> {
  const response = await api.post<SuccessResponse>(
    `/admin/ugc/${id}/unapprove`
  );
  return response.data;
}

export async function toggleFeaturedUGC(id: number): Promise<SuccessResponse> {
  const response = await api.post<SuccessResponse>(
    `/admin/ugc/${id}/toggle-featured`
  );
  return response.data;
}

export async function deleteUGC(id: number): Promise<SuccessResponse> {
  const response = await api.delete<SuccessResponse>(`/admin/ugc/${id}`);
  return response.data;
}
