import type { Route } from "./+types/convocatorias";
import { Convocatorias } from "~/features/Publicaciones/Convocatorias/Convocatorias";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "convocatorias" },
    { name: "description", content: "Esta es la pagina de convocatorias" },
  ];
}

export default function convocatorias() {
  return <Convocatorias />;
}
