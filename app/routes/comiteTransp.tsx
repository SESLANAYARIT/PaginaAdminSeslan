
import { ComiteTransparencia } from "~/features/Transparencia/Comite/Comite";
import type { Route } from "./+types/comiteTransp";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Comite de Transparencia" },
    {
      name: "description",
      content: "Esta es la pagina de comite de transparencia",
    },
  ];
}

export default function comiteTransp() {
  return <ComiteTransparencia />;
}
