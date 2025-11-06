"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Calendar,
  FileText,
  Users,
  MoreHorizontal,
  Edit,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  CommitteeLabels,
  type SessionInterface,
} from "~/interfaces/sessions.interfaces";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { formattedDate } from "~/api/utils/dateToLocal";
import { deleteSession } from "~/api/Sessions/Sessions.api";
import { toast } from "sonner";

interface SessionsTableProps {
  paginatedSessionsItems: SessionInterface[];
  setIsSessionsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedSessionsItem: React.Dispatch<
    React.SetStateAction<SessionInterface | null>
  >;
  setSessionsItems: React.Dispatch<React.SetStateAction<SessionInterface[]>>;
}

export function SessionsTable({
  paginatedSessionsItems,
  setIsSessionsDialogOpen,
  setSelectedSessionsItem,
  setSessionsItems,
}: SessionsTableProps) {
  const getTotalDocuments = (session: SessionInterface) => {
    return (
      session.acuerdos.length +
      session.actas.length +
      session.documentosAdicionales.length
    );
  };

  const handleEdit = (session: SessionInterface) => {
    setSelectedSessionsItem(session);
    setIsSessionsDialogOpen(true);
  };

  const handleDelete = async (sessionId: string) => {
    await deleteSession(sessionId);
    toast.success("Sesion eliminada");
    const updatedSessionsItems = paginatedSessionsItems.filter(
      (session) => session.id !== sessionId
    );
    setSessionsItems(updatedSessionsItems);
    
  };

  if (paginatedSessionsItems.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">
          No hay sesiones registradas con estos filtros
        </h3>
        <p className="text-muted-foreground">
          Comienza agregando tu primera sesión usando el botón "Agregar Sesión"
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold">Sesión</TableHead>
            <TableHead className="font-semibold">Comité</TableHead>
            <TableHead className="font-semibold">Fecha</TableHead>
            <TableHead className="font-semibold">Documentos</TableHead>
            <TableHead className="font-semibold">Estado</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedSessionsItems.map((session) => (
            <TableRow key={session.id} className="hover:bg-muted/50">
              <TableCell>
                <div className="font-medium text-foreground">
                  {session.name}
                </div>
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">
                    {CommitteeLabels[session.committee]}
                  </span>
                </div>
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">
                    {formattedDate(session.date)}
                  </span>
                </div>
              </TableCell>

              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {session.acuerdos.length > 0 && (
                    <Badge
                      variant="secondary"
                      className="text-xs bg-blue-100 text-blue-800 hover:bg-blue-200"
                    >
                      {session.acuerdos.length} Acuerdo
                      {session.acuerdos.length !== 1 ? "s" : ""}
                    </Badge>
                  )}
                  {session.actas.length > 0 && (
                    <Badge
                      variant="secondary"
                      className="text-xs bg-green-100 text-green-800 hover:bg-green-200"
                    >
                      {session.actas.length} Acta
                      {session.actas.length !== 1 ? "s" : ""}
                    </Badge>
                  )}
                  {session.documentosAdicionales.length > 0 && (
                    <Badge
                      variant="secondary"
                      className="text-xs bg-purple-100 text-purple-800 hover:bg-purple-200"
                    >
                      {session.documentosAdicionales.length} Adicional
                      {session.documentosAdicionales.length !== 1 ? "es" : ""}
                    </Badge>
                  )}
                  {getTotalDocuments(session) === 0 && (
                    <Badge
                      variant="outline"
                      className="text-xs text-muted-foreground"
                    >
                      Sin documentos
                    </Badge>
                  )}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Total: {getTotalDocuments(session)} documento
                  {getTotalDocuments(session) !== 1 ? "s" : ""}
                </div>
              </TableCell>

              <TableCell>
                <Badge
                  variant={
                    getTotalDocuments(session) > 0 ? "default" : "outline"
                  }
                  className={
                    getTotalDocuments(session) > 0
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "border-orange-300 text-orange-600"
                  }
                >
                  {getTotalDocuments(session) > 0 ? "Completa" : "Pendiente"}
                </Badge>
              </TableCell>

              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Abrir menú</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[160px]">
                    <DropdownMenuItem
                      onClick={() => handleEdit(session)}
                      className="cursor-pointer"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </DropdownMenuItem>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onSelect={(e) => {
                            e.preventDefault(); // Previene que el dropdown se cierre
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Eliminar
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            ¿Eliminar elemento?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            ¿Está seguro que desea eliminar este elemento? Esta
                            acción no se puede deshacer.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(session.id)}
                            className="bg-red-600"
                          >
                            Eliminar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
