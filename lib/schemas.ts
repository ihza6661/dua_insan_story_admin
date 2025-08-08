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