export interface User {
    id: number;
    full_name: string;
    email: string;
    phone_number: string | null;
    role: 'admin' | 'customer';
}

export interface LoginSuccessResponse {
    message: string;
    data: {
        user: User;
        token: string;
    };
}

export interface GenericError {
    message: string;
}

export interface ValidationError {
    message: string;
    errors: {
        [key: string]: string[];
    };
}

export interface ProductCategory {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
    created_at: string;
}

export interface ProductImage {
    id: number;
    image: string;
    alt_text: string | null;
    is_featured: boolean;
}

export interface AttributeValue {
    id: number;
    value: string;
}

export interface Attribute {
    id: number;
    name: string;
    values: AttributeValue[];
}

export interface ProductOption {
    id: number;
    price_adjustment: number;
    value: AttributeValue;
}

export interface AddOn {
    id: number;
    name: string;
    price: number;
    description: string | null;
}

export interface Product {
    id: number;
    name: string;
    description: string | null;
    base_price: number;
    min_order_quantity: number;
    is_active: boolean;
    created_at: string;
    category: {
        id: number;
        name: string;
    };
    add_ons: AddOn[];
    featured_image: { image: string } | null;
    variants: ProductVariant[];
}

export interface GalleryItem {
    id: number;
    title: string | null;
    description: string | null;
    category: string | null;
    media_type: 'image' | 'video';
    file_url: string;
    product: {
        id: number;
        name: string;
    } | null;
    created_at: string;
}

export interface ProductVariantImage {
    id: number;
    image_url: string;
    alt_text: string | null;
    is_featured: boolean;
}

export interface ProductVariant {
    id: number;
    product_id: number;
    price: number;
    stock: number;
    options: AttributeValue[];
    images: ProductVariantImage[];
}