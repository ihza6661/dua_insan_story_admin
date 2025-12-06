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

  const totalOrders = statusChartData.reduce((sum, item) => sum + item.value, 0);

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
              <YAxis className="text-xs" />
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
        <CardContent className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8">
          {statusChartData.length > 0 ? (
            <>
              {/* Pie Chart */}
              <div className="w-full md:w-[320px] flex-shrink-0">
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={statusChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={false}
                      outerRadius="80%"
                      innerRadius="55%"
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={statusColors[entry.name] || "#8884d8"} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => [`${value} pesanan`, 'Jumlah']}
                      contentStyle={{ 
                        borderRadius: '0.5rem',
                        border: 'none',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }}
                    />
                    <text
                      x="50%"
                      y="45%"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-2xl sm:text-3xl font-bold fill-foreground"
                    >
                      {totalOrders}
                    </text>
                    <text
                      x="50%"
                      y="58%"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-xs sm:text-sm fill-muted-foreground"
                    >
                      Total Pesanan
                    </text>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              {/* Legend */}
              <div className="flex flex-col gap-3 w-full md:w-auto md:min-w-[200px]">
                {statusChartData.map((entry, index) => {
                  const percent = totalOrders > 0 ? ((entry.value / totalOrders) * 100).toFixed(1) : 0;
                  return (
                    <div key={`legend-${index}`} className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-sm shrink-0" 
                        style={{ backgroundColor: statusColors[entry.name] || "#8884d8" }}
                      />
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="text-sm font-medium text-foreground truncate">
                          {entry.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {entry.value} pesanan ({percent}%)
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Tidak ada data untuk ditampilkan</p>
          )}
        </CardContent>
      </Card>
    </>
  );
}
