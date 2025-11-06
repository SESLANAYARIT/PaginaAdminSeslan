import type { Route } from "./+types/cuentaPublica";
import { PublicAccount } from "~/features/CuentaPublica/PublicAccount";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Cuenta Publica" },
    {
      name: "description",
      content: "Esta es la pagina de Cuenta Publica",
    },
  ];
}

export default function cuentaPublica() {
  return <PublicAccount />;
}
