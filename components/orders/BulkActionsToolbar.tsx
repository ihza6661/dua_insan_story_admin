import { Button } from '@/components/ui/button';
import { X, FileDown, Edit } from 'lucide-react';

interface BulkActionsToolbarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onBulkStatusUpdate: () => void;
  onExport: () => void;
}

export function BulkActionsToolbar({
  selectedCount,
  onClearSelection,
  onBulkStatusUpdate,
  onExport,
}: BulkActionsToolbarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center justify-between rounded-lg border bg-muted/50 p-4">
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium">
          {selectedCount} pesanan dipilih
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearSelection}
        >
          <X className="mr-2 h-4 w-4" />
          Batal
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onBulkStatusUpdate}
        >
          <Edit className="mr-2 h-4 w-4" />
          Ubah Status
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onExport}
        >
          <FileDown className="mr-2 h-4 w-4" />
          Export Pilihan
        </Button>
      </div>
    </div>
  );
}
