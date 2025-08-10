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
import { UserForm } from "../_components/UserForm";

export default function TambahPenggunaPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-4">
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/pengguna">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Daftar Pengguna
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Tambah Admin Baru</CardTitle>
          <CardDescription>
            Isi detail di bawah ini untuk membuat akun admin baru.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserForm />
        </CardContent>
      </Card>
    </div>
  );
}