import api from "@/lib/api";
import { AttributeSchema } from "@/lib/schemas";
import { Attribute } from "@/lib/types";

interface AttributesResponse {
    data: Attribute[];
}

interface AttributeResponse {
    data: Attribute;
}

export async function getAttributes(): Promise<Attribute[]> {
    const response = await api.get<AttributesResponse>('/admin/attributes');
    return response.data.data;
}

export async function getAttributeById(id: number): Promise<Attribute> {
    const response = await api.get<AttributeResponse>(`/admin/attributes/${id}`);
    return response.data.data;
}

export async function createAttribute(data: AttributeSchema): Promise<any> {
    const response = await api.post('/admin/attributes', data);
    return response.data;
}

export async function updateAttribute({ id, data }: { id: number, data: AttributeSchema }): Promise<any> {
    const response = await api.patch(`/admin/attributes/${id}`, data);
    return response.data;
}

export async function deleteAttribute(id: number): Promise<any> {
    const response = await api.delete(`/admin/attributes/${id}`);
    return response.data;
}