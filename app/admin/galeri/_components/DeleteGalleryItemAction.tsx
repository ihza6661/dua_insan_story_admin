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

import { deleteGalleryItem } from "@/services/api/gallery.service";
import { GenericError } from "@/lib/types";

interface DeleteGalleryItemActionProps {
  itemId: number;
  itemTitle: string;
}

export function DeleteGalleryItemAction({ itemId, itemTitle }: DeleteGalleryItemActionProps) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: deleteGalleryItem,
    onSuccess: (response: any) => {
      toast.success("Item Galeri Berhasil Dihapus", {
        description: response.message,
      });
      queryClient.invalidateQueries({ queryKey: ['gallery-items'] });
    },
    onError: (error: AxiosError<GenericError>) => {
      toast.error("Gagal Menghapus", {
        description: error.response?.data?.message || "Gagal menghapus item.",
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
            Tindakan ini tidak dapat dibatalkan. Ini akan menghapus item{" "}
            <span className="font-semibold">{itemTitle}</span> secara permanen.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => mutate(itemId)}
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