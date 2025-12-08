"use client";

import { useState, useEffect } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  TemplateField,
  FieldType,
  FieldCategory,
  createTemplateField,
  updateTemplateField,
} from "@/services/api/template-field.service";
import { ValidationRulesBuilder } from "./ValidationRulesBuilder";

const fieldFormSchema = z.object({
  field_key: z.string().min(1, "Field key wajib diisi").regex(/^[a-z_]+$/, "Hanya huruf kecil dan underscore"),
  field_label: z.string().min(1, "Label wajib diisi"),
  field_type: z.enum(["text", "textarea", "date", "time", "url", "email", "phone", "image", "color"]),
  field_category: z.enum(["couple", "event", "venue", "design", "general"]),
  placeholder: z.string().optional(),
  default_value: z.string().optional(),
  help_text: z.string().optional(),
  validation_rules: z.object({
    required: z.boolean().optional(),
    min: z.number().optional(),
    max: z.number().optional(),
    pattern: z.string().optional(),
  }).optional(),
  display_order: z.number().optional(),
  is_active: z.boolean().optional(),
});

type FieldFormValues = z.infer<typeof fieldFormSchema>;

interface FieldFormDialogProps {
  templateId: number;
  field?: TemplateField;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function FieldFormDialog({
  templateId,
  field,
  trigger,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: FieldFormDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const queryClient = useQueryClient();

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? controlledOnOpenChange! : setInternalOpen;

  const isEditMode = !!field;

  const form = useForm<FieldFormValues>({
    resolver: zodResolver(fieldFormSchema),
    defaultValues: {
      field_key: field?.field_key || "",
      field_label: field?.field_label || "",
      field_type: field?.field_type || "text",
      field_category: field?.field_category || "general",
      placeholder: field?.placeholder || "",
      default_value: field?.default_value || "",
      help_text: field?.help_text || "",
      validation_rules: field?.validation_rules || {},
      display_order: field?.display_order || 0,
      is_active: field?.is_active ?? true,
    },
  });

  useEffect(() => {
    if (field) {
      form.reset({
        field_key: field.field_key,
        field_label: field.field_label,
        field_type: field.field_type,
        field_category: field.field_category,
        placeholder: field.placeholder || "",
        default_value: field.default_value || "",
        help_text: field.help_text || "",
        validation_rules: field.validation_rules || {},
        display_order: field.display_order,
        is_active: field.is_active,
      });
    }
  }, [field, form]);

  const createMutation = useMutation({
    mutationFn: (data: FieldFormValues) => createTemplateField(templateId, data),
    onSuccess: () => {
      toast.success("Field berhasil dibuat");
      queryClient.invalidateQueries({ queryKey: ["template-fields", templateId] });
      setOpen(false);
      form.reset();
    },
    onError: (error: Error) => {
      toast.error(`Gagal membuat field: ${error.message}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: FieldFormValues) =>
      updateTemplateField({
        templateId,
        fieldId: field!.id,
        data,
      }),
    onSuccess: () => {
      toast.success("Field berhasil diperbarui");
      queryClient.invalidateQueries({ queryKey: ["template-fields", templateId] });
      setOpen(false);
    },
    onError: (error: Error) => {
      toast.error(`Gagal memperbarui field: ${error.message}`);
    },
  });

  const onSubmit = (data: FieldFormValues) => {
    if (isEditMode) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Field" : "Tambah Field Baru"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Perbarui informasi field template."
              : "Buat field dinamis baru untuk template ini."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="field_key"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Field Key</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. bride_full_name"
                        {...field}
                        disabled={isEditMode}
                      />
                    </FormControl>
                    <FormDescription>
                      Hanya huruf kecil dan underscore (tidak bisa diubah)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="field_label"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Label</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Nama Lengkap Pengantin Wanita" {...field} />
                    </FormControl>
                    <FormDescription>
                      Label yang ditampilkan di form
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="field_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipe Field</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih tipe" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="text">Teks</SelectItem>
                        <SelectItem value="textarea">Area Teks</SelectItem>
                        <SelectItem value="date">Tanggal</SelectItem>
                        <SelectItem value="time">Waktu</SelectItem>
                        <SelectItem value="url">URL</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="phone">Telepon</SelectItem>
                        <SelectItem value="image">Gambar</SelectItem>
                        <SelectItem value="color">Warna</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="field_category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kategori</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih kategori" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="couple">Pasangan</SelectItem>
                        <SelectItem value="event">Acara</SelectItem>
                        <SelectItem value="venue">Tempat</SelectItem>
                        <SelectItem value="design">Desain</SelectItem>
                        <SelectItem value="general">Umum</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="placeholder"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Placeholder (opsional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Masukkan nama lengkap" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="default_value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nilai Default (opsional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Nilai default untuk field ini" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="help_text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teks Bantuan (opsional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Petunjuk tambahan untuk pengguna"
                      {...field}
                      rows={2}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="validation_rules"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Aturan Validasi</FormLabel>
                  <FormControl>
                    <ValidationRulesBuilder
                      value={field.value || {}}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Status Aktif</FormLabel>
                    <FormDescription>
                      Field aktif akan ditampilkan di form customization
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="cursor-pointer"
              >
                {createMutation.isPending || updateMutation.isPending
                  ? "Menyimpan..."
                  : isEditMode
                  ? "Perbarui"
                  : "Buat Field"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
