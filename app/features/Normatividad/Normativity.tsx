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
import {
  TipoNormatividad,
  TipoNormatividadLabels,
  type NormativityInterface,
  type NormativitySearchParams,
} from "~/interfaces/normativity.interfaces";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { NormativityDialog } from "./Normativity-Dialog";
import { NormativityTable } from "./Normativity-Table";
import { getAllNormativities } from "~/api/Normativity/normativity.api";

export const Normativity = () => {
  const [normativitysItems, setNormativitysItems] = useState<
    NormativityInterface[]
  >([]);
  const [normativitysCount, setNormativitysCount] = useState<number>(0);
  const [selectedNormativitysItem, setSelectedNormativitysItem] =
    useState<NormativityInterface | null>(null);
  const [isNormativitysDialogOpen, setIsNormativitysDialogOpen] =
    useState(false);

  // Estados para filtros y paginación
  const [normativitysSearchTerm, setNormativitysSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(
    normativitysSearchTerm
  );
  const [normativitysCurrentPage, setNormativitysCurrentPage] = useState(1);
  const normativitysItemsPerPage = 10;
  const [normativitysNormatividadFilter, setNormativitysNormatividadFilter] =
    useState<TipoNormatividad[]>([]);

  // Controlar el cambio de la búsqueda
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(normativitysSearchTerm);
      setNormativitysCurrentPage(1); // reinicia a página 1 al cambiar búsqueda
    }, 500); // 500 ms de espera

    return () => {
      clearTimeout(handler); // limpia el timeout si el usuario sigue escribiendo
    };
  }, [normativitysSearchTerm]);

  //Cargar items cada vez que cambia página o se abre/cierra el diálogo
  useEffect(() => {
    const searchParams: NormativitySearchParams = {
      perPage: normativitysItemsPerPage,
      page: normativitysCurrentPage,
      search: debouncedSearchTerm,
      tipoNormatividad: normativitysNormatividadFilter,
    };

    getAllNormativities(searchParams).then((response) => {
      setNormativitysItems(response.normativities);
      setNormativitysCount(response.total);
    });
  }, [
    normativitysCurrentPage,
    debouncedSearchTerm,
    normativitysNormatividadFilter,
  ]);

  const normativitysTotalPages = Math.ceil(
    normativitysCount / normativitysItemsPerPage
  );
  const paginatedNormativitysItems = normativitysItems;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Documentos de Normatividad</CardTitle>
            <CardDescription>
              Gestiona los documentos normativos
            </CardDescription>
          </div>

          <NormativityDialog
            isNormativityDialogOpen={isNormativitysDialogOpen}
            setIsNormativityDialogOpen={setIsNormativitysDialogOpen}
            setSelectedNormativityItem={setSelectedNormativitysItem}
            selectedNormativityItem={selectedNormativitysItem}
            setNormativityItems={setNormativitysItems}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filtros */}
        <div className="flex flex-wrap items-center gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar en los documentos normativos"
              value={normativitysSearchTerm}
              onChange={(e) => {
                setNormativitysSearchTerm(e.target.value);
                setNormativitysCurrentPage(1);
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
                <span className="font-medium">Filtrar Normatividad</span>
                <span className="text-xs text-muted-foreground">
                  ({normativitysNormatividadFilter.length})
                </span>
              </Button>
            </PopoverTrigger>

            <PopoverContent
              className="w-72 p-4 rounded-2xl shadow-lg border bg-white"
              align="start"
            >
              <div className="mb-3">
                <h4 className="text-sm font-semibold text-gray-700">
                  Selecciona tipos de normatividad
                </h4>
                <p className="text-xs text-gray-500">
                  Marca uno o varios para filtrar las normativas
                </p>
              </div>

              <div className="max-h-60 overflow-y-auto pr-1 space-y-2">
                {Object.values(TipoNormatividad).map((tipo) => (
                  <div
                    key={tipo}
                    className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-gray-50"
                  >
                    <Checkbox
                      checked={normativitysNormatividadFilter.includes(tipo)}
                      onCheckedChange={(checked) => {
                        setNormativitysCurrentPage(1);
                        setNormativitysNormatividadFilter((prev) =>
                          checked
                            ? [...prev, tipo]
                            : prev.filter((t) => t !== tipo)
                        );
                      }}
                    />
                    <span className="text-sm">
                      {TipoNormatividadLabels[tipo]}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-3 flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setNormativitysNormatividadFilter([])}
                  className="text-xs text-red-500 hover:text-red-600"
                >
                  Limpiar
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Tabla */}
        <NormativityTable
          paginatedNormativitysItems={paginatedNormativitysItems}
          setIsNormativitysDialogOpen={setIsNormativitysDialogOpen}
          setSelectedNormativitysItem={setSelectedNormativitysItem}
          setNormativitysItems={setNormativitysItems}
        />
        {/* Paginación */}
        <div className="flex justify-between items-center mt-4">
          <Button
            variant="outline"
            disabled={normativitysCurrentPage === 1}
            onClick={() => setNormativitysCurrentPage((p) => p - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span>
            Página {normativitysCurrentPage} de {normativitysTotalPages}
          </span>
          <Button
            variant="outline"
            disabled={normativitysCurrentPage === normativitysTotalPages}
            onClick={() => setNormativitysCurrentPage((p) => p + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
