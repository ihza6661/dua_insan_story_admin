"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { MoreHorizontal, Eye, CheckCircle, XCircle, Star, MessageSquare, Trash2 } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Review, GenericError } from "@/lib/types";
import { 
  approveReview, 
  rejectReview, 
  toggleFeaturedReview
} from "@/services/api/review.service";
import { ReviewDetailDialog } from "./ReviewDetailDialog";
import { AdminResponseDialog } from "./AdminResponseDialog";
import { DeleteReviewDialog } from "./DeleteReviewDialog";

interface ReviewActionsProps {
  review: Review;
}

export function ReviewActions({ review }: ReviewActionsProps) {
  const queryClient = useQueryClient();
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showResponseDialog, setShowResponseDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const approveMutation = useMutation({
    mutationFn: approveReview,
    onSuccess: async (response) => {
      toast.success("Ulasan Disetujui", {
        description: response.message,
      });
      // Invalidate and refetch immediately
      await queryClient.invalidateQueries({ queryKey: ['reviews'], refetchType: 'active' });
      await queryClient.invalidateQueries({ queryKey: ['review-statistics'], refetchType: 'active' });
    },
    onError: (error: AxiosError<GenericError>) => {
      const errorMessage = error.response?.data?.message || "Gagal menyetujui ulasan.";
      toast.error("Gagal", {
        description: errorMessage,
      });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: rejectReview,
    onSuccess: async (response) => {
      toast.success("Ulasan Ditolak", {
        description: response.message,
      });
      // Invalidate and refetch immediately
      await queryClient.invalidateQueries({ queryKey: ['reviews'], refetchType: 'active' });
      await queryClient.invalidateQueries({ queryKey: ['review-statistics'], refetchType: 'active' });
    },
    onError: (error: AxiosError<GenericError>) => {
      const errorMessage = error.response?.data?.message || "Gagal menolak ulasan.";
      toast.error("Gagal", {
        description: errorMessage,
      });
    },
  });

  const toggleFeaturedMutation = useMutation({
    mutationFn: toggleFeaturedReview,
    onSuccess: async (response) => {
      const newStatus = !review.is_featured;
      toast.success(newStatus ? "Ulasan Ditandai Unggulan" : "Ulasan Tidak Lagi Unggulan", {
        description: response.message,
      });
      // Invalidate and refetch immediately
      await queryClient.invalidateQueries({ queryKey: ['reviews'], refetchType: 'active' });
      await queryClient.invalidateQueries({ queryKey: ['review-statistics'], refetchType: 'active' });
    },
    onError: (error: AxiosError<GenericError>) => {
      const errorMessage = error.response?.data?.message || "Gagal mengubah status unggulan.";
      toast.error("Gagal", {
        description: errorMessage,
      });
    },
  });

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Buka menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Aksi</DropdownMenuLabel>
          <DropdownMenuItem 
            onClick={() => setShowDetailDialog(true)}
            className="cursor-pointer"
          >
            <Eye className="mr-2 h-4 w-4" />
            Lihat Detail
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          
          {review.status === 'pending' && (
            <>
              <DropdownMenuItem 
                onClick={() => approveMutation.mutate(review.id)}
                disabled={approveMutation.isPending}
                className="cursor-pointer text-green-600 focus:text-green-600"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Setujui
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => rejectMutation.mutate(review.id)}
                disabled={rejectMutation.isPending}
                className="cursor-pointer text-red-600 focus:text-red-600"
              >
                <XCircle className="mr-2 h-4 w-4" />
                Tolak
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}

          {review.status === 'approved' && (
            <>
              <DropdownMenuItem 
                onClick={() => toggleFeaturedMutation.mutate(review.id)}
                disabled={toggleFeaturedMutation.isPending}
                className="cursor-pointer"
              >
                <Star className={`mr-2 h-4 w-4 ${review.is_featured ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                {review.is_featured ? 'Hapus Unggulan' : 'Tandai Unggulan'}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setShowResponseDialog(true)}
                className="cursor-pointer"
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                {review.admin_response ? 'Edit Tanggapan' : 'Tambah Tanggapan'}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}

          <DropdownMenuItem 
            onClick={() => setShowDeleteDialog(true)}
            className="cursor-pointer text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Hapus
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ReviewDetailDialog 
        review={review}
        open={showDetailDialog}
        onOpenChange={setShowDetailDialog}
      />

      <AdminResponseDialog 
        review={review}
        open={showResponseDialog}
        onOpenChange={setShowResponseDialog}
      />

      <DeleteReviewDialog 
        review={review}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
      />
    </>
  );
}
