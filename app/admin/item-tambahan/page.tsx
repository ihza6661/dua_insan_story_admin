"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAddOns } from "@/services/api/addon.service";
import { columns } from "./columns";
import { DataTable } from "@/components/shared/DataTable";

export default function ItemTambahanPage() {
  const { data: addOns, isLoading, error } = useQuery({
    queryKey: ['add-ons'],
    queryFn: getAddOns,
  });

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Item Tambahan</h1>
          <p className="text-muted-foreground">
            Kelola daftar item tambahan (add-ons) untuk produk.
          </p>
        </div>
        <Link href="/admin/item-tambahan/tambah">
          <Button className="cursor-pointer">
            <PlusCircle className="my-2 h-4 w-4" /> Tambah Item
          </Button>
        </Link>
      </div>

      <div className="mt-4">
        {isLoading && <p>Memuat data...</p>}
        {error && <p className="text-destructive">Gagal memuat data: {error.message}</p>}
        {addOns && (
          <DataTable 
            columns={columns} 
            data={addOns} 
            searchColumnKey="name"
            searchPlaceholder="Cari berdasarkan nama item..."
          />
        )}
      </div>
    </>
  );
}