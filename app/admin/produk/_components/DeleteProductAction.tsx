"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";

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
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

import { deleteProduct } from "@/services/api/product.service";
import { GenericError } from "@/lib/types";

interface DeleteProductActionProps {
  productId: number;
  productName: string;
}

export function DeleteProductAction({ productId, productName }: DeleteProductActionProps) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: deleteProduct,
    onSuccess: (response: any) => {
      toast.success("Produk Berhasil Dihapus", {
        description: response.message,
      });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error: AxiosError<GenericError>) => {
      const errorMessage = error.response?.data?.message || "Gagal menghapus produk.";
      toast.error("Gagal Menghapus", {
        description: errorMessage,
      });
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem
          onSelect={(e) => e.preventDefault()}
          className="cursor-pointer text-destructive focus:text-destructive"
        >
          Hapus
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Apakah Anda Yakin?</AlertDialogTitle>
          <AlertDialogDescription>
            Tindakan ini tidak dapat dibatalkan. Ini akan menghapus produk{" "}
            <span className="font-semibold">{productName}</span> secara permanen.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => mutate(productId)}
            disabled={isPending}
            className="bg-destructive hover:bg-destructive/90 cursor-pointer"
          >
            {isPending ? "Menghapus..." : "Ya, Hapus"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}