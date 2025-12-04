"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { format } from "date-fns"
import { id as localeId } from "date-fns/locale"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PromoCode } from "@/lib/types"
import { PromoCodeActions } from "./_components/PromoCodeActions"

export const columns: ColumnDef<PromoCode>[] = [
  {
    id: "rowNumber",
    meta: { cardLabel: "No." },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          No.
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return <div className="text-center font-medium">{row.index + 1}</div>;
    },
    accessorFn: (row, index) => index,
  },
  {
    accessorKey: "code",
    meta: { cardLabel: "Kode Promo" },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Kode Promo
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return <div className="font-mono font-bold text-primary">{row.getValue("code")}</div>
    }
  },
  {
    accessorKey: "discount_type",
    meta: { cardLabel: "Tipe Diskon" },
    header: "Tipe Diskon",
    cell: ({ row }) => {
      const promoCode = row.original;
      const label = promoCode.discount_type === 'percentage' 
        ? `${promoCode.discount_value}%` 
        : `Rp ${promoCode.discount_value.toLocaleString('id-ID')}`;
      
      return (
        <div className="flex flex-col gap-1">
          <Badge variant="outline" className="w-fit">
            {promoCode.discount_type === 'percentage' ? 'Persentase' : 'Nominal Tetap'}
          </Badge>
          <span className="text-sm font-medium">{label}</span>
        </div>
      )
    }
  },
  {
    accessorKey: "min_purchase",
    meta: { cardLabel: "Min. Pembelian" },
    header: "Min. Pembelian",
    cell: ({ row }) => {
      const minPurchase = row.getValue("min_purchase") as number | null;
      if (!minPurchase) {
        return <span className="text-muted-foreground">-</span>;
      }
      return <div className="text-sm">Rp {minPurchase.toLocaleString('id-ID')}</div>
    }
  },
  {
    accessorKey: "usage_limit",
    meta: { cardLabel: "Penggunaan" },
    header: "Penggunaan",
    cell: ({ row }) => {
      const promoCode = row.original;
      const usageLimit = promoCode.usage_limit;
      const timesUsed = promoCode.times_used;
      
      if (!usageLimit) {
        return (
          <div className="text-sm">
            <span className="font-medium">{timesUsed}</span>
            <span className="text-muted-foreground"> / Unlimited</span>
          </div>
        );
      }
      
      const percentage = (timesUsed / usageLimit) * 100;
      const isNearLimit = percentage >= 80;
      
      return (
        <div className="text-sm">
          <span className={`font-medium ${isNearLimit ? 'text-orange-600' : ''}`}>
            {timesUsed}
          </span>
          <span className="text-muted-foreground"> / {usageLimit}</span>
        </div>
      );
    }
  },
  {
    accessorKey: "valid_until",
    meta: { cardLabel: "Berlaku Hingga" },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Berlaku Hingga
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("valid_until"));
      const isExpired = date < new Date();
      return (
        <div className={isExpired ? 'text-destructive' : ''}>
          {format(date, "dd MMM yyyy", { locale: localeId })}
          {isExpired && <Badge variant="destructive" className="ml-2 text-xs">Kadaluarsa</Badge>}
        </div>
      )
    }
  },
  {
    accessorKey: "is_active",
    meta: { cardLabel: "Status" },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const isActive = row.getValue("is_active") as boolean;
      return (
        <Badge variant={isActive ? "default" : "secondary"}>
          {isActive ? "Aktif" : "Nonaktif"}
        </Badge>
      )
    }
  },
  {
    id: "actions",
    meta: { cardLabel: "Aksi" },
    header: () => <div className="text-right">Aksi</div>,
    cell: ({ row }) => {
      const promoCode = row.original;
      return (
        <div className="text-right">
          <PromoCodeActions promoCode={promoCode} />
        </div>
      )
    },
  },
]
