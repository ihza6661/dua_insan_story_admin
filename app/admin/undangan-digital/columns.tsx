"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Eye, Copy } from "lucide-react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DigitalInvitation } from "@/services/api/digital-invitation.service";
import { InvitationDetailDialog } from "./_components/InvitationDetailDialog";
import { DeleteInvitationDialog } from "./_components/DeleteInvitationDialog";

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'active':
      return <Badge variant="default" className="bg-green-500">Aktif</Badge>;
    case 'draft':
      return <Badge variant="default" className="bg-amber-500">Draft</Badge>;
    case 'expired':
      return <Badge variant="destructive">Expired</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export const columns: ColumnDef<DigitalInvitation>[] = [
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
    accessorKey: "slug",
    meta: { cardLabel: "Slug" },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Slug
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const copyToClipboard = () => {
        navigator.clipboard.writeText(row.original.public_url);
        toast.success("URL berhasil disalin");
      };

      return (
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm">{row.getValue("slug")}</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={copyToClipboard}
          >
            <Copy className="h-3 w-3" />
          </Button>
        </div>
      );
    },
  },
  {
    id: "customer",
    accessorFn: (row) => row.user.full_name,
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
      );
    },
    cell: ({ row }) => {
      return (
        <div>
          <div className="font-medium">{row.original.user.full_name}</div>
          <div className="text-xs text-muted-foreground">{row.original.user.email}</div>
        </div>
      );
    },
  },
  {
    id: "template",
    accessorFn: (row) => row.template.name,
    meta: { cardLabel: "Template" },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Template
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <div>{row.original.template.name}</div>;
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
      );
    },
    cell: ({ row }) => {
      return <div className="text-center">{getStatusBadge(row.getValue("status"))}</div>;
    },
  },
  {
    accessorKey: "view_count",
    meta: { cardLabel: "Views" },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <Eye className="mr-2 h-4 w-4" />
          Views
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <div className="text-center font-medium">{row.getValue("view_count")}</div>;
    },
  },
  {
    accessorKey: "created_at",
    meta: { cardLabel: "Dibuat" },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Dibuat
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("created_at"));
      return (
        <div className="text-sm">
          {format(date, "dd MMM yyyy", { locale: localeId })}
        </div>
      );
    },
  },
  {
    id: "actions",
    meta: { cardLabel: "Aksi" },
    header: () => <div className="text-right">Aksi</div>,
    cell: ({ row }) => {
      const invitation = row.original;
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
              <InvitationDetailDialog 
                invitationId={invitation.id}
                trigger={
                  <DropdownMenuItem 
                    className="cursor-pointer"
                    onSelect={(e) => e.preventDefault()}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Lihat Detail
                  </DropdownMenuItem>
                }
              />
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => {
                  window.open(invitation.public_url, '_blank');
                }}
              >
                Buka Undangan
              </DropdownMenuItem>
              <DeleteInvitationDialog 
                invitationId={invitation.id}
                invitationSlug={invitation.slug}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
