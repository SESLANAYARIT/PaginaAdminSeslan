import { type RouteConfig, index } from "@react-router/dev/routes";

export default [
  {
    path: "/",
    file: "routes/login.tsx",
    index: true,
  },
  {
    path: "/dashboard",
    file: "routes/dashboard.tsx", // Aquí va el layout
    children: [
      {
        path: "/dashboard/home",
        index: true,
        file: "routes/bienvenida.tsx",
      },
      {
        path: "/dashboard/paginaPrincipal",
        file: "routes/paginaPrincipal.tsx",
      },
      {
        path: "/dashboard/publicaciones/noticias",
        file: "routes/noticias.tsx",
      },
      {
        path: "/dashboard/publicaciones/convocatorias",
        file: "routes/convocatorias.tsx",
      },
      {
        path: "/dashboard/transparencia/comite",
        file: "routes/comiteTransp.tsx",
      },
      {
        path: "/dashboard/transparencia/articulo33",
        file: "routes/articulo33.tsx",
      },
      {
        path: "/dashboard/transparencia/cuentaPublica",
        file: "routes/cuentaPublica.tsx",
      },
      {
        path: "/dashboard/transparencia/sevac",
        file: "routes/sevac.tsx",
      },
      {
        path: "/dashboard/documentos/documentoSimple",
        file: "routes/documentos.tsx",
      },
      {
         path: "/dashboard/documentos/sessions",
        file: "routes/sesiones.tsx",
      },
      {
        path: "/dashboard/documentos/normatividad",
        file: "routes/normatividad.tsx",
      },
    ],
  },

  {
    path: "*",
    file: "routes/NotFound.tsx",
  },
] satisfies RouteConfig;
