"use client";

import { useQuery } from "@tanstack/react-query";
import { Mail, Eye, DollarSign, FileCheck, Calendar } from "lucide-react";
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getDigitalInvitationStatistics } from "@/services/api/digital-invitation.service";
import { formatRupiah } from "@/lib/utils";

export function StatisticsCards() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['digital-invitation-statistics'],
    queryFn: getDigitalInvitationStatistics,
  });

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Undangan
          </CardTitle>
          <Mail className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.total_invitations || 0}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {stats?.active_invitations || 0} aktif, {stats?.draft_invitations || 0} draft
          </p>
        </CardContent>
      </Card>

      <Link href="/admin/undangan-digital/terjadwal" className="block">
        <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Terjadwal
            </CardTitle>
            <Calendar className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">{stats?.scheduled_invitations || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Menunggu aktivasi otomatis
            </p>
          </CardContent>
        </Card>
      </Link>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Views
          </CardTitle>
          <Eye className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.total_views || 0}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Dari semua undangan
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Pendapatan
          </CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatRupiah(stats?.total_revenue || 0)}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Dari penjualan template
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Template Aktif
          </CardTitle>
          <FileCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.active_templates || 0}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Dari {stats?.templates_count || 0} template
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
