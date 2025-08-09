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
import { AttributeForm } from "../_components/AttributeForm";

export default function TambahAtributPage() {
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
          <CardTitle>Tambah Atribut Baru</CardTitle>
          <CardDescription>
            Isi nama atribut di bawah ini. Nilai-nilai untuk atribut ini dapat ditambahkan setelahnya.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AttributeForm />
        </CardContent>
      </Card>
    </div>
  );
}