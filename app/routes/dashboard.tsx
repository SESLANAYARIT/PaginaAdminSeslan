import { Navigate, Outlet } from "react-router";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar";
import { useAuth } from "~/context/AuthContext";
import { AppSidebar } from "~/features/sidebar/Sidebar";
import { Separator } from "~/components/ui/separator";
import type { Route } from "./+types/dashboard";
import { useEffect } from "react";
import { useLoading } from "~/context/LoadingContext";
import Loader from "~/features/Loader/Loader";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dashboard" },
    { name: "description", content: "Esta es la pagina de dashboard" },
  ];
}

export default function Dashboard() {
  const { isAuthenticated } = useAuth();
  const { loading } = useLoading();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          {loading && <Loader />}
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
