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
import { getReviews } from "@/services/api/review.service";
import { columns } from "./columns";
import { DataTable } from "@/components/shared/DataTable";
import { StatisticsCards } from "./_components/StatisticsCards";

export default function UlasanPage() {
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [ratingFilter, setRatingFilter] = useState<'all' | '1' | '2' | '3' | '4' | '5'>('all');
  const [featuredFilter, setFeaturedFilter] = useState<'all' | 'featured' | 'not-featured'>('all');

  const { data: reviewsData, isLoading, error } = useQuery({
    queryKey: ['reviews', statusFilter, ratingFilter, featuredFilter],
    queryFn: () => getReviews({
      status: statusFilter !== 'all' ? statusFilter as 'pending' | 'approved' | 'rejected' : undefined,
      rating: ratingFilter !== 'all' ? parseInt(ratingFilter) : undefined,
      is_featured: featuredFilter === 'featured' ? true : featuredFilter === 'not-featured' ? false : undefined,
    }),
  });

  const reviews = reviewsData?.data || [];

  const handleResetFilters = () => {
    setStatusFilter('all');
    setRatingFilter('all');
    setFeaturedFilter('all');
  };

  const hasActiveFilters = statusFilter !== 'all' || ratingFilter !== 'all' || featuredFilter !== 'all';

  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Ulasan Produk</h1>
        <p className="text-muted-foreground">
          Kelola ulasan dan rating produk dari pelanggan.
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

        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as typeof statusFilter)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="pending">Menunggu</SelectItem>
            <SelectItem value="approved">Disetujui</SelectItem>
            <SelectItem value="rejected">Ditolak</SelectItem>
          </SelectContent>
        </Select>

        <Select value={ratingFilter} onValueChange={(value) => setRatingFilter(value as typeof ratingFilter)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Rating</SelectItem>
            <SelectItem value="5">⭐⭐⭐⭐⭐ (5)</SelectItem>
            <SelectItem value="4">⭐⭐⭐⭐ (4)</SelectItem>
            <SelectItem value="3">⭐⭐⭐ (3)</SelectItem>
            <SelectItem value="2">⭐⭐ (2)</SelectItem>
            <SelectItem value="1">⭐ (1)</SelectItem>
          </SelectContent>
        </Select>

        <Select value={featuredFilter} onValueChange={(value) => setFeaturedFilter(value as typeof featuredFilter)}>
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
        {error && <p className="text-destructive">Gagal memuat data: {error.message}</p>}
        {reviews && (
          <DataTable 
            columns={columns} 
            data={reviews} 
            searchColumnKey="product_name"
            searchPlaceholder="Cari berdasarkan nama produk..."
          />
        )}
      </div>
    </>
  );
}
