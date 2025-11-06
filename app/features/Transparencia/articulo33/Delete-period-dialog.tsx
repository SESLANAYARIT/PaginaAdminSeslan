"use client";

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

interface DeletePeriodDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  year: number;
  period: string;
  hasFile: boolean;
  onConfirm: () => void;
}

export function DeletePeriodDialog({
  open,
  onOpenChange,
  year,
  period,
  hasFile,
  onConfirm,
}: DeletePeriodDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Eliminar período {period}?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción eliminará permanentemente el período {period} del año{" "}
            {year}.{hasFile && " El archivo asociado también se eliminará."}
            Esta acción no se puede deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700"
          >
            Eliminar Período
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
