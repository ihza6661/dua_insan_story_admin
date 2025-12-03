"use client";

import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Star, Image as ImageIcon } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Review } from "@/lib/types";

interface ReviewDetailDialogProps {
  review: Review;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReviewDetailDialog({ review, open, onOpenChange }: ReviewDetailDialogProps) {
  const statusLabel = 
    review.status === "approved" ? "Disetujui" :
    review.status === "pending" ? "Menunggu" :
    "Ditolak";

  const statusVariant = 
    review.status === "approved" ? "default" :
    review.status === "pending" ? "secondary" :
    "destructive";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detail Ulasan</DialogTitle>
          <DialogDescription>
            Ulasan untuk produk {review.product_name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Status & Featured */}
          <div className="flex gap-2">
            <Badge variant={statusVariant}>{statusLabel}</Badge>
            {review.is_featured && (
              <Badge variant="default" className="bg-purple-600">
                Unggulan
              </Badge>
            )}
            {review.is_verified_purchase && (
              <Badge variant="secondary">
                Pembelian Terverifikasi
              </Badge>
            )}
          </div>

          <Separator />

          {/* Customer Info */}
          <div>
            <h3 className="font-semibold text-sm text-muted-foreground mb-2">Pelanggan</h3>
            <p className="font-medium">{review.user_name}</p>
            <p className="text-sm text-muted-foreground">
              {format(new Date(review.created_at), "dd MMMM yyyy, HH:mm", { locale: localeId })}
            </p>
          </div>

          <Separator />

          {/* Rating */}
          <div>
            <h3 className="font-semibold text-sm text-muted-foreground mb-2">Rating</h3>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star}
                  className={`h-5 w-5 ${
                    star <= review.rating 
                      ? "fill-yellow-400 text-yellow-400" 
                      : "text-gray-300"
                  }`}
                />
              ))}
              <span className="font-medium ml-2">{review.rating}/5</span>
            </div>
          </div>

          {/* Comment */}
          {review.comment && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground mb-2">Komentar</h3>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{review.comment}</p>
              </div>
            </>
          )}

          {/* Images */}
          {review.images && review.images.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground mb-2 flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  Foto ({review.images.length})
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {review.images.map((image) => (
                    <a 
                      key={image.id}
                      href={image.image_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="aspect-square rounded-lg overflow-hidden border hover:border-primary transition-colors"
                    >
                      <img 
                        src={image.image_url} 
                        alt="Review"
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    </a>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Helpful Count */}
          <Separator />
          <div>
            <h3 className="font-semibold text-sm text-muted-foreground mb-2">Interaksi</h3>
            <p className="text-sm">
              <span className="font-medium">{review.helpful_count}</span> orang menganggap ulasan ini membantu
            </p>
          </div>

          {/* Admin Response */}
          {review.admin_response && (
            <>
              <Separator />
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-semibold text-sm mb-2">Tanggapan Admin</h3>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{review.admin_response}</p>
                {review.admin_response_at && (
                  <p className="text-xs text-muted-foreground mt-2">
                    {format(new Date(review.admin_response_at), "dd MMMM yyyy, HH:mm", { locale: localeId })}
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
