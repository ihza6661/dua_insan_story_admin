import api from "@/lib/api";
import { SuccessResponse } from "@/lib/types";

export type FieldType = 'text' | 'textarea' | 'date' | 'time' | 'url' | 'email' | 'phone' | 'image' | 'color';
export type FieldCategory = 'couple' | 'event' | 'venue' | 'design' | 'general';

export interface ValidationRules {
    required?: boolean;
    min?: number;
    max?: number;
    pattern?: string;
}

export interface TemplateField {
    id: number;
    template_id: number;
    field_key: string;
    field_label: string;
    field_type: FieldType;
    field_category: FieldCategory;
    placeholder_text: string | null;
    default_value: string | null;
    help_text: string | null;
    validation_rules: ValidationRules;
    display_order: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

interface TemplateFieldsResponse {
    data: TemplateField[];
}

interface TemplateFieldResponse {
    data: TemplateField;
}

interface MutateTemplateFieldResponse {
    message: string;
    data: TemplateField;
}

export interface TemplateFieldFormData {
    field_key: string;
    field_label: string;
    field_type: FieldType;
    field_category: FieldCategory;
    placeholder_text?: string;
    default_value?: string;
    help_text?: string;
    validation_rules?: ValidationRules;
    display_order?: number;
    is_active?: boolean;
}

export async function getTemplateFields(templateId: number): Promise<TemplateField[]> {
    const response = await api.get<TemplateFieldsResponse>(
        `/admin/invitation-templates/${templateId}/fields`
    );
    return response.data.data;
}

export async function getTemplateFieldById(
    templateId: number,
    fieldId: number
): Promise<TemplateField> {
    const response = await api.get<TemplateFieldResponse>(
        `/admin/invitation-templates/${templateId}/fields/${fieldId}`
    );
    return response.data.data;
}

export async function createTemplateField(
    templateId: number,
    data: TemplateFieldFormData
): Promise<MutateTemplateFieldResponse> {
    const response = await api.post<MutateTemplateFieldResponse>(
        `/admin/invitation-templates/${templateId}/fields`,
        data
    );
    return response.data;
}

export async function updateTemplateField({
    templateId,
    fieldId,
    data,
}: {
    templateId: number;
    fieldId: number;
    data: Partial<TemplateFieldFormData>;
}): Promise<MutateTemplateFieldResponse> {
    const response = await api.put<MutateTemplateFieldResponse>(
        `/admin/invitation-templates/${templateId}/fields/${fieldId}`,
        data
    );
    return response.data;
}

export async function deleteTemplateField(
    templateId: number,
    fieldId: number
): Promise<SuccessResponse> {
    const response = await api.delete<SuccessResponse>(
        `/admin/invitation-templates/${templateId}/fields/${fieldId}`
    );
    return response.data;
}

export async function reorderTemplateFields(
    templateId: number,
    fieldOrder: { id: number; display_order: number }[]
): Promise<SuccessResponse> {
    const response = await api.post<SuccessResponse>(
        `/admin/invitation-templates/${templateId}/fields/reorder`,
        { field_order: fieldOrder }
    );
    return response.data;
}

export async function toggleTemplateFieldActive(
    templateId: number,
    fieldId: number
): Promise<{
    message: string;
    data: { id: number; is_active: boolean };
}> {
    const response = await api.post<{
        message: string;
        data: { id: number; is_active: boolean };
    }>(`/admin/invitation-templates/${templateId}/fields/${fieldId}/toggle-active`);
    return response.data;
}

export async function duplicateTemplateField(
    templateId: number,
    fieldId: number
): Promise<MutateTemplateFieldResponse> {
    const response = await api.post<MutateTemplateFieldResponse>(
        `/admin/invitation-templates/${templateId}/fields/${fieldId}/duplicate`
    );
    return response.data;
}
