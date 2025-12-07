"use client";

import Image from "next/image";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { InvitationTemplate } from "@/services/api/invitation-template.service";
import { formatRupiah, getImageUrl } from "@/lib/utils";
import { DeleteTemplateDialog } from "./_components/DeleteTemplateDialog";
import { TemplateFormDialog } from "./_components/TemplateFormDialog";
import { ToggleActiveButton } from "./_components/ToggleActiveButton";

export const columns: ColumnDef<InvitationTemplate>[] = [
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
      );
    },
    cell: ({ row }) => {
      return <div className="text-center font-medium">{row.index + 1}</div>;
    },
    accessorFn: (row, index) => index,
  },
  {
    id: "image",
    header: "Preview",
    cell: ({ row }) => {
      const imageUrl = getImageUrl(row.original.thumbnail_url);

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
            <div className="flex items-center justify-center h-full text-xs text-muted-foreground">
              No Image
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    meta: { cardLabel: "Nama Template" },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nama Template
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("name")}</div>;
    },
  },
  {
    accessorKey: "price",
    meta: { cardLabel: "Harga" },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Harga
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"));
      return <div className="font-medium">{formatRupiah(price)}</div>;
    },
  },
  {
    id: "invitations_count",
    accessorKey: "invitations_count",
    meta: { cardLabel: "Digunakan" },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Digunakan
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const count = row.original.invitations_count || 0;
      return <div className="text-center">{count} undangan</div>;
    },
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
      );
    },
    cell: ({ row }) => {
      const isActive = row.getValue("is_active");
      return (
        <div className="text-center">
          <Badge variant={isActive ? "default" : "outline"}>
            {isActive ? "Aktif" : "Tidak Aktif"}
          </Badge>
        </div>
      );
    },
  },
  {
    id: "actions",
    meta: { cardLabel: "Aksi" },
    header: () => <div className="text-right">Aksi</div>,
    cell: ({ row }) => {
      const template = row.original;
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
              <TemplateFormDialog 
                template={template}
                trigger={
                  <DropdownMenuItem 
                    className="cursor-pointer"
                    onSelect={(e) => e.preventDefault()}
                  >
                    Edit
                  </DropdownMenuItem>
                }
              />
              <ToggleActiveButton template={template} />
              <DeleteTemplateDialog 
                templateId={template.id}
                templateName={template.name}
                hasInvitations={(template.invitations_count || 0) > 0}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
