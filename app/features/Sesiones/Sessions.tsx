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

import { Checkbox } from "~/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { CommitteeLabels, type CommitteeType, type SessionInterface } from "~/interfaces/sessions.interfaces";
import { SessionDialog } from "./Sessions-Dialog";
import { getAllSessions } from "~/api/Sessions/Sessions.api";
import { SessionsTable } from "./Session-Table";

export const Sessions = () => {
  const [sessionsItems, setSessionsItems] = useState<SessionInterface[]>([]);
  const [sessionsCount, setSessionsCount] = useState<number>(0);
  const [selectedSessionsItem, setSelectedSessionsItem] =
    useState<SessionInterface | null>(null);
  const [isSessionsDialogOpen, setIsSessionsDialogOpen] = useState(false);

  // Estados para filtros y paginación
  const [sessionsSearchTerm, setSessionsSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] =
    useState(sessionsSearchTerm);
  const [sessionsCurrentPage, setSessionsCurrentPage] = useState(1);
  const sessionsItemsPerPage = 10;
  const [sessionsCommitteeFilter, setSessionsCommitteeFilter] = useState<
    CommitteeType[]
  >([]);

  // Controlar el cambio de la búsqueda
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(sessionsSearchTerm);
      setSessionsCurrentPage(1); // reinicia a página 1 al cambiar búsqueda
    }, 500); // 500 ms de espera

    return () => {
      clearTimeout(handler); // limpia el timeout si el usuario sigue escribiendo
    };
  }, [sessionsSearchTerm]);

  // Cargar items cada vez que cambia página o se abre/cierra el diálogo
  useEffect(() => {
    getAllSessions({
      perPage: sessionsItemsPerPage,
      page: sessionsCurrentPage,
      search: debouncedSearchTerm,
      committee: sessionsCommitteeFilter,
    }).then((response) => {
      setSessionsItems(response.sessions);
      setSessionsCount(response.total);
    });
  }, [sessionsCurrentPage, debouncedSearchTerm, sessionsCommitteeFilter]);

  const sessionsTotalPages = Math.ceil(sessionsCount / sessionsItemsPerPage);
  const paginatedSessionsItems = sessionsItems;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Sesiones</CardTitle>
            <CardDescription>Gestiona las sesiones de comités</CardDescription>
          </div>

          <SessionDialog
            isSessionDialogOpen={isSessionsDialogOpen}
            setIsSessionDialogOpen={setIsSessionsDialogOpen}
            setSelectedSessionItem={setSelectedSessionsItem}
            selectedSessionItem={selectedSessionsItem}
            setSessionItems={setSessionsItems}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filtros */}
        <div className="flex flex-wrap items-center gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar en las sesiones"
              value={sessionsSearchTerm}
              onChange={(e) => {
                setSessionsSearchTerm(e.target.value);
                setSessionsCurrentPage(1);
              }}
              className="pl-10"
            />
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 rounded-2xl shadow-sm"
              >
                <span className="font-medium">Filtrar Comités</span>
                <span className="text-xs text-muted-foreground">
                  ({sessionsCommitteeFilter.length})
                </span>
              </Button>
            </PopoverTrigger>

            <PopoverContent
              className="w-72 p-4 rounded-2xl shadow-lg border bg-white"
              align="start"
            >
              <div className="mb-3">
                <h4 className="text-sm font-semibold text-gray-700">
                  Selecciona comités
                </h4>
                <p className="text-xs text-gray-500">
                  Marca uno o varios para filtrar las sesiones
                </p>
              </div>

              <div className="max-h-60 overflow-y-auto pr-1 space-y-2">
                {Object.entries(CommitteeLabels).map(([key, label]) => (
                  <div
                    key={key}
                    className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-gray-50"
                  >
                    <Checkbox
                      checked={sessionsCommitteeFilter.includes(
                        key as CommitteeType
                      )}
                      onCheckedChange={(checked) => {
                        setSessionsCurrentPage(1);
                        setSessionsCommitteeFilter((prev) =>
                          checked
                            ? [...prev, key as CommitteeType]
                            : prev.filter((c) => c !== key)
                        );
                      }}
                    />
                    <span className="text-sm">{label}</span>
                  </div>
                ))}
              </div>

              <div className="mt-3 flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSessionsCommitteeFilter([])}
                  className="text-xs text-red-500 hover:text-red-600"
                >
                  Limpiar
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Tabla */}
        <SessionsTable
          paginatedSessionsItems={paginatedSessionsItems}
          setIsSessionsDialogOpen={setIsSessionsDialogOpen}
          setSelectedSessionsItem={setSelectedSessionsItem}
          setSessionsItems={setSessionsItems}
        />
        {/* Paginación */}
        <div className="flex justify-between items-center mt-4">
          <Button
            variant="outline"
            disabled={sessionsCurrentPage === 1}
            onClick={() => setSessionsCurrentPage((p) => p - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span>
            Página {sessionsCurrentPage} de {sessionsTotalPages}
          </span>
          <Button
            variant="outline"
            disabled={sessionsCurrentPage === sessionsTotalPages}
            onClick={() => setSessionsCurrentPage((p) => p + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
