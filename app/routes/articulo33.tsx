import type { Route } from "./+types/articulo33";
import { Article33 } from "../features/Transparencia/articulo33/Articulo33";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Articulo 33" },
    {
      name: "description",
      content: "Esta es la pagina de articulo 33",
    },
  ];
}

export default function articulo33() {
  return <Article33 />;
}
