"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { Link, PlusCircle, Trash2 } from "lucide-react";

import { Product } from "@/lib/types";
import { getAddOns } from "@/services/api/addon.service";
import { linkAddOnToProduct, unlinkAddOnFromProduct } from "@/services/api/product.service";

import { Button } from "@/components/ui/button";
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
import { useState } from "react";

interface ProductAddOnsManagerProps {
  product: Product;
}

export function ProductAddOnsManager({ product }: ProductAddOnsManagerProps) {
  const queryClient = useQueryClient();
  const [selectedAddOnId, setSelectedAddOnId] = useState<string>("");

  const { data: allAddOns, isLoading: isLoadingAddOns } = useQuery({
    queryKey: ["add-ons"],
    queryFn: getAddOns,
  });

  const { mutate: linkMutate, isPending: isLinking } = useMutation({
    mutationFn: linkAddOnToProduct,
    onSuccess: () => {
      toast.success("Item tambahan berhasil ditautkan.");
      queryClient.invalidateQueries({ queryKey: ["product", product.id] });
      setSelectedAddOnId("");
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data?.message || "Gagal menautkan item.");
    },
  });

  const { mutate: unlinkMutate, isPending: isUnlinking } = useMutation({
    mutationFn: unlinkAddOnFromProduct,
    onSuccess: () => {
      toast.success("Tautan item tambahan berhasil dilepas.");
      queryClient.invalidateQueries({ queryKey: ["product", product.id] });
    },
    onError: (error: AxiosError<any>) => {
      toast.error(error.response?.data?.message || "Gagal melepas tautan.");
    },
  });

  const handleLinkAddOn = () => {
    if (!selectedAddOnId) {
      toast.error("Silakan pilih item tambahan.");
      return;
    }
    linkMutate({ productId: product.id, addOnId: Number(selectedAddOnId) });
  };

  const availableAddOns = allAddOns?.filter(
    (addOn) => !product.add_ons.some(linked => linked.id === addOn.id)
  ) ?? [];

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium mb-4">Tautkan Item Tambahan Baru</h3>
        <div className="flex items-end gap-4 p-4 border rounded-lg">
          <div className="flex-grow">
            <label className="text-sm font-medium">Item Tambahan</label>
            <Select onValueChange={setSelectedAddOnId} value={selectedAddOnId} disabled={isLoadingAddOns}>
              <SelectTrigger>
                <SelectValue placeholder={isLoadingAddOns ? "Memuat..." : "Pilih item tambahan"} />
              </SelectTrigger>
              <SelectContent>
                {availableAddOns.map(addOn => (
                  <SelectItem key={addOn.id} value={addOn.id.toString()}>{addOn.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleLinkAddOn} disabled={isLinking || !selectedAddOnId}>
            <Link className="mr-2 h-4 w-4" />
            {isLinking ? "Menautkan..." : "Tautkan"}
          </Button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium">Item Tambahan yang Tertaut</h3>
        <div className="mt-4 rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Harga</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {product.add_ons.length > 0 ? (
                product.add_ons.map(addOn => (
                  <TableRow key={addOn.id}>
                    <TableCell className="font-medium">{addOn.name}</TableCell>
                    <TableCell>
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        minimumFractionDigits: 0,
                      }).format(addOn.price)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => unlinkMutate({ productId: product.id, addOnId: addOn.id })}
                        disabled={isUnlinking}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">
                    Belum ada item tambahan yang ditautkan.
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