import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProductForm } from "../_components/ProductForm";

export default function TambahProdukPage() {
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
      <Card>
        <CardHeader>
          <CardTitle>Tambah Produk Baru</CardTitle>
          <CardDescription>
            Langkah 1: Isi detail dasar produk di bawah ini.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProductForm />
        </CardContent>
      </Card>
    </div>
  );
}