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

interface DeleteYearDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  year: number;
  periodsCount: number;
  onConfirm: () => void;
}

export function DeleteYearDialog({
  open,
  onOpenChange,
  year,
  periodsCount,
  onConfirm,
}: DeleteYearDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Eliminar año {year}?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción eliminará permanentemente el año {year} y todos sus{" "}
            {periodsCount} períodos.
            {periodsCount > 0 &&
              " Todos los archivos asociados también se perderán."}
            Esta acción no se puede deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700"
          >
            Eliminar Año
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
