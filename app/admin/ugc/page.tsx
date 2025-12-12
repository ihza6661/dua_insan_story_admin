"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Filter, Image as ImageIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllUGC } from "@/services/api/ugc.service";
import { columns } from "./columns";
import { DataTable } from "@/components/shared/DataTable";
import { Card, CardContent } from "@/components/ui/card";

export default function UGCPage() {
  const [approvalFilter, setApprovalFilter] = useState<
    "all" | "approved" | "pending"
  >("all");
  const [featuredFilter, setFeaturedFilter] = useState<
    "all" | "featured" | "not-featured"
  >("all");

  const { data: ugcData, isLoading, error } = useQuery({
    queryKey: ["admin-ugc", approvalFilter, featuredFilter],
    queryFn: () =>
      getAllUGC({
        is_approved:
          approvalFilter === "approved"
            ? true
            : approvalFilter === "pending"
            ? false
            : undefined,
        is_featured:
          featuredFilter === "featured"
            ? true
            : featuredFilter === "not-featured"
            ? false
            : undefined,
      }),
  });

  const ugcItems = ugcData?.data || [];
  const totalItems = ugcData?.meta?.total || 0;
  const approvedCount = ugcItems.filter((item) => item.is_approved).length;
  const pendingCount = ugcItems.filter((item) => !item.is_approved).length;
  const featuredCount = ugcItems.filter((item) => item.is_featured).length;

  const handleResetFilters = () => {
    setApprovalFilter("all");
    setFeaturedFilter("all");
  };

  const hasActiveFilters =
    approvalFilter !== "all" || featuredFilter !== "all";

  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">
          Foto Pengguna (UGC)
        </h1>
        <p className="text-muted-foreground">
          Kelola foto yang diunggah oleh pelanggan untuk galeri.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Foto
                </p>
                <p className="text-2xl font-bold">{totalItems}</p>
              </div>
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Disetujui
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {approvedCount}
                </p>
              </div>
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-xl">✓</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Pending
                </p>
                <p className="text-2xl font-bold text-yellow-600">
                  {pendingCount}
                </p>
              </div>
              <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                <span className="text-xl">⏳</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Unggulan
                </p>
                <p className="text-2xl font-bold text-yellow-600">
                  {featuredCount}
                </p>
              </div>
              <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                <span className="text-xl">⭐</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filter:</span>
        </div>

        <Select
          value={approvalFilter}
          onValueChange={(value) =>
            setApprovalFilter(value as typeof approvalFilter)
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status Persetujuan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="approved">Disetujui</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={featuredFilter}
          onValueChange={(value) =>
            setFeaturedFilter(value as typeof featuredFilter)
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Unggulan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua</SelectItem>
            <SelectItem value="featured">Unggulan</SelectItem>
            <SelectItem value="not-featured">Tidak Unggulan</SelectItem>
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
        {ugcItems && (
          <DataTable
            columns={columns}
            data={ugcItems}
            searchColumnKey="user.name"
            searchPlaceholder="Cari berdasarkan nama pengguna..."
          />
        )}
      </div>
    </>
  );
}
