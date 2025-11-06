import { Normativity } from "~/features/Normatividad/normativity";
import type { Route } from "./+types/normatividad";


export function meta({}: Route.MetaArgs) {
  return [
    { title: "Normatividad" },
    {
      name: "description",
      content: "Esta es la pagina de documentos de normatividad",
    },
  ];
}

export default function normatividad() {
  return <Normativity />;
}
