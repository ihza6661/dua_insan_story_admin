'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useOrderDetail } from '@/lib/hooks/useOrders';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const OrderDetailsPage = () => {
  const params = useParams();
  const orderId = params.orderId as string;

  const { data: orderData, isLoading, isError, error } = useOrderDetail(orderId);

  if (isLoading) {
    return <p>Loading order details...</p>;
  }

  if (isError) {
    return <p>Error: {error?.message}</p>;
  }

  if (!orderData) {
    return <p>Order not found.</p>;
  }

  console.log('Order object in frontend:', orderData);

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
            <p><strong>Status:</strong> <Badge variant={orderData.status === 'completed' ? 'default' : orderData.status === 'pending' ? 'secondary' : 'destructive'}>{orderData.status}</Badge></p>
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
            <CardTitle>Billing Address</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{orderData.billing_address}</p>
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