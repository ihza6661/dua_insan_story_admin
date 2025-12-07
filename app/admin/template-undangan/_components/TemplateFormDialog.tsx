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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  InvitationTemplate,
  createInvitationTemplate,
  updateInvitationTemplate,
} from "@/services/api/invitation-template.service";

const templateFormSchema = z.object({
  name: z.string().min(1, "Nama template wajib diisi"),
  slug: z.string().optional(),
  description: z.string().optional(),
  price: z.number().min(0, "Harga harus 0 atau lebih"),
  template_component: z.string().min(1, "Nama komponen template wajib diisi"),
  is_active: z.boolean().optional(),
  thumbnail_image: z.instanceof(File).optional(),
});

type TemplateFormValues = z.infer<typeof templateFormSchema>;

interface TemplateFormDialogProps {
  template?: InvitationTemplate;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function TemplateFormDialog({
  template,
  trigger,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: TemplateFormDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? controlledOnOpenChange! : setInternalOpen;

  const isEditMode = !!template;

  const form = useForm<TemplateFormValues>({
    resolver: zodResolver(templateFormSchema),
    defaultValues: {
      name: template?.name || "",
      slug: template?.slug || "",
      description: template?.description || "",
      price: template?.price || 0,
      template_component: template?.template_component || "",
      is_active: template?.is_active ?? true,
    },
  });

  useEffect(() => {
    if (template) {
      form.reset({
        name: template.name,
        slug: template.slug,
        description: template.description || "",
        price: template.price,
        template_component: template.template_component,
        is_active: template.is_active,
      });
      setPreviewUrl(template.thumbnail_url);
    }
  }, [template, form]);

  const createMutation = useMutation({
    mutationFn: createInvitationTemplate,
    onSuccess: () => {
      toast.success("Template berhasil dibuat");
      queryClient.invalidateQueries({ queryKey: ["invitation-templates"] });
      setOpen(false);
      form.reset();
      setPreviewUrl(null);
    },
    onError: (error: Error) => {
      toast.error(`Gagal membuat template: ${error.message}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateInvitationTemplate,
    onSuccess: () => {
      toast.success("Template berhasil diperbarui");
      queryClient.invalidateQueries({ queryKey: ["invitation-templates"] });
      setOpen(false);
    },
    onError: (error: Error) => {
      toast.error(`Gagal memperbarui template: ${error.message}`);
    },
  });

  const onSubmit = (data: TemplateFormValues) => {
    if (isEditMode) {
      updateMutation.mutate({
        id: template.id,
        data: {
          name: data.name,
          slug: data.slug,
          description: data.description,
          price: data.price,
          template_component: data.template_component,
          is_active: data.is_active,
          thumbnail_image: data.thumbnail_image,
        },
      });
    } else {
      createMutation.mutate({
        name: data.name,
        slug: data.slug,
        description: data.description,
        price: data.price,
        template_component: data.template_component,
        is_active: data.is_active,
        thumbnail_image: data.thumbnail_image,
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("thumbnail_image", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Template" : "Tambah Template Baru"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Perbarui informasi template undangan."
              : "Buat template undangan digital baru."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Template</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Sakeenah Modern" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug (opsional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. sakeenah-modern" {...field} />
                  </FormControl>
                  <FormDescription>
                    Biarkan kosong untuk generate otomatis dari nama
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deskripsi (opsional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Deskripsi template"
                      {...field}
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Harga (Rp)</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="template_component"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Komponen Template</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. SakeenaTemplate" {...field} />
                  </FormControl>
                  <FormDescription>
                    Nama file komponen React untuk template ini
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="thumbnail_image"
              render={() => (
                <FormItem>
                  <FormLabel>Gambar Preview</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <Input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={handleImageChange}
                      />
                      {previewUrl && (
                        <div className="relative w-full h-48 rounded-md overflow-hidden border">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={previewUrl}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormDescription>
                    Max 2MB. Format: JPG, PNG, WebP
                  </FormDescription>
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
                      Template aktif akan ditampilkan di katalog pelanggan
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
                  : "Buat Template"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
