import api from "@/lib/api";
import { AddOnSchema } from "@/lib/schemas";
import { AddOn } from "@/lib/types";

interface AddOnsResponse {
    data: AddOn[];
}

interface AddOnResponse {
    data: AddOn;
}

export async function getAddOns(): Promise<AddOn[]> {
    const response = await api.get<AddOnsResponse>('/admin/add-ons');
    return response.data.data;
}

export async function getAddOnById(id: number): Promise<AddOn> {
    const response = await api.get<AddOnResponse>(`/admin/add-ons/${id}`);
    return response.data.data;
}

export async function createAddOn(data: AddOnSchema): Promise<any> {
    const response = await api.post('/admin/add-ons', data);
    return response.data;
}

export async function updateAddOn({ id, data }: { id: number, data: AddOnSchema }): Promise<any> {
    const response = await api.patch(`/admin/add-ons/${id}`, data);
    return response.data;
}

export async function deleteAddOn(id: number): Promise<any> {
    const response = await api.delete(`/admin/add-ons/${id}`);
    return response.data;
}