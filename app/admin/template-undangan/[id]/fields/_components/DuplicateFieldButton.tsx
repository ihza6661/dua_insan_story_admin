"use client";

import { useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Copy } from "lucide-react";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { TemplateField, duplicateTemplateField } from "@/services/api/template-field.service";

interface DuplicateFieldButtonProps {
  field: TemplateField;
}

export function DuplicateFieldButton({ field }: DuplicateFieldButtonProps) {
  const queryClient = useQueryClient();

  const duplicateMutation = useMutation({
    mutationFn: () => duplicateTemplateField(field.template_id, field.id),
    onSuccess: () => {
      toast.success("Field berhasil diduplikasi");
      queryClient.invalidateQueries({ queryKey: ["template-fields", field.template_id] });
    },
    onError: (error: Error) => {
      toast.error(`Gagal menduplikasi field: ${error.message}`);
    },
  });

  return (
    <DropdownMenuItem
      className="cursor-pointer"
      onClick={() => duplicateMutation.mutate()}
      disabled={duplicateMutation.isPending}
    >
      <Copy className="mr-2 h-4 w-4" />
      Duplikasi
    </DropdownMenuItem>
  );
}
