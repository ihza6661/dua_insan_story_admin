"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCustomerUsers } from "@/services/api/user.service";
import { columns } from "../_shared/columns";
import { DataTable } from "@/components/shared/DataTable";

export default function PenggunaCustomerPage() {
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['customer-users'],
    queryFn: getCustomerUsers,
  });

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pengguna Customer</h1>
          <p className="text-muted-foreground">
            Kelola daftar akun customer.
          </p>
        </div>
        <Link href="/admin/pengguna/tambah?role=customer">
          <Button className="cursor-pointer">
            <PlusCircle className="mr-2 h-4 w-4" /> Tambah Customer
          </Button>
        </Link>
      </div>

      <div className="mt-4">
        {isLoading && <p>Memuat data...</p>}
        {error && <p className="text-destructive">Gagal memuat data: {error.message}</p>}
        {users && (
          <DataTable
            columns={columns}
            data={users}
            searchColumnKey="full_name"
            searchPlaceholder="Cari berdasarkan nama..."
          />
        )}
      </div>
    </>
  );
}