"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Filter } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getDigitalInvitations } from "@/services/api/digital-invitation.service";
import { columns } from "./columns";
import { DataTable } from "@/components/shared/DataTable";
import { StatisticsCards } from "./_components/StatisticsCards";

export default function UndanganDigitalPage() {
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'active' | 'expired'>('all');
  const [templateFilter, setTemplateFilter] = useState<'all' | string>('all');

  const { data: invitationsData, isLoading, error } = useQuery({
    queryKey: ['digital-invitations', statusFilter, templateFilter],
    queryFn: () => getDigitalInvitations({
      status: statusFilter !== 'all' ? statusFilter as 'draft' | 'active' | 'expired' : undefined,
      template_id: templateFilter !== 'all' ? parseInt(templateFilter) : undefined,
    }),
  });

  const { data: templates } = useQuery({
    queryKey: ['invitation-templates-list'],
    queryFn: () => import('@/services/api/invitation-template.service').then(m => m.getInvitationTemplates()),
  });

  const invitations = invitationsData?.data || [];

  const handleResetFilters = () => {
    setStatusFilter('all');
    setTemplateFilter('all');
  };

  const hasActiveFilters = statusFilter !== 'all' || templateFilter !== 'all';

  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Undangan Digital</h1>
        <p className="text-muted-foreground">
          Monitor semua undangan digital yang dibuat pelanggan.
        </p>
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

        <Select 
          value={statusFilter} 
          onValueChange={(value) => setStatusFilter(value as typeof statusFilter)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="active">Aktif</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
          </SelectContent>
        </Select>

        <Select 
          value={templateFilter} 
          onValueChange={setTemplateFilter}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Template" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Template</SelectItem>
            {templates?.map((template) => (
              <SelectItem key={template.id} value={template.id.toString()}>
                {template.name}
              </SelectItem>
            ))}
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
        {invitations && (
          <DataTable
            columns={columns}
            data={invitations}
            searchColumnKey="slug"
            searchPlaceholder="Cari berdasarkan slug atau nama pelanggan..."
          />
        )}
      </div>
    </>
  );
}
