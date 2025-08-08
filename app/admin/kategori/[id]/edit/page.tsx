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
import { CategoryForm } from "../../_components/CategoryForm";
import { getProductCategoryById } from "@/services/api/product-category.service";

export default function EditKategoriPage() {
  const params = useParams();
  const id = Number(params.id);

  const { data: category, isLoading, error } = useQuery({
    queryKey: ['product-category', id],
    queryFn: () => getProductCategoryById(id),
    enabled: !!id,
  });

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-4">
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/kategori">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Daftar Kategori
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Edit Kategori Produk</CardTitle>
          <CardDescription>
            Perbarui detail kategori di bawah ini.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && <p>Memuat data kategori...</p>}
          {error && <p className="text-destructive">Gagal memuat data.</p>}
          {category && <CategoryForm initialData={category} />}
        </CardContent>
      </Card>
    </div>
  );
}