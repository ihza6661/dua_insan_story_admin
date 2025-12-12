"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Eye, Copy, Clock, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { toast } from "sonner";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScheduledInvitation } from "@/services/api/digital-invitation.service";
import { InvitationDetailDialog } from "../_components/InvitationDetailDialog";

export const columns: ColumnDef<ScheduledInvitation>[] = [
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
    id: "couple",
    accessorFn: (row) => 
      row.customization_data?.bride_name && row.customization_data?.groom_name
        ? `${row.customization_data.bride_name} & ${row.customization_data.groom_name}`
        : "Belum diisi",
    meta: { cardLabel: "Nama Pasangan" },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nama Pasangan
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const bride = row.original.customization_data?.bride_name;
      const groom = row.original.customization_data?.groom_name;
      
      if (!bride || !groom) {
        return <div className="text-muted-foreground text-sm italic">Belum diisi</div>;
      }

      return <div className="text-sm">{bride} & {groom}</div>;
    },
  },
  {
    accessorKey: "scheduled_activation_at",
    meta: { cardLabel: "Jadwal Aktivasi" },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <Clock className="mr-2 h-4 w-4" />
          Jadwal Aktivasi
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const scheduledAt = row.getValue("scheduled_activation_at") as string;
      const date = new Date(scheduledAt);
      const isOverdue = row.original.is_overdue;

      return (
        <div className="space-y-1">
          <div className="text-sm font-medium">
            {format(date, "dd MMM yyyy, HH:mm", { locale: localeId })}
          </div>
          <div className={`text-xs ${isOverdue ? 'text-destructive font-medium' : 'text-muted-foreground'}`}>
            {row.original.scheduled_at_human}
          </div>
        </div>
      );
    },
  },
  {
    id: "status",
    accessorFn: (row) => row.is_overdue ? "overdue" : "upcoming",
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
      const isOverdue = row.original.is_overdue;
      
      return (
        <div className="text-center">
          {isOverdue ? (
            <Badge variant="destructive" className="gap-1">
              <AlertTriangle className="h-3 w-3" />
              Terlambat
            </Badge>
          ) : (
            <Badge variant="default" className="bg-blue-500 gap-1">
              <Clock className="h-3 w-3" />
              Mendatang
            </Badge>
          )}
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
              <DropdownMenuItem asChild>
                <Link href={`/admin/undangan-digital`} className="cursor-pointer">
                  Lihat di Daftar Utama
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
