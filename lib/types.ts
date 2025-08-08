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