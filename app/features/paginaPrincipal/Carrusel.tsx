import { useEffect, useState } from "react";
import { Calendar, ChevronLeft, ChevronRight, Search } from "lucide-react";

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

import {
  getAllCarrousel,
} from "~/api/Principal/carrousel.api";

import type { ItemCarrousel } from "~/interfaces/carrousel.interfaces";

import { CarruselDialog } from "./CarruselDialog";
import { CarruselTable } from "./CarruselTable";

export const Carrusel = () => {
  const [carouselItems, setCarouselItems] = useState<ItemCarrousel[]>([]);
  const [carouselCount, setCarouselCount] = useState<number>(0);
  const [selectedCarouselItem, setSelectedCarouselItem] =
    useState<ItemCarrousel | null>(null);
  const [isCarouselDialogOpen, setIsCarouselDialogOpen] = useState(false);

  // Estados para filtros y paginación del carrusel
  const [carouselSearchTerm, setCarouselSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] =
    useState(carouselSearchTerm);
  const [carouselStatusFilter, setCarouselStatusFilter] = useState("all");
  const [carouselDateFilter, setCarouselDateFilter] = useState("all");
  const [carouselCurrentPage, setCarouselCurrentPage] = useState(1);
  const carouselItemsPerPage = 10;

  // Controlar el cambio de la búsqueda
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(carouselSearchTerm);
      setCarouselCurrentPage(1); // reinicia a página 1 al cambiar búsqueda
    }, 500); // 500 ms de espera

    return () => {
      clearTimeout(handler); // limpia el timeout si el usuario sigue escribiendo
    };
  }, [carouselSearchTerm]);

  // Cargar items cada vez que cambia página o se abre/cierra el diálogo
  useEffect(() => {
    getAllCarrousel({
      perPage: carouselItemsPerPage,
      page: carouselCurrentPage,
      search: debouncedSearchTerm,
      status: carouselStatusFilter,
      dateFilter: carouselDateFilter,
    }).then((response) => {
      setCarouselItems(response.items);
      setCarouselCount(response.count);
    });
  }, [
    carouselCurrentPage,
    debouncedSearchTerm,
    carouselStatusFilter,
    carouselDateFilter,
  ]);

  const carouselTotalPages = Math.ceil(carouselCount / carouselItemsPerPage);
  const paginatedCarouselItems = carouselItems;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Elementos del Carrusel</CardTitle>
            <CardDescription>
              Gestiona las imágenes y contenido que aparecen en el carrusel
              principal
            </CardDescription>
          </div>

          <CarruselDialog
            isCarouselDialogOpen={isCarouselDialogOpen}
            setIsCarouselDialogOpen={setIsCarouselDialogOpen}
            setSelectedCarouselItem={setSelectedCarouselItem}
            selectedCarouselItem={selectedCarouselItem}
            setCarouselItems={setCarouselItems}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filtros */}
        <div className="flex flex-wrap items-center gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar en carrusel..."
              value={carouselSearchTerm}
              onChange={(e) => {
                setCarouselSearchTerm(e.target.value);
                setCarouselCurrentPage(1);
              }}
              className="pl-10"
            />
          </div>

          <Select
            value={carouselStatusFilter}
            onValueChange={(value) => {
              setCarouselStatusFilter(value);
              setCarouselCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="active">Activos</SelectItem>
              <SelectItem value="inactive">Inactivos</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={carouselDateFilter}
            onValueChange={(value) => {
              setCarouselDateFilter(value);
              setCarouselCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[140px]">
              <Calendar className="h-4 w-4 mr-2 text-blue-700" />
              <SelectValue placeholder="Vigencia" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="current">Actualmente vigentes</SelectItem>
              <SelectItem value="expired">Vencidas</SelectItem>
              <SelectItem value="upcoming">Por iniciar</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tabla */}
        <CarruselTable
          paginatedCarouselItems={paginatedCarouselItems}
          setCarouselItems={setCarouselItems}
          setIsCarouselDialogOpen={setIsCarouselDialogOpen}
          setSelectedCarouselItem={setSelectedCarouselItem}
        />

        {/* Paginación */}
        <div className="flex justify-between items-center mt-4">
          <Button
            variant="outline"
            disabled={carouselCurrentPage === 1}
            onClick={() => setCarouselCurrentPage((p) => p - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span>
            Página {carouselCurrentPage} de {carouselTotalPages}
          </span>
          <Button
            variant="outline"
            disabled={carouselCurrentPage === carouselTotalPages}
            onClick={() => setCarouselCurrentPage((p) => p + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
