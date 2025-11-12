'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useOrderDetail } from '@/lib/hooks/useOrders';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const OrderDetailsPage = () => {
  const params = useParams();
  const orderId = params.orderId as string;
  const queryClient = useQueryClient();

  const { data: orderData, isLoading, isError, error } = useOrderDetail(orderId);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending Payment':
        return <Badge variant="secondary">Menunggu Pembayaran</Badge>;
      case 'Partially Paid':
        return <Badge variant="secondary">DP Lunas</Badge>;
      case 'Paid':
        return <Badge variant="success">Lunas</Badge>;
      case 'Processing':
        return <Badge variant="default">Diproses</Badge>;
      case 'Design Approval':
        return <Badge variant="default">Persetujuan Desain</Badge>;
      case 'In Production':
        return <Badge variant="default">Dalam Produksi</Badge>;
      case 'Shipped':
        return <Badge variant="default">Dikirim</Badge>;
      case 'Delivered':
        return <Badge variant="default">Terkirim</Badge>;
      case 'Completed':
        return <Badge variant="success">Selesai</Badge>;
      case 'Cancelled':
        return <Badge variant="destructive">Dibatalkan</Badge>;
      case 'Failed':
        return <Badge variant="destructive">Gagal</Badge>;
      case 'Refunded':
        return <Badge variant="destructive">Dikembalikan</Badge>;
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
        return <Badge variant="success">Lunas</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Dibatalkan</Badge>;
      default:
        return <Badge variant="destructive">Status Tidak Diketahui</Badge>;
    }
  };

  const updateStatus = async (status: string) => {
    try {
      await api.post(`/admin/orders/${orderId}/status`, { status });
      await queryClient.invalidateQueries({ queryKey: ['order', orderId] });
    } catch (err) {
      console.error('Failed to update status', err);
      // Optionally, show an error message to the user
    }
  };

  if (isLoading) {
    return <p>Memuat detail pesanan...</p>;
  }

  if (isError) {
    return <p>Error: {error?.message}</p>;
  }

  if (!orderData) {
    return <p>Pesanan tidak ditemukan.</p>;
  }

  const amountPaid = Number(orderData.amount_paid ?? 0);
  const remainingBalance = Number(
    orderData.remaining_balance ?? Math.max(orderData.total_amount - amountPaid, 0)
  );

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-6 text-3xl font-bold">Detail Pesanan #{orderData.id}</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Informasi Pesanan</CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>ID Order:</strong> {orderData.id}</p>
            <p><strong>Pelanggan:</strong> {orderData.user_full_name}</p>
            <p><strong>Status Pesanan:</strong> {getStatusBadge(orderData.order_status)}</p>
            {/* <p><strong>Status Pembayaran:</strong> {getPaymentStatusBadge(orderData.payment_status)}</p> */}
            <p><strong>Jumlah Total:</strong> Rp. {typeof orderData.total_amount === 'number' ? orderData.total_amount.toLocaleString('id-ID') : 'N/A'}</p>
            <p><strong>Tanggal Pesanan:</strong> {new Date(orderData.created_at).toLocaleDateString()}</p>
          </CardContent>
        </Card>

        {orderData.invitation_detail && (
          <Card>
            <CardHeader>
              <CardTitle>Detail Pernikahan</CardTitle>
            </CardHeader>
            <CardContent>
              <p><strong>Mempelai Wanita:</strong> {orderData.invitation_detail.bride_full_name} ({orderData.invitation_detail.bride_nickname})</p>
              <p><strong>Mempelai Pria:</strong> {orderData.invitation_detail.groom_full_name} ({orderData.invitation_detail.groom_nickname})</p>
              <p><strong>Orang Tua Mempelai Wanita:</strong> {orderData.invitation_detail.bride_parents}</p>
              <p><strong>Orang Tua Mempelai Pria:</strong> {orderData.invitation_detail.groom_parents}</p>
              <p><strong>Tanggal Akad:</strong> {new Date(orderData.invitation_detail.akad_date).toLocaleDateString()}</p>
              <p><strong>Waktu Akad:</strong> {orderData.invitation_detail.akad_time}</p>
              <p><strong>Lokasi Akad:</strong> {orderData.invitation_detail.akad_location}</p>
              {orderData.invitation_detail.reception_date && (
                <>
                  <p><strong>Tanggal Resepsi:</strong> {new Date(orderData.invitation_detail.reception_date).toLocaleDateString()}</p>
                  <p><strong>Waktu Resepsi:</strong> {orderData.invitation_detail.reception_time}</p>
                  <p><strong>Lokasi Resepsi:</strong> {orderData.invitation_detail.reception_location}</p>
                </>
              )}
              {orderData.invitation_detail.gmaps_link && (
                <p><strong>Google Maps:</strong> <a href={orderData.invitation_detail.gmaps_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Tautan</a></p>
              )}
              {orderData.invitation_detail.prewedding_photo && (
                <p><strong>Foto Prewedding:</strong> <a href={orderData.invitation_detail.prewedding_photo} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Lihat Foto</a></p>
              )}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Alamat Pengiriman</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{orderData.shipping_address}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ringkasan Pembayaran</CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>Status Pembayaran:</strong> {getPaymentStatusBadge(orderData.payment_status)}</p>
            <p><strong>Jumlah Dibayar:</strong> Rp. {amountPaid.toLocaleString('id-ID')}</p>
            <p><strong>Sisa Tagihan:</strong> Rp. {remainingBalance.toLocaleString('id-ID')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Perbarui Status</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col space-y-2">
            {orderData.order_status === 'processing' && (
              <Button onClick={() => updateStatus('packing')}>Tandai sebagai Packing</Button>
            )}
            {orderData.order_status === 'packing' && (
              <Button onClick={() => updateStatus('shipped')}>Tandai sebagai Dikirim</Button>
            )}
            {orderData.order_status === 'shipped' && (
              <Button onClick={() => updateStatus('completed')}>Tandai sebagai Selesai</Button>
            )}
            {(orderData.order_status !== 'completed' && orderData.order_status !== 'cancelled') && (
              <Button variant="destructive" onClick={() => updateStatus('cancelled')}>Batalkan Pesanan</Button>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Item yang Di Pesan</CardTitle>
        </CardHeader>
        <CardContent>
          {orderData.order_items && orderData.order_items.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produk</TableHead>
                  <TableHead>Jumlah</TableHead>
                  <TableHead>Haraga</TableHead>
                  <TableHead>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orderData.order_items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.product_name}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>Rp. {item.price.toLocaleString('id-ID')}</TableCell>
                    <TableCell>Rp. {item.subtotal.toLocaleString('id-ID')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p>Tidak ada item di pesanan ini.</p>
          )}
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Riwayat Pembayaran</CardTitle>
        </CardHeader>
        <CardContent>
          {orderData.payments && orderData.payments.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Jumlah</TableHead>
                  <TableHead>Metode</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orderData.payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>{new Date(payment.payment_date).toLocaleDateString()}</TableCell>
                    <TableCell>Rp. {payment.amount.toLocaleString('id-ID')}</TableCell>
                    <TableCell>{payment.payment_method}</TableCell>
                    <TableCell>{getPaymentStatusBadge(payment.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p>Tidak ada riwayat pembayaran untuk pesanan ini.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderDetailsPage;
