import api from "@/lib/api";
import { Attribute } from "@/lib/types";

interface AttributesResponse {
    data: Attribute[];
}

export async function getAttributes(): Promise<Attribute[]> {
    const response = await api.get<AttributesResponse>('/admin/attributes');
    return response.data.data;
}