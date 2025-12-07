"use client";

import { useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import {
  InvitationTemplate,
  toggleInvitationTemplateActive,
} from "@/services/api/invitation-template.service";

interface ToggleActiveButtonProps {
  template: InvitationTemplate;
}

export function ToggleActiveButton({ template }: ToggleActiveButtonProps) {
  const queryClient = useQueryClient();

  const toggleMutation = useMutation({
    mutationFn: () => toggleInvitationTemplateActive(template.id),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["invitation-templates"] });
    },
    onError: (error: Error) => {
      toast.error(`Gagal mengubah status: ${error.message}`);
    },
  });

  return (
    <DropdownMenuItem
      className="cursor-pointer"
      onSelect={(e) => {
        e.preventDefault();
        toggleMutation.mutate();
      }}
      disabled={toggleMutation.isPending}
    >
      {toggleMutation.isPending
        ? "Memproses..."
        : template.is_active
        ? "Nonaktifkan"
        : "Aktifkan"}
    </DropdownMenuItem>
  );
}
