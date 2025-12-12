"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UGCItem } from "@/services/api/ugc.service";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import Image from "next/image";
import { Instagram, Package, ShoppingBag, Calendar } from "lucide-react";

interface UGCDetailDialogProps {
  item: UGCItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UGCDetailDialog({
  item,
  open,
  onOpenChange,
}: UGCDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detail Foto Pengguna</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Image */}
          <div className="relative aspect-square w-full overflow-hidden rounded-lg">
            <Image
              src={item.image_url}
              alt={item.caption || "User photo"}
              fill
              className="object-cover"
            />
          </div>

          {/* Status Badges */}
          <div className="flex gap-2">
            {item.is_approved ? (
              <Badge variant="default" className="bg-green-600">
                ✓ Disetujui
              </Badge>
            ) : (
              <Badge variant="secondary">⏳ Pending</Badge>
            )}
            {item.is_featured && (
              <Badge variant="default" className="bg-yellow-600">
                ⭐ Unggulan
              </Badge>
            )}
          </div>

          {/* Caption */}
          {item.caption && (
            <div>
              <h3 className="font-semibold mb-2">Caption</h3>
              <p className="text-sm text-muted-foreground">{item.caption}</p>
            </div>
          )}

          {/* User Info */}
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">Informasi Pengguna</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-muted-foreground">Nama:</span>{" "}
                <span className="font-medium">{item.user?.name || "N/A"}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Email:</span>{" "}
                <span className="font-medium">{item.user?.email || "N/A"}</span>
              </div>
            </div>
          </div>

          {/* Instagram Info */}
          {(item.instagram_handle || item.instagram_url) && (
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Instagram className="h-4 w-4" />
                Instagram
              </h3>
              <div className="space-y-2 text-sm">
                {item.instagram_handle && (
                  <div>
                    <span className="text-muted-foreground">Handle:</span>{" "}
                    <a
                      href={`https://instagram.com/${item.instagram_handle}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      @{item.instagram_handle}
                    </a>
                  </div>
                )}
                {item.instagram_url && (
                  <div>
                    <span className="text-muted-foreground">Post URL:</span>{" "}
                    <a
                      href={item.instagram_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline break-all"
                    >
                      {item.instagram_url}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Product Info */}
          {item.product && (
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Package className="h-4 w-4" />
                Produk Terkait
              </h3>
              <div className="text-sm">
                <span className="font-medium">{item.product.name}</span>
              </div>
            </div>
          )}

          {/* Order Info */}
          {item.order && (
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" />
                Pesanan Terkait
              </h3>
              <div className="text-sm">
                <span className="font-medium">#{item.order.order_number}</span>
              </div>
            </div>
          )}

          {/* Dates */}
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Tanggal
            </h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-muted-foreground">Diunggah:</span>{" "}
                <span className="font-medium">
                  {format(new Date(item.created_at), "dd MMMM yyyy, HH:mm", {
                    locale: idLocale,
                  })}
                </span>
              </div>
              {item.approved_at && (
                <div>
                  <span className="text-muted-foreground">Disetujui:</span>{" "}
                  <span className="font-medium">
                    {format(new Date(item.approved_at), "dd MMMM yyyy, HH:mm", {
                      locale: idLocale,
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
