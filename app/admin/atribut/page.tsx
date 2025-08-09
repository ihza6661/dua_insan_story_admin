"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAttributes } from "@/services/api/attribute.service";
import { columns } from "./columns";
import { DataTable } from "@/components/shared/DataTable";

export default function AtributPage() {
  const { data: attributes, isLoading, error } = useQuery({
    queryKey: ['attributes'],
    queryFn: getAttributes,
  });

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Atribut</h1>
          <p className="text-muted-foreground">
            Kelola atribut dan nilai-nilainya untuk opsi produk.
          </p>
        </div>
        <Link href="/admin/atribut/tambah">
          <Button className="cursor-pointer">
            <PlusCircle className="mr-2 h-4 w-4" /> Tambah Atribut
          </Button>
        </Link>
      </div>

      <div className="mt-4">
        {isLoading && <p>Memuat data...</p>}
        {error && <p className="text-destructive">Gagal memuat data: {error.message}</p>}
        {attributes && (
          <DataTable 
            columns={columns} 
            data={attributes} 
            searchColumnKey="name"
            searchPlaceholder="Cari berdasarkan nama atribut..."
          />
        )}
      </div>
    </>
  );
}