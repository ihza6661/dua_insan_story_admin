"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Upload, FileText, Download, Trash2, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  getDesignProofsForOrder,
  uploadDesignProof,
  deleteDesignProof,
} from '@/services/api/design-proof.service';
import { DesignProof, OrderItem } from '@/lib/types';

interface DesignProofSectionProps {
  orderId: number;
  orderItems: OrderItem[];
}

// Helper function to get full storage URL
const getStorageUrl = (path: string | null): string | null => {
  if (!path) return null;
  
  // If already a full URL, return as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // Get the base API URL without /api/v1
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';
  const baseUrl = apiUrl.replace('/api/v1', '');
  
  // Construct full storage URL
  return `${baseUrl}/storage/${path}`;
};

export function DesignProofSection({ orderId, orderItems }: DesignProofSectionProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedOrderItemId, setSelectedOrderItemId] = useState<number | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: designProofs, isLoading } = useQuery({
    queryKey: ['design-proofs', orderId],
    queryFn: () => getDesignProofsForOrder(orderId),
  });

  const uploadMutation = useMutation({
    mutationFn: ({ orderItemId, file, notes }: { orderItemId: number; file: File; notes?: string }) =>
      uploadDesignProof(orderItemId, file, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['design-proofs', orderId] });
      toast.success('Desain proof berhasil diunggah');
      setIsUploadDialogOpen(false);
      setSelectedFile(null);
      setSelectedOrderItemId(null);
      setAdminNotes('');
    },
    onError: (error: Error) => {
      toast.error(`Gagal mengunggah: ${error.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteDesignProof,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['design-proofs', orderId] });
      toast.success('Desain proof berhasil dihapus');
    },
    onError: (error: Error) => {
      toast.error(`Gagal menghapus: ${error.message}`);
    },
  });

  const handleUpload = () => {
    if (!selectedFile || !selectedOrderItemId) {
      toast.error('Silakan pilih file dan item pesanan');
      return;
    }

    uploadMutation.mutate({
      orderItemId: selectedOrderItemId,
      file: selectedFile,
      notes: adminNotes || undefined,
    });
  };

  const getStatusBadge = (status: DesignProof['status']) => {
    switch (status) {
      case 'pending_approval':
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Menunggu</Badge>;
      case 'approved':
        return <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Disetujui</Badge>;
      case 'revision_requested':
        return <Badge variant="default">Revisi Diminta</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Ditolak</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'N/A';
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    return `${size.toFixed(2)} ${units[unitIndex]}`;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Desain Proof</CardTitle>
        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Upload className="w-4 h-4 mr-2" />
              Unggah Desain Proof
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Unggah Desain Proof</DialogTitle>
              <DialogDescription>
                Unggah desain proof untuk ditinjau oleh pelanggan
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="order-item">Item Pesanan</Label>
                <Select
                  value={selectedOrderItemId?.toString() || ''}
                  onValueChange={(value) => setSelectedOrderItemId(Number(value))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih item pesanan" />
                  </SelectTrigger>
                  <SelectContent>
                    {orderItems.map((item) => (
                      <SelectItem key={item.id} value={item.id.toString()}>
                        {item.product_name} (Qty: {item.quantity})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="file">File Desain</Label>
                <Input
                  id="file"
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                />
                <p className="text-sm text-muted-foreground">
                  Format yang diterima: JPG, PNG, PDF (Maks 10MB)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Catatan Admin (Opsional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Tambahkan catatan tentang desain proof ini..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={3}
                />
              </div>

              <Button
                onClick={handleUpload}
                disabled={uploadMutation.isPending || !selectedFile || !selectedOrderItemId}
                className="w-full"
              >
                {uploadMutation.isPending ? 'Mengunggah...' : 'Unggah Desain Proof'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p>Memuat desain proof...</p>
        ) : !designProofs || designProofs.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Belum ada desain proof yang diunggah
          </p>
        ) : (
          <div className="space-y-4">
            {designProofs.map((proof) => (
              <div
                key={proof.id}
                className="border rounded-lg p-4 flex items-start justify-between"
              >
                <div className="flex items-start space-x-4 flex-1">
                  {proof.thumbnail_url ? (
                    <Image
                      src={getStorageUrl(proof.thumbnail_url) || ''}
                      alt={proof.file_name || 'Design proof'}
                      width={80}
                      height={80}
                      className="w-20 h-20 object-cover rounded"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gray-100 rounded flex items-center justify-center">
                      <FileText className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center space-x-2">
                      <p className="font-medium">{proof.file_name || 'Desain Proof'}</p>
                      {getStatusBadge(proof.status)}
                      <Badge variant="outline">v{proof.version}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Diunggah: {new Date(proof.created_at).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' })}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Ukuran: {formatFileSize(proof.file_size)}
                    </p>
                    {proof.admin_notes && (
                      <p className="text-sm text-muted-foreground italic">
                        Catatan: {proof.admin_notes}
                      </p>
                    )}
                    {proof.customer_feedback && (
                      <p className="text-sm text-blue-600">
                        Feedback pelanggan: {proof.customer_feedback}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    asChild
                  >
                    <a href={getStorageUrl(proof.file_url) || ''} target="_blank" rel="noopener noreferrer">
                      <Download className="w-4 h-4" />
                    </a>
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      if (confirm('Apakah Anda yakin ingin menghapus desain proof ini?')) {
                        deleteMutation.mutate(proof.id);
                      }
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
