'use client';

import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  getCancellationRequests, 
  getCancellationStatistics,
  type CancellationRequest 
} from '@/services/api/cancellation.service';
import { CancellationRequestDetailDialog } from './_components/CancellationRequestDetailDialog';
import { AlertCircle, CheckCircle, Clock, XCircle } from 'lucide-react';

const formatCurrency = (amount: unknown) => {
  const numericValue = Number(amount);
  if (!Number.isFinite(numericValue)) return 'Rp 0';
  return `Rp ${numericValue.toLocaleString('id-ID')}`;
};

const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return 'Tanggal tidak valid';
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return 'Tanggal tidak valid';
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'pending':
      return (
        <Badge variant="secondary" className="gap-1">
          <Clock className="h-3 w-3" />
          Menunggu
        </Badge>
      );
    case 'approved':
      return (
        <Badge variant="default" className="gap-1 bg-green-600">
          <CheckCircle className="h-3 w-3" />
          Disetujui
        </Badge>
      );
    case 'rejected':
      return (
        <Badge variant="destructive" className="gap-1">
          <XCircle className="h-3 w-3" />
          Ditolak
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const CancellationRequestsPage = () => {
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [selectedRequest, setSelectedRequest] = useState<CancellationRequest | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  // Fetch cancellation requests
  const { data: requestsData, isLoading } = useQuery({
    queryKey: ['cancellation-requests', activeTab],
    queryFn: () => getCancellationRequests(activeTab, 1),
  });

  // Fetch statistics
  const { data: statistics } = useQuery({
    queryKey: ['cancellation-statistics'],
    queryFn: getCancellationStatistics,
  });

  const handleViewDetails = (request: CancellationRequest) => {
    setSelectedRequest(request);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setTimeout(() => setSelectedRequest(null), 300);
  };

  const handleActionSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['cancellation-requests'] });
    queryClient.invalidateQueries({ queryKey: ['cancellation-statistics'] });
    queryClient.invalidateQueries({ queryKey: ['orders'] });
    handleDialogClose();
  };

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-6">
        <p>Memuat Permintaan Pembatalan...</p>
      </div>
    );
  }

  const requests = requestsData?.data || [];

  return (
    <div className="container mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Permintaan Pembatalan</h1>
          <p className="text-sm text-muted-foreground">
            Kelola permintaan pembatalan pesanan dari pelanggan
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      {statistics && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Menunggu</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.pending}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Disetujui</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.approved}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ditolak</CardTitle>
              <XCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.rejected}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.total}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabs */}
      <Card className="shadow-sm">
        <CardHeader>
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'pending' | 'approved' | 'rejected')}>
            <TabsList>
              <TabsTrigger value="pending">
                Menunggu {statistics && statistics.pending > 0 && `(${statistics.pending})`}
              </TabsTrigger>
              <TabsTrigger value="approved">Disetujui</TabsTrigger>
              <TabsTrigger value="rejected">Ditolak</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          {requests.length > 0 ? (
            <div className="space-y-6">
              {/* Mobile View */}
              <div className="space-y-4 md:hidden">
                {requests.map((request) => (
                  <div
                    key={request.id}
                    className="rounded-2xl border bg-card p-4 shadow-sm"
                  >
                    <div className="mb-3 flex items-start justify-between">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Pesanan</p>
                        <p className="text-base font-semibold">#{request.order?.order_number}</p>
                      </div>
                      {getStatusBadge(request.status)}
                    </div>
                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Pelanggan</p>
                        <p className="font-medium">{request.order?.customer?.full_name}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Alasan</p>
                        <p className="line-clamp-2">{request.cancellation_reason}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Total Pesanan</p>
                          <p className="font-semibold">{formatCurrency(request.order?.total_amount)}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Tanggal</p>
                          <p className="font-medium">{formatDate(request.created_at)}</p>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleViewDetails(request)}
                        className="w-full"
                        size="sm"
                      >
                        Lihat Detail
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop View */}
              <div className="hidden md:block">
                <div className="overflow-x-auto rounded-xl border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>No. Pesanan</TableHead>
                        <TableHead>Pelanggan</TableHead>
                        <TableHead>Alasan Pembatalan</TableHead>
                        <TableHead>Total Pesanan</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Tanggal</TableHead>
                        <TableHead>Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {requests.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell className="font-semibold">
                            #{request.order?.order_number}
                          </TableCell>
                          <TableCell>{request.order?.customer?.full_name}</TableCell>
                          <TableCell className="max-w-xs truncate">
                            {request.cancellation_reason}
                          </TableCell>
                          <TableCell>{formatCurrency(request.order?.total_amount)}</TableCell>
                          <TableCell>{getStatusBadge(request.status)}</TableCell>
                          <TableCell>{formatDate(request.created_at)}</TableCell>
                          <TableCell>
                            <Button
                              onClick={() => handleViewDetails(request)}
                              size="sm"
                              variant="outline"
                            >
                              Detail
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 py-10 text-center text-muted-foreground">
              <AlertCircle className="h-12 w-12" />
              <p className="text-base font-medium">Tidak ada permintaan pembatalan</p>
              <p className="text-sm">
                {activeTab === 'pending'
                  ? 'Permintaan pembatalan baru akan muncul di sini'
                  : `Tidak ada permintaan yang ${activeTab === 'approved' ? 'disetujui' : 'ditolak'}`}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      {selectedRequest && (
        <CancellationRequestDetailDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          request={selectedRequest}
          onSuccess={handleActionSuccess}
        />
      )}
    </div>
  );
};

export default CancellationRequestsPage;
