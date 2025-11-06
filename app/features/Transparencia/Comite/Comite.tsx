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
import type { Committee } from "~/interfaces/committe.interface";
import { getAllCommittees } from "~/api/Committee/committee.api";
import { CommitteeDialog } from "./CommitteeDialog";
import { CommitteeTable } from "./CommitteeTable";

export const ComiteTransparencia = () => {
  const [committeeItems, setCommitteeItems] = useState<Committee[]>([]);
  const [committeeCount, setCommitteeCount] = useState<number>(0);
  const [selectedCommitteeItem, setSelectedCommitteeItem] =
    useState<Committee | null>(null);
  const [isCommitteeDialogOpen, setIsCommitteeDialogOpen] = useState(false);

  // Estados para filtros y paginación
  const [committeeSearchTerm, setCommitteeSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] =
    useState(committeeSearchTerm);
  const [committeeCurrentPage, setCommitteeCurrentPage] = useState(1);
  const committeeItemsPerPage = 10;

  // Controlar el cambio de la búsqueda
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(committeeSearchTerm);
      setCommitteeCurrentPage(1); // reinicia a página 1 al cambiar búsqueda
    }, 500); // 500 ms de espera

    return () => {
      clearTimeout(handler); // limpia el timeout si el usuario sigue escribiendo
    };
  }, [committeeSearchTerm]);

  // Cargar items cada vez que cambia página o se abre/cierra el diálogo
  useEffect(() => {
    getAllCommittees({
      perPage: committeeItemsPerPage,
      page: committeeCurrentPage,
      search: debouncedSearchTerm,
    }).then((response) => {
      setCommitteeItems(response.docTransparencia);
      setCommitteeCount(response.total);
    });
  }, [committeeCurrentPage, debouncedSearchTerm]);

  const committeeTotalPages = Math.ceil(committeeCount / committeeItemsPerPage);
  const paginatedCommitteeItems = committeeItems;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Comite de transparencia</CardTitle>
            <CardDescription>
              Gestiona los documentos del comite
            </CardDescription>
          </div>

          <CommitteeDialog
            isCommitteeDialogOpen={isCommitteeDialogOpen}
            setIsCommitteeDialogOpen={setIsCommitteeDialogOpen}
            setSelectedCommitteeItem={setSelectedCommitteeItem}
            selectedCommitteeItem={selectedCommitteeItem}
            setCommitteeItems={setCommitteeItems}
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
              value={committeeSearchTerm}
              onChange={(e) => {
                setCommitteeSearchTerm(e.target.value);
                setCommitteeCurrentPage(1);
              }}
              className="pl-10"
            />
          </div>
        </div>

        {/* Tabla */}
        <CommitteeTable
          paginatedCommitteeItems={paginatedCommitteeItems}
          setIsCommitteeDialogOpen={setIsCommitteeDialogOpen}
          setSelectedCommitteeItem={setSelectedCommitteeItem}
          setCommitteeItems={setCommitteeItems}
        />
        {/* Paginación */}
        <div className="flex justify-between items-center mt-4">
          <Button
            variant="outline"
            disabled={committeeCurrentPage === 1}
            onClick={() => setCommitteeCurrentPage((p) => p - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span>
            Página {committeeCurrentPage} de {committeeTotalPages}
          </span>
          <Button
            variant="outline"
            disabled={committeeCurrentPage === committeeTotalPages}
            onClick={() => setCommitteeCurrentPage((p) => p + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
