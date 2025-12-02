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
import { Review, GenericError } from "@/lib/types";
import { deleteReview } from "@/services/api/review.service";

interface DeleteReviewDialogProps {
  review: Review;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteReviewDialog({ review, open, onOpenChange }: DeleteReviewDialogProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteReview,
    onSuccess: (response) => {
      toast.success("Ulasan Berhasil Dihapus", {
        description: response.message,
      });
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      queryClient.invalidateQueries({ queryKey: ['review-statistics'] });
      onOpenChange(false);
    },
    onError: (error: AxiosError<GenericError>) => {
      const errorMessage = error.response?.data?.message || "Gagal menghapus ulasan.";
      toast.error("Gagal Menghapus", {
        description: errorMessage,
      });
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Apakah Anda Yakin?</AlertDialogTitle>
          <AlertDialogDescription>
            Tindakan ini akan menghapus ulasan dari{" "}
            <span className="font-semibold">{review.user_name}</span> untuk produk{" "}
            <span className="font-semibold">{review.product_name}</span> secara permanen.
            <br /><br />
            Ulasan ini memiliki rating <span className="font-semibold">{review.rating} bintang</span>
            {review.images && review.images.length > 0 && (
              <> dan <span className="font-semibold">{review.images.length} foto</span></>
            )}.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer" disabled={mutation.isPending}>
            Batal
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => mutation.mutate(review.id)}
            disabled={mutation.isPending}
            className="bg-destructive hover:bg-destructive/90 cursor-pointer"
          >
            {mutation.isPending ? "Menghapus..." : "Ya, Hapus"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
