import { Edit, Star, Trash2 } from "lucide-react";
import React from "react";
import { deleteDocument } from "~/api/documents/documents.api";
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
import {
  AreaLabels,
  TopicoLabels,
  type DocumentInterface,
} from "~/interfaces/documents/document.interfaces";

interface props {
  paginatedDocumentsItems: DocumentInterface[];
  setIsDocumentsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedDocumentsItem: React.Dispatch<
    React.SetStateAction<DocumentInterface | null>
  >;
  setDocumentsItems: React.Dispatch<React.SetStateAction<DocumentInterface[]>>;
}

export const DocumentsTable = ({
  paginatedDocumentsItems,
  setIsDocumentsDialogOpen,
  setSelectedDocumentsItem,
  setDocumentsItems,
}: props) => {
  const editDocumentsItem = (item: DocumentInterface) => {
    setSelectedDocumentsItem(item);
    setIsDocumentsDialogOpen(true);
  };
  const deleteDocumentsItem = async (id: string) => {
    await deleteDocument(id);
    setDocumentsItems((items) => items.filter((item) => item.id !== id));
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Título</TableHead>
          <TableHead>Fecha de publicación</TableHead>
          <TableHead>Area</TableHead>
          <TableHead>Topico</TableHead>
          <TableHead>Activo</TableHead>
          <TableHead>Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {paginatedDocumentsItems.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={6}
              className="text-center text-muted-foreground"
            >
              No hay elementos que mostrar
            </TableCell>
          </TableRow>
        ) : (
          paginatedDocumentsItems.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.title}</TableCell>
              <TableCell>{formattedDate(item.documentDate)}</TableCell>
              <TableCell>{AreaLabels[item.area]}</TableCell>
              <TableCell>{TopicoLabels[item.topico]}</TableCell>
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
                    Desactivado
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => editDocumentsItem(item)}
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
                          deleteDocumentsItem(item.id);
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
