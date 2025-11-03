"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserForm } from "../_shared/_components/UserForm";

export default function TambahPenggunaPage() {
  const searchParams = useSearchParams();
  const role = searchParams.get("role") || "admin";

  const title = role === "admin" ? "Tambah Admin Baru" : "Tambah Customer Baru";
  const description = role === "admin" ? "Isi detail di bawah ini untuk membuat akun admin baru." : "Isi detail di bawah ini untuk membuat akun customer baru.";
  const backLink = role === "admin" ? "/admin/pengguna/admin" : "/admin/pengguna/customer";

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-4">
        <Button asChild variant="outline" size="sm">
          <Link href={backLink}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Daftar Pengguna
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <UserForm role={role} />
        </CardContent>
      </Card>
    </div>
  );
}