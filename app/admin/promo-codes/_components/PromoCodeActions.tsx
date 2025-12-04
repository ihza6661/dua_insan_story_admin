"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { MoreHorizontal, Eye, Edit, Trash2, Power } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { PromoCode, GenericError } from "@/lib/types";
import { 
  togglePromoCodeStatus
} from "@/services/api/promo-code.service";
import { PromoCodeDetailDialog } from "./PromoCodeDetailDialog";
import { PromoCodeFormDialog } from "./PromoCodeFormDialog";
import { DeletePromoCodeDialog } from "./DeletePromoCodeDialog";

interface PromoCodeActionsProps {
  promoCode: PromoCode;
}

export function PromoCodeActions({ promoCode }: PromoCodeActionsProps) {
  const queryClient = useQueryClient();
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const toggleStatusMutation = useMutation({
    mutationFn: togglePromoCodeStatus,
    onSuccess: (response) => {
      toast.success("Status Diubah", {
        description: response.message,
      });
      queryClient.invalidateQueries({ queryKey: ['promo-codes'] });
      queryClient.invalidateQueries({ queryKey: ['promo-code-statistics'] });
    },
    onError: (error: AxiosError<GenericError>) => {
      const errorMessage = error.response?.data?.message || "Gagal mengubah status.";
      toast.error("Gagal", {
        description: errorMessage,
      });
    },
  });

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
          <DropdownMenuItem 
            onClick={() => setShowDetailDialog(true)}
            className="cursor-pointer"
          >
            <Eye className="mr-2 h-4 w-4" />
            Lihat Detail
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => setShowEditDialog(true)}
            className="cursor-pointer"
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            onClick={() => toggleStatusMutation.mutate(promoCode.id)}
            disabled={toggleStatusMutation.isPending}
            className="cursor-pointer"
          >
            <Power className="mr-2 h-4 w-4" />
            {promoCode.is_active ? 'Nonaktifkan' : 'Aktifkan'}
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem 
            onClick={() => setShowDeleteDialog(true)}
            className="cursor-pointer text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Hapus
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <PromoCodeDetailDialog 
        promoCode={promoCode}
        open={showDetailDialog}
        onOpenChange={setShowDetailDialog}
      />

      <PromoCodeFormDialog 
        promoCode={promoCode}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
      />

      <DeletePromoCodeDialog 
        promoCode={promoCode}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
      />
    </>
  );
}
