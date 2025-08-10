import api from "@/lib/api";
import { GalleryItem } from "@/lib/types";

interface GalleryItemsResponse {
    data: GalleryItem[];
}

interface GalleryItemResponse {
    data: GalleryItem;
}

export async function getGalleryItems(): Promise<GalleryItem[]> {
    const response = await api.get<GalleryItemsResponse>('/admin/gallery-items');
    return response.data.data;
}

export async function getGalleryItemById(id: number): Promise<GalleryItem> {
    const response = await api.get<GalleryItemResponse>(`/admin/gallery-items/${id}`);
    return response.data.data;
}

export async function createGalleryItem(formData: FormData): Promise<any> {
    const response = await api.post('/admin/gallery-items', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
}

export async function updateGalleryItem({ id, formData }: { id: number, formData: FormData }): Promise<any> {
    formData.append('_method', 'PUT');
    const response = await api.post(`/admin/gallery-items/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
}

export async function deleteGalleryItem(id: number): Promise<any> {
    const response = await api.delete(`/admin/gallery-items/${id}`);
    return response.data;
}