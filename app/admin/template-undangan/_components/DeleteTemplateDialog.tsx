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
import { deleteInvitationTemplate } from "@/services/api/invitation-template.service";

interface DeleteTemplateDialogProps {
  templateId: number;
  templateName: string;
  hasInvitations: boolean;
}

export function DeleteTemplateDialog({
  templateId,
  templateName,
  hasInvitations,
}: DeleteTemplateDialogProps) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () => deleteInvitationTemplate(templateId),
    onSuccess: () => {
      toast.success("Template berhasil dihapus");
      queryClient.invalidateQueries({ queryKey: ["invitation-templates"] });
      setOpen(false);
    },
    onError: (error: Error) => {
      toast.error(`Gagal menghapus template: ${error.message}`);
    },
  });

  const handleDelete = () => {
    if (hasInvitations) {
      toast.error("Tidak dapat menghapus template yang masih digunakan");
      setOpen(false);
      return;
    }
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
            <AlertDialogTitle>Hapus Template</AlertDialogTitle>
            <AlertDialogDescription>
              {hasInvitations ? (
                <span className="text-destructive font-medium">
                  Template &quot;{templateName}&quot; masih digunakan oleh{" "}
                  {hasInvitations} undangan dan tidak dapat dihapus.
                </span>
              ) : (
                <>
                  Apakah Anda yakin ingin menghapus template &quot;
                  <span className="font-medium">{templateName}</span>&quot;? Tindakan
                  ini tidak dapat dibatalkan.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            {!hasInvitations && (
              <AlertDialogAction
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className="bg-destructive hover:bg-destructive/90 cursor-pointer"
              >
                {deleteMutation.isPending ? "Menghapus..." : "Hapus"}
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
