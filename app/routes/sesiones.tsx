import { Sessions } from "~/features/Sesiones/Sessions";
import type { Route } from "./+types/sesiones";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Sesiones" },
    { name: "description", content: "Esta es la pagina de sesiones" },
  ];
}

export default function sesiones() {
  return <Sessions />;
}
