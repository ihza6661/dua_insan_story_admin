"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, PlusCircle, Filter } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getTemplateFields } from "@/services/api/template-field.service";
import { getInvitationTemplateById } from "@/services/api/invitation-template.service";
import { FieldList } from "./_components/FieldList";
import { FieldFormDialog } from "./_components/FieldFormDialog";

export default function TemplateFieldsPage() {
  const params = useParams();
  const router = useRouter();
  const templateId = parseInt(params.id as string);
  
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Fetch template details
  const { data: template, isLoading: isLoadingTemplate } = useQuery({
    queryKey: ['invitation-template', templateId],
    queryFn: () => getInvitationTemplateById(templateId),
  });

  // Fetch template fields
  const { data: fields, isLoading: isLoadingFields, error } = useQuery({
    queryKey: ['template-fields', templateId],
    queryFn: () => getTemplateFields(templateId),
  });

  const handleResetFilters = () => {
    setCategoryFilter('all');
    setStatusFilter('all');
  };

  const hasActiveFilters = categoryFilter !== 'all' || statusFilter !== 'all';

  // Filter fields based on selected filters
  const filteredFields = fields?.filter(field => {
    const categoryMatch = categoryFilter === 'all' || field.field_category === categoryFilter;
    const statusMatch = statusFilter === 'all' || 
      (statusFilter === 'active' ? field.is_active : !field.is_active);
    return categoryMatch && statusMatch;
  }) || [];

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push('/admin/template-undangan')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {isLoadingTemplate ? 'Memuat...' : `Field Template: ${template?.name}`}
            </h1>
            <p className="text-muted-foreground">
              Kelola field dinamis untuk template undangan ini.
            </p>
          </div>
        </div>
        <Button 
          className="cursor-pointer"
          onClick={() => setIsCreateDialogOpen(true)}
        >
          <PlusCircle className="my-2 h-4 w-4" /> Tambah Field
        </Button>
      </div>

      {/* Filters */}
      <div className="mt-4 mb-4 flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filter:</span>
        </div>

        <Select 
          value={categoryFilter} 
          onValueChange={setCategoryFilter}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Kategori" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Kategori</SelectItem>
            <SelectItem value="couple">Pasangan</SelectItem>
            <SelectItem value="event">Acara</SelectItem>
            <SelectItem value="venue">Tempat</SelectItem>
            <SelectItem value="design">Desain</SelectItem>
            <SelectItem value="general">Umum</SelectItem>
          </SelectContent>
        </Select>

        <Select 
          value={statusFilter} 
          onValueChange={setStatusFilter}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="active">Aktif</SelectItem>
            <SelectItem value="inactive">Tidak Aktif</SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleResetFilters}
            className="cursor-pointer"
          >
            Reset Filter
          </Button>
        )}
      </div>

      {/* Field List */}
      <div className="mt-4">
        {isLoadingFields && <p>Memuat data...</p>}
        {error && (
          <p className="text-destructive">
            Gagal memuat data: {error.message}
          </p>
        )}
        {filteredFields && (
          <FieldList
            templateId={templateId}
            fields={filteredFields}
          />
        )}
      </div>

      {/* Create Dialog */}
      <FieldFormDialog
        templateId={templateId}
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </>
  );
}
