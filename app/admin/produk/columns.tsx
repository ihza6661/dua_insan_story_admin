"use client"

import Link from "next/link";
import Image from "next/image";
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Product } from "@/lib/types"
import { DeleteProductAction } from "./_components/DeleteProductAction";
import { getImageUrl } from "@/lib/utils";

export const columns: ColumnDef<Product>[] = [
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
    id: "image",
    header: "Gambar",
    cell: ({ row }) => {
      const featuredImage = row.original.featured_image;
      const imageUrl = getImageUrl(featuredImage?.image_url);

      return (
        <div className="w-24 h-16 relative rounded-md overflow-hidden bg-muted">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={row.original.name}
              fill
              sizes="6rem"
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-xs text-muted-foreground">No Image</div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    meta: { cardLabel: "Nama Produk" },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nama Produk
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
        return <div className="font-medium">{row.getValue("name")}</div>
    }
  },
  {
    accessorFn: (row) => row.category.name,
    id: "category",
    meta: { cardLabel: "Kategori" },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Kategori
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
        return <div>{row.original.category.name}</div>
    }
  },
  {
    accessorKey: "base_price",
    meta: { cardLabel: "Harga Dasar" },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Harga Dasar
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
        const price = parseFloat(row.getValue("base_price"));
        const formatted = new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(price);

        return <div className="font-medium">{formatted}</div>
    }
  },
  {
    id: "stock",
    meta: { cardLabel: "Stok" },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Stok
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    accessorFn: (row) => {
      if (!row.variants || row.variants.length === 0) return 0;
      return row.variants.reduce((total, variant) => total + (variant.stock || 0), 0);
    },
    cell: ({ row }) => {
      const variants = row.original.variants || [];
      const totalStock = variants.reduce((total, variant) => total + (variant.stock || 0), 0);
      const hasLowStock = variants.some((v) => v.stock > 0 && v.stock < 10);
      const isOutOfStock = totalStock === 0;

      return (
        <div className="text-center space-y-1">
          <div className="font-medium">{totalStock} unit</div>
          {isOutOfStock && (
            <Badge variant="destructive" className="text-xs">Habis</Badge>
          )}
          {!isOutOfStock && hasLowStock && (
            <Badge variant="default" className="text-xs bg-amber-500">Stok Rendah</Badge>
          )}
        </div>
      );
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
        const isActive = row.getValue("is_active");
        return (
            <div className="text-center">
              <Badge variant={isActive ? "default" : "outline"}>
                  {isActive ? "Aktif" : "Tidak Aktif"}
              </Badge>
            </div>
        )
    }
  },
  {
    id: "actions",
    meta: { cardLabel: "Aksi" },
    header: () => <div className="text-right">Aksi</div>,
    cell: ({ row }) => {
      const product = row.original;
      return (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><span className="sr-only">Buka menu</span><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Aksi</DropdownMenuLabel>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href={`/admin/produk/${product.id}/edit`}>Edit</Link>
              </DropdownMenuItem>
              <DeleteProductAction productId={product.id} productName={product.name} />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
  },
]