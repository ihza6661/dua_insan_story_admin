'use client';

import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  approveCancellation,
  rejectCancellation,
  type CancellationRequest,
} from '@/services/api/cancellation.service';
import { AlertCircle, CheckCircle, Clock, XCircle, Package, User, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

interface CancellationRequestDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: CancellationRequest;
  onSuccess: () => void;
}

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
      month: 'long',
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

export function CancellationRequestDetailDialog({
  open,
  onOpenChange,
  request,
  onSuccess,
}: CancellationRequestDetailDialogProps) {
  const [adminNotes, setAdminNotes] = useState('');
  const [showApproveConfirm, setShowApproveConfirm] = useState(false);
  const [showRejectForm, setShowRejectForm] = useState(false);

  // Approve mutation
  const approveMutation = useMutation({
    mutationFn: () => approveCancellation(request.id, adminNotes || undefined),
    onSuccess: (data) => {
      toast.success('Pembatalan Disetujui', {
        description: data.message || 'Pesanan telah dibatalkan dan stok dipulihkan',
      });
      onSuccess();
      resetState();
    },
    onError: (error: unknown) => {
      const apiError = error as { response?: { data?: { message?: string } } };
      toast.error('Gagal Menyetujui', {
        description: apiError.response?.data?.message || 'Terjadi kesalahan saat memproses permintaan',
      });
    },
  });

  // Reject mutation
  const rejectMutation = useMutation({
    mutationFn: () => {
      if (!adminNotes.trim()) {
        throw new Error('Catatan admin wajib diisi saat menolak pembatalan');
      }
      return rejectCancellation(request.id, adminNotes);
    },
    onSuccess: (data) => {
      toast.success('Pembatalan Ditolak', {
        description: data.message || 'Permintaan pembatalan telah ditolak',
      });
      onSuccess();
      resetState();
    },
    onError: (error: unknown) => {
      const apiError = error as { response?: { data?: { message?: string } }; message?: string };
      toast.error('Gagal Menolak', {
        description: apiError.response?.data?.message || apiError.message || 'Terjadi kesalahan',
      });
    },
  });

  const resetState = () => {
    setAdminNotes('');
    setShowApproveConfirm(false);
    setShowRejectForm(false);
  };

  const handleApprove = () => {
    if (showApproveConfirm) {
      approveMutation.mutate();
    } else {
      setShowApproveConfirm(true);
      setShowRejectForm(false);
    }
  };

  const handleReject = () => {
    if (showRejectForm) {
      rejectMutation.mutate();
    } else {
      setShowRejectForm(true);
      setShowApproveConfirm(false);
    }
  };

  const handleCancel = () => {
    resetState();
  };

  const isPending = request.status === 'pending';
  const isLoading = approveMutation.isPending || rejectMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-xl">Detail Permintaan Pembatalan</DialogTitle>
              <DialogDescription className="mt-1">
                Pesanan #{request.order?.order_number}
              </DialogDescription>
            </div>
            {getStatusBadge(request.status)}
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Customer Information */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <User className="h-4 w-4" />
              Informasi Pelanggan
            </div>
            <div className="rounded-lg border bg-muted/50 p-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Nama Lengkap</p>
                  <p className="text-sm font-medium">{request.order?.customer?.full_name || '-'}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Email</p>
                  <p className="text-sm font-medium">{request.order?.customer?.email || '-'}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Order Information */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Package className="h-4 w-4" />
              Informasi Pesanan
            </div>
            <div className="rounded-lg border bg-muted/50 p-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Nomor Pesanan</p>
                  <p className="text-sm font-semibold">#{request.order?.order_number}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Status Pesanan</p>
                  <p className="text-sm font-medium">{request.order?.order_status || '-'}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Total Pesanan</p>
                  <p className="text-sm font-bold">{formatCurrency(request.order?.total_amount)}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Tanggal Permintaan</p>
                  <p className="text-sm font-medium">{formatDate(request.created_at)}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Cancellation Details */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <AlertCircle className="h-4 w-4" />
              Detail Pembatalan
            </div>
            <div className="space-y-3">
              <div>
                <Label className="text-xs font-medium text-muted-foreground">Alasan Pembatalan</Label>
                <div className="mt-1.5 rounded-lg border bg-muted/30 p-3">
                  <p className="whitespace-pre-wrap text-sm">{request.cancellation_reason}</p>
                </div>
              </div>
              <div>
                <Label className="text-xs font-medium text-muted-foreground">Diminta Oleh</Label>
                <p className="mt-1 text-sm font-medium">
                  {request.requested_by_user?.full_name || request.order?.customer?.full_name || '-'}
                </p>
              </div>
            </div>
          </div>

          {/* Refund Information (if approved) */}
          {request.status === 'approved' && (
            <>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <CreditCard className="h-4 w-4" />
                  Informasi Pengembalian Dana
                </div>
                <div className="rounded-lg border bg-muted/50 p-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Status Refund</p>
                      <p className="text-sm font-medium capitalize">
                        {request.refund_status || 'pending'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Jumlah Refund</p>
                      <p className="text-sm font-bold">
                        {formatCurrency(request.refund_amount || request.order?.total_amount)}
                      </p>
                    </div>
                    {request.refund_transaction_id && (
                      <div className="sm:col-span-2">
                        <p className="text-xs font-medium text-muted-foreground">ID Transaksi Refund</p>
                        <p className="text-sm font-mono">{request.refund_transaction_id}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Stok Dipulihkan</p>
                      <p className="text-sm font-medium">{request.stock_restored ? 'Ya' : 'Tidak'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Admin Review (if reviewed) */}
          {request.status !== 'pending' && (
            <>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <CheckCircle className="h-4 w-4" />
                  Review Admin
                </div>
                <div className="space-y-3">
                  {request.admin_notes && (
                    <div>
                      <Label className="text-xs font-medium text-muted-foreground">Catatan Admin</Label>
                      <div className="mt-1.5 rounded-lg border bg-muted/30 p-3">
                        <p className="whitespace-pre-wrap text-sm">{request.admin_notes}</p>
                      </div>
                    </div>
                  )}
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Direview Oleh</p>
                      <p className="text-sm font-medium">{request.reviewed_by_user?.full_name || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Tanggal Review</p>
                      <p className="text-sm font-medium">
                        {request.reviewed_at ? formatDate(request.reviewed_at) : '-'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Admin Notes Input (for pending requests) */}
          {isPending && (showApproveConfirm || showRejectForm) && (
            <>
              <Separator />
              <div className="space-y-3">
                <Label htmlFor="admin-notes" className="text-sm font-semibold">
                  Catatan Admin {showRejectForm && <span className="text-destructive">*</span>}
                </Label>
                <Textarea
                  id="admin-notes"
                  placeholder={
                    showRejectForm
                      ? 'Jelaskan alasan penolakan (wajib)...'
                      : 'Tambahkan catatan untuk pelanggan (opsional)...'
                  }
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={4}
                  className="resize-none"
                  disabled={isLoading}
                />
                {showRejectForm && !adminNotes.trim() && (
                  <p className="text-xs text-destructive">
                    Catatan admin wajib diisi saat menolak pembatalan
                  </p>
                )}
              </div>
            </>
          )}

          {/* Approve Confirmation Message */}
          {isPending && showApproveConfirm && (
            <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950">
              <div className="flex gap-3">
                <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-600 dark:text-green-500" />
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-green-900 dark:text-green-100">
                    Konfirmasi Persetujuan
                  </p>
                  <p className="text-xs text-green-800 dark:text-green-200">
                    Dengan menyetujui, pesanan akan dibatalkan, stok produk akan dipulihkan, dan proses
                    pengembalian dana akan dimulai. Pelanggan akan menerima email notifikasi.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Reject Confirmation Message */}
          {isPending && showRejectForm && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950">
              <div className="flex gap-3">
                <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600 dark:text-red-500" />
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-red-900 dark:text-red-100">
                    Konfirmasi Penolakan
                  </p>
                  <p className="text-xs text-red-800 dark:text-red-200">
                    Dengan menolak, pesanan akan tetap aktif dan pembatalan tidak akan diproses. Pastikan
                    Anda memberikan alasan yang jelas kepada pelanggan.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-row">
          {isPending ? (
            <>
              {showApproveConfirm || showRejectForm ? (
                <>
                  <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
                    Batal
                  </Button>
                  {showApproveConfirm && (
                    <Button
                      onClick={handleApprove}
                      disabled={isLoading}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {isLoading ? 'Memproses...' : 'Konfirmasi Setujui'}
                    </Button>
                  )}
                  {showRejectForm && (
                    <Button
                      onClick={handleReject}
                      disabled={isLoading || !adminNotes.trim()}
                      variant="destructive"
                    >
                      {isLoading ? 'Memproses...' : 'Konfirmasi Tolak'}
                    </Button>
                  )}
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={() => onOpenChange(false)}>
                    Tutup
                  </Button>
                  <Button onClick={handleReject} variant="destructive" disabled={isLoading}>
                    <XCircle className="mr-2 h-4 w-4" />
                    Tolak
                  </Button>
                  <Button
                    onClick={handleApprove}
                    disabled={isLoading}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Setujui
                  </Button>
                </>
              )}
            </>
          ) : (
            <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
              Tutup
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
