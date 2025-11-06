import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";

import { Button } from "~/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

import { Input } from "~/components/ui/input";

import type { AnnouncementInterface } from "~/interfaces/announcement.interfaces";
import { getAllAnnouncements } from "~/api/announcements/announcements.api";
import { AnnouncementDialog } from "./AnnouncementDialog";
import { AnnouncementTable } from "./AnnouncementTable";

export const Convocatorias = () => {
  const [announcementItems, setAnnouncementItems] = useState<
    AnnouncementInterface[]
  >([]);
  const [announcementCount, setAnnouncementCount] = useState<number>(0);
  const [selectedAnnouncementItem, setSelectedAnnouncementItem] =
    useState<AnnouncementInterface | null>(null);
  const [isAnnouncementDialogOpen, setIsAnnouncementDialogOpen] =
    useState(false);

  // Estados para filtros y paginación
  const [announcementSearchTerm, setAnnouncementSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(
    announcementSearchTerm
  );
  const [announcementCurrentPage, setAnnouncementCurrentPage] = useState(1);
  const announcementItemsPerPage = 10;

  // Controlar el cambio de la búsqueda
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(announcementSearchTerm);
      setAnnouncementCurrentPage(1); // reinicia a página 1 al cambiar búsqueda
    }, 500); // 500 ms de espera

    return () => {
      clearTimeout(handler); // limpia el timeout si el usuario sigue escribiendo
    };
  }, [announcementSearchTerm]);

  // Cargar items cada vez que cambia página o se abre/cierra el diálogo
  useEffect(() => {
    getAllAnnouncements({
      perPage: announcementItemsPerPage,
      page: announcementCurrentPage,
      search: debouncedSearchTerm,
    }).then((response) => {
      setAnnouncementItems(response.announcements);
      setAnnouncementCount(response.total);
    });
  }, [announcementCurrentPage, debouncedSearchTerm]);

  const announcementTotalPages = Math.ceil(
    announcementCount / announcementItemsPerPage
  );
  const paginatedAnnouncementItems = announcementItems;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Convocatorias</CardTitle>
            <CardDescription>Gestiona las convocatorias</CardDescription>
          </div>

          <AnnouncementDialog
            isAnnouncementDialogOpen={isAnnouncementDialogOpen}
            setIsAnnouncementDialogOpen={setIsAnnouncementDialogOpen}
            setSelectedAnnouncementItem={setSelectedAnnouncementItem}
            selectedAnnouncementItem={selectedAnnouncementItem}
            setAnnouncementItems={setAnnouncementItems}
          />
        </div>
      </CardHeader>
      <CardContent>
        {/* Filtros */}
        <div className="flex flex-wrap items-center gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar en convocatorias"
              value={announcementSearchTerm}
              onChange={(e) => {
                setAnnouncementSearchTerm(e.target.value);
                setAnnouncementCurrentPage(1);
              }}
              className="pl-10"
            />
          </div>
        </div>

        {/* Tabla */}
        <AnnouncementTable
          paginatedAnnouncementItems={paginatedAnnouncementItems}
          setIsAnnouncementDialogOpen={setIsAnnouncementDialogOpen}
          setAnnouncementItems={setAnnouncementItems}
          setSelectedAnnouncementItem={setSelectedAnnouncementItem}
        />
        {/* Paginación */}
        <div className="flex justify-between items-center mt-4">
          <Button
            variant="outline"
            disabled={announcementCurrentPage === 1}
            onClick={() => setAnnouncementCurrentPage((p) => p - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span>
            Página {announcementCurrentPage} de {announcementTotalPages}
          </span>
          <Button
            variant="outline"
            disabled={announcementCurrentPage === announcementTotalPages}
            onClick={() => setAnnouncementCurrentPage((p) => p + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
