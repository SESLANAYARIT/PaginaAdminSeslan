import type { Route } from "./+types/documentos";
import { Documentos } from "~/features/Documentos/Documentos";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Documentos" },
    { name: "description", content: "Esta es la pagina de documentos" },
  ];
}

export default function documentos() {
  return <Documentos />;
}
