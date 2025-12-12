import api from "@/lib/api";
import { PaginatedResponse, SuccessResponse } from "@/lib/types";

export interface DigitalInvitationData {
    template_name: string;
    couple_names: string;
    bride_name: string;
    groom_name: string;
    bride_parents: string | null;
    groom_parents: string | null;
    event_date: string;
    event_time: string;
    event_location: string;
    reception_date: string | null;
    reception_time: string | null;
    reception_location: string | null;
    venue_maps_url: string | null;
    additional_info: string | null;
    photos: string[];
}

export interface DigitalInvitation {
    id: number;
    user_id: number;
    user: {
        id: number;
        full_name: string;
        email: string;
        phone_number?: string | null;
    };
    template_id: number;
    template: {
        id: number;
        name: string;
        slug?: string;
        price?: number;
    };
    order_id: number | null;
    slug: string;
    status: 'draft' | 'active' | 'expired';
    activated_at: string | null;
    expires_at: string | null;
    scheduled_activation_at: string | null;
    view_count: number;
    last_viewed_at: string | null;
    created_at: string;
    updated_at: string;
    public_url: string;
    customization_data?: DigitalInvitationData | null;
}

export interface InvitationStatistics {
    total_invitations: number;
    active_invitations: number;
    draft_invitations: number;
    expired_invitations: number;
    scheduled_invitations: number;
    total_views: number;
    total_revenue: number;
    templates_count: number;
    active_templates: number;
}

interface InvitationStatisticsResponse {
    data: InvitationStatistics;
}

interface DigitalInvitationResponse {
    data: DigitalInvitation;
}

export interface DigitalInvitationFilters {
    status?: 'draft' | 'active' | 'expired';
    user_id?: number;
    template_id?: number;
    date_from?: string;
    date_to?: string;
    search?: string;
    per_page?: number;
    page?: number;
}

export async function getDigitalInvitations(
    filters?: DigitalInvitationFilters
): Promise<PaginatedResponse<DigitalInvitation>> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.user_id) params.append('user_id', filters.user_id.toString());
    if (filters?.template_id) params.append('template_id', filters.template_id.toString());
    if (filters?.date_from) params.append('date_from', filters.date_from);
    if (filters?.date_to) params.append('date_to', filters.date_to);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.per_page) params.append('per_page', filters.per_page.toString());
    if (filters?.page) params.append('page', filters.page.toString());

    const response = await api.get<PaginatedResponse<DigitalInvitation>>(
        `/admin/digital-invitations${params.toString() ? `?${params.toString()}` : ''}`
    );
    return response.data;
}

export async function getDigitalInvitationById(id: number): Promise<DigitalInvitation> {
    const response = await api.get<DigitalInvitationResponse>(`/admin/digital-invitations/${id}`);
    return response.data.data;
}

export async function getDigitalInvitationStatistics(): Promise<InvitationStatistics> {
    const response = await api.get<InvitationStatisticsResponse>(
        '/admin/digital-invitations/statistics'
    );
    return response.data.data;
}

export async function deleteDigitalInvitation(id: number): Promise<SuccessResponse> {
    const response = await api.delete<SuccessResponse>(`/admin/digital-invitations/${id}`);
    return response.data;
}

export interface ScheduledInvitation extends DigitalInvitation {
    scheduled_at_human: string;
    is_overdue: boolean;
}

export interface ScheduledInvitationFilters {
    search?: string;
    timeframe?: 'upcoming' | 'overdue';
    per_page?: number;
    page?: number;
}

export async function getScheduledInvitations(
    filters?: ScheduledInvitationFilters
): Promise<PaginatedResponse<ScheduledInvitation>> {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.timeframe) params.append('timeframe', filters.timeframe);
    if (filters?.per_page) params.append('per_page', filters.per_page.toString());
    if (filters?.page) params.append('page', filters.page.toString());

    const response = await api.get<PaginatedResponse<ScheduledInvitation>>(
        `/admin/digital-invitations/scheduled${params.toString() ? `?${params.toString()}` : ''}`
    );
    return response.data;
}

