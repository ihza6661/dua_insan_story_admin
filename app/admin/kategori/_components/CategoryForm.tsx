"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { categorySchema, CategorySchema } from "@/lib/schemas";
import { createProductCategory, updateProductCategory } from "@/services/api/product-category.service";
import { GenericError, ProductCategory } from "@/lib/types";
import { getImageUrl } from "@/lib/utils";

interface SuccessResponse {
  message: string;
}

interface CategoryFormProps {
  initialData?: ProductCategory;
}

export function CategoryForm({ initialData }: CategoryFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isEditMode = !!initialData;

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<CategorySchema>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      image: undefined,
    },
  });

  const imageFile = form.watch("image");

  useEffect(() => {
    if (isEditMode && initialData?.image_url) {
      setImagePreview(getImageUrl(initialData.image_url));
    }
  }, [initialData, isEditMode]);

  useEffect(() => {
    if (imageFile && imageFile.length > 0) {
      const file = imageFile[0];
      const newPreviewUrl = URL.createObjectURL(file);
      setImagePreview(newPreviewUrl);

      return () => URL.revokeObjectURL(newPreviewUrl);
    }
  }, [imageFile]);


  const { mutate: createMutate, isPending: isCreating } = useMutation({
    mutationFn: createProductCategory,
    onSuccess: (response: SuccessResponse) => {
      toast.success("Kategori Dibuat", {
        description: response.message,
      });
      queryClient.invalidateQueries({ queryKey: ['product-categories'] });
      router.push("/admin/kategori");
    },
    onError: (error: AxiosError<GenericError>) => {
      const errorMessage = error.response?.data?.message || "Terjadi kesalahan pada server.";
      toast.error("Gagal Membuat Kategori", {
        description: errorMessage,
      });
    }
  });

  const { mutate: updateMutate, isPending: isUpdating } = useMutation({
    mutationFn: updateProductCategory,
    onSuccess: (response: SuccessResponse) => {
      toast.success("Kategori Diperbarui", { description: response.message });
      queryClient.invalidateQueries({ queryKey: ['product-categories'] });
      queryClient.invalidateQueries({ queryKey: ['product-category', initialData!.id] });
      router.push("/admin/kategori");
    },
    onError: (error: AxiosError<GenericError>) => {
      const errorMessage = error.response?.data?.message || "Terjadi kesalahan pada server.";
      toast.error("Gagal Memperbarui Kategori", { description: errorMessage });
    }
  });

  const isPending = isCreating || isUpdating;

  const onSubmit = (data: CategorySchema) => {
    const formData = new FormData();
    formData.append("name", data.name);
    if (data.description) {
      formData.append("description", data.description);
    }
    if (data.image && data.image.length > 0) {
      formData.append("image", data.image[0]);
    }
    
    if (isEditMode) {
      updateMutate({ id: initialData.id, formData });
    } else {
      createMutate(formData);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Nama Kategori</Label>
        <Input
          id="name"
          placeholder="Contoh: Undangan Pernikahan"
          {...form.register("name")}
          disabled={isPending}
        />
        {form.formState.errors.name && (
          <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Deskripsi (Opsional)</Label>
        <Textarea
          id="description"
          placeholder="Jelaskan tentang kategori ini"
          {...form.register("description")}
          disabled={isPending}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Gambar</Label>
        {imagePreview && (
          <div className="mb-4">
            <p className="text-sm text-muted-foreground mb-2">Pratinjau:</p>
            <div className="w-48 h-32 relative rounded-md overflow-hidden bg-muted">
              <Image
                src={imagePreview}
                alt="Pratinjau gambar"
                fill
                sizes="12rem"
                className="object-cover"
              />
            </div>
          </div>
        )}
        <Input
          id="image"
          type="file"
          accept="image/png, image/jpeg, image/webp"
          {...form.register("image")}
          disabled={isPending}
        />
        <p className="text-xs text-muted-foreground">
          {isEditMode ? "Pilih file baru untuk mengganti gambar saat ini." : "Opsional."}
        </p>
        {form.formState.errors.image && (
          <p className="text-sm text-destructive">{`${form.formState.errors.image.message}`}</p>
        )}
      </div>

      <div className="flex justify-end gap-2">
         <Button 
            type="button" 
            variant="outline" 
            onClick={() => router.back()}
            disabled={isPending}
        >
            Batal
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Menyimpan..." : (isEditMode ? "Simpan Perubahan" : "Simpan Kategori")}
        </Button>
      </div>
    </form>
  );
}