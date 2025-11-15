"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { ImageIcon, Trash2, UploadCloud, Star } from "lucide-react";
import Image from "next/image";

import { ProductVariant } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { deleteVariantImage, uploadVariantImages } from "@/services/api/product.service";
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
import { getImageUrl } from "@/lib/utils";
// using native <img> for external/internal URLs to avoid Next.js optimization issues

interface ErrorResponse {
  message: string;
}

interface VariantImageManagerProps {
  variant: ProductVariant;
}

interface ImageUploadForm {
  images: FileList;
}

export function VariantImageManager({ variant }: VariantImageManagerProps) {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm<ImageUploadForm>();

  const { mutate: uploadMutate, isPending: isUploading } = useMutation({
    mutationFn: uploadVariantImages,
    onSuccess: () => {
      toast.success("Gambar berhasil diunggah.");
      queryClient.invalidateQueries({ queryKey: ["variant", variant.id] });
      queryClient.invalidateQueries({ queryKey: ["product", variant.product_id] });
      reset();
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error.response?.data?.message || "Gagal mengunggah gambar.");
    },
  });

  const { mutate: deleteMutate, isPending: isDeleting } = useMutation({
    mutationFn: deleteVariantImage,
    onSuccess: () => {
      toast.success("Gambar berhasil dihapus.");
      queryClient.invalidateQueries({ queryKey: ["variant", variant.id] });
      queryClient.invalidateQueries({ queryKey: ["product", variant.product_id] });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error.response?.data?.message || "Gagal menghapus gambar.");
    },
  });

  const onSubmit: SubmitHandler<ImageUploadForm> = (data) => {
    const formData = new FormData();
    if (data.images) {
      Array.from(data.images).forEach((file) => {
        formData.append("images[]", file);
      });
    }
    uploadMutate({ variantId: variant.id, formData });
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
            className="grow text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
          />
          <Button type="submit" disabled={isUploading}>
            <UploadCloud className="mr-2 h-4 w-4" />
            {isUploading ? "Mengunggah..." : "Unggah"}
          </Button>
        </form>
      </div>

      <div>
        <h3 className="text-lg font-medium">Daftar Gambar</h3>
        {variant.images.length > 0 ? (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {variant.images.map((image) => (
              <div key={image.id} className="relative group border rounded-md overflow-hidden">
                {image.is_featured && (
                  <div className="absolute top-2 left-2 z-10 bg-primary text-primary-foreground rounded-full p-1.5">
                    <Star className="h-4 w-4" />
                  </div>
                )}
                <Image
                  src={getImageUrl(image.image_url)}
                  alt={image.alt_text ?? 'Gambar Varian'}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
            <p className="mt-4">Belum ada gambar untuk varian ini.</p>
          </div>
        )}
      </div>
    </div>
  );
}