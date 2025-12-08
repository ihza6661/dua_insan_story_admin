"use client";

import { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

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
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { deleteTemplateField } from "@/services/api/template-field.service";

interface DeleteFieldDialogProps {
  templateId: number;
  fieldId: number;
  fieldLabel: string;
}

export function DeleteFieldDialog({
  templateId,
  fieldId,
  fieldLabel,
}: DeleteFieldDialogProps) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () => deleteTemplateField(templateId, fieldId),
    onSuccess: () => {
      toast.success("Field berhasil dihapus");
      queryClient.invalidateQueries({ queryKey: ["template-fields", templateId] });
      setOpen(false);
    },
    onError: (error: Error) => {
      toast.error(`Gagal menghapus field: ${error.message}`);
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate();
  };

  return (
    <>
      <DropdownMenuItem
        className="cursor-pointer text-destructive focus:text-destructive"
        onSelect={(e) => {
          e.preventDefault();
          setOpen(true);
        }}
      >
        Hapus
      </DropdownMenuItem>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Field</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus field &quot;
              <span className="font-medium">{fieldLabel}</span>&quot;? Tindakan
              ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="bg-destructive hover:bg-destructive/90 cursor-pointer"
            >
              {deleteMutation.isPending ? "Menghapus..." : "Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
