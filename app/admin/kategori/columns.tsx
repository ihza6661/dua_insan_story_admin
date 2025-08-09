"use client"

import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import Image from "next/image";

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ProductCategory } from "@/lib/types"
import { DeleteCategoryAction } from "./_components/DeleteCategoryAction";

const STORAGE_URL = process.env.NEXT_PUBLIC_STORAGE_URL;

export const columns: ColumnDef<ProductCategory>[] = [
  {
    id: "no",
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
      return <div className="text-center">{row.index + 1}</div>;
    },
  },
  {
    accessorKey: "image",
    header: "Gambar",
    cell: ({ row }) => {
      const imagePath = row.getValue("image") as string | null;
      const imageUrl = imagePath ? `${STORAGE_URL}/${imagePath}` : null;

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
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nama Kategori
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "description",
    header: "Deskripsi",
    cell: ({ row }) => {
        const description = row.getValue("description") as string | null;
        return <div className="max-w-xs truncate">{description || "-"}</div>
    }
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tanggal Dibuat
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const dateString = row.getValue("created_at") as string;
      const date = new Date(dateString.replace(' ', 'T'));
      
      return new Intl.DateTimeFormat("id-ID", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(date);
    },
  },
  {
    id: "actions",
    header: () => <div className="text-right">Aksi</div>,
    cell: ({ row }) => {
      const category = row.original;
      return (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Buka menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Aksi</DropdownMenuLabel>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href={`/admin/kategori/${category.id}/edit`}>Edit</Link>
              </DropdownMenuItem>
              <DeleteCategoryAction categoryId={category.id} categoryName={category.name} />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
  },
]