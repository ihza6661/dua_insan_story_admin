"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Filter, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getPromoCodes } from "@/services/api/promo-code.service";
import { columns } from "./columns";
import { DataTable } from "@/components/shared/DataTable";
import { StatisticsCards } from "./_components/StatisticsCards";
import { PromoCodeFormDialog } from "./_components/PromoCodeFormDialog";

export default function PromoCodesPage() {
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const { data: promoCodesData, isLoading, error } = useQuery({
    queryKey: ['promo-codes', statusFilter],
    queryFn: () => getPromoCodes({
      status: statusFilter !== 'all' ? statusFilter as 'active' | 'inactive' : undefined,
    }),
  });

  const promoCodes = promoCodesData?.data.data || [];

  const handleResetFilters = () => {
    setStatusFilter('all');
  };

  const hasActiveFilters = statusFilter !== 'all';

  return (
    <>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Kode Promo</h1>
            <p className="text-muted-foreground">
              Kelola kode promo dan diskon untuk pelanggan.
            </p>
          </div>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Buat Kode Promo
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="mb-6">
        <StatisticsCards />
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filter:</span>
        </div>

        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as typeof statusFilter)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="active">Aktif</SelectItem>
            <SelectItem value="inactive">Nonaktif</SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleResetFilters}
            className="cursor-pointer"
          >
            Reset Filter
          </Button>
        )}
      </div>

      {/* Data Table */}
      <div className="mt-4">
        {isLoading && <p>Memuat data...</p>}
        {error && <p className="text-destructive">Gagal memuat data: {error.message}</p>}
        {promoCodes && (
          <DataTable 
            columns={columns} 
            data={promoCodes} 
            searchColumnKey="code"
            searchPlaceholder="Cari kode promo..."
          />
        )}
      </div>

      {/* Create Dialog */}
      <PromoCodeFormDialog 
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
    </>
  );
}
