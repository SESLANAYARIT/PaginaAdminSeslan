import { Edit, Star, Trash2 } from "lucide-react";
import React from "react";
import { deleteNews } from "~/api/News/news.api";
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
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/tooltip";
import { NewsStatus, type NewsInterface } from "~/interfaces/news.interfaces";

interface props {
  paginatedNewsItems: NewsInterface[];
  setIsNewsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedNewsItem: React.Dispatch<
    React.SetStateAction<NewsInterface | null>
  >;
  setNewsItems: React.Dispatch<React.SetStateAction<NewsInterface[]>>;
}

export const NewsTable = ({
  paginatedNewsItems,
  setIsNewsDialogOpen,
  setSelectedNewsItem,
  setNewsItems,
}: props) => {
  const editNewsItem = (item: NewsInterface) => {
    setSelectedNewsItem(item);
    setIsNewsDialogOpen(true);
  };
  const deleteNewsItem = (id: string) => {
    deleteNews(id).then(() =>
      setNewsItems((items) => items.filter((item) => item.id !== id))
    );
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Título</TableHead>
          <TableHead>Categoría</TableHead>
          <TableHead>Resumen</TableHead>
          <TableHead>Fecha de publicación</TableHead>
          <TableHead>Destacada</TableHead>
          <TableHead>Activo</TableHead>
          <TableHead>Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {paginatedNewsItems.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={6}
              className="text-center text-muted-foreground"
            >
              No hay elementos que mostrar
            </TableCell>
          </TableRow>
        ) : (
          paginatedNewsItems.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.title}</TableCell>
              <TableCell>{item.category}</TableCell>
              <TableCell className="max-w-[200px] truncate">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>{item.excerpt}</span>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-sm whitespace-pre-line break-words">
                    {item.excerpt}
                  </TooltipContent>
                </Tooltip>
              </TableCell>
              <TableCell>{formattedDate(item.publishDate)}</TableCell>
              <TableCell>
                {item.featured ? (
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                ) : (
                  <Star className="w-5 h-5 text-gray-400" />
                )}
              </TableCell>
              <TableCell>
                {item.status === NewsStatus.PUBLISHED ? (
                  <Badge
                    variant="outline"
                    className="border-green-600 text-green-600"
                  >
                    Publicado
                  </Badge>
                ) : item.status === NewsStatus.DRAFT ? (
                  <Badge
                    variant="outline"
                    className="border-yellow-600 text-yellow-600 dark:border-yellow-600"
                  >
                    Borrador
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="border-red-600 text-red-600 dark:border-red-600"
                  >
                    Archivado
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => editNewsItem(item)}
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
                          deleteNewsItem(item.id);
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
