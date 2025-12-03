'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { exportOrders } from '@/services/api/orders';
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { OrderFilters } from '@/lib/types';

interface ExportOrdersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedOrderIds?: number[];
  filters?: OrderFilters;
}

export function ExportOrdersDialog({
  open,
  onOpenChange,
  selectedOrderIds,
  filters,
}: ExportOrdersDialogProps) {
  const [exportType, setExportType] = useState<'selected' | 'filtered' | 'all'>(
    selectedOrderIds && selectedOrderIds.length > 0 ? 'selected' : 'all'
  );

  const mutation = useMutation({
    mutationFn: exportOrders,
    onSuccess: (blob) => {
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success('Data pesanan berhasil diekspor');
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Gagal mengekspor data pesanan');
    },
  });

  const handleExport = () => {
    const payload: {
      order_ids?: number[];
      search?: string;
      order_status?: string;
      payment_status?: string;
      date_from?: string;
      date_to?: string;
    } = {};

    if (exportType === 'selected' && selectedOrderIds && selectedOrderIds.length > 0) {
      payload.order_ids = selectedOrderIds;
    } else if (exportType === 'filtered' && filters) {
      // Apply current filters
      if (filters.search) payload.search = filters.search;
      if (filters.order_status) payload.order_status = filters.order_status;
      if (filters.payment_status) payload.payment_status = filters.payment_status;
      if (filters.date_from) payload.date_from = filters.date_from;
      if (filters.date_to) payload.date_to = filters.date_to;
    }
    // For 'all', send empty payload to export everything

    mutation.mutate(payload);
  };

  const hasFilters = filters && (
    filters.search ||
    filters.order_status ||
    filters.payment_status ||
    filters.date_from ||
    filters.date_to
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export Pesanan</DialogTitle>
          <DialogDescription>
            Pilih pesanan yang ingin diekspor ke format CSV.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <RadioGroup value={exportType} onValueChange={(value) => setExportType(value as typeof exportType)}>
            {selectedOrderIds && selectedOrderIds.length > 0 && (
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="selected" id="selected" />
                <Label htmlFor="selected" className="font-normal cursor-pointer">
                  Export {selectedOrderIds.length} pesanan yang dipilih
                </Label>
              </div>
            )}
            {hasFilters && (
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="filtered" id="filtered" />
                <Label htmlFor="filtered" className="font-normal cursor-pointer">
                  Export pesanan dengan filter aktif
                </Label>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="all" />
              <Label htmlFor="all" className="font-normal cursor-pointer">
                Export semua pesanan
              </Label>
            </div>
          </RadioGroup>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={mutation.isPending}
          >
            Batal
          </Button>
          <Button
            onClick={handleExport}
            disabled={mutation.isPending}
          >
            {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Export ke CSV
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
