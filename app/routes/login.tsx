import { Login } from "~/features/login/Login";
import type { Route } from "./+types/login";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Login" },
    { name: "description", content: "Login de pagina administrativa" },
  ];
}



export default function login() {
  return <Login />;
}
