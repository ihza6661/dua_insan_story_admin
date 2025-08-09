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

import { attributeSchema, AttributeSchema } from "@/lib/schemas";
import { createAttribute, updateAttribute } from "@/services/api/attribute.service";
import { Attribute, GenericError } from "@/lib/types";

interface AttributeFormProps {
  initialData?: Attribute;
}

export function AttributeForm({ initialData }: AttributeFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isEditMode = !!initialData;

  const form = useForm<AttributeSchema>({
    resolver: zodResolver(attributeSchema),
    defaultValues: {
      name: initialData?.name || "",
    },
  });

  const { mutate: createMutate, isPending: isCreating } = useMutation({
    mutationFn: createAttribute,
    onSuccess: (response) => {
      toast.success("Atribut berhasil dibuat.");
      queryClient.invalidateQueries({ queryKey: ["attributes"] });
      router.push(`/admin/atribut/${response.data.id}/edit`);
    },
    onError: (error: AxiosError<GenericError>) => {
      const errorMessage =
        error.response?.data?.message || "Terjadi kesalahan pada server.";
      toast.error("Gagal Membuat Atribut", {
        description: errorMessage,
      });
    },
  });

  const { mutate: updateMutate, isPending: isUpdating } = useMutation({
    mutationFn: updateAttribute,
    onSuccess: () => {
      toast.success("Atribut berhasil diperbarui.");
      queryClient.invalidateQueries({ queryKey: ["attributes"] });
      queryClient.invalidateQueries({ queryKey: ["attribute", initialData?.id] });
      router.push("/admin/atribut");
    },
    onError: (error: AxiosError<GenericError>) => {
      const errorMessage =
        error.response?.data?.message || "Terjadi kesalahan pada server.";
      toast.error("Gagal Memperbarui Atribut", {
        description: errorMessage,
      });
    },
  });

  const isPending = isCreating || isUpdating;

  const onSubmit: SubmitHandler<AttributeSchema> = (data) => {
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
              <FormLabel>Nama Atribut</FormLabel>
              <FormControl>
                <Input
                  placeholder="Contoh: Warna, Jenis Kertas"
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