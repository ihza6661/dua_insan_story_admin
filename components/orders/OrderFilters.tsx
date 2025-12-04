"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { Search, X } from "lucide-react"
import { DateRange, DateRangePicker } from "@/components/ui/date-range-picker"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"

export interface OrderFilterValues {
  search?: string
  orderStatus?: string
  paymentStatus?: string
  dateRange?: DateRange
}

interface OrderFiltersProps {
  filters: OrderFilterValues
  onFiltersChange: (filters: OrderFilterValues) => void
  onClearFilters: () => void
}

const ORDER_STATUSES = [
  { value: "pending_payment", label: "Menunggu Pembayaran" },
  { value: "partially_paid", label: "Dibayar Sebagian" },
  { value: "paid", label: "Lunas" },
  { value: "processing", label: "Diproses" },
  { value: "design_approval", label: "Persetujuan Desain" },
  { value: "in_production", label: "Produksi" },
  { value: "shipped", label: "Dikirim" },
  { value: "delivered", label: "Terkirim" },
  { value: "completed", label: "Selesai" },
  { value: "cancelled", label: "Dibatalkan" },
  { value: "failed", label: "Gagal" },
  { value: "refunded", label: "Refund" },
]

const PAYMENT_STATUSES = [
  { value: "pending", label: "Menunggu" },
  { value: "partially_paid", label: "Dibayar Sebagian" },
  { value: "paid", label: "Lunas" },
  { value: "cancelled", label: "Dibatalkan" },
]

export function OrderFilters({ filters, onFiltersChange, onClearFilters }: OrderFiltersProps) {
  // Local state for search input with debouncing
  const [searchInput, setSearchInput] = useState(filters.search || "")

  const hasActiveFilters = !!(
    filters.search ||
    filters.orderStatus ||
    filters.paymentStatus ||
    filters.dateRange?.from ||
    filters.dateRange?.to
  )

  // Debounce search input (500ms delay)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== filters.search) {
        onFiltersChange({ ...filters, search: searchInput || undefined })
      }
    }, 500)

    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput])

  // Sync local state when filters change externally (e.g., clear filters)
  useEffect(() => {
    setSearchInput(filters.search || "")
  }, [filters.search])

  return (
    <Card className="shadow-sm">
      <CardContent className="pt-6">
        <div className="flex flex-col gap-4">
          {/* Search Input with debouncing */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari nomor order atau nama pelanggan..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Filters Row */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Order Status Filter */}
            <Select
              value={filters.orderStatus || ""}
              onValueChange={(value) =>
                onFiltersChange({
                  ...filters,
                  orderStatus: value || undefined,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Status Pesanan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                {ORDER_STATUSES.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Payment Status Filter */}
            <Select
              value={filters.paymentStatus || ""}
              onValueChange={(value) =>
                onFiltersChange({
                  ...filters,
                  paymentStatus: value || undefined,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Status Pembayaran" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                {PAYMENT_STATUSES.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Date Range Filter */}
            <div className="sm:col-span-2 lg:col-span-1">
              <DateRangePicker
                value={filters.dateRange}
                onChange={(range) =>
                  onFiltersChange({ ...filters, dateRange: range })
                }
              />
            </div>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <Button
                variant="outline"
                onClick={onClearFilters}
                className="w-full"
              >
                <X className="mr-2 h-4 w-4" />
                Hapus Filter
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
