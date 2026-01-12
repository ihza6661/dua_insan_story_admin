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

export interface SuccessResponse {
    message: string;
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
    image_url: string | null;
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
    weight: number | null;
    pivot?: {
        weight: number | null;
    };
}

export interface Product {
    id: number;
    name: string;
    description: string | null;
    base_price: number;
    weight: number | null;
    min_order_quantity: number;
    is_active: boolean;
    created_at: string;
    category: {
        id: number;
        name: string;
    };
    add_ons: AddOn[];
    featured_image: { image: string; image_url?: string | null } | null;
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
    image: string;
    image_url: string;
    alt_text: string | null;
    is_featured: boolean;
}

export interface ProductVariant {
    id: number;
    product_id: number;
    price: number;
    stock: number;
    weight: number | null;
    options: AttributeValue[];
    images: ProductVariantImage[];
}

export interface OrderItem {
    id: number;
    product_name: string;
    quantity: number;
    price: number;
    subtotal: number;
}

export interface InvitationDetail {
    bride_full_name: string;
    groom_full_name: string;
    bride_nickname: string;
    groom_nickname: string;
    bride_parents: string;
    groom_parents: string;
    akad_date: string;
    akad_time: string;
    akad_location: string;
    reception_date: string;
    reception_time: string;
    reception_location: string;
    gmaps_link: string | null;
    prewedding_photo: string | null;
}

export type OrderStatus = 
    | 'Pending Payment'
    | 'Partially Paid'
    | 'Paid'
    | 'Processing'
    | 'Design Approval'
    | 'In Production'
    | 'Shipped'
    | 'Delivered'
    | 'Completed'
    | 'Cancelled'
    | 'Failed'
    | 'Refunded';

export interface Order {
    order_status: OrderStatus;
    id: number;
    user_id: number;
    user_full_name: string;
    status: string;
    total_amount: number;
    payment_status: string;
    amount_paid: number;
    remaining_balance: number;
    created_at: string;
    shipping_address: string;
    shipping_method?: string;
    shipping_cost?: number;
    shipping_service?: string;
    courier?: string;
    billing_address: string;
    order_items: OrderItem[];
    invitation_detail?: InvitationDetail;
    payments: OrderPayment[];
}

export interface OrderPayment {
    id: number;
    payment_date: string;
    amount: number;
    payment_method: string;
    status: string;
}

export interface DesignProof {
    id: number;
    order_item_id: number;
    uploaded_by: number;
    version: number;
    file_url: string;
    file_name: string | null;
    file_type: string | null;
    file_size: number | null;
    thumbnail_url: string | null;
    full_file_url?: string | null;
    full_thumbnail_url?: string | null;
    status: 'pending_approval' | 'approved' | 'revision_requested' | 'rejected';
    reviewed_at: string | null;
    reviewed_by: number | null;
    customer_feedback: string | null;
    admin_notes: string | null;
    customer_notified: boolean;
    customer_notified_at: string | null;
    created_at: string;
    updated_at: string;
    uploaded_by_user?: User;
    reviewed_by_user?: User;
    order_item?: OrderItem;
}

export interface ReviewImage {
    id: number;
    image_url: string;
}

export interface Review {
    id: number;
    user_id: number;
    user_name: string;
    product_id: number;
    product_name: string;
    order_item_id: number;
    rating: number;
    comment: string | null;
    is_verified_purchase: boolean;
    status: 'pending' | 'approved' | 'rejected';
    is_featured: boolean;
    helpful_count: number;
    admin_response: string | null;
    admin_response_at: string | null;
    created_at: string;
    updated_at: string;
    images: ReviewImage[];
}

export interface ReviewStatistics {
    total_reviews: number;
    pending_reviews: number;
    approved_reviews: number;
    rejected_reviews: number;
    average_rating: number;
    rating_breakdown: {
        '5': number;
        '4': number;
        '3': number;
        '2': number;
        '1': number;
    };
}

export interface PaginationMeta {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: PaginationMeta;
}

export interface OrderFilters {
    search?: string;
    order_status?: string;
    payment_status?: string;
    date_from?: string;
    date_to?: string;
    per_page?: number;
    page?: number;
}

export interface BulkUpdateStatusRequest {
    order_ids: number[];
    order_status: string;
    tracking_number?: string;
}

export interface ExportOrdersRequest {
    format?: 'csv' | 'excel';
    order_ids?: number[];
    search?: string;
    order_status?: string;
    payment_status?: string;
    date_from?: string;
    date_to?: string;
}

export interface PromoCodeUsage {
    id: number;
    user_id: number;
    promo_code_id: number;
    used_at: string;
    user?: User;
}

export interface PromoCode {
    id: number;
    code: string;
    discount_type: 'percentage' | 'fixed';
    discount_value: number;
    min_purchase: number | null;
    max_discount: number | null;
    usage_limit: number | null;
    times_used: number;
    valid_from: string;
    valid_until: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    usages?: PromoCodeUsage[];
}

export interface PromoCodeStatistics {
    total_promo_codes: number;
    active_promo_codes: number;
    total_usages: number;
    most_used_promo_codes: Array<{
        code: string;
        discount_type: string;
        discount_value: number;
        times_used: number;
        usage_limit: number | null;
    }>;
}