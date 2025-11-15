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

import { deleteAttribute } from "@/services/api/attribute.service";
import { GenericError } from "@/lib/types";

interface SuccessResponse {
  message: string;
}

interface DeleteAttributeActionProps {
  attributeId: number;
  attributeName: string;
}

export function DeleteAttributeAction({ attributeId, attributeName }: DeleteAttributeActionProps) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: deleteAttribute,
    onSuccess: (response: SuccessResponse) => {
      toast.success("Atribut Berhasil Dihapus", {
        description: response.message,
      });
      queryClient.invalidateQueries({ queryKey: ['attributes'] });
    },
    onError: (error: AxiosError<GenericError>) => {
      const errorMessage = error.response?.data?.message || "Gagal menghapus atribut.";
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
            Tindakan ini akan menghapus atribut{" "}
            <span className="font-semibold">{attributeName}</span> secara permanen.
            Menghapus atribut juga akan menghapus semua nilai di dalamnya.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => mutate(attributeId)}
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