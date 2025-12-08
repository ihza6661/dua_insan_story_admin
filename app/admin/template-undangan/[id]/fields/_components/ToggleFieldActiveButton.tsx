"use client";

import { useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { TemplateField, toggleTemplateFieldActive } from "@/services/api/template-field.service";

interface ToggleFieldActiveButtonProps {
  field: TemplateField;
}

export function ToggleFieldActiveButton({ field }: ToggleFieldActiveButtonProps) {
  const queryClient = useQueryClient();

  const toggleMutation = useMutation({
    mutationFn: () => toggleTemplateFieldActive(field.template_id, field.id),
    onSuccess: (data) => {
      const newStatus = data.data.is_active ? "aktif" : "non-aktif";
      toast.success(`Field berhasil diubah menjadi ${newStatus}`);
      queryClient.invalidateQueries({ queryKey: ["template-fields", field.template_id] });
    },
    onError: (error: Error) => {
      toast.error(`Gagal mengubah status field: ${error.message}`);
    },
  });

  return (
    <DropdownMenuItem
      className="cursor-pointer"
      onClick={() => toggleMutation.mutate()}
      disabled={toggleMutation.isPending}
    >
      {field.is_active ? "Nonaktifkan" : "Aktifkan"}
    </DropdownMenuItem>
  );
}
