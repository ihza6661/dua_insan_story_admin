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
import { GalleryForm } from "../../_components/GalleryForm";
import { getGalleryItemById } from "@/services/api/gallery.service";

export default function EditGaleriPage() {
  const params = useParams();
  const id = Number(params.id);

  const { data: galleryItem, isLoading, error } = useQuery({
    queryKey: ['gallery-item', id],
    queryFn: () => getGalleryItemById(id),
    enabled: !!id,
  });

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
          <CardTitle>Edit Item Galeri</CardTitle>
          <CardDescription>
            Perbarui detail item di bawah ini.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && <p>Memuat data item...</p>}
          {error && <p className="text-destructive">Gagal memuat data.</p>}
          {galleryItem && <GalleryForm initialData={galleryItem} />}
        </CardContent>
      </Card>
    </div>
  );
}