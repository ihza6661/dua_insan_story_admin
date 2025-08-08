"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getProductCategories } from "@/services/api/product-category.service";
import { columns } from "./columns";
import { DataTable } from "@/components/shared/DataTable";

export default function KategoriPage() {
  const { data: categories, isLoading, error } = useQuery({
    queryKey: ['product-categories'],
    queryFn: getProductCategories,
  });

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kategori Produk</h1>
          <p className="text-muted-foreground">
            Kelola daftar kategori produk Anda.
          </p>
        </div>
        <Link href="/admin/kategori/tambah">
          <Button className="cursor-pointer">
            <PlusCircle className="mr-2 h-4 w-4" /> Tambah Kategori
          </Button>
        </Link>
      </div>

      <div className="mt-4">
        {isLoading && <p>Memuat data...</p>}
        {error && <p className="text-destructive">Gagal memuat data: {error.message}</p>}
        {categories && (
            <DataTable 
              columns={columns} 
              data={categories} 
              searchColumnKey="name"
              searchPlaceholder="Cari berdasarkan nama..."
            />
        )}
      </div>
    </>
  );
}