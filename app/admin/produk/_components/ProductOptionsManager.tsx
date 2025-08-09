"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { PlusCircle, Trash2 } from "lucide-react";

import { Attribute, Product } from "@/lib/types";
import { getAttributes } from "@/services/api/attribute.service";
import { createProductOption, deleteProductOption } from "@/services/api/product.service";

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

interface ProductOptionsManagerProps {
  product: Product;
}

export function ProductOptionsManager({ product }: ProductOptionsManagerProps) {
  const queryClient = useQueryClient();
  const [selectedAttributeId, setSelectedAttributeId] = useState<string>("");
  const [selectedValueId, setSelectedValueId] = useState<string>("");
  const [priceAdjustment, setPriceAdjustment] = useState<number>(0);

  const { data: attributes, isLoading: isLoadingAttributes } = useQuery({
    queryKey: ["attributes"],
    queryFn: getAttributes,
  });

  const { mutate: createMutate, isPending: isCreating } = useMutation({
    mutationFn: createProductOption,
    onSuccess: () => {
      toast.success("Opsi berhasil ditambahkan.");
      queryClient.invalidateQueries({ queryKey: ["product", product.id] });
      setSelectedAttributeId("");
      setSelectedValueId("");
      setPriceAdjustment(0);
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data?.message || "Gagal menambahkan opsi.");
    },
  });

  const { mutate: deleteMutate, isPending: isDeleting } = useMutation({
    mutationFn: deleteProductOption,
    onSuccess: () => {
      toast.success("Opsi berhasil dihapus.");
      queryClient.invalidateQueries({ queryKey: ["product", product.id] });
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data?.message || "Gagal menghapus opsi.");
    },
  });

  const handleAddOption = () => {
    if (!selectedValueId) {
      toast.error("Silakan pilih nilai atribut.");
      return;
    }
    createMutate({
      productId: product.id,
      data: {
        attribute_value_id: Number(selectedValueId),
        price_adjustment: priceAdjustment,
      },
    });
  };

  const findAttributeByValueId = (valueId: number): Attribute | undefined => {
    return attributes?.find(attr => attr.values.some(val => val.id === valueId));
  };

  const selectedAttribute = attributes?.find(attr => attr.id.toString() === selectedAttributeId);
  const availableValues = selectedAttribute?.values.filter(
    (value) => !product.options.some(opt => opt.value.id === value.id)
  ) ?? [];

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium mb-4">Tambah Opsi Baru</h3>
        <div className="flex flex-col md:flex-row items-start md:items-end gap-4 p-4 border rounded-lg">
          <div className="flex-1 w-full">
            <label className="text-sm font-medium">Atribut</label>
            <Select onValueChange={setSelectedAttributeId} value={selectedAttributeId} disabled={isLoadingAttributes}>
              <SelectTrigger>
                <SelectValue placeholder={isLoadingAttributes ? "Memuat..." : "Pilih Atribut"} />
              </SelectTrigger>
              <SelectContent>
                {attributes?.map(attr => (
                  <SelectItem key={attr.id} value={attr.id.toString()}>{attr.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1 w-full">
            <label className="text-sm font-medium">Nilai</label>
            <Select onValueChange={setSelectedValueId} value={selectedValueId} disabled={!selectedAttributeId}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih Nilai" />
              </SelectTrigger>
              <SelectContent>
                {availableValues.map(val => (
                  <SelectItem key={val.id} value={val.id.toString()}>{val.value}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1 w-full">
            <label className="text-sm font-medium">Penyesuaian Harga (Rp)</label>
            <Input
              type="number"
              value={priceAdjustment}
              onChange={(e) => setPriceAdjustment(Number(e.target.value))}
              placeholder="Contoh: 1000 atau -500"
            />
          </div>
          <Button onClick={handleAddOption} disabled={isCreating}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Tambah
          </Button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium">Opsi yang Tertaut</h3>
        <div className="mt-4 rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Atribut</TableHead>
                <TableHead>Nilai</TableHead>
                <TableHead>Penyesuaian Harga</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {product.options.length > 0 ? (
                product.options.map(option => {
                  const attributeName = findAttributeByValueId(option.value.id)?.name || 'N/A';
                  return (
                    <TableRow key={option.id}>
                      <TableCell className="font-medium">{attributeName}</TableCell>
                      <TableCell>{option.value.value}</TableCell>
                      <TableCell>
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          minimumFractionDigits: 0,
                        }).format(option.price_adjustment)}
                      </TableCell>
                      <TableCell className="text-right">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Anda yakin?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tindakan ini akan menghapus opsi dari produk ini.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Batal</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteMutate(option.id)}
                                disabled={isDeleting}
                                className="bg-destructive hover:bg-destructive/90"
                              >
                                {isDeleting ? "Menghapus..." : "Ya, Hapus"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    Belum ada opsi yang ditambahkan.
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