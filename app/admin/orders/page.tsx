'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useMemo, useCallback } from 'react';
import { format } from 'date-fns';
import { Download } from 'lucide-react';
import { useOrders } from '@/lib/hooks/useOrders';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { getOrderStatusLabel, getOrderStatusVariant } from '@/lib/constants/orderStatus';
import { OrderFilters } from '@/components/orders/OrderFilters';
import { Pagination } from '@/components/ui/pagination';
import { BulkActionsToolbar } from '@/components/orders/BulkActionsToolbar';
import { BulkStatusUpdateDialog } from '@/components/orders/BulkStatusUpdateDialog';
import { ExportOrdersDialog } from '@/components/orders/ExportOrdersDialog';
import type { OrderFilterValues } from '@/components/orders/OrderFilters';
import type { OrderFilters as OrderFiltersType } from '@/lib/types';

const formatCurrency = (amount: unknown) => {
  const numericValue = Number(amount);

  if (!Number.isFinite(numericValue)) {
    return 'Rp 0';
  }

  return `Rp ${numericValue.toLocaleString('id-ID')}`;
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
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [filters, setFilters] = useState<OrderFilterValues>({});
  const [selectedOrders, setSelectedOrders] = useState<Set<number>>(new Set());
  const [showBulkUpdateDialog, setShowBulkUpdateDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);

  // Convert filters to API format
  const apiFilters: OrderFiltersType = useMemo(() => {
    const converted: OrderFiltersType = {
      page: currentPage,
      per_page: perPage,
    };

    if (filters.search) converted.search = filters.search;
    if (filters.orderStatus) converted.order_status = filters.orderStatus;
    if (filters.paymentStatus) converted.payment_status = filters.paymentStatus;
    
    if (filters.dateRange?.from) {
      converted.date_from = format(filters.dateRange.from, 'yyyy-MM-dd');
    }
    if (filters.dateRange?.to) {
      converted.date_to = format(filters.dateRange.to, 'yyyy-MM-dd');
    }

    return converted;
  }, [currentPage, perPage, filters]);

  const { data, isLoading, isError, error } = useOrders(apiFilters);

  const orders = data?.data || [];
  const meta = data?.meta;

  // Selection handlers - memoized to prevent re-renders
  const toggleSelectAll = useCallback(() => {
    if (selectedOrders.size === orders.length) {
      setSelectedOrders(new Set());
    } else {
      setSelectedOrders(new Set(orders.map(o => o.id)));
    }
  }, [selectedOrders.size, orders]);

  const toggleSelectOrder = useCallback((orderId: number) => {
    setSelectedOrders(prev => {
      const newSelection = new Set(prev);
      if (newSelection.has(orderId)) {
        newSelection.delete(orderId);
      } else {
        newSelection.add(orderId);
      }
      return newSelection;
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedOrders(new Set());
  }, []);

  const handleBulkUpdateSuccess = useCallback(() => {
    clearSelection();
  }, [clearSelection]);

  const getStatusBadge = useCallback((status: string) => {
    const variant = getOrderStatusVariant(status);
    const label = getOrderStatusLabel(status);
    return <Badge variant={variant}>{label}</Badge>;
  }, []);

  const getPaymentStatusBadge = useCallback((status: string) => {
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
  }, []);

  const handleFiltersChange = useCallback((newFilters: OrderFilterValues) => {
    setFilters(newFilters);
    setCurrentPage(1);
    clearSelection();
  }, [clearSelection]);

  const handleClearFilters = useCallback(() => {
    setFilters({});
    setCurrentPage(1);
    clearSelection();
  }, [clearSelection]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    clearSelection();
  }, [clearSelection]);

  const handlePerPageChange = useCallback((newPerPage: number) => {
    setPerPage(newPerPage);
    setCurrentPage(1);
    clearSelection();
  }, [clearSelection]);

  if (isError) {
    return (
      <div className="container mx-auto w-full max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Manajemen Pesanan</h1>
        </div>
        <Card className="shadow-sm">
          <CardContent className="py-10">
            <div className="text-center text-destructive">
              <p className="text-lg font-semibold">Error memuat pesanan</p>
              <p className="text-sm text-muted-foreground">{error?.message}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto w-full max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manajemen Pesanan</h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Pantau status pesanan pelanggan kapan pun dan di perangkat apa pun.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => setShowExportDialog(true)}
          disabled={isLoading}
        >
          <Download className="mr-2 h-4 w-4" />
          Export Semua
        </Button>
      </div>

      {/* Filters */}
      <OrderFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClearFilters={handleClearFilters}
      />

      {/* Bulk Actions Toolbar */}
      <BulkActionsToolbar
        selectedCount={selectedOrders.size}
        onClearSelection={clearSelection}
        onBulkStatusUpdate={() => setShowBulkUpdateDialog(true)}
        onExport={() => setShowExportDialog(true)}
      />

      <Card className="shadow-sm">
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>
            {meta ? `${meta.total} Pesanan` : 'Semua Pesanan'}
          </CardTitle>
          <p className="text-sm text-muted-foreground">Klik baris untuk melihat detail lengkap.</p>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : orders && orders.length > 0 ? (
            <div className="space-y-6">
              {/* Mobile View - Cards */}
              <div className="space-y-4 md:hidden">
                {orders.map((order) => {
                  const remainingBalance = Math.max(
                    Number(order.remaining_balance ?? order.total_amount - order.amount_paid),
                    0,
                  );

                  return (
                    <div
                      key={order.id}
                      className="rounded-2xl border bg-card p-4 shadow-sm"
                    >
                      <div className="mb-3 flex items-start gap-3">
                        <Checkbox
                          checked={selectedOrders.has(order.id)}
                          onCheckedChange={() => toggleSelectOrder(order.id)}
                        />
                        <button
                          type="button"
                          onClick={() => router.push(`/admin/orders/${order.id}`)}
                          className="flex-1 text-left"
                        >
                          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
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
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Desktop View - Table */}
              <div className="hidden md:block">
                <div className="overflow-x-auto rounded-xl border">
                  <Table className="min-w-[960px] text-sm">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">
                          <Checkbox
                            checked={selectedOrders.size === orders.length && orders.length > 0}
                            onCheckedChange={toggleSelectAll}
                          />
                        </TableHead>
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
                          <TableRow key={order.id} className="cursor-pointer hover:bg-muted">
                            <TableCell onClick={(e) => e.stopPropagation()}>
                              <Checkbox
                                checked={selectedOrders.has(order.id)}
                                onCheckedChange={() => toggleSelectOrder(order.id)}
                              />
                            </TableCell>
                            <TableCell
                              className="font-semibold"
                              onClick={() => router.push(`/admin/orders/${order.id}`)}
                            >
                              #{order.id}
                            </TableCell>
                            <TableCell onClick={() => router.push(`/admin/orders/${order.id}`)}>
                              {order.user_full_name}
                            </TableCell>
                            <TableCell onClick={() => router.push(`/admin/orders/${order.id}`)}>
                              {formatCurrency(order.total_amount)}
                            </TableCell>
                            <TableCell onClick={() => router.push(`/admin/orders/${order.id}`)}>
                              {formatCurrency(remainingBalance)}
                            </TableCell>
                            <TableCell onClick={() => router.push(`/admin/orders/${order.id}`)}>
                              {getStatusBadge(order.order_status)}
                            </TableCell>
                            <TableCell onClick={() => router.push(`/admin/orders/${order.id}`)}>
                              {getPaymentStatusBadge(order.payment_status)}
                            </TableCell>
                            <TableCell onClick={() => router.push(`/admin/orders/${order.id}`)}>
                              {formatDate(order.created_at)}
                            </TableCell>
                            <TableCell
                              className="max-w-xs truncate"
                              onClick={() => router.push(`/admin/orders/${order.id}`)}
                            >
                              {order.shipping_address || 'N/A'}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Pagination */}
              {meta && meta.total > 0 && (
                <Pagination
                  currentPage={meta.current_page}
                  totalPages={meta.last_page}
                  totalItems={meta.total}
                  perPage={meta.per_page}
                  onPageChange={handlePageChange}
                  onPerPageChange={handlePerPageChange}
                />
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 py-10 text-center text-muted-foreground">
              <p className="text-base font-medium">Order tidak ditemukan</p>
              <p className="text-sm">
                {filters.search || filters.orderStatus || filters.paymentStatus || filters.dateRange
                  ? 'Coba ubah filter pencarian Anda.'
                  : 'Pesanan baru akan muncul secara otomatis setelah pelanggan melakukan transaksi.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bulk Status Update Dialog */}
      <BulkStatusUpdateDialog
        open={showBulkUpdateDialog}
        onOpenChange={setShowBulkUpdateDialog}
        selectedOrderIds={Array.from(selectedOrders)}
        onSuccess={handleBulkUpdateSuccess}
      />

      {/* Export Dialog */}
      <ExportOrdersDialog
        open={showExportDialog}
        onOpenChange={setShowExportDialog}
        selectedOrderIds={selectedOrders.size > 0 ? Array.from(selectedOrders) : undefined}
        filters={apiFilters}
      />
    </div>
  );
};

export default OrdersPage;
