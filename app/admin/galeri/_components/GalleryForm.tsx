"use client";

import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { galleryItemSchema, GalleryItemSchema, updateGalleryItemSchema, UpdateGalleryItemSchema } from "@/lib/schemas";
import { createGalleryItem, updateGalleryItem } from "@/services/api/gallery.service";
import { getProducts } from "@/services/api/product.service";
import { GalleryItem, GenericError } from "@/lib/types";

interface GalleryFormProps {
  initialData?: GalleryItem;
}

export function GalleryForm({ initialData }: GalleryFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isEditMode = !!initialData;

  const [preview, setPreview] = useState<{ url: string; type: 'image' | 'video' } | null>(null);

  const { data: products, isLoading: isLoadingProducts } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  });

  const form = useForm<GalleryItemSchema | UpdateGalleryItemSchema>({
    resolver: zodResolver(isEditMode ? updateGalleryItemSchema : galleryItemSchema) as any,
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      category: initialData?.category || "",
      product_id: initialData?.product?.id.toString() || "unlinked",
    },
  });

  const fileField = form.watch("file");

  useEffect(() => {
    if (isEditMode && initialData?.file_url) {
      setPreview({
        url: `${initialData.file_url}`,
        type: initialData.media_type,
      });
    }
  }, [initialData, isEditMode]);

  useEffect(() => {
    if (fileField && fileField.length > 0) {
      const file = fileField[0];
      const url = URL.createObjectURL(file);
      const type = file.type.startsWith("image/") ? 'image' : 'video';
      setPreview({ url, type });

      return () => URL.revokeObjectURL(url);
    } else {
      if (isEditMode && initialData?.file_url) {
        setPreview({
          url: `${initialData.file_url}`,
          type: initialData.media_type,
        });
      } else {
        setPreview(null);
      }
    }
  }, [fileField, initialData, isEditMode]);

  const { mutate: createMutate, isPending: isCreating } = useMutation({
    mutationFn: createGalleryItem,
    onSuccess: () => {
      toast.success("Item galeri berhasil diunggah.");
      queryClient.invalidateQueries({ queryKey: ["gallery-items"] });
      router.push("/admin/galeri");
    },
    onError: (error: AxiosError<GenericError>) => {
      toast.error(error.response?.data?.message || "Gagal mengunggah item.");
    },
  });

  const { mutate: updateMutate, isPending: isUpdating } = useMutation({
    mutationFn: updateGalleryItem,
    onSuccess: () => {
      toast.success("Item galeri berhasil diperbarui.");
      queryClient.invalidateQueries({ queryKey: ["gallery-items"] });
      queryClient.invalidateQueries({ queryKey: ["gallery-item", initialData?.id] });
      router.push("/admin/galeri");
    },
    onError: (error: AxiosError<GenericError>) => {
      toast.error(error.response?.data?.message || "Gagal memperbarui item.");
    },
  });

  const isPending = isCreating || isUpdating;

  const onSubmit: SubmitHandler<GalleryItemSchema | UpdateGalleryItemSchema> = (data) => {
    const formData = new FormData();
    formData.append("title", data.title || "");
    formData.append("description", data.description || "");
    formData.append("category", data.category || "");
    formData.append("product_id", data.product_id === "unlinked" ? "" : data.product_id || "");
    if (data.file && data.file.length > 0) {
      formData.append("file", data.file[0]);
    }

    if (isEditMode) {
      updateMutate({ id: initialData.id, formData });
    } else {
      createMutate(formData);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {preview && (
          <div className="space-y-2">
            <FormLabel>Pratinjau</FormLabel>
            <div className="w-full aspect-square relative rounded-md overflow-hidden bg-muted">
              {preview.type === 'image' ? (
                <Image 
                  src={preview.url} 
                  alt="Pratinjau media" 
                  fill 
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <video src={preview.url} controls className="w-full h-full object-cover" />
              )}
            </div>
          </div>
        )}

        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{isEditMode ? "Ganti File Media (Opsional)" : "File Media"}</FormLabel>
              <FormControl>
                <Input 
                  type="file" 
                  accept="image/*,video/mp4,video/webm"
                  onChange={(e) => field.onChange(e.target.files)}
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Judul (Opsional)</FormLabel>
              <FormControl>
                <Input placeholder="Portofolio Undangan Elegan" {...field} disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deskripsi (Opsional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Jelaskan tentang item galeri ini"
                  {...field}
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kategori (Opsional)</FormLabel>
              <FormControl>
                <Input placeholder="Undangan, Souvenir, etc." {...field} disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="product_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tautkan ke Produk (Opsional)</FormLabel>
              <Select onValueChange={field.onChange} value={field.value} disabled={isPending || isLoadingProducts}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={isLoadingProducts ? "Memuat produk..." : "Pilih produk"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="unlinked">Tidak ditautkan</SelectItem>
                  {products?.map((product) => (
                    <SelectItem key={product.id} value={product.id.toString()}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
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
            {isPending ? "Menyimpan..." : (isEditMode ? "Simpan Perubahan" : "Simpan")}
          </Button>
        </div>
      </form>
    </Form>
  );
}