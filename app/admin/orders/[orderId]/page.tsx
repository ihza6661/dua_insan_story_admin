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
    return <p>Loading order details...</p>;
  }

  if (isError) {
    return <p>Error: {error?.message}</p>;
  }

  if (!orderData) {
    return <p>Order not found.</p>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-6 text-3xl font-bold">Order Details #{orderData.id}</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Order Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>Order ID:</strong> {orderData.id}</p>
            <p><strong>Customer:</strong> {orderData.user_full_name}</p>
            <p><strong>Status:</strong> {getStatusBadge(orderData.order_status)}</p>
            <p><strong>Total Amount:</strong> Rp. {orderData.total_amount.toLocaleString('id-ID')}</p>
            <p><strong>Order Date:</strong> {new Date(orderData.created_at).toLocaleDateString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Shipping Address</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{orderData.shipping_address}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Update Status</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col space-y-2">
            {orderData.order_status === 'processing' && (
              <Button onClick={() => updateStatus('packing')}>Mark as Packing</Button>
            )}
            {orderData.order_status === 'packing' && (
              <Button onClick={() => updateStatus('shipped')}>Mark as Shipped</Button>
            )}
            {orderData.order_status === 'shipped' && (
              <Button onClick={() => updateStatus('completed')}>Mark as Completed</Button>
            )}
            {(orderData.order_status !== 'completed' && orderData.order_status !== 'cancelled') && (
              <Button variant="destructive" onClick={() => updateStatus('cancelled')}>Cancel Order</Button>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          {orderData.order_items && orderData.order_items.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Subtotal</TableHead>
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
            <p>No items in this order.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderDetailsPage;
