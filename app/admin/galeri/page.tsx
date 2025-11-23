"use client";

import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { MoreVertical, PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

import { getGalleryItems } from "@/services/api/gallery.service";
import { DeleteGalleryItemAction } from "./_components/DeleteGalleryItemAction";
import { getImageUrl } from "@/lib/utils";

export default function GaleriPage() {
  const { data: galleryItems, isLoading, error } = useQuery({
    queryKey: ['gallery-items'],
    queryFn: getGalleryItems,
  });

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Galeri</h1>
          <p className="text-muted-foreground">
            Kelola media gambar dan video untuk portofolio Anda.
          </p>
        </div>
        <Link href="/admin/galeri/tambah">
          <Button className="cursor-pointer">
            <PlusCircle className="mr-2 h-4 w-4" /> Unggah Gambar
          </Button>
        </Link>
      </div>

      <div className="mt-4">
        {isLoading && <p>Memuat item galeri...</p>}
        {error && <p className="text-destructive">Gagal memuat data: {error.message}</p>}
        
        {galleryItems && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {galleryItems.map((item, index) => (
              <Card key={item.id}>
                <CardHeader className="p-0">
                  <div className="relative w-full aspect-square overflow-hidden rounded-t-lg">
                    {item.media_type === 'image' ? (
                      <Image
                        src={getImageUrl(item.file_url)}
                        alt={item.title || 'Gallery Item'}
                        fill
                        className="object-cover"
                        priority={index === 0}
                      />
                    ) : (
                      <video
                        src={`${item.file_url}`}
                        muted
                        autoPlay
                        loop
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <h3 className="font-semibold truncate">{item.title || "Tanpa Judul"}</h3>
                  <p className="text-sm text-muted-foreground truncate">{item.description || "Tanpa deskripsi"}</p>
                </CardContent>
                <CardFooter className="flex justify-between p-4 pt-0">
                  <Badge variant="outline">{item.category || "Lainnya"}</Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                      <DropdownMenuItem asChild className="cursor-pointer">
                        <Link href={`/admin/galeri/${item.id}/edit`}>Edit</Link>
                      </DropdownMenuItem>
                      <DeleteGalleryItemAction 
                        itemId={item.id} 
                        itemTitle={item.title || 'item ini'} 
                      />
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {galleryItems?.length === 0 && (
          <div className="text-center text-muted-foreground mt-16">
            <p>Belum ada item di galeri.</p>
          </div>
        )}
      </div>
    </>
  );
}