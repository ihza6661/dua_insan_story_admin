"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { Check, Pencil, PlusCircle, Trash2, X } from "lucide-react";

import { Attribute } from "@/lib/types";
import {
  createAttributeValue,
  deleteAttributeValue,
  updateAttributeValue,
} from "@/services/api/attribute.service";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface AttributeValuesManagerProps {
  attribute: Attribute;
}

export function AttributeValuesManager({ attribute }: AttributeValuesManagerProps) {
  const queryClient = useQueryClient();
  const [newValue, setNewValue] = useState("");
  const [editingValueId, setEditingValueId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");

  const invalidateQueries = () => {
    queryClient.invalidateQueries({ queryKey: ["attributes"] });
    queryClient.invalidateQueries({ queryKey: ["attribute", attribute.id] });
  };

  const { mutate: createMutate, isPending: isCreating } = useMutation({
    mutationFn: createAttributeValue,
    onSuccess: () => {
      toast.success("Nilai berhasil ditambahkan.");
      invalidateQueries();
      setNewValue("");
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data?.message || "Gagal menambahkan nilai.");
    },
  });

  const { mutate: updateMutate, isPending: isUpdating } = useMutation({
    mutationFn: updateAttributeValue,
    onSuccess: () => {
      toast.success("Nilai berhasil diperbarui.");
      invalidateQueries();
      setEditingValueId(null);
      setEditingText("");
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data?.message || "Gagal memperbarui nilai.");
    },
  });

  const { mutate: deleteMutate, isPending: isDeleting } = useMutation({
    mutationFn: deleteAttributeValue,
    onSuccess: () => {
      toast.success("Nilai berhasil dihapus.");
      invalidateQueries();
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data?.message || "Gagal menghapus nilai.");
    },
  });

  const handleAddValue = () => {
    if (!newValue.trim()) {
      toast.error("Nama nilai tidak boleh kosong.");
      return;
    }
    createMutate({ attributeId: attribute.id, data: { value: newValue } });
  };

  const handleUpdateValue = () => {
    if (!editingText.trim()) {
      toast.error("Nama nilai tidak boleh kosong.");
      return;
    }
    if (editingValueId) {
      updateMutate({ id: editingValueId, data: { value: editingText } });
    }
  };

  return (
    <div className="space-y-8 mt-8 pt-8 border-t">
      <div>
        <h3 className="text-lg font-medium mb-4">Tambah Nilai Baru</h3>
        <div className="flex items-center gap-4">
          <Input
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            placeholder="Contoh: Merah, Kecil, Art Paper"
            disabled={isCreating}
          />
          <Button onClick={handleAddValue} disabled={isCreating}>
            <PlusCircle className="mr-2 h-4 w-4" />
            {isCreating ? "Menambah..." : "Tambah"}
          </Button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium">Daftar Nilai</h3>
        <div className="mt-4 rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nilai</TableHead>
                <TableHead className="text-right w-[120px]">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attribute.values.length > 0 ? (
                attribute.values.map((value) => (
                  <TableRow key={value.id}>
                    <TableCell>
                      {editingValueId === value.id ? (
                        <Input
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          className="h-8"
                        />
                      ) : (
                        value.value
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {editingValueId === value.id ? (
                        <div className="flex gap-2 justify-end">
                          <Button size="icon" className="h-8 w-8" onClick={handleUpdateValue} disabled={isUpdating}>
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => setEditingValueId(null)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex gap-2 justify-end">
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8"
                            onClick={() => {
                              setEditingValueId(value.id);
                              setEditingText(value.value);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="icon" className="h-8 w-8">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Anda yakin?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tindakan ini akan menghapus nilai <span className="font-semibold">{value.value}</span>.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteMutate(value.id)}
                                  disabled={isDeleting}
                                  className="bg-destructive hover:bg-destructive/90"
                                >
                                  {isDeleting ? "Menghapus..." : "Ya, Hapus"}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} className="h-24 text-center">
                    Belum ada nilai untuk atribut ini.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}