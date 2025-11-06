"use client";

import type * as React from "react";
import {
  BarChart3,
  Building2,
  FileText,
  Home,
  MessageSquare,
  Settings,
  Shield,
  Database,
  ChevronRight,
  Gavel,
  Files,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "~/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { useAuth } from "~/context/AuthContext";
import { Link } from "react-router";

// Datos del menú principal
const data = {
  // user: {
  //   name: "Admin Institucional",
  //   email: "admin@institucion.edu",
  //   avatar: "/placeholder.svg?height=32&width=32",
  // },
  navMain: [
    {
      title: "Home",
      url: "/home",
      icon: Home,
      isActive: true,
      items: [
        {
          title: "Pagina principal",
          url: "/dashboard/paginaPrincipal",
        },
      ],
    },
    {
      title: "Publicaciones",
      url: "/dashboard/publicaciones",
      icon: FileText,
      items: [
        {
          title: "Noticias",
          url: "/dashboard/publicaciones/noticias",
        },
        {
          title: "Convocatorias",
          url: "/dashboard/publicaciones/convocatorias",
        },
      ],
    },
    {
      title: "Transparencia",
      url: "#",
      icon: Gavel,
      items: [
        {
          title: "Comite",
          url: "/dashboard/transparencia/comite",
        },
        {
          title: "Articulo 33",
          url: "/dashboard/transparencia/articulo33",
        },
        {
          title: "Cuenta Publica",
          url: "/dashboard/transparencia/cuentaPublica",
        },
        {
          title: "Sevac",
          url: "/dashboard/transparencia/sevac",
        },
      ],
    },
    {
      title: "Documentos",
      url: "#",
      icon: Files,
      items: [
        {
          title: "Documentos Generales",
          url: "/dashboard/documentos/documentoSimple",
        },
        {
          title: "Sesiones",
          url: "/dashboard/documentos/sessions",
        },
        {
          title: "Normatividad",
          url: "/dashboard/documentos/normatividad",
        },
      ],
    },
  ],
  navSecondary: [],
  // [
    
  //   {
  //     title: "Reportes",
  //     url: "#",
  //     icon: BarChart3,
  //     items: [
  //       {
  //         title: "Estadísticas Web",
  //         url: "#",
  //       },
  //       {
  //         title: "Reportes de Usuario",
  //         url: "#",
  //       },
  //       {
  //         title: "Análisis de Contenido",
  //         url: "#",
  //       },
  //     ],
  //   },
  //   {
  //     title: "Recursos",
  //     url: "#",
  //     icon: Database,
  //     items: [
  //       {
  //         title: "Biblioteca Digital",
  //         url: "#",
  //       },
  //       {
  //         title: "Documentos",
  //         url: "#",
  //       },
  //       {
  //         title: "Multimedia",
  //         url: "#",
  //       },
  //     ],
  //   },
  //   {
  //     title: "Configuración",
  //     url: "#",
  //     icon: Settings,
  //     items: [
  //       {
  //         title: "General",
  //         url: "#",
  //       },
  //       {
  //         title: "Seguridad",
  //         url: "#",
  //       },
  //       {
  //         title: "Integraciones",
  //         url: "#",
  //       },
  //       {
  //         title: "Respaldos",
  //         url: "#",
  //       },
  //     ],
  //   },
  // ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, logout } = useAuth();
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/dashboard/home">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Building2 className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">SESLAN</span>
                  <span className="truncate text-xs">
                    Sistema de Gestión de Contenido
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Gestión Principal</SidebarGroupLabel>
          <SidebarMenu>
            {data.navMain.map((item) => (
              <Collapsible
                key={item.title}
                asChild
                defaultOpen={item.isActive}
                className="group/collapsible cursor-pointer"
              >
                <SidebarMenuItem className="cursor-pointer">
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                      {item.items && (
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      )}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  {item.items?.length ? (
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton asChild>
                              <Link to={subItem.url}>
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  ) : null}
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel>Herramientas Avanzadas</SidebarGroupLabel>
          <SidebarMenu>
            {data.navSecondary.map((item) => (
              <Collapsible
                key={item.title}
                asChild
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <a href={subItem.url}>
                              <span>{subItem.title}</span>
                            </a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage
                      src={"/placeholder.svg"}
                      alt={user?.fullname}
                    />
                    <AvatarFallback className="rounded-lg">AI</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {user?.fullname || "Admin Institucional"}
                    </span>
                    <span className="truncate text-xs">{user?.email}</span>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem className="hover:bg-gray-200 rounded-full hover:p-1 cursor-pointer transition">
                  <Settings className="mr-2 h-4 w-4 " />
                  Configuración
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="hover:bg-gray-200 rounded-full hover:p-1 cursor-pointer transition"
                  onClick={() => logout()}
                >
                  <Shield className="mr-2 h-4 w-4" />
                  Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
