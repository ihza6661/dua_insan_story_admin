"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Filter, Calendar, AlertTriangle, Clock, ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getScheduledInvitations } from "@/services/api/digital-invitation.service";
import { columns } from "./columns";
import { DataTable } from "@/components/shared/DataTable";

export default function TerjadwalPage() {
  const [timeframeFilter, setTimeframeFilter] = useState<'all' | 'upcoming' | 'overdue'>('all');

  const { data: scheduledData, isLoading, error } = useQuery({
    queryKey: ['scheduled-invitations', timeframeFilter],
    queryFn: () => getScheduledInvitations({
      timeframe: timeframeFilter !== 'all' ? timeframeFilter as 'upcoming' | 'overdue' : undefined,
    }),
    refetchInterval: 60000, // Refresh every minute to update countdowns
  });

  const invitations = scheduledData?.data || [];
  const overdueCount = invitations.filter(inv => inv.is_overdue).length;
  const upcomingCount = invitations.filter(inv => !inv.is_overdue).length;

  const handleResetFilters = () => {
    setTimeframeFilter('all');
  };

  const hasActiveFilters = timeframeFilter !== 'all';

  return (
    <>
      {/* Header with Back Button */}
      <div className="mb-6">
        <Link 
          href="/admin/undangan-digital" 
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-2"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali ke Daftar Undangan
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Undangan Terjadwal</h1>
        <p className="text-muted-foreground">
          Monitor undangan digital yang dijadwalkan untuk aktivasi otomatis.
        </p>
      </div>

      {/* Alert for Overdue Invitations */}
      {overdueCount > 0 && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Perhatian: Ada {overdueCount} undangan terlambat diaktifkan!</AlertTitle>
          <AlertDescription>
            Beberapa undangan melewati waktu aktivasi yang dijadwalkan. Sistem akan mengaktifkannya secara otomatis pada job berikutnya (setiap 15 menit).
          </AlertDescription>
        </Alert>
      )}

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <h3 className="text-sm font-medium text-muted-foreground">Total Terjadwal</h3>
          </div>
          <p className="text-3xl font-bold">{invitations.length}</p>
          <p className="text-xs text-muted-foreground mt-1">Undangan dalam antrian</p>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-5 w-5 text-blue-500" />
            <h3 className="text-sm font-medium text-muted-foreground">Mendatang</h3>
          </div>
          <p className="text-3xl font-bold text-blue-500">{upcomingCount}</p>
          <p className="text-xs text-muted-foreground mt-1">Akan diaktifkan sesuai jadwal</p>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <h3 className="text-sm font-medium text-muted-foreground">Terlambat</h3>
          </div>
          <p className="text-3xl font-bold text-destructive">{overdueCount}</p>
          <p className="text-xs text-muted-foreground mt-1">Melewati waktu yang dijadwalkan</p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filter:</span>
        </div>

        <Select 
          value={timeframeFilter} 
          onValueChange={(value) => setTimeframeFilter(value as typeof timeframeFilter)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua</SelectItem>
            <SelectItem value="upcoming">Mendatang</SelectItem>
            <SelectItem value="overdue">Terlambat</SelectItem>
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

      {/* Info Box */}
      <Alert className="mb-6">
        <Clock className="h-4 w-4" />
        <AlertTitle>Aktivasi Otomatis</AlertTitle>
        <AlertDescription>
          Sistem akan mengaktifkan undangan secara otomatis setiap 15 menit. Undangan yang sudah melewati waktu aktivasi akan diaktifkan pada job berikutnya.
        </AlertDescription>
      </Alert>

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
            searchColumnKey="customer"
            searchPlaceholder="Cari berdasarkan nama pelanggan atau slug..."
          />
        )}
      </div>
    </>
  );
}
