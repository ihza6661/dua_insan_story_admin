"use client";

import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
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

import { addOnSchema, AddOnSchema } from "@/lib/schemas";
import { createAddOn, updateAddOn } from "@/services/api/addon.service";
import { AddOn, GenericError } from "@/lib/types";

interface AddOnFormProps {
  initialData?: AddOn;
}

export function AddOnForm({ initialData }: AddOnFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isEditMode = !!initialData;

  const form = useForm<AddOnSchema>({
    resolver: zodResolver(addOnSchema) as any,
    defaultValues: {
      name: initialData?.name || "",
      price: initialData?.price || 0,
    },
  });

  const { mutate: createMutate, isPending: isCreating } = useMutation({
    mutationFn: createAddOn,
    onSuccess: () => {
      toast.success("Item tambahan berhasil dibuat.");
      queryClient.invalidateQueries({ queryKey: ["add-ons"] });
      router.push("/admin/item-tambahan");
    },
    onError: (error: AxiosError<GenericError>) => {
      const errorMessage =
        error.response?.data?.message || "Terjadi kesalahan pada server.";
      toast.error("Gagal Membuat Item Tambahan", {
        description: errorMessage,
      });
    },
  });

  const { mutate: updateMutate, isPending: isUpdating } = useMutation({
    mutationFn: updateAddOn,
    onSuccess: () => {
      toast.success("Item tambahan berhasil diperbarui.");
      queryClient.invalidateQueries({ queryKey: ["add-ons"] });
      queryClient.invalidateQueries({ queryKey: ["add-on", initialData?.id] });
      router.push("/admin/item-tambahan");
    },
    onError: (error: AxiosError<GenericError>) => {
      const errorMessage =
        error.response?.data?.message || "Terjadi kesalahan pada server.";
      toast.error("Gagal Memperbarui Item", {
        description: errorMessage,
      });
    },
  });

  const isPending = isCreating || isUpdating;

  const onSubmit: SubmitHandler<AddOnSchema> = (data) => {
    if (isEditMode) {
      updateMutate({ id: initialData.id, data });
    } else {
      createMutate(data);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Item Tambahan</FormLabel>
              <FormControl>
                <Input
                  placeholder="Contoh: Denah Lokasi, Kupon Souvenir"
                  {...field}
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Harga (Rp)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="1000"
                  {...field}
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isPending}
          >
            Batal
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Menyimpan..." : (isEditMode ? "Simpan Perubahan" : "Simpan")}
          </Button>
        </div>
      </form>
    </Form>
  );
}