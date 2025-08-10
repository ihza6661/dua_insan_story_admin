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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { userSchema, UserSchema, updateUserSchema, UpdateUserSchema } from "@/lib/schemas";
import { createAdminUser, updateAdminUser } from "@/services/api/user.service";
import { GenericError, User } from "@/lib/types";

interface UserFormProps {
  initialData?: User;
}

export function UserForm({ initialData }: UserFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isEditMode = !!initialData;

  const form = useForm<UserSchema | UpdateUserSchema>({
    resolver: zodResolver(isEditMode ? updateUserSchema : userSchema) as any,
    defaultValues: {
      full_name: initialData?.full_name || "",
      email: initialData?.email || "",
      phone_number: initialData?.phone_number || "",
      password: "",
      password_confirmation: "",
    },
  });

  const { mutate: createMutate, isPending: isCreating } = useMutation({
    mutationFn: createAdminUser,
    onSuccess: () => {
      toast.success("Akun admin berhasil dibuat.");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      router.push("/admin/pengguna");
    },
    onError: (error: AxiosError<GenericError>) => {
      const errorMessage =
        error.response?.data?.message || "Terjadi kesalahan pada server.";
      toast.error("Gagal Membuat Akun", {
        description: errorMessage,
      });
    },
  });

  const { mutate: updateMutate, isPending: isUpdating } = useMutation({
    mutationFn: updateAdminUser,
    onSuccess: () => {
      toast.success("Akun admin berhasil diperbarui.");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-user", initialData?.id] });
      router.push("/admin/pengguna");
    },
    onError: (error: AxiosError<GenericError>) => {
      const errorMessage =
        error.response?.data?.message || "Terjadi kesalahan pada server.";
      toast.error("Gagal Memperbarui Akun", {
        description: errorMessage,
      });
    },
  });

  const isPending = isCreating || isUpdating;

  const onSubmit: SubmitHandler<UserSchema | UpdateUserSchema> = (data) => {
    if (isEditMode) {
      updateMutate({ id: initialData.id, data });
    } else {
      createMutate(data as UserSchema);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Lengkap</FormLabel>
              <FormControl>
                <Input
                  placeholder="John Doe"
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="admin@example.com"
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
          name="phone_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nomor Telepon (Opsional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="08123456789"
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
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="********"
                  {...field}
                  disabled={isPending}
                />
              </FormControl>
              {isEditMode && <FormDescription>Kosongkan jika tidak ingin mengubah password.</FormDescription>}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password_confirmation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Konfirmasi Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="********"
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