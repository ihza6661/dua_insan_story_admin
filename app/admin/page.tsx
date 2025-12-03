"use client";

import { useAuthStore } from "@/store/auth.store";
import { useQuery } from "@tanstack/react-query";
import { getDashboardData } from "@/services/api/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, CreditCard, Activity } from "lucide-react";
import { formatRupiah } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function AdminDashboardPage() {
  const user = useAuthStore((state) => state.user);

  const { data, isLoading } = useQuery<{
    stats: {
      total_customers: number;
      total_orders: number;
      pending_orders: number;
      total_revenue: number;
    };
    weekly_revenue: {
      date: string;
      revenue: number;
    }[];
  }>({ queryKey: ["dashboardData"], queryFn: getDashboardData });

  const stats = data?.stats;
  const weeklyRevenue = data?.weekly_revenue;

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">
        Selamat Datang, {user?.full_name}!
      </h1>
      <p className="text-muted-foreground">
        Ini adalah halaman dashboard panel admin Anda.
      </p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pendapatan</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : formatRupiah(stats?.total_revenue ?? 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Pelanggan
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : stats?.total_customers}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pesanan</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : stats?.total_orders}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pesanan Tertunda
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : stats?.pending_orders}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Pendapatan Mingguan</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={500}>
              <BarChart data={weeklyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis
                  width={95}
                  interval="preserveStartEnd"
                  tickCount={5}
                  tickFormatter={(value) => formatRupiah(value)}
                  className="text-xs"
                />
                <Tooltip
                  formatter={(value: number) => formatRupiah(value)}
                  labelStyle={{ color: "#000" }}
                />
                <Legend />
                <Bar dataKey="revenue" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

