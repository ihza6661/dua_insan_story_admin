"use client";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getProducts } from "@/services/api/product.service";
import { columns } from "./columns";
import { DataTable } from "@/components/shared/DataTable";

export default function ProdukPage() {
  const { data: products, isLoading, error } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts
  });

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Produk</h1>
          <p className="text-muted-foreground">Kelola daftar produk Anda.</p>
        </div>
        <Link href="/admin/produk/tambah">
          <Button className="cursor-pointer">
            <PlusCircle className="mr-2 h-4 w-4" /> Tambah Produk
          </Button>
        </Link>
      </div>
      <div className="mt-4">
        {isLoading && <p>Memuat data...</p>}
        {error && (
          <p className="text-destructive">
            Gagal memuat data: {error.message}
          </p>
        )}
        {products && (
          <DataTable
            columns={columns}
            data={products}
            searchColumnKey="name"
            searchPlaceholder="Cari berdasarkan nama produk..."
          />
        )}
      </div>
    </>
  );
}
