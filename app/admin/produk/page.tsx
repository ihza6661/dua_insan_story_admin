"use client";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { PlusCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getProducts } from "@/services/api/product.service";
import { columns } from "./columns";
import { DataTable } from "@/components/shared/DataTable";

export default function ProdukPage() {
  const { data: products, isLoading, error } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts
  });

  // Count products with low stock
  const lowStockCount = products?.filter((product) => {
    if (!product.variants || product.variants.length === 0) return false;
    return product.variants.some((v) => v.stock > 0 && v.stock < 10);
  }).length || 0;

  const outOfStockCount = products?.filter((product) => {
    if (!product.variants || product.variants.length === 0) return false;
    const totalStock = product.variants.reduce((total, v) => total + (v.stock || 0), 0);
    return totalStock === 0;
  }).length || 0;

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Produk</h1>
          <p className="text-muted-foreground">Kelola daftar produk Anda.</p>
        </div>
        <Link href="/admin/produk/tambah">
          <Button className="cursor-pointer">
            <PlusCircle className="my-2 h-4 w-4" /> Tambah Produk
          </Button>
        </Link>
      </div>

      {/* Low Stock Alert */}
      {!isLoading && (lowStockCount > 0 || outOfStockCount > 0) && (
        <Alert variant="default" className="mt-4 border-amber-500 bg-amber-50 dark:bg-amber-950">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-900 dark:text-amber-100">Peringatan Stok</AlertTitle>
          <AlertDescription className="text-amber-800 dark:text-amber-200">
            {outOfStockCount > 0 && (
              <span className="font-semibold">{outOfStockCount} produk habis. </span>
            )}
            {lowStockCount > 0 && (
              <span className="font-semibold">{lowStockCount} produk stok rendah. </span>
            )}
            Segera lakukan restock untuk menjaga ketersediaan produk.
          </AlertDescription>
        </Alert>
      )}

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
