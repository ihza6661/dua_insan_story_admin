"use client";

import Image from "next/image";
import Link from "next/link";
import { MoreVertical } from "lucide-react";

import { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CreateVariantForm } from "./CreateVariantForm";
import { DeleteVariantAction } from "./DeleteVariantAction";

interface ProductVariantsManagerProps {
  product: Product;
}

export function ProductVariantsManager({ product }: ProductVariantsManagerProps) {
  const formatOptions = (options: { value: string }[]): string => {
    return options.map(opt => opt.value).join(' / ');
  };

  const findFeaturedImage = (images: Product['variants'][number]['images']) => {
    return images.find(img => img.is_featured) || images[0] || null;
  };

  const formatWeight = (weight: number | null | undefined) => {
    if (weight === null || weight === undefined) {
      return "-";
    }
    return `${weight} gr`;
  };

  const resolveVariantImage = (image?: Product['variants'][number]['images'][number]) => {
    if (!image) {
      return null;
    }

    if (typeof image.image_url === "string" && image.image_url.length > 0) {
      return image.image_url;
    }

    if (typeof image.image === "string" && image.image.length > 0) {
      return image.image;
    }

    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <CreateVariantForm product={product} />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">Gambar</TableHead>
              <TableHead>Kombinasi Opsi</TableHead>
              <TableHead>Harga</TableHead>
              <TableHead>Berat (gram)</TableHead>
              <TableHead>Stok</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {product.variants.length > 0 ? (
              product.variants.map(variant => {
                const featuredImage = findFeaturedImage(variant.images);
                const imageSrc = resolveVariantImage(featuredImage);
                const variantName = formatOptions(variant.options);
                return (
                  <TableRow key={variant.id}>
                    <TableCell>
                      <div className="w-16 h-16 relative rounded-md overflow-hidden bg-muted">
                        {imageSrc ? (
                          <Image
                            src={imageSrc}
                            alt="Gambar Varian"
                            fill
                            sizes="4rem"
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-xs text-muted-foreground">No Img</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{variantName}</TableCell>
                    <TableCell>
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        minimumFractionDigits: 0,
                      }).format(variant.price)}
                    </TableCell>
                    <TableCell>{formatWeight(variant.weight)}</TableCell>
                    <TableCell>{variant.stock ?? 'N/A'}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                          <DropdownMenuItem asChild className="cursor-pointer">
                            <Link href={`/admin/produk/${product.id}/varian/${variant.id}`}>Edit Varian</Link>
                          </DropdownMenuItem>
                          <DeleteVariantAction 
                            productId={product.id}
                            variantId={variant.id}
                            variantName={variantName}
                          />
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Belum ada varian untuk produk ini.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}