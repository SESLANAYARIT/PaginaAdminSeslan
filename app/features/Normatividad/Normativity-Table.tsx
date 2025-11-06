import { Edit, Trash2 } from "lucide-react";
import React from "react";
import { deleteNormativity } from "~/api/Normativity/normativity.api";
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
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import {
  TipoNormatividad,
  TipoNormatividadLabels,
  type NormativityInterface,
} from "~/interfaces/normativity.interfaces";

interface props {
  paginatedNormativitysItems: NormativityInterface[];
  setIsNormativitysDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedNormativitysItem: React.Dispatch<
    React.SetStateAction<NormativityInterface | null>
  >;
  setNormativitysItems: React.Dispatch<
    React.SetStateAction<NormativityInterface[]>
  >;
}

export const NormativityTable = ({
  paginatedNormativitysItems,
  setIsNormativitysDialogOpen,
  setSelectedNormativitysItem,
  setNormativitysItems,
}: props) => {
  const editNormativitysItem = (item: NormativityInterface) => {
    setSelectedNormativitysItem(item);
    setIsNormativitysDialogOpen(true);
  };

  const deleteNormativitysItem = async (id: string) => {
    await deleteNormativity(id);
    setNormativitysItems((items) => items.filter((item) => item.id !== id));
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Título</TableHead>
          <TableHead>Descripción</TableHead>
          <TableHead>Fecha de publicación</TableHead>
          <TableHead>Tipo de Normatividad</TableHead>
          <TableHead>Activo</TableHead>
          <TableHead>Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {paginatedNormativitysItems.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={5}
              className="text-center text-muted-foreground"
            >
              No hay elementos que mostrar
            </TableCell>
          </TableRow>
        ) : (
          paginatedNormativitysItems.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.title}</TableCell>
              <TableCell className="max-w-[200px] truncate">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>{item.description}</span>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-sm whitespace-pre-line break-words">
                    {item.description}
                  </TooltipContent>
                </Tooltip>
              </TableCell>
              <TableCell>{formattedDate(item.documentDate)}</TableCell>
              <TableCell>
                <Badge variant="secondary" className="font-normal">
                  {
                    TipoNormatividadLabels[
                      item.tipoNormatividad as TipoNormatividad
                    ]
                  }
                </Badge>
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
                    Desactivado
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => editNormativitysItem(item)}
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
                        <AlertDialogTitle>
                          ¿Eliminar normativityo?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          ¿Está seguro que desea eliminar el normativityo "
                          {item.title}"? Esta acción no se puede deshacer.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => {
                            deleteNormativitysItem(item.id);
                          }}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Eliminar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};
