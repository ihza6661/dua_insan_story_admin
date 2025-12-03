"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Link as LinkIcon, PlusCircle, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Product } from "@/lib/types";
import { getAddOns } from "@/services/api/addon.service";
import {
  linkAddOnToProduct,
  unlinkAddOnFromProduct,
} from "@/services/api/product.service";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ProductAddOnsManagerProps {
  product: Product;
}

const currencyFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
});

export function ProductAddOnsManager({ product }: ProductAddOnsManagerProps) {
  const queryClient = useQueryClient();
  const [selectedAddOnId, setSelectedAddOnId] = useState<string>("");
  const [weight, setWeight] = useState<string>("");

  const { data: allAddOns, isLoading: isLoadingAddOns } = useQuery({
    queryKey: ["add-ons"],
    queryFn: getAddOns,
  });

  const availableAddOns = useMemo(
    () =>
      allAddOns?.filter(
        (addOn) => !product.add_ons.some((linked) => linked.id === addOn.id),
      ) ?? [],
    [allAddOns, product.add_ons],
  );

  const { mutate: linkMutate, isPending: isLinking } = useMutation({
    mutationFn: linkAddOnToProduct,
    onSuccess: () => {
      toast.success("Item tambahan berhasil ditautkan.");
      queryClient.invalidateQueries({ queryKey: ["product", product.id] });
      setSelectedAddOnId("");
      setWeight("");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(error.response?.data?.message || "Gagal menautkan item.");
    },
  });

  const { mutate: unlinkMutate, isPending: isUnlinking } = useMutation({
    mutationFn: unlinkAddOnFromProduct,
    onSuccess: () => {
      toast.success("Tautan item tambahan berhasil dilepas.");
      queryClient.invalidateQueries({ queryKey: ["product", product.id] });
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(error.response?.data?.message || "Gagal melepas tautan.");
    },
  });

  const handleLinkAddOn = () => {
    if (!selectedAddOnId) {
      toast.error("Silakan pilih item tambahan.");
      return;
    }

    const parsedWeight = weight.trim() === "" ? undefined : Number(weight);
    if (parsedWeight !== undefined && (Number.isNaN(parsedWeight) || parsedWeight < 0)) {
      toast.error("Berat harus berupa angka minimal 0 gram.");
      return;
    }

    linkMutate({
      productId: product.id,
      addOnId: Number(selectedAddOnId),
      weight: parsedWeight,
    });
  };

  const resolveWeightValue = (value: number | null | undefined) => value ?? 0;

  return (
    <div className="space-y-8">
      <div>
        <h3 className="mb-4 text-lg font-medium">Tautkan Item Tambahan Baru</h3>
        <div className="flex flex-col gap-4 rounded-lg border p-4 md:flex-row md:items-end">
          <div className="grow">
            <label className="text-sm font-medium">Item Tambahan</label>
            <Select
              onValueChange={setSelectedAddOnId}
              value={selectedAddOnId}
              disabled={isLoadingAddOns}
            >
              <SelectTrigger>
                <SelectValue placeholder={isLoadingAddOns ? "Memuat..." : "Pilih item tambahan"} />
              </SelectTrigger>
              <SelectContent>
                {availableAddOns.map((addOn) => (
                  <SelectItem key={addOn.id} value={addOn.id.toString()}>
                    {addOn.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grow md:max-w-[200px]">
            <label className="text-sm font-medium">Berat (gram)</label>
            <Input
              type="number"
              min={0}
              placeholder="Opsional"
              value={weight}
              onChange={(event) => setWeight(event.target.value)}
            />
          </div>
          <Button onClick={handleLinkAddOn} disabled={isLinking || !selectedAddOnId}>
            <LinkIcon className="mr-2 h-4 w-4" />
            {isLinking ? "Menautkan..." : "Tautkan"}
          </Button>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Item Tambahan yang Tertaut</h3>
          <Button variant="ghost" size="sm" className="gap-2" disabled>
            <PlusCircle className="h-4 w-4" />
            Kelola Item Tambahan
          </Button>
        </div>
        <div className="mt-4 rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Harga</TableHead>
                <TableHead>Berat (gram)</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {product.add_ons.length > 0 ? (
                // Remove duplicates by filtering unique IDs
                Array.from(new Map(product.add_ons.map(addon => [addon.id, addon])).values()).map((addOn) => (
                  <TableRow key={addOn.id}>
                    <TableCell className="font-medium">{addOn.name}</TableCell>
                    <TableCell>{currencyFormatter.format(addOn.price)}</TableCell>
                    <TableCell>{resolveWeightValue(addOn.weight ?? addOn.pivot?.weight)} gr</TableCell>
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
                  <TableCell colSpan={4} className="h-24 text-center">
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

