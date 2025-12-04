"use client";

import { useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { PromoCode, GenericError, ValidationError } from "@/lib/types";
import { 
  createPromoCode, 
  updatePromoCode,
  CreatePromoCodeData
} from "@/services/api/promo-code.service";

interface PromoCodeFormDialogProps {
  promoCode?: PromoCode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PromoCodeFormDialog({
  promoCode,
  open,
  onOpenChange,
}: PromoCodeFormDialogProps) {
  const queryClient = useQueryClient();
  const isEditMode = !!promoCode;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CreatePromoCodeData>({
    defaultValues: {
      code: '',
      discount_type: 'percentage',
      discount_value: 0,
      min_purchase: null,
      max_discount: null,
      usage_limit: null,
      valid_from: '',
      valid_until: '',
      is_active: true,
    },
  });

  const discountType = watch('discount_type');

  useEffect(() => {
    if (promoCode) {
      reset({
        code: promoCode.code,
        discount_type: promoCode.discount_type,
        discount_value: promoCode.discount_value,
        min_purchase: promoCode.min_purchase || null,
        max_discount: promoCode.max_discount || null,
        usage_limit: promoCode.usage_limit || null,
        valid_from: promoCode.valid_from.split('T')[0],
        valid_until: promoCode.valid_until.split('T')[0],
        is_active: promoCode.is_active,
      });
    } else {
      reset({
        code: '',
        discount_type: 'percentage',
        discount_value: 0,
        min_purchase: null,
        max_discount: null,
        usage_limit: null,
        valid_from: '',
        valid_until: '',
        is_active: true,
      });
    }
  }, [promoCode, reset]);

  const createMutation = useMutation({
    mutationFn: createPromoCode,
    onSuccess: (response) => {
      toast.success("Berhasil", {
        description: response.message,
      });
      queryClient.invalidateQueries({ queryKey: ['promo-codes'] });
      queryClient.invalidateQueries({ queryKey: ['promo-code-statistics'] });
      onOpenChange(false);
    },
    onError: (error: AxiosError<ValidationError | GenericError>) => {
      const errorData = error.response?.data;
      if (errorData && 'errors' in errorData) {
        Object.entries(errorData.errors).forEach(([field, messages]) => {
          toast.error(field, {
            description: messages.join(', '),
          });
        });
      } else {
        const errorMessage = errorData?.message || "Gagal membuat kode promo.";
        toast.error("Gagal", {
          description: errorMessage,
        });
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreatePromoCodeData }) =>
      updatePromoCode(id, data),
    onSuccess: (response) => {
      toast.success("Berhasil", {
        description: response.message,
      });
      queryClient.invalidateQueries({ queryKey: ['promo-codes'] });
      queryClient.invalidateQueries({ queryKey: ['promo-code-statistics'] });
      onOpenChange(false);
    },
    onError: (error: AxiosError<ValidationError | GenericError>) => {
      const errorData = error.response?.data;
      if (errorData && 'errors' in errorData) {
        Object.entries(errorData.errors).forEach(([field, messages]) => {
          toast.error(field, {
            description: messages.join(', '),
          });
        });
      } else {
        const errorMessage = errorData?.message || "Gagal mengupdate kode promo.";
        toast.error("Gagal", {
          description: errorMessage,
        });
      }
    },
  });

  const onSubmit = (data: CreatePromoCodeData) => {
    // Convert empty strings to null
    const processedData = {
      ...data,
      min_purchase: data.min_purchase || null,
      max_discount: data.max_discount || null,
      usage_limit: data.usage_limit || null,
    };

    if (isEditMode && promoCode) {
      updateMutation.mutate({ id: promoCode.id, data: processedData });
    } else {
      createMutation.mutate(processedData);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? 'Edit Kode Promo' : 'Buat Kode Promo Baru'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Code */}
          <div className="space-y-2">
            <Label htmlFor="code">
              Kode Promo <span className="text-destructive">*</span>
            </Label>
            <Input
              id="code"
              {...register('code', { required: 'Kode promo wajib diisi' })}
              placeholder="WEDDING2025"
              className="uppercase"
              onChange={(e) => setValue('code', e.target.value.toUpperCase())}
            />
            {errors.code && (
              <p className="text-sm text-destructive">{errors.code.message}</p>
            )}
          </div>

          {/* Discount Type and Value */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="discount_type">
                Tipe Diskon <span className="text-destructive">*</span>
              </Label>
              <Select
                value={watch('discount_type')}
                onValueChange={(value) => setValue('discount_type', value as 'percentage' | 'fixed')}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Persentase (%)</SelectItem>
                  <SelectItem value="fixed">Nominal Tetap (Rp)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="discount_value">
                Nilai Diskon <span className="text-destructive">*</span>
              </Label>
              <Input
                id="discount_value"
                type="number"
                {...register('discount_value', { 
                  required: 'Nilai diskon wajib diisi',
                  min: { value: 0, message: 'Nilai minimal 0' },
                  max: discountType === 'percentage' 
                    ? { value: 100, message: 'Maksimal 100%' }
                    : undefined
                })}
                placeholder={discountType === 'percentage' ? '15' : '50000'}
              />
              {errors.discount_value && (
                <p className="text-sm text-destructive">{errors.discount_value.message}</p>
              )}
            </div>
          </div>

          {/* Min Purchase and Max Discount */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="min_purchase">Minimal Pembelian (Rp)</Label>
              <Input
                id="min_purchase"
                type="number"
                {...register('min_purchase', { 
                  min: { value: 0, message: 'Nilai minimal 0' } 
                })}
                placeholder="500000"
              />
              <p className="text-xs text-muted-foreground">Kosongkan jika tidak ada minimal</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="max_discount">Maksimal Diskon (Rp)</Label>
              <Input
                id="max_discount"
                type="number"
                {...register('max_discount', { 
                  min: { value: 0, message: 'Nilai minimal 0' } 
                })}
                placeholder="100000"
              />
              <p className="text-xs text-muted-foreground">
                Hanya untuk diskon persentase
              </p>
            </div>
          </div>

          {/* Usage Limit */}
          <div className="space-y-2">
            <Label htmlFor="usage_limit">Limit Penggunaan</Label>
            <Input
              id="usage_limit"
              type="number"
              {...register('usage_limit', { 
                min: { value: 1, message: 'Minimal 1' } 
              })}
              placeholder="100"
            />
            <p className="text-xs text-muted-foreground">
              Kosongkan untuk unlimited
            </p>
          </div>

          {/* Valid Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="valid_from">
                Berlaku Dari <span className="text-destructive">*</span>
              </Label>
              <Input
                id="valid_from"
                type="date"
                {...register('valid_from', { required: 'Tanggal mulai wajib diisi' })}
              />
              {errors.valid_from && (
                <p className="text-sm text-destructive">{errors.valid_from.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="valid_until">
                Berlaku Hingga <span className="text-destructive">*</span>
              </Label>
              <Input
                id="valid_until"
                type="date"
                {...register('valid_until', { required: 'Tanggal akhir wajib diisi' })}
              />
              {errors.valid_until && (
                <p className="text-sm text-destructive">{errors.valid_until.message}</p>
              )}
            </div>
          </div>

          {/* Active Status */}
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="is_active">Status Aktif</Label>
              <p className="text-sm text-muted-foreground">
                Aktifkan kode promo agar dapat digunakan
              </p>
            </div>
            <Switch
              id="is_active"
              checked={watch('is_active')}
              onCheckedChange={(checked) => setValue('is_active', checked)}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Menyimpan...' : isEditMode ? 'Update' : 'Buat'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
