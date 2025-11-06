import type { Route } from "./+types/login";
import { Bienvenida } from "~/features/Bienvenida/Bienvenida";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Bienvenida" },
    { name: "description", content: "Esta es la pagina de bienvenida" },
  ];
}

export default function Home() {
  return <Bienvenida />;
}
