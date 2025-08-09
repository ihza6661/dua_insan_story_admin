"use client";

import Image from "next/image";
import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { ImageIcon, Trash2, UploadCloud, X } from "lucide-react";
import { useState } from "react";

import { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { deleteProductImage, uploadProductImages } from "@/services/api/product.service";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const STORAGE_URL = process.env.NEXT_PUBLIC_STORAGE_URL;

interface ProductImageManagerProps {
  product: Product;
}

interface ImageUploadForm {
  images: FileList;
}

export function ProductImageManager({ product }: ProductImageManagerProps) {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm<ImageUploadForm>();

  const { mutate: uploadMutate, isPending: isUploading } = useMutation({
    mutationFn: uploadProductImages,
    onSuccess: () => {
      toast.success("Gambar berhasil diunggah.");
      queryClient.invalidateQueries({ queryKey: ["product", product.id] });
      reset();
    },
    onError: (error: AxiosError<any>) => {
      const errorMessage = error.response?.data?.message || "Gagal mengunggah gambar.";
      toast.error(errorMessage);
    },
  });

  const { mutate: deleteMutate, isPending: isDeleting } = useMutation({
    mutationFn: deleteProductImage,
    onSuccess: () => {
      toast.success("Gambar berhasil dihapus.");
      queryClient.invalidateQueries({ queryKey: ["product", product.id] });
    },
    onError: (error: AxiosError<any>) => {
      const errorMessage = error.response?.data?.message || "Gagal menghapus gambar.";
      toast.error(errorMessage);
    },
  });

  const onSubmit: SubmitHandler<ImageUploadForm> = (data) => {
    const formData = new FormData();
    if (data.images) {
      Array.from(data.images).forEach((file) => {
        formData.append("images[]", file);
      });
    }
    uploadMutate({ id: product.id, formData });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Unggah Gambar Baru</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 flex items-center gap-4">
          <input
            type="file"
            multiple
            accept="image/png, image/jpeg, image/webp"
            {...register("images")}
            disabled={isUploading}
            className="flex-grow text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
          />
          <Button type="submit" disabled={isUploading}>
            <UploadCloud className="mr-2 h-4 w-4" />
            {isUploading ? "Mengunggah..." : "Unggah"}
          </Button>
        </form>
      </div>

      <div>
        <h3 className="text-lg font-medium">Daftar Gambar</h3>
        {product.images.length > 0 ? (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {product.images.map((image) => (
              <div key={image.id} className="relative group border rounded-md overflow-hidden">
                <Image
                  src={`${STORAGE_URL}/${image.image}`}
                  alt={image.alt_text || product.name}
                  width={200}
                  height={200}
                  className="aspect-square w-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="icon" className="h-8 w-8 opacity-80 group-hover:opacity-100 transition-opacity">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Anda yakin?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tindakan ini akan menghapus gambar secara permanen.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteMutate(image.id)}
                          disabled={isDeleting}
                          className="bg-destructive hover:bg-destructive/90"
                        >
                          {isDeleting ? "Menghapus..." : "Ya, Hapus"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-4 flex flex-col items-center justify-center text-center text-muted-foreground border-2 border-dashed rounded-md p-8">
            <ImageIcon className="h-12 w-12" />
            <p className="mt-4">Belum ada gambar untuk produk ini.</p>
          </div>
        )}
      </div>
    </div>
  );
}