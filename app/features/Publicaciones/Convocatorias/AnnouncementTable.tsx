import { Edit, Trash2 } from "lucide-react";
import React from "react";
import { deleteAnnouncement } from "~/api/announcements/announcements.api";
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
import type { AnnouncementInterface } from "~/interfaces/announcement.interfaces";

interface props {
  paginatedAnnouncementItems: AnnouncementInterface[];
  setIsAnnouncementDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedAnnouncementItem: React.Dispatch<
    React.SetStateAction<AnnouncementInterface | null>
  >;
  setAnnouncementItems: React.Dispatch<
    React.SetStateAction<AnnouncementInterface[]>
  >;
}

export const AnnouncementTable = ({
  paginatedAnnouncementItems,
  setIsAnnouncementDialogOpen,
  setSelectedAnnouncementItem,
  setAnnouncementItems,
}: props) => {
  const editAnnouncementItem = (item: AnnouncementInterface) => {
    setSelectedAnnouncementItem(item);
    setIsAnnouncementDialogOpen(true);
  };
  const deleteAnnouncementItem = (id: string) => {
    deleteAnnouncement(id).then(() =>
      setAnnouncementItems((items) => items.filter((item) => item.id !== id))
    );
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Título</TableHead>
          <TableHead>Fecha de la convocatoria</TableHead>
          <TableHead>Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {paginatedAnnouncementItems.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={6}
              className="text-center text-muted-foreground"
            >
              No hay elementos que mostrar
            </TableCell>
          </TableRow>
        ) : (
          paginatedAnnouncementItems.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.title}</TableCell>
              <TableCell>{formattedDate(item.date)}</TableCell>
              <TableCell>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => editAnnouncementItem(item)}
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
                          deleteAnnouncementItem(item.id);
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
