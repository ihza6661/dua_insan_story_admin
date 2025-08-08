import api from "@/lib/api";
import { ProductCategory } from "@/lib/types";

interface CategoriesResponse {
    data: ProductCategory[];
}

interface CreateCategoryResponse {
    message: string;
    data: ProductCategory;
}

interface CategoryResponse {
    data: ProductCategory;
}

export async function getProductCategories(): Promise<ProductCategory[]> {
    const response = await api.get<CategoriesResponse>('/admin/product-categories');
    return response.data.data;
}

export async function createProductCategory(formData: FormData): Promise<CreateCategoryResponse> {
    const response = await api.post<CreateCategoryResponse>('/admin/product-categories', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
}

export async function getProductCategoryById(id: number): Promise<ProductCategory> {
    const response = await api.get<CategoryResponse>(`/admin/product-categories/${id}`);
    return response.data.data;
}

export async function updateProductCategory({ id, formData }: { id: number, formData: FormData }) {
    formData.append('_method', 'PUT'); 
    
    const response = await api.post(`/admin/product-categories/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
}

export async function deleteProductCategory(id: number) {
    const response = await api.delete(`/admin/product-categories/${id}`);
    return response.data;
}