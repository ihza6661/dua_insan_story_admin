"use client";

import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { productSchema, ProductSchema } from "@/lib/schemas";
import { createProduct, updateProduct } from "@/services/api/product.service";
import { getProductCategories } from "@/services/api/product-category.service";
import { GenericError, Product } from "@/lib/types";

interface ProductFormProps {
  initialData?: Product;
}

export function ProductForm({ initialData }: ProductFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isEditMode = !!initialData;

  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ["product-categories"],
    queryFn: getProductCategories,
  });

  const form = useForm<ProductSchema>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: {
      name: initialData?.name ?? "",
      description: initialData?.description ?? "",
      category_id: initialData?.category?.id?.toString() ?? "",
      base_price: initialData?.base_price ?? 0,
      min_order_quantity: initialData?.min_order_quantity ?? 1,
      is_active: initialData?.is_active ?? true,
    },
  });

  const { mutate: createMutate, isPending: isCreating } = useMutation({
    mutationFn: createProduct,
    onSuccess: (response) => {
      toast.success("Produk Berhasil Dibuat", {
        description: "Anda akan diarahkan ke halaman edit produk.",
      });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      router.push(`/admin/produk/${response.data.id}/edit`);
    },
    onError: (error: AxiosError<GenericError>) => {
      const errorMessage =
        error.response?.data?.message || "Terjadi kesalahan pada server.";
      toast.error("Gagal Membuat Produk", {
        description: errorMessage,
      });
    },
  });

  const { mutate: updateMutate, isPending: isUpdating } = useMutation({
    mutationFn: updateProduct,
    onSuccess: (response) => {
      toast.success("Produk Berhasil Diperbarui");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", initialData?.id] });
      router.push('/admin/produk');
    },
    onError: (error: AxiosError<GenericError>) => {
      const errorMessage =
        error.response?.data?.message || "Terjadi kesalahan pada server.";
      toast.error("Gagal Memperbarui Produk", {
        description: errorMessage,
      });
    },
  });

  const isPending = isCreating || isUpdating;

  const onSubmit: SubmitHandler<ProductSchema> = (data) => {
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
              <FormLabel>Nama Produk</FormLabel>
              <FormControl>
                <Input
                  placeholder="Contoh: Undangan Digital Elegan"
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
          name="category_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kategori</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={isPending || isLoadingCategories}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        isLoadingCategories
                          ? "Memuat kategori..."
                          : "Pilih kategori"
                      }
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories?.map((category) => (
                    <SelectItem
                      key={category.id}
                      value={category.id.toString()}
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deskripsi (Opsional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Jelaskan tentang produk ini"
                  {...field}
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="base_price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Harga Dasar (Rp)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="5000"
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
            name="min_order_quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minimal Order</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="100"
                    {...field}
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="is_active"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>Status Produk</FormLabel>
                <FormDescription>
                  Jika aktif, produk akan dapat dilihat oleh pelanggan.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isPending}
                />
              </FormControl>
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
            {isPending ? "Menyimpan..." : (isEditMode ? "Simpan Perubahan" : "Simpan dan Lanjutkan")}
          </Button>
        </div>
      </form>
    </Form>
  );
}