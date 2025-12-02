"use client";

import { useQuery } from "@tanstack/react-query";
import { MessageSquare, Clock, CheckCircle, XCircle, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getReviewStatistics } from "@/services/api/review.service";

export function StatisticsCards() {
  const { data: statistics, isLoading } = useQuery({
    queryKey: ['review-statistics'],
    queryFn: getReviewStatistics,
  });

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!statistics) {
    return null;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Ulasan</CardTitle>
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{statistics.total_reviews}</div>
          <p className="text-xs text-muted-foreground">
            Semua ulasan produk
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Menunggu</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{statistics.pending_reviews}</div>
          <p className="text-xs text-muted-foreground">
            Perlu ditinjau
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Disetujui</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{statistics.approved_reviews}</div>
          <p className="text-xs text-muted-foreground">
            Ulasan aktif
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ditolak</CardTitle>
          <XCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{statistics.rejected_reviews}</div>
          <p className="text-xs text-muted-foreground">
            Tidak dipublikasikan
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Rating Rata-rata</CardTitle>
          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {statistics.average_rating > 0 ? statistics.average_rating.toFixed(1) : "0.0"}
          </div>
          <p className="text-xs text-muted-foreground">
            Dari {statistics.approved_reviews} ulasan
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
