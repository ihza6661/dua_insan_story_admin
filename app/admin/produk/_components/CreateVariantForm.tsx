"use client";

import { useState } from "react";
import { useForm, SubmitHandler, Controller, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { variantSchema, VariantSchema } from "@/lib/schemas";
import { createProductVariant } from "@/services/api/product.service";
import { getAttributes } from "@/services/api/attribute.service";
import { GenericError, Product } from "@/lib/types";

interface CreateVariantFormProps {
  product: Product;
}

export function CreateVariantForm({ product }: CreateVariantFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: attributes, isLoading: isLoadingAttributes } = useQuery({
    queryKey: ['attributes'],
    queryFn: getAttributes,
  });

  const form = useForm<VariantSchema>({
    resolver: zodResolver(variantSchema) as Resolver<VariantSchema>,
    defaultValues: {
      price: product.base_price || 0,
      stock: 0,
      weight: product.weight ?? null,
      options: [],
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: createProductVariant,
    onSuccess: () => {
      toast.success("Varian berhasil dibuat.");
      queryClient.invalidateQueries({ queryKey: ["product", product.id] });
      setIsOpen(false);
      form.reset();
    },
    onError: (error: AxiosError<GenericError>) => {
      toast.error(error.response?.data?.message || "Gagal membuat varian.");
    },
  });

  const onSubmit: SubmitHandler<VariantSchema> = (data) => {
    mutate({ productId: product.id, data });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Tambah Varian
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tambah Varian Baru</DialogTitle>
          <DialogDescription>
            Pilih kombinasi opsi dan tentukan harga serta stoknya.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {attributes?.map((attribute) => (
              <Controller
                key={attribute.id}
                control={form.control}
                name="options"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{attribute.name}</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        const otherValues = field.value.filter(
                          (v) => !attribute.values.some(av => av.id.toString() === v)
                        );
                        field.onChange([...otherValues, value]);
                      }}
                      disabled={isPending || isLoadingAttributes}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={`Pilih ${attribute.name}`} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {attribute.values.map((value) => (
                          <SelectItem key={value.id} value={value.id.toString()}>
                            {value.value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            ))}
            <FormMessage>{form.formState.errors.options?.message}</FormMessage>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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
            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={isPending}>
                {isPending ? "Menyimpan..." : "Simpan Varian"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}