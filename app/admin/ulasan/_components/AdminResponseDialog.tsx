"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Review, GenericError } from "@/lib/types";
import { addAdminResponse } from "@/services/api/review.service";

const responseSchema = z.object({
  admin_response: z.string().min(1, "Tanggapan harus diisi").max(1000, "Tanggapan maksimal 1000 karakter"),
});

type ResponseFormData = z.infer<typeof responseSchema>;

interface AdminResponseDialogProps {
  review: Review;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AdminResponseDialog({ review, open, onOpenChange }: AdminResponseDialogProps) {
  const queryClient = useQueryClient();

  const form = useForm<ResponseFormData>({
    resolver: zodResolver(responseSchema),
    defaultValues: {
      admin_response: review.admin_response || "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: ResponseFormData) => addAdminResponse(review.id, data.admin_response),
    onSuccess: (response) => {
      toast.success("Tanggapan Berhasil Disimpan", {
        description: response.message,
      });
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      onOpenChange(false);
      form.reset();
    },
    onError: (error: AxiosError<GenericError>) => {
      const errorMessage = error.response?.data?.message || "Gagal menyimpan tanggapan.";
      toast.error("Gagal", {
        description: errorMessage,
      });
    },
  });

  const onSubmit = (data: ResponseFormData) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {review.admin_response ? "Edit Tanggapan Admin" : "Tambah Tanggapan Admin"}
          </DialogTitle>
          <DialogDescription>
            Tanggapi ulasan dari {review.user_name} untuk produk {review.product_name}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Display Review */}
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold">{review.user_name}</span>
                <span className="text-sm text-muted-foreground">
                  {review.rating} ⭐
                </span>
              </div>
              {review.comment && (
                <p className="text-sm">{review.comment}</p>
              )}
            </div>

            <FormField
              control={form.control}
              name="admin_response"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tanggapan Anda</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Tulis tanggapan untuk ulasan ini..."
                      rows={5}
                      className="resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="text-xs text-muted-foreground">
                    {field.value.length}/1000 karakter
                  </p>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={mutation.isPending}
              >
                Batal
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Menyimpan..." : "Simpan Tanggapan"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
