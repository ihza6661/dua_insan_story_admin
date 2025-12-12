"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MoreHorizontal, CheckCircle, XCircle, Star, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import {
  UGCItem,
  approveUGC,
  unapproveUGC,
  toggleFeaturedUGC,
  deleteUGC,
} from "@/services/api/ugc.service";
import { UGCDetailDialog } from "./UGCDetailDialog";
import { DeleteUGCDialog } from "./DeleteUGCDialog";

interface UGCActionsProps {
  item: UGCItem;
}

export function UGCActions({ item }: UGCActionsProps) {
  const queryClient = useQueryClient();
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const approveMutation = useMutation({
    mutationFn: approveUGC,
    onSuccess: () => {
      toast.success("Foto berhasil disetujui");
      queryClient.invalidateQueries({ queryKey: ["admin-ugc"] });
    },
    onError: () => {
      toast.error("Gagal menyetujui foto");
    },
  });

  const unapproveMutation = useMutation({
    mutationFn: unapproveUGC,
    onSuccess: () => {
      toast.success("Persetujuan foto dibatalkan");
      queryClient.invalidateQueries({ queryKey: ["admin-ugc"] });
    },
    onError: () => {
      toast.error("Gagal membatalkan persetujuan foto");
    },
  });

  const toggleFeaturedMutation = useMutation({
    mutationFn: toggleFeaturedUGC,
    onSuccess: () => {
      toast.success(
        item.is_featured
          ? "Foto dihapus dari unggulan"
          : "Foto ditambahkan ke unggulan"
      );
      queryClient.invalidateQueries({ queryKey: ["admin-ugc"] });
    },
    onError: () => {
      toast.error("Gagal mengubah status unggulan");
    },
  });

  const handleApprove = () => {
    approveMutation.mutate(item.id);
  };

  const handleUnapprove = () => {
    unapproveMutation.mutate(item.id);
  };

  const handleToggleFeatured = () => {
    toggleFeaturedMutation.mutate(item.id);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Buka menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Aksi</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={() => setDetailDialogOpen(true)}>
            <Eye className="mr-2 h-4 w-4" />
            Lihat Detail
          </DropdownMenuItem>

          {!item.is_approved ? (
            <DropdownMenuItem onClick={handleApprove}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Setujui
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={handleUnapprove}>
              <XCircle className="mr-2 h-4 w-4" />
              Batalkan Persetujuan
            </DropdownMenuItem>
          )}

          <DropdownMenuItem onClick={handleToggleFeatured}>
            <Star className="mr-2 h-4 w-4" />
            {item.is_featured ? "Hapus dari Unggulan" : "Jadikan Unggulan"}
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => setDeleteDialogOpen(true)}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Hapus
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <UGCDetailDialog
        item={item}
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
      />

      <DeleteUGCDialog
        item={item}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      />
    </>
  );
}
