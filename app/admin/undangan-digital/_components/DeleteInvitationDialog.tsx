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
import { deleteDigitalInvitation } from "@/services/api/digital-invitation.service";

interface DeleteInvitationDialogProps {
  invitationId: number;
  invitationSlug: string;
}

export function DeleteInvitationDialog({
  invitationId,
  invitationSlug,
}: DeleteInvitationDialogProps) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () => deleteDigitalInvitation(invitationId),
    onSuccess: () => {
      toast.success("Undangan berhasil dinonaktifkan");
      queryClient.invalidateQueries({ queryKey: ["digital-invitations"] });
      queryClient.invalidateQueries({ queryKey: ["digital-invitation-statistics"] });
      setOpen(false);
    },
    onError: (error: Error) => {
      toast.error(`Gagal menonaktifkan undangan: ${error.message}`);
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
        Nonaktifkan
      </DropdownMenuItem>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Nonaktifkan Undangan</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menonaktifkan undangan &quot;
              <span className="font-medium font-mono">{invitationSlug}</span>&quot;? 
              <br /><br />
              Undangan akan diubah statusnya menjadi expired dan tidak dapat diakses lagi oleh tamu.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="bg-destructive hover:bg-destructive/90 cursor-pointer"
            >
              {deleteMutation.isPending ? "Memproses..." : "Nonaktifkan"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
