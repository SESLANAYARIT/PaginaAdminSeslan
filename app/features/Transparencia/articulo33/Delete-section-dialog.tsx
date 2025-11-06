import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { AlertTriangle } from "lucide-react";

interface DeleteSectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sectionName: string;
  hasSubsections: boolean;
  fileCount: number;
  onConfirm: () => void;
}

export function DeleteSectionDialog({
  open,
  onOpenChange,
  sectionName,
  hasSubsections,
  fileCount,
  onConfirm,
}: DeleteSectionDialogProps) {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Eliminar Sección
          </DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que quieres eliminar la sección "{sectionName}"?
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800">
              <strong>Esta acción no se puede deshacer.</strong>
            </p>
            <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
              {fileCount > 0 && <li>Se eliminarán {fileCount} archivo(s)</li>}
              {hasSubsections && <li>Se eliminarán todas las subsecciones</li>}
            </ul>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleConfirm}>
            Eliminar Sección
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
