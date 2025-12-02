"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Star } from "lucide-react"
import { format } from "date-fns"
import { id as localeId } from "date-fns/locale"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Review } from "@/lib/types"
import { ReviewActions } from "./_components/ReviewActions"

export const columns: ColumnDef<Review>[] = [
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
    accessorKey: "product_name",
    meta: { cardLabel: "Produk" },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Produk
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return <div className="font-medium max-w-[200px] truncate">{row.getValue("product_name")}</div>
    }
  },
  {
    accessorKey: "user_name",
    meta: { cardLabel: "Pelanggan" },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Pelanggan
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const review = row.original;
      return (
        <div>
          <div className="font-medium">{review.user_name}</div>
          {review.is_verified_purchase && (
            <Badge variant="secondary" className="text-xs mt-1">
              Pembelian Terverifikasi
            </Badge>
          )}
        </div>
      )
    }
  },
  {
    accessorKey: "rating",
    meta: { cardLabel: "Rating" },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Rating
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const rating = row.getValue("rating") as number;
      return (
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="font-medium">{rating}</span>
        </div>
      )
    }
  },
  {
    accessorKey: "comment",
    meta: { cardLabel: "Komentar" },
    header: "Komentar",
    cell: ({ row }) => {
      const comment = row.getValue("comment") as string | null;
      if (!comment) {
        return <span className="text-muted-foreground">-</span>;
      }
      return (
        <div className="max-w-[300px] truncate" title={comment}>
          {comment}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
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
      const status = row.getValue("status") as string;
      const variant = 
        status === "approved" ? "default" :
        status === "pending" ? "secondary" :
        "destructive";
      
      const label = 
        status === "approved" ? "Disetujui" :
        status === "pending" ? "Menunggu" :
        "Ditolak";

      return <Badge variant={variant}>{label}</Badge>
    }
  },
  {
    accessorKey: "is_featured",
    meta: { cardLabel: "Unggulan" },
    header: "Unggulan",
    cell: ({ row }) => {
      const isFeatured = row.getValue("is_featured") as boolean;
      return isFeatured ? (
        <Badge variant="default" className="bg-purple-600">
          Unggulan
        </Badge>
      ) : (
        <span className="text-muted-foreground">-</span>
      );
    },
  },
  {
    accessorKey: "created_at",
    meta: { cardLabel: "Tanggal" },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tanggal
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("created_at"));
      return <div>{format(date, "dd MMM yyyy", { locale: localeId })}</div>
    }
  },
  {
    id: "actions",
    meta: { cardLabel: "Aksi" },
    header: () => <div className="text-right">Aksi</div>,
    cell: ({ row }) => {
      const review = row.original;
      return (
        <div className="text-right">
          <ReviewActions review={review} />
        </div>
      )
    },
  },
]
