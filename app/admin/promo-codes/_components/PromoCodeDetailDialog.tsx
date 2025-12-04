"use client";

import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { PromoCode } from "@/lib/types";
import { Separator } from "@/components/ui/separator";

interface PromoCodeDetailDialogProps {
  promoCode: PromoCode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PromoCodeDetailDialog({
  promoCode,
  open,
  onOpenChange,
}: PromoCodeDetailDialogProps) {
  const formatRupiah = (amount: number) => {
    return `Rp ${amount.toLocaleString('id-ID')}`;
  };

  const getDiscountDisplay = () => {
    if (promoCode.discount_type === 'percentage') {
      return `${promoCode.discount_value}%`;
    }
    return formatRupiah(promoCode.discount_value);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detail Kode Promo</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Code and Status */}
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Kode Promo</p>
              <p className="text-2xl font-mono font-bold text-primary">{promoCode.code}</p>
            </div>
            <Badge variant={promoCode.is_active ? "default" : "secondary"}>
              {promoCode.is_active ? "Aktif" : "Nonaktif"}
            </Badge>
          </div>

          <Separator />

          {/* Discount Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Tipe Diskon</p>
              <p className="font-medium">
                {promoCode.discount_type === 'percentage' ? 'Persentase' : 'Nominal Tetap'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Nilai Diskon</p>
              <p className="font-bold text-lg text-primary">{getDiscountDisplay()}</p>
            </div>
          </div>

          <Separator />

          {/* Purchase Limits */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Min. Pembelian</p>
              <p className="font-medium">
                {promoCode.min_purchase ? formatRupiah(promoCode.min_purchase) : 'Tidak ada'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Maks. Diskon</p>
              <p className="font-medium">
                {promoCode.max_discount ? formatRupiah(promoCode.max_discount) : 'Tidak ada'}
              </p>
            </div>
          </div>

          <Separator />

          {/* Usage Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Limit Penggunaan</p>
              <p className="font-medium">
                {promoCode.usage_limit ? `${promoCode.usage_limit} kali` : 'Unlimited'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Telah Digunakan</p>
              <p className="font-bold text-lg">
                {promoCode.times_used} kali
                {promoCode.usage_limit && (
                  <span className="text-sm text-muted-foreground font-normal">
                    {' '}/ {promoCode.usage_limit}
                  </span>
                )}
              </p>
            </div>
          </div>

          <Separator />

          {/* Date Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Berlaku Dari</p>
              <p className="font-medium">
                {format(new Date(promoCode.valid_from), "dd MMMM yyyy", { locale: localeId })}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Berlaku Hingga</p>
              <p className="font-medium">
                {format(new Date(promoCode.valid_until), "dd MMMM yyyy", { locale: localeId })}
              </p>
            </div>
          </div>

          <Separator />

          {/* Usage History */}
          {promoCode.usages && promoCode.usages.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-3">Riwayat Penggunaan (Terakhir 10)</p>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {promoCode.usages.slice(0, 10).map((usage) => (
                  <div
                    key={usage.id}
                    className="flex justify-between items-center p-3 bg-muted/50 rounded-lg text-sm"
                  >
                    <div>
                      <p className="font-medium">{usage.user?.full_name || 'Pengguna'}</p>
                      <p className="text-xs text-muted-foreground">{usage.user?.email}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(usage.used_at), "dd MMM yyyy, HH:mm", { locale: localeId })}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Creation Date */}
          <div className="text-xs text-muted-foreground">
            Dibuat pada {format(new Date(promoCode.created_at), "dd MMMM yyyy, HH:mm", { locale: localeId })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
