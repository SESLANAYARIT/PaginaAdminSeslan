import { Sevac } from "~/features/Sevac/Sevac";
import type { Route } from "./+types/sevac";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Sevac" },
    {
      name: "description",
      content: "Esta es la pagina de Sevac",
    },
  ];
}

export default function cuentaPublica() {
  return <Sevac />;
}
