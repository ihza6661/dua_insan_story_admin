'use client';

import Link from 'next/link';
import React from 'react';
import { useOrders } from '@/lib/hooks/useOrders';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const OrdersPage = () => {
  const { data: orders, isLoading, isError, error } = useOrders();

  if (isLoading) {
    return <p>Loading orders...</p>;
  }

  if (isError) {
    return <p>Error: {error?.message}</p>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-6 text-3xl font-bold">Order Management</h1>
      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {orders && orders.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Order Date</TableHead>
                  <TableHead>Shipping Address</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id} className="cursor-pointer hover:bg-muted">
                    <Link href={`/admin/orders/${order.id}`} className="contents">
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.user_full_name}</TableCell>
                    <TableCell>Rp. {order.total_amount.toLocaleString('id-ID')}</TableCell>
                    <TableCell>
                      <Badge
                        variant={order.status === 'completed' ? 'default' : order.status === 'pending' ? 'secondary' : 'destructive'}
                      >
                        {order.status}
                      </Badge>
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
                    </Link>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p>No orders found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrdersPage;