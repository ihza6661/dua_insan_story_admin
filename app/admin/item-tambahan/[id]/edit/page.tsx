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
import { AddOnForm } from "../../_components/AddOnForm";
import { getAddOnById } from "@/services/api/addon.service";

export default function EditItemTambahanPage() {
  const params = useParams();
  const id = Number(params.id);

  const { data: addOn, isLoading, error } = useQuery({
    queryKey: ['add-on', id],
    queryFn: () => getAddOnById(id),
    enabled: !!id,
  });

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-4">
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/item-tambahan">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Daftar Item
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Edit Item Tambahan</CardTitle>
          <CardDescription>
            Perbarui detail item tambahan di bawah ini.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && <p>Memuat data item...</p>}
          {error && <p className="text-destructive">Gagal memuat data.</p>}
          {addOn && <AddOnForm initialData={addOn} />}
        </CardContent>
      </Card>
    </div>
  );
}