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
import { AttributeForm } from "../../_components/AttributeForm";
import { AttributeValuesManager } from "../../_components/AttributeValuesManager";
import { getAttributeById } from "@/services/api/attribute.service";

export default function EditAtributPage() {
  const params = useParams();
  const id = Number(params.id);

  const { data: attribute, isLoading, error } = useQuery({
    queryKey: ['attribute', id],
    queryFn: () => getAttributeById(id),
    enabled: !!id,
  });

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-4">
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/atribut">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Daftar Atribut
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Edit Atribut</CardTitle>
          <CardDescription>
            Perbarui nama atribut dan kelola nilai-nilainya di bawah ini.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && <p>Memuat data atribut...</p>}
          {error && <p className="text-destructive">Gagal memuat data.</p>}
          {attribute && (
            <>
              <AttributeForm initialData={attribute} />
              <AttributeValuesManager attribute={attribute} />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}