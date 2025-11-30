'use client';

import { useRouter } from 'next/navigation';
import React from 'react';
import { useOrders } from '@/lib/hooks/useOrders';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { getOrderStatusLabel, getOrderStatusVariant } from '@/lib/constants/orderStatus';

const formatCurrency = (amount: unknown) => {
  const numericValue = Number(amount);

  if (!Number.isFinite(numericValue)) {
    return 'Rp 0';
  }

  return `Rp ${numericValue.toLocaleString('id-ID')}`;
};

const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) {
      return 'Tanggal tidak valid';
    }

    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch (error) {
    console.error('Error parsing date:', dateString, error);
    return 'Tanggal tidak valid';
  }
};

const OrdersPage = () => {
  const { data: orders, isLoading, isError, error } = useOrders();
  const router = useRouter();

  const getStatusBadge = (status: string) => {
    const variant = getOrderStatusVariant(status);
    const label = getOrderStatusLabel(status);
    return <Badge variant={variant}>{label}</Badge>;
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Menunggu</Badge>;
      case 'partially_paid':
        return <Badge variant="default">Dibayar Sebagian</Badge>;
      case 'paid':
        return <Badge variant="success">Lunas</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Dibatalkan</Badge>;
      default:
        return <Badge variant="destructive">Status Tidak Diketahui</Badge>;
    }
  };

  if (isLoading) {
    return <p>Memuat Pesanan...</p>;
  }

  if (isError) {
    return <p>Error: {error?.message}</p>;
  }

  return (
    <div className="container mx-auto w-full max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Manajemen Pesanan</h1>
        <p className="text-sm text-muted-foreground sm:text-base">Pantau status pesanan pelanggan kapan pun dan di perangkat apa pun.</p>
      </div>
      <Card className="shadow-sm">
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Semua Order</CardTitle>
          <p className="text-sm text-muted-foreground">Tap sebuah baris atau kartu untuk melihat detail lengkap.</p>
        </CardHeader>
        <CardContent>
          {orders && orders.length > 0 ? (
            <div className="space-y-6">
              <div className="space-y-4 md:hidden">
                {orders.map((order) => {
                  const remainingBalance = Math.max(
                    Number(order.remaining_balance ?? order.total_amount - order.amount_paid),
                    0,
                  );

                  return (
                    <button
                      key={order.id}
                      type="button"
                      onClick={() => router.push(`/admin/orders/${order.id}`)}
                      className="w-full rounded-2xl border bg-card p-4 text-left shadow-sm transition hover:border-primary/50 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    >
                      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">ID Order</p>
                          <p className="text-base font-semibold">#{order.id}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1 text-right">
                          {getStatusBadge(order.order_status)}
                          {getPaymentStatusBadge(order.payment_status)}
                        </div>
                      </div>
                      <div className="space-y-3 text-sm">
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Pelanggan</p>
                          <p className="font-medium">{order.user_full_name ?? 'Tidak diketahui'}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3 rounded-xl bg-muted/40 p-3">
                          <div>
                            <p className="text-xs font-medium text-muted-foreground">Jumlah Total</p>
                            <p className="font-semibold">{formatCurrency(order.total_amount)}</p>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-muted-foreground">Sisa Tagihan</p>
                            <p className="font-semibold">{formatCurrency(remainingBalance)}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <div>
                            <p className="text-xs font-medium text-muted-foreground">Tanggal Order</p>
                            <p className="font-medium">{formatDate(order.created_at)}</p>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-muted-foreground">Alamat Pengiriman</p>
                            <p className="line-clamp-2 font-medium">{order.shipping_address || 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="hidden md:block">
                <div className="overflow-x-auto rounded-xl border">
                  <Table className="min-w-[960px] text-sm">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="whitespace-nowrap">ID Order</TableHead>
                        <TableHead className="whitespace-nowrap">Pelanggan</TableHead>
                        <TableHead className="whitespace-nowrap">Jumlah Total</TableHead>
                        <TableHead className="whitespace-nowrap">Sisa Tagihan</TableHead>
                        <TableHead className="whitespace-nowrap">Status Pesanan</TableHead>
                        <TableHead className="whitespace-nowrap">Status Pembayaran</TableHead>
                        <TableHead className="whitespace-nowrap">Tanggal Order</TableHead>
                        <TableHead className="whitespace-nowrap">Alamat Pengiriman</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => {
                        const remainingBalance = Math.max(
                          Number(order.remaining_balance ?? order.total_amount - order.amount_paid),
                          0,
                        );

                        return (
                          <TableRow
                            key={order.id}
                            className="cursor-pointer hover:bg-muted"
                            onClick={() => router.push(`/admin/orders/${order.id}`)}
                          >
                            <TableCell className="font-semibold">#{order.id}</TableCell>
                            <TableCell>{order.user_full_name}</TableCell>
                            <TableCell>{formatCurrency(order.total_amount)}</TableCell>
                            <TableCell>{formatCurrency(remainingBalance)}</TableCell>
                            <TableCell>{getStatusBadge(order.order_status)}</TableCell>
                            <TableCell>{getPaymentStatusBadge(order.payment_status)}</TableCell>
                            <TableCell>{formatDate(order.created_at)}</TableCell>
                            <TableCell className="max-w-xs truncate">{order.shipping_address || 'N/A'}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 py-10 text-center text-muted-foreground">
              <p className="text-base font-medium">Order tidak ditemukan</p>
              <p className="text-sm">Pesanan baru akan muncul secara otomatis setelah pelanggan melakukan transaksi.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrdersPage;
