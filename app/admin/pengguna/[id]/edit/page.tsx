"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserForm } from "../../_components/UserForm";
import { getAdminUserById } from "@/services/api/user.service";

export default function EditPenggunaPage() {
  const params = useParams();
  const id = Number(params.id);

  const { data: user, isLoading, error } = useQuery({
    queryKey: ['admin-user', id],
    queryFn: () => getAdminUserById(id),
    enabled: !!id,
  });

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-4">
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/pengguna">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Daftar Pengguna
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Edit Admin</CardTitle>
          <CardDescription>
            Perbarui detail akun admin di bawah ini.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && <p>Memuat data pengguna...</p>}
          {error && <p className="text-destructive">Gagal memuat data.</p>}
          {user && <UserForm initialData={user} />}
        </CardContent>
      </Card>
    </div>
  );
}