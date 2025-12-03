'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { bulkUpdateOrderStatus } from '@/services/api/orders';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ORDER_STATUSES } from '@/lib/constants/orderStatus';

interface BulkStatusUpdateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedOrderIds: number[];
  onSuccess?: () => void;
}

export function BulkStatusUpdateDialog({
  open,
  onOpenChange,
  selectedOrderIds,
  onSuccess,
}: BulkStatusUpdateDialogProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: bulkUpdateOrderStatus,
    onSuccess: () => {
      // Invalidate both orders and dashboard queries since order changes affect dashboard stats
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success(`${selectedOrderIds.length} pesanan berhasil diperbarui`);
      onOpenChange(false);
      setSelectedStatus('');
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Gagal memperbarui pesanan');
    },
  });

  const handleSubmit = () => {
    if (!selectedStatus) {
      toast.warning('Pilih status pesanan terlebih dahulu');
      return;
    }

    mutation.mutate({
      order_ids: selectedOrderIds,
      order_status: selectedStatus,
    });
  };

  const handleCancel = () => {
    setSelectedStatus('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ubah Status Pesanan</DialogTitle>
          <DialogDescription>
            Ubah status untuk {selectedOrderIds.length} pesanan yang dipilih.
            Email notifikasi akan dikirim ke pelanggan.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="status">Status Pesanan</Label>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger id="status">
                <SelectValue placeholder="Pilih status..." />
              </SelectTrigger>
              <SelectContent>
                {ORDER_STATUSES.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={mutation.isPending}
          >
            Batal
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={mutation.isPending || !selectedStatus}
          >
            {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Perbarui {selectedOrderIds.length} Pesanan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
