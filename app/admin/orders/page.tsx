'use client';

import { useRouter } from 'next/navigation';
import React from 'react';
import { useOrders } from '@/lib/hooks/useOrders';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const OrdersPage = () => {
  const { data: orders, isLoading, isError, error } = useOrders();
  const router = useRouter();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending_payment':
        return <Badge variant="secondary">Menunggu Pembayaran</Badge>;
      case 'processing':
        return <Badge variant="default">Diproses</Badge>;
      case 'packing':
        return <Badge variant="default">Dikemas</Badge>;
      case 'shipped':
        return <Badge variant="default">Dikirim</Badge>;
      case 'completed':
        return <Badge variant="success">Selesai</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Dibatalkan</Badge>;
      default:
        return <Badge variant="destructive">Status Tidak Diketahui</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Menunggu</Badge>;
      case 'partially_paid':
        return <Badge variant="default">Dibayar Sebagian</Badge>;
      case 'paid':
        return <Badge variant="destructive">Lunas</Badge>;
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
    <div className="container mx-auto py-8">
      <h1 className="mb-6 text-3xl font-bold">Manajemen Pesanan</h1>
      <Card>
        <CardHeader>
          <CardTitle>Semua Order</CardTitle>
        </CardHeader>
        <CardContent>
          {orders && orders.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Order</TableHead>
                  <TableHead>Pelanggan</TableHead>
                  <TableHead>Jumlah Total</TableHead>
                  <TableHead>Sisa Tagihan</TableHead>
                  <TableHead>Status Pesanan</TableHead>
                  <TableHead>Status Pembayaran</TableHead>
                  <TableHead>Tanggal Order</TableHead>
                  <TableHead>Alamat Pengiriman</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow
                    key={order.id}
                    className="cursor-pointer hover:bg-muted"
                    onClick={() => router.push(`/admin/orders/${order.id}`)}
                  >
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.user_full_name}</TableCell>
                    <TableCell>Rp. {typeof order.total_amount === 'number' ? order.total_amount.toLocaleString('id-ID') : 'N/A'}</TableCell>
                    <TableCell>Rp. {typeof order.remaining_balance === 'number' ? order.remaining_balance.toLocaleString('id-ID') : 'N/A'}</TableCell>
                    <TableCell>
                      {getStatusBadge(order.status)}
                    </TableCell>
                    <TableCell>
                      {getPaymentStatusBadge(order.payment_status)}
                    </TableCell>
                    <TableCell>{(() => {
                      try {
                        const date = new Date(order.created_at);
                        if (isNaN(date.getTime())) {
                          console.error('Invalid date string:', order.created_at);
                          return 'Invalid Date';
                        }
                        return date.toLocaleDateString();
                      } catch (e) {
                        console.error('Error parsing date:', order.created_at, e);
                        return 'Invalid Date';
                      }
                    })()}</TableCell>
                    <TableCell>
                      {order.shipping_address ? order.shipping_address : 'N/A'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p>Order tidak ditemukan.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrdersPage;
