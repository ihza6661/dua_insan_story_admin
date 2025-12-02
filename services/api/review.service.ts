import api from "@/lib/api";
import { Review, ReviewStatistics, SuccessResponse } from "@/lib/types";

interface ReviewsResponse {
    data: Review[];
    meta?: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

interface ReviewResponse {
    data: Review;
}

interface StatisticsResponse {
    data: ReviewStatistics;
}

interface GetReviewsParams {
    page?: number;
    per_page?: number;
    status?: 'pending' | 'approved' | 'rejected';
    rating?: number;
    product_id?: number;
    is_featured?: boolean;
}

export async function getReviews(params?: GetReviewsParams): Promise<ReviewsResponse> {
    const response = await api.get<ReviewsResponse>('/admin/reviews', { params });
    return response.data;
}

export async function getReviewById(id: number): Promise<Review> {
    const response = await api.get<ReviewResponse>(`/admin/reviews/${id}`);
    return response.data.data;
}

export async function approveReview(id: number): Promise<SuccessResponse> {
    const response = await api.post<SuccessResponse>(`/admin/reviews/${id}/approve`);
    return response.data;
}

export async function rejectReview(id: number): Promise<SuccessResponse> {
    const response = await api.post<SuccessResponse>(`/admin/reviews/${id}/reject`);
    return response.data;
}

export async function toggleFeaturedReview(id: number): Promise<SuccessResponse> {
    const response = await api.post<SuccessResponse>(`/admin/reviews/${id}/toggle-featured`);
    return response.data;
}

export async function addAdminResponse(id: number, response: string): Promise<SuccessResponse> {
    const apiResponse = await api.post<SuccessResponse>(`/admin/reviews/${id}/response`, {
        admin_response: response,
    });
    return apiResponse.data;
}

export async function deleteReview(id: number): Promise<SuccessResponse> {
    const response = await api.delete<SuccessResponse>(`/admin/reviews/${id}`);
    return response.data;
}

export async function getReviewStatistics(): Promise<ReviewStatistics> {
    const response = await api.get<StatisticsResponse>('/admin/reviews/statistics');
    return response.data.data;
}
