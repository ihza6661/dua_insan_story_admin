"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { UGCItem, deleteUGC } from "@/services/api/ugc.service";

interface DeleteUGCDialogProps {
  item: UGCItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteUGCDialog({
  item,
  open,
  onOpenChange,
}: DeleteUGCDialogProps) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteUGC,
    onSuccess: () => {
      toast.success("Foto berhasil dihapus");
      queryClient.invalidateQueries({ queryKey: ["admin-ugc"] });
      onOpenChange(false);
    },
    onError: () => {
      toast.error("Gagal menghapus foto");
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate(item.id);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Foto?</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah Anda yakin ingin menghapus foto dari{" "}
            <span className="font-semibold">{item.user?.name || "pengguna ini"}</span>?
            Tindakan ini tidak dapat dibatalkan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteMutation.isPending}>
            Batal
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleteMutation.isPending ? "Menghapus..." : "Hapus"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
