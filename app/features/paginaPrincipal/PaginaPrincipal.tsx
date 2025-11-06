import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Carrusel } from "./Carrusel";
import { NoticiasDestacadas } from "./NoticiasDestacadas";

export default function PaginaPrincipal() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Contenido</h1>
          <p className="text-muted-foreground">
            Administra el carrusel y las noticias destacadas
          </p>
        </div>
      </div>
      <Carrusel />
 {/* 
      <Tabs defaultValue="carousel" className="space-y-6">
        <TabsList>
          <TabsTrigger value="carousel">Carrusel</TabsTrigger>
        </TabsList>

        {/* Gestión del Carrusel }
        <TabsContent value="carousel" className="space-y-6">
          <Carrusel />
        </TabsContent>

       Gestión de Noticias Destacadas
        <TabsContent value="news" className="space-y-6">
          <NoticiasDestacadas />
        </TabsContent>
      
       
      </Tabs>
      */}
    </div>
  );
}
