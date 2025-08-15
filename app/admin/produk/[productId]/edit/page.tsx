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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import { ProductForm } from "../../_components/ProductForm";
import { ProductVariantsManager } from "../../_components/ProductVariantsManager";
import { ProductAddOnsManager } from "../../_components/ProductAddOnsManager";
import { getProductById } from "@/services/api/product.service";

export default function EditProdukPage() {
  const params = useParams();
  const id = Number(params.productId);

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductById(id),
    enabled: !!id,
  });

  if (isLoading) {
    return <p>Memuat data produk...</p>;
  }

  if (error) {
    return <p className="text-destructive">Gagal memuat data.</p>;
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-4">
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/produk">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Daftar Produk
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="detail">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="detail">Detail Produk</TabsTrigger>
          <TabsTrigger value="variants">Varian</TabsTrigger>
          <TabsTrigger value="addons">Item Tambahan</TabsTrigger>
        </TabsList>

        <TabsContent value="detail">
          <Card>
            <CardHeader>
              <CardTitle>Detail Produk</CardTitle>
              <CardDescription>
                Perbarui detail dasar produk Anda di sini.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {product && <ProductForm initialData={product} />}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="variants">
           <Card>
            <CardHeader>
              <CardTitle>Varian Produk</CardTitle>
              <CardDescription>
                Kelola kombinasi opsi, harga, stok, dan gambar untuk setiap varian.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {product && <ProductVariantsManager product={product} />}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="addons">
           <Card>
            <CardHeader>
              <CardTitle>Item Tambahan</CardTitle>
              <CardDescription>
                Tautkan item tambahan yang tersedia untuk produk ini.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {product && <ProductAddOnsManager product={product} />}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}