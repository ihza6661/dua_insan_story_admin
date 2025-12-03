"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  type PieLabelRenderProps,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatRupiah } from "@/lib/utils";

interface DashboardChartsProps {
  revenueTrend: Array<{ date: string; revenue: number }>;
  statusBreakdown: { [key: string]: number };
  statusColors: { [key: string]: string };
}

export function DashboardCharts({ revenueTrend, statusBreakdown, statusColors }: DashboardChartsProps) {
  const statusChartData = Object.entries(statusBreakdown).map(([status, count]) => ({
    name: status,
    value: count,
  }));

  return (
    <>
      {/* Revenue Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Trend Pendapatan</CardTitle>
          <CardDescription>Pendapatan harian dalam periode yang dipilih</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip
                formatter={(value: number) => formatRupiah(value)}
                labelFormatter={(label) => `Tanggal: ${label}`}
              />
              <Legend />
              <Bar dataKey="revenue" fill="#8884d8" name="Pendapatan" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Order Status Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Status Pesanan</CardTitle>
          <CardDescription>Distribusi pesanan berdasarkan status</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          {statusChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(props: PieLabelRenderProps) => {
                    const percent = typeof props.percent === 'number' ? props.percent : 0;
                    return `${props.name}: ${(percent * 100).toFixed(0)}%`;
                  }}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={statusColors[entry.name] || "#8884d8"} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-muted-foreground">Tidak ada data untuk ditampilkan</p>
          )}
        </CardContent>
      </Card>
    </>
  );
}
