"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { UGCItem } from "@/services/api/ugc.service";
import { UGCActions } from "./_components/UGCActions";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import Image from "next/image";

export const columns: ColumnDef<UGCItem>[] = [
  {
    accessorKey: "image_url",
    header: "Foto",
    cell: ({ row }) => {
      const imageUrl = row.original.image_url;
      return (
        <div className="relative w-20 h-20">
          <Image
            src={imageUrl}
            alt="UGC"
            fill
            className="object-cover rounded-md"
          />
        </div>
      );
    },
  },
  {
    accessorKey: "user",
    header: "Pengguna",
    cell: ({ row }) => {
      const user = row.original.user;
      return (
        <div className="flex flex-col">
          <span className="font-medium">{user?.name || "N/A"}</span>
          <span className="text-xs text-muted-foreground">{user?.email}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "caption",
    header: "Caption",
    cell: ({ row }) => {
      const caption = row.original.caption;
      return caption ? (
        <p className="max-w-xs truncate">{caption}</p>
      ) : (
        <span className="text-muted-foreground italic">-</span>
      );
    },
  },
  {
    accessorKey: "product",
    header: "Produk",
    cell: ({ row }) => {
      const product = row.original.product;
      return product ? (
        <span className="text-sm">{product.name}</span>
      ) : (
        <span className="text-muted-foreground italic">-</span>
      );
    },
  },
  {
    accessorKey: "instagram_handle",
    header: "Instagram",
    cell: ({ row }) => {
      const handle = row.original.instagram_handle;
      return handle ? (
        <a
          href={`https://instagram.com/${handle}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          @{handle}
        </a>
      ) : (
        <span className="text-muted-foreground italic">-</span>
      );
    },
  },
  {
    accessorKey: "is_approved",
    header: "Status",
    cell: ({ row }) => {
      const isApproved = row.original.is_approved;
      return isApproved ? (
        <Badge variant="default" className="bg-green-600">
          Disetujui
        </Badge>
      ) : (
        <Badge variant="secondary">Pending</Badge>
      );
    },
  },
  {
    accessorKey: "is_featured",
    header: "Unggulan",
    cell: ({ row }) => {
      const isFeatured = row.original.is_featured;
      return isFeatured ? (
        <Badge variant="default" className="bg-yellow-600">
          ⭐ Ya
        </Badge>
      ) : (
        <Badge variant="outline">Tidak</Badge>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Tanggal",
    cell: ({ row }) => {
      const date = row.original.created_at;
      return format(new Date(date), "dd MMM yyyy", { locale: idLocale });
    },
  },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => <UGCActions item={row.original} />,
  },
];
