"use client";

import { DataTable } from "@/components/shared/DataTable";
import { TemplateField } from "@/services/api/template-field.service";
import { fieldColumns } from "./field-columns";

interface FieldListProps {
  templateId: number;
  fields: TemplateField[];
}

export function FieldList({ templateId, fields }: FieldListProps) {
  return (
    <DataTable
      columns={fieldColumns}
      data={fields}
      searchColumnKey="field_label"
      searchPlaceholder="Cari berdasarkan label field..."
    />
  );
}
