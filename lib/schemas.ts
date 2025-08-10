import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string().email({ message: "Format email tidak valid." }),
    password: z.string().min(6, { message: "Password minimal harus 6 karakter." }),
});

export type LoginSchema = z.infer<typeof loginSchema>;

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const categorySchema = z.object({
    name: z.string().min(3, { message: "Nama kategori minimal harus 3 karakter." }),
    description: z.string().optional(),
    image: z
        .any()
        .refine((files) => !files || files?.[0]?.size <= MAX_FILE_SIZE, `Ukuran file maksimal adalah 2MB.`)
        .refine(
            (files) => !files || ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
            "Hanya format .jpg, .jpeg, .png, dan .webp yang didukung."
        )
        .optional(),
});

export type CategorySchema = z.infer<typeof categorySchema>;

export const productSchema = z.object({
    name: z.string().min(3, { message: "Nama produk minimal harus 3 karakter." }),
    category_id: z.string().min(1, { message: "Kategori wajib dipilih." }),
    description: z.string().optional(),
    base_price: z.coerce.number().min(1, { message: "Harga dasar harus diisi." }),
    min_order_quantity: z.coerce.number().min(1, { message: "Minimal order harus diisi." }),
    is_active: z.boolean().default(true),
});

export type ProductSchema = z.infer<typeof productSchema>;

export const attributeSchema = z.object({
    name: z.string().min(3, { message: "Nama atribut minimal harus 3 karakter." }),
});

export type AttributeSchema = z.infer<typeof attributeSchema>;

export const attributeValueSchema = z.object({
    value: z.string().min(1, { message: "Nilai tidak boleh kosong." }),
});

export type AttributeValueSchema = z.infer<typeof attributeValueSchema>;

export const addOnSchema = z.object({
    name: z.string().min(3, { message: "Nama item minimal harus 3 karakter." }),
    price: z.coerce.number().min(0, { message: "Harga tidak boleh negatif." }),
});

export type AddOnSchema = z.infer<typeof addOnSchema>;

export const userSchema = z.object({
    full_name: z.string().min(3, { message: "Nama lengkap minimal harus 3 karakter." }),
    email: z.string().email({ message: "Format email tidak valid." }),
    phone_number: z.string().optional(),
    password: z.string().min(8, { message: "Password minimal harus 8 karakter." }),
    password_confirmation: z.string(),
}).refine((data) => data.password === data.password_confirmation, {
    message: "Konfirmasi password tidak cocok.",
    path: ["password_confirmation"],
});

export type UserSchema = z.infer<typeof userSchema>;

export const updateUserSchema = z.object({
    full_name: z.string().min(3, { message: "Nama lengkap minimal harus 3 karakter." }),
    email: z.string().email({ message: "Format email tidak valid." }),
    phone_number: z.string().optional(),
    password: z.string().min(8, { message: "Password minimal harus 8 karakter." }).optional().or(z.literal('')),
    password_confirmation: z.string().optional(),
}).refine((data) => data.password === data.password_confirmation, {
    message: "Konfirmasi password tidak cocok.",
    path: ["password_confirmation"],
});

export type UpdateUserSchema = z.infer<typeof updateUserSchema>;

const MAX_FILE_SIZE_GALLERY = 20 * 1024 * 1024; // 20MB
const ACCEPTED_MEDIA_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "video/mp4", "video/webm"];

export const galleryItemSchema = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    category: z.string().optional(),
    product_id: z.string().optional(),
    file: z
        .any()
        .refine((files) => files?.[0], "File tidak boleh kosong.")
        .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE_GALLERY, `Ukuran file maksimal adalah 20MB.`)
        .refine(
            (files) => ACCEPTED_MEDIA_TYPES.includes(files?.[0]?.type),
            "Hanya format .jpg, .jpeg, .png, .webp, .mp4, dan .webm yang didukung."
        ),
});

export type GalleryItemSchema = z.infer<typeof galleryItemSchema>;

export const updateGalleryItemSchema = galleryItemSchema.extend({
    file: z.any().optional(),
});

export type UpdateGalleryItemSchema = z.infer<typeof updateGalleryItemSchema>;

