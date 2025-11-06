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

import {
  Area,
  AreaLabels,
  Topico,
  TopicoLabels,
  type DocumentInterface,
} from "~/interfaces/documents/document.interfaces";
import { getAllDocuments } from "~/api/documents/documents.api";
import { DocumentsDialog } from "./Documents-Dialog";
import { DocumentsTable } from "./Documents-table";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

export const Documentos = () => {
  const [documentsItems, setDocumentsItems] = useState<DocumentInterface[]>([]);
  const [documentsCount, setDocumentsCount] = useState<number>(0);
  const [selectedDocumentsItem, setSelectedDocumentsItem] =
    useState<DocumentInterface | null>(null);
  const [isDocumentsDialogOpen, setIsDocumentsDialogOpen] = useState(false);

  // Estados para filtros y paginación
  const [documentsSearchTerm, setDocumentsSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] =
    useState(documentsSearchTerm);
  const [documentsCurrentPage, setDocumentsCurrentPage] = useState(1);
  const documentsItemsPerPage = 10;
  const [documentsAreaFilter, setDocumentsAreaFilter] = useState<Area[]>([]);
    const [documentsTopicoFilter, setDocumentsTopicoFilter] = useState<Topico[]>([]);

  // Controlar el cambio de la búsqueda
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(documentsSearchTerm);
      setDocumentsCurrentPage(1); // reinicia a página 1 al cambiar búsqueda
    }, 500); // 500 ms de espera

    return () => {
      clearTimeout(handler); // limpia el timeout si el usuario sigue escribiendo
    };
  }, [documentsSearchTerm]);

  // Cargar items cada vez que cambia página o se abre/cierra el diálogo
  useEffect(() => {
    getAllDocuments({
      perPage: documentsItemsPerPage,
      page: documentsCurrentPage,
      search: debouncedSearchTerm,
      area: documentsAreaFilter,
      topico: documentsTopicoFilter,
    }).then((response) => {
      setDocumentsItems(response.documents);
      setDocumentsCount(response.total);
    });
  }, [documentsCurrentPage, debouncedSearchTerm, documentsAreaFilter,documentsTopicoFilter]);

  const documentsTotalPages = Math.ceil(documentsCount / documentsItemsPerPage);
  const paginatedDocumentsItems = documentsItems;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Documentos</CardTitle>
            <CardDescription>Gestiona las documentos</CardDescription>
          </div>

          <DocumentsDialog
            isDocumentDialogOpen={isDocumentsDialogOpen}
            setIsDocumentDialogOpen={setIsDocumentsDialogOpen}
            setSelectedDocumentItem={setSelectedDocumentsItem}
            selectedDocumentItem={selectedDocumentsItem}
            setDocumentItems={setDocumentsItems}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filtros */}
        <div className="flex flex-wrap items-center gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar en las documentos"
              value={documentsSearchTerm}
              onChange={(e) => {
                setDocumentsSearchTerm(e.target.value);
                setDocumentsCurrentPage(1);
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
                <span className="font-medium">Filtrar Áreas</span>
                <span className="text-xs text-muted-foreground">
                  ({documentsAreaFilter.length})
                </span>
              </Button>
            </PopoverTrigger>

            <PopoverContent
              className="w-72 p-4 rounded-2xl shadow-lg border bg-white"
              align="start"
            >
              <div className="mb-3">
                <h4 className="text-sm font-semibold text-gray-700">
                  Selecciona áreas
                </h4>
                <p className="text-xs text-gray-500">
                  Marca una o varias para filtrar los documentos
                </p>
              </div>

              <div className="max-h-60 overflow-y-auto pr-1 space-y-2">
                {Object.values(Area).map((area) => (
                  <div
                    key={area}
                    className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-gray-50"
                  >
                    <Checkbox
                      checked={documentsAreaFilter.includes(area)}
                      onCheckedChange={(checked) => {
                        setDocumentsCurrentPage(1);
                        setDocumentsAreaFilter((prev) =>
                          checked
                            ? [...prev, area]
                            : prev.filter((a) => a !== area)
                        );
                      }}
                    />
                    <span className="text-sm">{AreaLabels[area]}</span>
                  </div>
                ))}
              </div>

              <div className="mt-3 flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDocumentsAreaFilter([])}
                  className="text-xs text-red-500 hover:text-red-600"
                >
                  Limpiar
                </Button>
              </div>
            </PopoverContent>
          </Popover>
           <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 rounded-2xl shadow-sm"
              >
                <span className="font-medium">Filtrar Tópicos</span>
                <span className="text-xs text-muted-foreground">
                  ({documentsTopicoFilter.length})
                </span>
              </Button>
            </PopoverTrigger>

            <PopoverContent
              className="w-72 p-4 rounded-2xl shadow-lg border bg-white"
              align="start"
            >
              <div className="mb-3">
                <h4 className="text-sm font-semibold text-gray-700">
                  Selecciona tópicos
                </h4>
                <p className="text-xs text-gray-500">
                  Marca uno o varios para filtrar los documentos
                </p>
              </div>

              <div className="max-h-60 overflow-y-auto pr-1 space-y-2">
                {Object.values(Topico).map((topico) => (
                  <div
                    key={topico}
                    className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-gray-50"
                  >
                    <Checkbox
                      checked={documentsTopicoFilter.includes(topico)}
                      onCheckedChange={(checked) => {
                        setDocumentsCurrentPage(1);
                        setDocumentsTopicoFilter((prev) =>
                          checked
                            ? [...prev, topico]
                            : prev.filter((a) => a !== topico)
                        );
                      }}
                    />
                    <span className="text-sm">{TopicoLabels[topico]}</span>
                  </div>
                ))}
              </div>

              <div className="mt-3 flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDocumentsTopicoFilter([])}
                  className="text-xs text-red-500 hover:text-red-600"
                >
                  Limpiar
                </Button>
              </div>
            </PopoverContent>
          </Popover>

        </div>

        {/* Tabla */}
        <DocumentsTable
          paginatedDocumentsItems={paginatedDocumentsItems}
          setIsDocumentsDialogOpen={setIsDocumentsDialogOpen}
          setSelectedDocumentsItem={setSelectedDocumentsItem}
          setDocumentsItems={setDocumentsItems}
        />
        {/* Paginación */}
        <div className="flex justify-between items-center mt-4">
          <Button
            variant="outline"
            disabled={documentsCurrentPage === 1}
            onClick={() => setDocumentsCurrentPage((p) => p - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span>
            Página {documentsCurrentPage} de {documentsTotalPages}
          </span>
          <Button
            variant="outline"
            disabled={documentsCurrentPage === documentsTotalPages}
            onClick={() => setDocumentsCurrentPage((p) => p + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
