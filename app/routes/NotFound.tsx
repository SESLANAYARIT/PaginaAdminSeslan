import { NotFoundPage } from "~/features/notFound/NotFoundPage";
import type { Route } from "./+types/NotFound";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Not Found" },
    { name: "description", content: "Esta es la pagina de mensaje de error" },
  ];
}

export default function NotFound() {
  return <NotFoundPage />;
}
