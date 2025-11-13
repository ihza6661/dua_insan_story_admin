"use client";

import { useForm, SubmitHandler, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { updateVariantSchema, UpdateVariantSchema } from "@/lib/schemas";
import { updateProductVariant } from "@/services/api/product.service";
import { GenericError, ProductVariant } from "@/lib/types";
import { useRouter } from "next/navigation";

interface VariantDetailsFormProps {
  variant: ProductVariant;
}

export function VariantDetailsForm({ variant }: VariantDetailsFormProps) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const form = useForm<UpdateVariantSchema>({
    resolver: zodResolver(updateVariantSchema) as Resolver<UpdateVariantSchema>,
    defaultValues: {
      price: variant.price || 0,
      stock: variant.stock || 0,
      weight: variant.weight ?? null,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: updateProductVariant,
    onSuccess: () => {
      toast.success("Varian berhasil diperbarui.");
      queryClient.invalidateQueries({ queryKey: ["variant", variant.id] });
      queryClient.invalidateQueries({ queryKey: ["product", variant.product_id] });
      router.refresh();
    },
    onError: (error: AxiosError<GenericError>) => {
      toast.error(error.response?.data?.message || "Gagal memperbarui varian.");
    },
  });

  const onSubmit: SubmitHandler<UpdateVariantSchema> = (data) => {
    mutate({ id: variant.id, data });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Harga Varian (Rp)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="5500" {...field} disabled={isPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stok (Opsional)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="100" {...field} disabled={isPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Berat Varian (gram)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    placeholder="Opsional"
                    value={field.value ?? ""}
                    onChange={(event) =>
                      field.onChange(event.target.value === "" ? null : Number(event.target.value))
                    }
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-end">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </div>
      </form>
    </Form>
  );
}