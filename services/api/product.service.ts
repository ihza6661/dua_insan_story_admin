import api from "@/lib/api";
import { ProductSchema, UpdateVariantSchema, VariantSchema } from "@/lib/schemas";
import { Product, ProductVariant } from "@/lib/types";

interface ProductsResponse {
    data: Product[];
}

interface ProductResponse {
    data: Product;
}

interface MutateProductResponse {
    message: string;
    data: Product;
}

interface VariantResponse {
    data: ProductVariant;
}

export async function getProducts(): Promise<Product[]> {
    const response = await api.get<ProductsResponse>('/admin/products');
    return response.data.data;
}

export async function getProductById(id: number): Promise<Product> {
    const response = await api.get<ProductResponse>(`/admin/products/${id}`);
    return response.data.data;
}

export async function createProduct(data: ProductSchema): Promise<MutateProductResponse> {
    const response = await api.post<MutateProductResponse>('/admin/products', {
        ...data,
        category_id: Number(data.category_id),
        weight: data.weight ?? null,
    });
    return response.data;
}

export async function updateProduct({ id, data }: { id: number, data: ProductSchema }): Promise<MutateProductResponse> {
    const response = await api.put<MutateProductResponse>(`/admin/products/${id}`, {
        ...data,
        category_id: Number(data.category_id),
        weight: data.weight ?? null,
    });
    return response.data;
}

export async function deleteProduct(id: number): Promise<unknown> {
    const response = await api.delete(`/admin/products/${id}`);
    return response.data;
}

export async function getVariantById(id: number): Promise<ProductVariant> {
    const response = await api.get<VariantResponse>(`/admin/variants/${id}`);
    return response.data.data;
}

export async function createProductVariant({ productId, data }: { productId: number, data: VariantSchema }): Promise<unknown> {
    const payload = {
        ...data,
        options: data.options.map(Number),
        weight: data.weight ?? null,
    };
    const response = await api.post(`/admin/products/${productId}/variants`, payload);
    return response.data;
}

export async function deleteProductVariant(id: number): Promise<unknown> {
    const response = await api.delete(`/admin/variants/${id}`);
    return response.data;
}

export async function updateProductVariant({ id, data }: { id: number, data: UpdateVariantSchema }): Promise<unknown> {
    const response = await api.put(`/admin/variants/${id}`, {
        ...data,
        weight: data.weight ?? null,
    });
    return response.data;
}

export async function uploadVariantImages({ variantId, formData }: { variantId: number, formData: FormData }): Promise<unknown> {
    const response = await api.post(`/admin/variants/${variantId}/images`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
}

export async function deleteVariantImage(id: number): Promise<unknown> {
    const response = await api.delete(`/admin/images/${id}`);
    return response.data;
}

export async function linkAddOnToProduct({ productId, addOnId, weight }: { productId: number, addOnId: number, weight?: number | null }): Promise<unknown> {
    const payload: Record<string, unknown> = { add_on_id: addOnId };
    if (weight !== undefined) {
        payload.weight = weight ?? null;
    }

    const response = await api.post(`/admin/products/${productId}/add-ons`, payload);
    return response.data;
}

export async function unlinkAddOnFromProduct({ productId, addOnId }: { productId: number, addOnId: number }): Promise<unknown> {
    const response = await api.delete(`/admin/products/${productId}/add-ons/${addOnId}`);
    return response.data;
}