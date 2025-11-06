import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import type { FileData } from "~/interfaces/Article33/types/article33.types";

interface DeleteFileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  file: FileData | null;
  period: string;
  year: number;
  onConfirm: () => void;
}

export function DeleteFileDialog({
  open,
  onOpenChange,
  file,
  period,
  year,
  onConfirm,
}: DeleteFileDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Eliminar archivo?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción eliminará permanentemente el archivo "{file?.name}" del
            período {period} ({year}). Esta acción no se puede deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700"
          >
            Eliminar Archivo
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
