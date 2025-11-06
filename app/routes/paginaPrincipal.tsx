import PaginaPrincipal from "~/features/paginaPrincipal/PaginaPrincipal";
import type { Route } from "./+types/paginaPrincipal";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Principal" },
    {
      name: "description",
      content: "Esta es la pagina de dashboard de la pagina principal",
    },
  ];
}

export default function Principal() {
  return <PaginaPrincipal />;
}
