"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginSchema, LoginSchema } from "@/lib/schemas";
import { GenericError, LoginSuccessResponse } from "@/lib/types";
import { useAuthStore } from "@/store/auth.store";
import api from "@/lib/api";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const loginAction = useAuthStore((state) => state.login);

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginSchema) => {
    setIsLoading(true);
    toast.loading("Mencoba untuk login...");

    try {
      const response = await api.post<LoginSuccessResponse>("/login", data);
      const { user, token } = response.data.data;

      loginAction(user, token);

      toast.dismiss();
      toast.success("Login Berhasil", {
        // description: response.data.message,
      });

      router.push("/admin");
    } catch (error) {
      toast.dismiss();
      const axiosError = error as AxiosError<GenericError>;
      const errorMessage =
        axiosError.response?.data?.message || "Terjadi kesalahan pada server.";

      toast.error("Login Gagal", {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Login Admin</h1>
            <p className="text-balance text-muted-foreground">
              Masukkan email dan password Anda untuk masuk ke panel admin.
            </p>
          </div>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                autoComplete="email"
                {...form.register("email")}
                disabled={isLoading}
              />
              {form.formState.errors.email && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                {...form.register("password")}
                disabled={isLoading}
              />
              {form.formState.errors.password && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Memproses..." : "Login"}
            </Button>
          </form>
        </div>
      </div>
      <div className="hidden bg-background lg:block">
        <Image
          src="/duainsan.png"
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}