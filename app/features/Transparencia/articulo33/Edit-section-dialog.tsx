"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

interface EditSectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sectionName: string;
  onConfirm: (newName: string) => void;
}

export function EditSectionDialog({
  open,
  onOpenChange,
  sectionName,
  onConfirm,
}: EditSectionDialogProps) {
  const [newName, setNewName] = useState(sectionName);

  const handleConfirm = () => {
    if (newName.trim()) {
      onConfirm(newName.trim());
      onOpenChange(false);
      setNewName("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Sección</DialogTitle>
          <DialogDescription>
            Cambia el nombre de la sección. Este cambio se aplicará
            inmediatamente.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nombre
            </Label>
            <Input
              id="name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="col-span-3"
              placeholder="Nombre de la sección"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              setNewName("");
            }}
          >
            Cancelar
          </Button>
          <Button onClick={handleConfirm} disabled={!newName.trim()}>
            Guardar Cambios
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
