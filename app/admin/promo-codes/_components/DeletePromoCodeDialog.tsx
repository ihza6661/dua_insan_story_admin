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
} from "@/components/ui/alert-dialog";
import { PromoCode, GenericError } from "@/lib/types";
import { deletePromoCode } from "@/services/api/promo-code.service";

interface DeletePromoCodeDialogProps {
  promoCode: PromoCode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeletePromoCodeDialog({
  promoCode,
  open,
  onOpenChange,
}: DeletePromoCodeDialogProps) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deletePromoCode,
    onSuccess: (response) => {
      toast.success("Berhasil", {
        description: response.message,
      });
      queryClient.invalidateQueries({ queryKey: ['promo-codes'] });
      queryClient.invalidateQueries({ queryKey: ['promo-code-statistics'] });
      onOpenChange(false);
    },
    onError: (error: AxiosError<GenericError>) => {
      const errorMessage = error.response?.data?.message || "Gagal menghapus kode promo.";
      toast.error("Gagal", {
        description: errorMessage,
      });
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Kode Promo</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah Anda yakin ingin menghapus kode promo <strong>{promoCode.code}</strong>?
            {promoCode.times_used > 0 && (
              <span className="block mt-2 text-orange-600 font-medium">
                ⚠️ Kode promo ini telah digunakan {promoCode.times_used} kali. 
                Anda tidak dapat menghapusnya. Pertimbangkan untuk menonaktifkannya saja.
              </span>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => deleteMutation.mutate(promoCode.id)}
            disabled={deleteMutation.isPending || promoCode.times_used > 0}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleteMutation.isPending ? "Menghapus..." : "Hapus"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
