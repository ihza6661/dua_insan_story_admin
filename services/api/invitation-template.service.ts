import api from "@/lib/api";
import { SuccessResponse } from "@/lib/types";

export interface InvitationTemplate {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    thumbnail_image: string | null;
    thumbnail_url: string | null;
    price: number;
    template_component: string;
    is_active: boolean;
    usage_count: number;
    invitations_count?: number;
    created_at: string;
}

interface InvitationTemplatesResponse {
    data: InvitationTemplate[];
}

interface InvitationTemplateResponse {
    data: InvitationTemplate;
}

interface MutateInvitationTemplateResponse {
    message: string;
    data: InvitationTemplate;
}

export interface InvitationTemplateFormData {
    name: string;
    slug?: string;
    description?: string;
    thumbnail_image?: File;
    price: number;
    template_component: string;
    is_active?: boolean;
}

export async function getInvitationTemplates(filters?: {
    is_active?: boolean;
    search?: string;
}): Promise<InvitationTemplate[]> {
    const params = new URLSearchParams();
    if (filters?.is_active !== undefined) {
        params.append('is_active', filters.is_active.toString());
    }
    if (filters?.search) {
        params.append('search', filters.search);
    }

    const response = await api.get<InvitationTemplatesResponse>(
        `/admin/invitation-templates${params.toString() ? `?${params.toString()}` : ''}`
    );
    return response.data.data;
}

export async function getInvitationTemplateById(id: number): Promise<InvitationTemplate> {
    const response = await api.get<InvitationTemplateResponse>(`/admin/invitation-templates/${id}`);
    return response.data.data;
}

export async function createInvitationTemplate(
    data: InvitationTemplateFormData
): Promise<MutateInvitationTemplateResponse> {
    const formData = new FormData();
    formData.append('name', data.name);
    if (data.slug) formData.append('slug', data.slug);
    if (data.description) formData.append('description', data.description);
    if (data.thumbnail_image) formData.append('thumbnail_image', data.thumbnail_image);
    formData.append('price', data.price.toString());
    formData.append('template_component', data.template_component);
    if (data.is_active !== undefined) formData.append('is_active', data.is_active ? '1' : '0');

    const response = await api.post<MutateInvitationTemplateResponse>(
        '/admin/invitation-templates',
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }
    );
    return response.data;
}

export async function updateInvitationTemplate({
    id,
    data,
}: {
    id: number;
    data: Partial<InvitationTemplateFormData>;
}): Promise<MutateInvitationTemplateResponse> {
    const formData = new FormData();
    if (data.name) formData.append('name', data.name);
    if (data.slug) formData.append('slug', data.slug);
    if (data.description !== undefined) formData.append('description', data.description);
    if (data.thumbnail_image) formData.append('thumbnail_image', data.thumbnail_image);
    if (data.price !== undefined) formData.append('price', data.price.toString());
    if (data.template_component) formData.append('template_component', data.template_component);
    if (data.is_active !== undefined) formData.append('is_active', data.is_active ? '1' : '0');

    const response = await api.post<MutateInvitationTemplateResponse>(
        `/admin/invitation-templates/${id}?_method=PUT`,
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }
    );
    return response.data;
}

export async function deleteInvitationTemplate(id: number): Promise<SuccessResponse> {
    const response = await api.delete<SuccessResponse>(`/admin/invitation-templates/${id}`);
    return response.data;
}

export async function toggleInvitationTemplateActive(id: number): Promise<{
    message: string;
    data: { id: number; is_active: boolean };
}> {
    const response = await api.post<{
        message: string;
        data: { id: number; is_active: boolean };
    }>(`/admin/invitation-templates/${id}/toggle-active`);
    return response.data;
}
