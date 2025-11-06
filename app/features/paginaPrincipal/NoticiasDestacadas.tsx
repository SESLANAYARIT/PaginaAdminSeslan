import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Eye,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { useState, type SetStateAction } from "react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Carrusel } from "./Carrusel";

// Datos de ejemplo para noticias
const newsData = [
  {
    id: 1,
    title: "Lanzamiento de nueva línea de productos",
    excerpt:
      "Presentamos nuestra nueva colección primavera-verano con diseños innovadores",
    category: "Productos",
    publishDate: "2024-01-20",
    featured: true,
    status: "published",
  },
  {
    id: 2,
    title: "Expansión a nuevas ciudades",
    excerpt: "Abrimos nuevas sucursales en 5 ciudades del país",
    category: "Empresa",
    publishDate: "2024-01-18",
    featured: false,
    status: "published",
  },
  {
    id: 3,
    title: "Programa de sostenibilidad",
    excerpt: "Iniciamos nuestro compromiso con el medio ambiente",
    category: "Sostenibilidad",
    publishDate: "2024-01-15",
    featured: true,
    status: "draft",
  },
  {
    id: 4,
    title: "Nueva alianza estratégica",
    excerpt:
      "Nos asociamos con líderes del sector para ofrecer mejores servicios",
    category: "Empresa",
    publishDate: "2024-01-12",
    featured: false,
    status: "published",
  },
  {
    id: 5,
    title: "Tecnología innovadora",
    excerpt: "Implementamos IA para mejorar la experiencia del cliente",
    category: "Tecnología",
    publishDate: "2024-01-10",
    featured: true,
    status: "published",
  },
  {
    id: 6,
    title: "Premio a la excelencia",
    excerpt: "Reconocimiento por nuestro servicio al cliente",
    category: "Empresa",
    publishDate: "2024-01-08",
    featured: false,
    status: "published",
  },
  {
    id: 7,
    title: "Nuevas certificaciones",
    excerpt: "Obtenemos certificaciones internacionales de calidad",
    category: "Calidad",
    publishDate: "2024-01-05",
    featured: true,
    status: "draft",
  },
  {
    id: 8,
    title: "Campaña de responsabilidad social",
    excerpt: "Lanzamos iniciativas para apoyar a la comunidad local",
    category: "Sostenibilidad",
    publishDate: "2024-01-03",
    featured: false,
    status: "published",
  },
];
export const NoticiasDestacadas = () => {
  const [newsItems, setNewsItems] = useState(newsData);
  const [selectedNewsItems, setSelectedNewsItems] = useState([1, 3]); // IDs de noticias seleccionadas
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  // Estados para filtros y paginación de noticias
  const [newsCategoryFilter, setNewsCategoryFilter] = useState("all");
  const [newsDateFilter, setNewsDateFilter] = useState("all");
  const [newsCurrentPage, setNewsCurrentPage] = useState(1);
  const [newsItemsPerPage] = useState(5);

  const toggleNewsSelection = (newsId: number) => {
    setSelectedNewsItems((prev) =>
      prev.includes(newsId)
        ? prev.filter((id) => id !== newsId)
        : [...prev, newsId]
    );
  };
  // Filtrado y paginación de noticias mejorado
  const categories = [...new Set(newsItems.map((news) => news.category))];
  const filteredNewsItems = newsItems.filter((news) => {
    const matchesSearch =
      news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      news.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || news.status === filterStatus;
    const matchesCategory =
      newsCategoryFilter === "all" || news.category === newsCategoryFilter;

    let matchesDate = true;
    if (newsDateFilter === "today") {
      const today = new Date().toISOString().split("T")[0];
      matchesDate = news.publishDate === today;
    } else if (newsDateFilter === "week") {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      matchesDate = new Date(news.publishDate) >= weekAgo;
    } else if (newsDateFilter === "month") {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      matchesDate = new Date(news.publishDate) >= monthAgo;
    }

    return matchesSearch && matchesStatus && matchesCategory && matchesDate;
  });

  const newsTotalPages = Math.ceil(filteredNewsItems.length / newsItemsPerPage);
  const paginatedNewsItems = filteredNewsItems.slice(
    (newsCurrentPage - 1) * newsItemsPerPage,
    newsCurrentPage * newsItemsPerPage
  );
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Noticias Destacadas</CardTitle>
            <CardDescription>
              Selecciona las noticias que aparecerán como destacadas en la
              página principal
            </CardDescription>
          </div>
          <Badge variant="outline">
            {selectedNewsItems.length} seleccionadas
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filtros de Noticias Mejorados */}
        <div className="flex flex-wrap items-center gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar noticias..."
              value={searchTerm}
              onChange={(e: { target: { value: SetStateAction<string> } }) => {
                setSearchTerm(e.target.value);
                setNewsCurrentPage(1);
              }}
              className="pl-10"
            />
          </div>

          <Select
            value={filterStatus}
            onValueChange={(value: SetStateAction<string>) => {
              setFilterStatus(value);
              setNewsCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="published">Publicadas</SelectItem>
              <SelectItem value="draft">Borradores</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={newsCategoryFilter}
            onValueChange={(value: SetStateAction<string>) => {
              setNewsCategoryFilter(value);
              setNewsCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[140px]">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={newsDateFilter}
            onValueChange={(value: SetStateAction<string>) => {
              setNewsDateFilter(value);
              setNewsCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[140px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Fecha" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="today">Hoy</SelectItem>
              <SelectItem value="week">Esta semana</SelectItem>
              <SelectItem value="month">Este mes</SelectItem>
            </SelectContent>
          </Select>

          <div className="text-sm text-muted-foreground">
            {filteredNewsItems.length} noticia
            {filteredNewsItems.length !== 1 ? "s" : ""}
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">Destacar</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedNewsItems.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No se encontraron noticias
                  </TableCell>
                </TableRow>
              ) : (
                paginatedNewsItems.map((news) => (
                  <TableRow key={news.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedNewsItems.includes(news.id)}
                        onCheckedChange={() => toggleNewsSelection(news.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{news.title}</div>
                        <div className="text-sm text-muted-foreground truncate max-w-[300px]">
                          {news.excerpt}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{news.category}</Badge>
                    </TableCell>
                    <TableCell>{news.publishDate}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          news.status === "published" ? "default" : "secondary"
                        }
                      >
                        {news.status === "published" ? "Publicada" : "Borrador"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Paginación de Noticias */}
        {newsTotalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Página {newsCurrentPage} de {newsTotalPages}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setNewsCurrentPage((prev) => Math.max(prev - 1, 1))
                }
                disabled={newsCurrentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: newsTotalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <Button
                      key={page}
                      variant={page === newsCurrentPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => setNewsCurrentPage(page)}
                      className="w-8 h-8 p-0"
                    >
                      {page}
                    </Button>
                  )
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setNewsCurrentPage((prev) =>
                    Math.min(prev + 1, newsTotalPages)
                  )
                }
                disabled={newsCurrentPage === newsTotalPages}
              >
                Siguiente
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-4">
          <p className="text-sm text-muted-foreground">
            {selectedNewsItems.length} de {newsItems.length} noticias
            seleccionadas como destacadas
          </p>
          <Button>Guardar Selección</Button>
        </div>
      </CardContent>
    </Card>
  );
};
