import { Edit, Trash2 } from "lucide-react";
import React from "react";
import { deleteCarrousel } from "~/api/Principal/carrousel.api";
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
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import type { ItemCarrousel } from "~/interfaces/carrousel.interfaces";

interface props {
  paginatedCarouselItems: ItemCarrousel[];
  setIsCarouselDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedCarouselItem: React.Dispatch<
    React.SetStateAction<ItemCarrousel | null>
  >;
  setCarouselItems: React.Dispatch<React.SetStateAction<ItemCarrousel[]>>;
}

export const CarruselTable = ({
  paginatedCarouselItems,
  setIsCarouselDialogOpen,
  setSelectedCarouselItem,
  setCarouselItems,
}: props) => {
  const editCarouselItem = (item: ItemCarrousel) => {
    setSelectedCarouselItem(item);
    setIsCarouselDialogOpen(true);
  };
  const deleteCarouselItem = (id: string) => {
    deleteCarrousel(id).then(() =>
      setCarouselItems((items) => items.filter((item) => item.id !== id))
    );
  };
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Título</TableHead>
          <TableHead>Descripción</TableHead>
          <TableHead>Orden</TableHead>
          <TableHead>Vigencia</TableHead>
          <TableHead>Activo</TableHead>
          <TableHead>Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {paginatedCarouselItems.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={6}
              className="text-center text-muted-foreground"
            >
              No hay elementos que mostrar
            </TableCell>
          </TableRow>
        ) : (
          paginatedCarouselItems.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.title}</TableCell>
              <TableCell>{item.description}</TableCell>
              <TableCell>{item.order}</TableCell>
              <TableCell>
                {formattedDate(item.startDate)} - {formattedDate(item.endDate)}
              </TableCell>
              <TableCell>
                {item.active ? (
                  <Badge
                    variant="outline"
                    className="border-green-600 text-green-600"
                  >
                    Activo
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="border-red-600 text-red-600"
                  >
                    Inactivo
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => editCarouselItem(item)}
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
                        ¿Está seguro que desea eliminar este elemento del
                        carrusel? Esta acción no se puede deshacer.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => {
                          deleteCarouselItem(item.id);
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
