import api from "@/lib/api";
import { ProductSchema } from "@/lib/schemas";
import { Product } from "@/lib/types";

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
    });
    return response.data;
}

export async function updateProduct({ id, data }: { id: number, data: ProductSchema }): Promise<MutateProductResponse> {
    const response = await api.patch<MutateProductResponse>(`/admin/products/${id}`, {
        ...data,
        category_id: Number(data.category_id),
    });
    return response.data;
}

export async function deleteProduct(id: number): Promise<any> {
  const response = await api.delete(`/admin/products/${id}`);
  return response.data;
}

export async function uploadProductImages({ id, formData }: { id: number, formData: FormData }): Promise<any> {
    const response = await api.post(`/admin/products/${id}/images`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
}

export async function deleteProductImage(id: number): Promise<any> {
    const response = await api.delete(`/admin/images/${id}`);
    return response.data;
}

export async function createProductOption({ productId, data }: { productId: number, data: { attribute_value_id: number, price_adjustment: number } }): Promise<any> {
    const response = await api.post(`/admin/products/${productId}/options`, data);
    return response.data;
}

export async function deleteProductOption(id: number): Promise<any> {
    const response = await api.delete(`/admin/options/${id}`);
    return response.data;
}

export async function linkAddOnToProduct({ productId, addOnId }: { productId: number, addOnId: number }): Promise<any> {
    const response = await api.post(`/admin/products/${productId}/add-ons`, { add_on_id: addOnId });
    return response.data;
}

export async function unlinkAddOnFromProduct({ productId, addOnId }: { productId: number, addOnId: number }): Promise<any> {
    const response = await api.delete(`/admin/products/${productId}/add-ons/${addOnId}`);
    return response.data;
}