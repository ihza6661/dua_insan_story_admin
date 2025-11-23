"use client"

import * as React from "react"
import {
  Column,
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { useMediaQuery } from "@/lib/hooks/useMediaQuery"

type ResponsiveColumnMeta = {
  cardLabel?: string
}

function getResponsiveColumnLabel<TData>(column: Column<TData, unknown>) {
  const meta = column.columnDef.meta as ResponsiveColumnMeta | undefined
  if (meta?.cardLabel) {
    return meta.cardLabel
  }

  if (typeof column.columnDef.header === "string") {
    return column.columnDef.header
  }

  if (typeof column.id === "string" && column.id.length) {
    return column.id
      .split(/[-_.]/)
      .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
      .join(" ")
  }

  return "Kolom"
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  searchColumnKey: string
  searchPlaceholder: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchColumnKey,
  searchPlaceholder,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const isMobile = useMediaQuery("(max-width: 768px)")

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })

  const rows = table.getRowModel().rows ?? []
  const hasRows = rows.length > 0

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 py-2 sm:flex-row sm:items-center sm:justify-between">
        <Input
          placeholder={searchPlaceholder}
          value={(table.getColumn(searchColumnKey)?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn(searchColumnKey)?.setFilterValue(event.target.value)
          }
          className="w-full sm:max-w-sm"
        />
      </div>
      <div className="rounded-2xl border bg-card/40 shadow-sm">
        {isMobile ? (
          <div className="divide-y">
            {hasRows ? (
              rows.map((row) => (
                <div
                  key={row.id}
                  className="flex flex-col gap-4 p-4"
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <div key={cell.id} className="space-y-1">
                      <p className="text-xs font-medium uppercase text-muted-foreground">
                        {getResponsiveColumnLabel(cell.column)}
                      </p>
                      <div className="text-sm">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </div>
                    </div>
                  ))}
                </div>
              ))
            ) : (
              <p className="p-6 text-center text-sm text-muted-foreground">
                Tidak ada data.
              </p>
            )}
          </div>
        ) : (
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {hasRows ? (
                rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    Tidak ada data.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  )
}