"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PlusCircle, Filter } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getInvitationTemplates } from "@/services/api/invitation-template.service";
import { columns } from "./columns";
import { DataTable } from "@/components/shared/DataTable";
import { TemplateFormDialog } from "./_components/TemplateFormDialog";

export default function TemplateUndanganPage() {
  const [isActiveFilter, setIsActiveFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const { data: templates, isLoading, error } = useQuery({
    queryKey: ['invitation-templates', isActiveFilter],
    queryFn: () => getInvitationTemplates({
      is_active: isActiveFilter === 'all' ? undefined : isActiveFilter === 'active',
    }),
  });

  const handleResetFilters = () => {
    setIsActiveFilter('all');
  };

  const hasActiveFilters = isActiveFilter !== 'all';

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Template Undangan</h1>
          <p className="text-muted-foreground">
            Kelola template undangan digital untuk pelanggan.
          </p>
        </div>
        <Button 
          className="cursor-pointer"
          onClick={() => setIsCreateDialogOpen(true)}
        >
          <PlusCircle className="my-2 h-4 w-4" /> Tambah Template
        </Button>
      </div>

      {/* Filters */}
      <div className="mt-4 mb-4 flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filter:</span>
        </div>

        <Select 
          value={isActiveFilter} 
          onValueChange={(value) => setIsActiveFilter(value as typeof isActiveFilter)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="active">Aktif</SelectItem>
            <SelectItem value="inactive">Tidak Aktif</SelectItem>
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
        {error && (
          <p className="text-destructive">
            Gagal memuat data: {error.message}
          </p>
        )}
        {templates && (
          <DataTable
            columns={columns}
            data={templates}
            searchColumnKey="name"
            searchPlaceholder="Cari berdasarkan nama template..."
          />
        )}
      </div>

      {/* Create Dialog */}
      <TemplateFormDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </>
  );
}
