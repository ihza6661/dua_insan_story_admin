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
import { AddOnForm } from "../_components/AddOnForm";

export default function TambahItemTambahanPage() {
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
          <CardTitle>Tambah Item Tambahan Baru</CardTitle>
          <CardDescription>
            Isi detail item tambahan di bawah ini.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AddOnForm />
        </CardContent>
      </Card>
    </div>
  );
}