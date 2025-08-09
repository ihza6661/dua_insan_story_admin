import api from "@/lib/api";
import { AddOn } from "@/lib/types";

interface AddOnsResponse {
    data: AddOn[];
}

export async function getAddOns(): Promise<AddOn[]> {
    const response = await api.get<AddOnsResponse>('/admin/add-ons');
    return response.data.data;
}