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
import { GalleryForm } from "../_components/GalleryForm";

export default function TambahGaleriPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-4">
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/galeri">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Galeri
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Unggah Item Galeri Baru</CardTitle>
          <CardDescription>
            Pilih file gambar atau video dan isi detailnya di bawah ini.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GalleryForm />
        </CardContent>
      </Card>
    </div>
  );
}