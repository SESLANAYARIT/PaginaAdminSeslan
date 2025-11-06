import { Edit, Trash2 } from "lucide-react";
import React from "react";
import { deleteCommittee } from "~/api/Committee/committee.api";
import { formattedDate } from "~/api/utils/dateToLocal";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import type { Committee } from "~/interfaces/committe.interface";

interface props {
  paginatedCommitteeItems: Committee[];
  setIsCommitteeDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedCommitteeItem: React.Dispatch<
    React.SetStateAction<Committee | null>
  >;
  setCommitteeItems: React.Dispatch<React.SetStateAction<Committee[]>>;
}

export const CommitteeTable = ({
  paginatedCommitteeItems,
  setIsCommitteeDialogOpen,
  setSelectedCommitteeItem,
  setCommitteeItems,
}: props) => {
  const editCommitteeItem = (item: Committee) => {
    setSelectedCommitteeItem(item);
    setIsCommitteeDialogOpen(true);
  };
  const deleteCommitteeItem = (id: string) => {
    deleteCommittee(id).then(() =>
      setCommitteeItems((items) => items.filter((item) => item.id !== id))
    );
  };
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Título</TableHead>
          <TableHead>Fecha del documento</TableHead>
          <TableHead>Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {paginatedCommitteeItems.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={6}
              className="text-center text-muted-foreground"
            >
              No hay elementos que mostrar
            </TableCell>
          </TableRow>
        ) : (
          paginatedCommitteeItems.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.title}</TableCell>
              <TableCell>{formattedDate(item.date)}</TableCell>
              <TableCell>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => editCommitteeItem(item)}
                  className="mr-2"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" variant="destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Eliminar elemento?</AlertDialogTitle>
                      <AlertDialogDescription>
                        ¿Está seguro que desea eliminar este elemento? Esta
                        acción no se puede deshacer.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => {
                          deleteCommitteeItem(item.id);
                        }}
                        className="bg-red-600"
                      >
                        Eliminar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};
