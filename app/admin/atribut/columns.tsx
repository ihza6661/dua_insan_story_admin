"use client"

import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Attribute } from "@/lib/types"
import { DeleteAttributeAction } from "./_components/DeleteAttributeAction";

export const columns: ColumnDef<Attribute>[] = [
  {
    id: "rowNumber",
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
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nama Atribut
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("name")}</div>
    }
  },
  {
    accessorKey: "values",
    header: "Nilai-nilai",
    cell: ({ row }) => {
      const values = row.original.values;
      if (!values || values.length === 0) {
        return <span className="text-muted-foreground">-</span>;
      }
      return (
        <div className="flex flex-wrap gap-1">
          {values.map((value) => (
            <Badge key={value.id} variant="secondary">{value.value}</Badge>
          ))}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-right">Aksi</div>,
    cell: ({ row }) => {
      const attribute = row.original;
      return (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><span className="sr-only">Buka menu</span><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Aksi</DropdownMenuLabel>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href={`/admin/atribut/${attribute.id}/edit`}>Edit</Link>
              </DropdownMenuItem>
              <DeleteAttributeAction attributeId={attribute.id} attributeName={attribute.name} />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
  },
]