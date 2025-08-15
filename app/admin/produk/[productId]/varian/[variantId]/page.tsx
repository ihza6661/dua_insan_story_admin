"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getVariantById } from "@/services/api/product.service";
import { VariantImageManager } from "../../../_components/VariantImageManager"; 
import { VariantDetailsForm } from "../../../_components/VariantDetailsForm";

export default function EditVarianPage() {
  const params = useParams();
  const productId = Number(params.productId);
  const variantId = Number(params.variantId);

  const { data: variant, isLoading, error } = useQuery({
    queryKey: ['variant', variantId],
    queryFn: () => getVariantById(variantId),
    enabled: !!variantId,
  });

  const formatOptions = (options: { value: string }[]): string => {
    return options.map(opt => opt.value).join(' / ');
  };

  if (isLoading) {
    return <p>Memuat data varian...</p>;
  }

  if (error) {
    return <p className="text-destructive">Gagal memuat data.</p>;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="mb-4">
        <Button asChild variant="outline" size="sm">
          <Link href={`/admin/produk/${productId}/edit`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Produk
          </Link>
        </Button>
      </div>

      {variant && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Edit Detail Varian</CardTitle>
              <CardDescription>
                Perbarui harga dan stok untuk varian <span className="font-semibold">{formatOptions(variant.options)}</span>.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <VariantDetailsForm variant={variant} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Kelola Gambar Varian</CardTitle>
              <CardDescription>
                Atur semua gambar untuk varian ini.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <VariantImageManager variant={variant} />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}