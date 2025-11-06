
import { Noticias } from "~/features/Publicaciones/Noticias/Noticias";
import type { Route } from "./+types/noticias";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Noticias" },
    { name: "description", content: "Esta es la pagina de noticias" },
  ];
}

export default function noticias() {
  return <Noticias />;
}
