"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, GripVertical } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TemplateField } from "@/services/api/template-field.service";
import { FieldFormDialog } from "./FieldFormDialog";
import { DeleteFieldDialog } from "./DeleteFieldDialog";
import { ToggleFieldActiveButton } from "./ToggleFieldActiveButton";
import { DuplicateFieldButton } from "./DuplicateFieldButton";

const fieldTypeLabels: Record<string, string> = {
  text: "Teks",
  textarea: "Area Teks",
  date: "Tanggal",
  time: "Waktu",
  url: "URL",
  email: "Email",
  phone: "Telepon",
  image: "Gambar",
  color: "Warna",
};

const fieldCategoryLabels: Record<string, string> = {
  couple: "Pasangan",
  event: "Acara",
  venue: "Tempat",
  design: "Desain",
  general: "Umum",
};

export const fieldColumns: ColumnDef<TemplateField>[] = [
  {
    id: "drag",
    header: "",
    cell: () => {
      return (
        <div className="cursor-grab active:cursor-grabbing">
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
      );
    },
    size: 40,
  },
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
    accessorKey: "field_label",
    meta: { cardLabel: "Label" },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Label
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div>
          <div className="font-medium">{row.getValue("field_label")}</div>
          <div className="text-xs text-muted-foreground">{row.original.field_key}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "field_type",
    meta: { cardLabel: "Tipe" },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tipe
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const type = row.getValue("field_type") as string;
      return (
        <Badge variant="outline">
          {fieldTypeLabels[type] || type}
        </Badge>
      );
    },
  },
  {
    accessorKey: "field_category",
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
      );
    },
    cell: ({ row }) => {
      const category = row.getValue("field_category") as string;
      return (
        <Badge variant="secondary">
          {fieldCategoryLabels[category] || category}
        </Badge>
      );
    },
  },
  {
    id: "required",
    meta: { cardLabel: "Wajib" },
    header: "Wajib",
    cell: ({ row }) => {
      const isRequired = row.original.validation_rules?.required;
      return (
        <div className="text-center">
          <Badge variant={isRequired ? "default" : "outline"}>
            {isRequired ? "Ya" : "Tidak"}
          </Badge>
        </div>
      );
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
      const field = row.original;
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
              <FieldFormDialog 
                templateId={field.template_id}
                field={field}
                trigger={
                  <DropdownMenuItem 
                    className="cursor-pointer"
                    onSelect={(e) => e.preventDefault()}
                  >
                    Edit
                  </DropdownMenuItem>
                }
              />
              <DropdownMenuSeparator />
              <ToggleFieldActiveButton field={field} />
              <DuplicateFieldButton field={field} />
              <DropdownMenuSeparator />
              <DeleteFieldDialog 
                templateId={field.template_id}
                fieldId={field.id}
                fieldLabel={field.field_label}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
