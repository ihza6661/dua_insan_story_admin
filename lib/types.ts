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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    image: any;
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