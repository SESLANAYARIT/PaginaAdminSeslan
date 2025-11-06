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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

import {
  NewsStatus,
  type NewsInterface,
} from "~/interfaces/news.interfaces";
import { getAllNews } from "~/api/News/news.api";
import { NewsDialog } from "./NewsDialog";
import { NewsTable } from "./NewsTable";

export const Noticias = () => {
  const [newsItems, setNewsItems] = useState<NewsInterface[]>([]);
  const [newsCount, setNewsCount] = useState<number>(0);
  const [selectedNewsItem, setSelectedNewsItem] =
    useState<NewsInterface | null>(null);
  const [isNewsDialogOpen, setIsNewsDialogOpen] = useState(false);

  // Estados para filtros y paginación
  const [newsSearchTerm, setNewsSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] =
    useState(newsSearchTerm);
  const [newsStatusFilter, setNewsStatusFilter] = useState<string | undefined>(
    undefined
  );
  const [newsFeaturedFilter, setFeaturedFilter] = useState<string | undefined>(
    undefined
  );
  const [newsCurrentPage, setNewsCurrentPage] = useState(1);
  const newsItemsPerPage = 10;

  // Controlar el cambio de la búsqueda
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(newsSearchTerm);
      setNewsCurrentPage(1); // reinicia a página 1 al cambiar búsqueda
    }, 500); // 500 ms de espera

    return () => {
      clearTimeout(handler); // limpia el timeout si el usuario sigue escribiendo
    };
  }, [newsSearchTerm]);

  // Cargar items cada vez que cambia página o se abre/cierra el diálogo
  useEffect(() => {
    getAllNews({
      perPage: newsItemsPerPage,
      page: newsCurrentPage,
      search: debouncedSearchTerm,
      statusNews: newsStatusFilter as NewsStatus,
      featured: newsFeaturedFilter,
    }).then((response) => {
      setNewsItems(response.news);
      setNewsCount(response.total);
    });
  }, [newsCurrentPage, debouncedSearchTerm, newsStatusFilter, newsFeaturedFilter]);

  const newsTotalPages = Math.ceil(newsCount / newsItemsPerPage);
  const paginatedNewsItems = newsItems;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Noticias</CardTitle>
            <CardDescription>Gestiona las noticias</CardDescription>
          </div>

          <NewsDialog
            isNewsDialogOpen={isNewsDialogOpen}
            setIsNewsDialogOpen={setIsNewsDialogOpen}
            setSelectedNewsItem={setSelectedNewsItem}
            selectedNewsItem={selectedNewsItem}
            setNewsItems={setNewsItems}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filtros */}
        <div className="flex flex-wrap items-center gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar en las noticias"
              value={newsSearchTerm}
              onChange={(e) => {
                setNewsSearchTerm(e.target.value);
                setNewsCurrentPage(1);
              }}
              className="pl-10"
            />
          </div>

          <Select
            value={newsStatusFilter}
            onValueChange={(value) => {
              setNewsStatusFilter(value);
              setNewsCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todos</SelectItem>
              <SelectItem value={NewsStatus.DRAFT}>Borradores</SelectItem>
              <SelectItem value={NewsStatus.ARCHIVED}>Archivados</SelectItem>
              <SelectItem value={NewsStatus.PUBLISHED}>Publicados</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={newsFeaturedFilter}
            onValueChange={(value) => {
              setFeaturedFilter(value);
              setNewsCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Destacadas" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="true">Si</SelectItem>
              <SelectItem value="false">No</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tabla */}
        <NewsTable
          paginatedNewsItems={paginatedNewsItems}
          setIsNewsDialogOpen={setIsNewsDialogOpen}
          setSelectedNewsItem={setSelectedNewsItem}
          setNewsItems={setNewsItems}
        />
        {/* Paginación */}
        <div className="flex justify-between items-center mt-4">
          <Button
            variant="outline"
            disabled={newsCurrentPage === 1}
            onClick={() => setNewsCurrentPage((p) => p - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span>
            Página {newsCurrentPage} de {newsTotalPages}
          </span>
          <Button
            variant="outline"
            disabled={newsCurrentPage === newsTotalPages}
            onClick={() => setNewsCurrentPage((p) => p + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
