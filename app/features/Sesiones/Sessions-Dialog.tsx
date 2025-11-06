import { zodResolver } from "@hookform/resolvers/zod";
import {
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@radix-ui/react-dialog";
import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogPortal,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  CommitteeLabels,
  CommitteeType,
  type FileData,
  type SessionForm,
  type SessionInterface,
} from "~/interfaces/sessions.interfaces";
import { sessionSchema } from "~/schemas/session.schema";
import { FileUpload } from "./Session-FileUpload";
import { createSession, updateSession } from "~/api/Sessions/Sessions.api";

interface Props {
  isSessionDialogOpen: boolean;
  setIsSessionDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedSessionItem: React.Dispatch<
    React.SetStateAction<SessionInterface | null>
  >;
  selectedSessionItem: SessionInterface | null;
  setSessionItems: React.Dispatch<React.SetStateAction<SessionInterface[]>>;
}

export const SessionDialog = ({
  isSessionDialogOpen,
  setIsSessionDialogOpen,
  setSelectedSessionItem,
  selectedSessionItem,
  setSessionItems,
}: Props) => {
  const defaultValues: SessionForm = {
    name: "",
    date: "",
    committee: CommitteeType.CC,
    acuerdos: [],
    actas: [],
    documentosAdicionales: [],
  };

  const {
    register,
    reset,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SessionForm>({
    resolver: zodResolver(sessionSchema),
    mode: "onBlur",
    defaultValues,
  });

  // Estados para manejo de archivos
  const [acuerdos, setAcuerdos] = useState<FileData[]>([]);
  const [actas, setActas] = useState<FileData[]>([]);
  const [documentosAdicionales, setDocumentosAdicionales] = useState<
    FileData[]
  >([]);
  const [deletedFileIds, setDeletedFileIds] = useState<string[]>([]);

  // Actualizar formulario cuando cambian los archivos
  useEffect(() => {
    setValue("acuerdos", acuerdos);
    setValue("actas", actas);
    setValue("documentosAdicionales", documentosAdicionales);
  }, [acuerdos, actas, documentosAdicionales, setValue]);

  // Cargar datos cuando se selecciona una sesión para editar
  useEffect(() => {
    if (selectedSessionItem) {
      const { date, ...rest } = selectedSessionItem;
      reset({
        date: selectedSessionItem.date.split("T")[0],
        ...rest,
      });
      setAcuerdos(selectedSessionItem.acuerdos || []);
      setActas(selectedSessionItem.actas || []);
      setDocumentosAdicionales(selectedSessionItem.documentosAdicionales || []);
    } else {
      reset(defaultValues);
      setAcuerdos([]);
      setActas([]);
      setDocumentosAdicionales([]);
    }
  }, [selectedSessionItem, reset]);

  const handleSessionSubmit = async (formDataInf: SessionForm) => {
    const { acuerdos, actas, documentosAdicionales, ...rest } = formDataInf;

    const formData = new FormData();

    Object.entries(rest).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    if (acuerdos?.length) {
      acuerdos.forEach((a) => {
        if (a.file) formData.append("acuerdos", a.file);
      });
    }

    if (actas?.length) {
      actas.forEach((a) => {
        if (a.file) formData.append("actas", a.file);
      });
    }

    if (documentosAdicionales?.length) {
      documentosAdicionales.forEach((d) => {
        if (d.file) formData.append("documentosAdicionales", d.file);
      });
    }

    try {
      if (selectedSessionItem) {
        deletedFileIds.forEach((id) => {
          formData.append("ids", id);
        })
        const response = await updateSession(selectedSessionItem.id, formData);
        setSessionItems((items) =>
          items.map((item) => (item.id === response.id ? response : item))
        );
        toast.success("Sesión actualizada correctamente");
      } else {
        const response = await createSession(formData);
        setSessionItems((items) => [...items, response]);
        toast.success("Sesión creada correctamente");
      }

      setIsSessionDialogOpen(false);
      setSelectedSessionItem(null);
      reset(defaultValues);
      setAcuerdos([]);
      setActas([]);
      setDocumentosAdicionales([]);
      setDeletedFileIds([]);
    } catch (error) {
      toast.error("Error al procesar la sesión");
    }
  };

  const onError = (errors: any) => {
    if (errors.name) toast.error("El nombre de la sesión es requerido");
    if (errors.date) toast.error("La fecha de la sesión es requerida");
    if (errors.committee) toast.error("Debe seleccionar un comité");
  };

  return (
    <Dialog
      open={isSessionDialogOpen}
      onOpenChange={(open) => {
        setIsSessionDialogOpen(open);
        if (!open) {
          setAcuerdos(selectedSessionItem?.acuerdos || []);
          setActas(selectedSessionItem?.actas || []);
          setDocumentosAdicionales(
            selectedSessionItem?.documentosAdicionales || []
          );
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          onClick={() => {
            setSelectedSessionItem(null);
            reset(defaultValues);
            setAcuerdos([]);
            setActas([]);
            setDocumentosAdicionales([]);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Agregar Sesión
        </Button>
      </DialogTrigger>

      <DialogPortal>
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1000]" />
        <DialogContent className="fixed top-1/2 left-1/2 z-[1001] w-full max-w-4xl -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-xl overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {selectedSessionItem ? "Editar Sesión" : "Nueva Sesión"}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Completa la información para la sesión y adjunta los documentos
              correspondientes
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={handleSubmit(handleSessionSubmit, onError)}
            className="mt-6 space-y-6"
          >
            {/* Información básica */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name" className="font-medium text-gray-700">
                  Nombre de la Sesión
                </Label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="Ej: Sesión Ordinaria Enero 2024"
                  className="focus:ring-2 focus:ring-blue-500"
                  required
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="date" className="font-medium text-gray-700">
                  Fecha de Sesión
                </Label>
                <Input
                  id="date"
                  type="date"
                  {...register("date")}
                  className="focus:ring-2 focus:ring-blue-500"
                  required
                />
                {errors.date && (
                  <p className="text-red-500 text-sm">{errors.date.message}</p>
                )}
              </div>
            </div>

            {/* Comité */}
            <div className="space-y-2">
              <Label htmlFor="committee" className="font-medium text-gray-700">
                Comité
              </Label>
              <select
                id="committee"
                {...register("committee")}
                className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              >
                {Object.entries(CommitteeLabels).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
              {errors.committee && (
                <p className="text-red-500 text-sm">
                  {errors.committee.message}
                </p>
              )}
            </div>

            {/* Secciones de archivos */}
            <div className="space-y-6">
              <FileUpload
                files={acuerdos}
                onFilesChange={setAcuerdos}
                 setDeletedFileIds={setDeletedFileIds}
                label="Acuerdos"
                accept=".pdf"
              />

              <FileUpload
                files={actas}
                onFilesChange={setActas}
                setDeletedFileIds={setDeletedFileIds}
                label="Actas"
                accept=".pdf"
              />

              <FileUpload
                files={documentosAdicionales}
                onFilesChange={setDocumentosAdicionales}
                 setDeletedFileIds={setDeletedFileIds}
                label="Documentos Adicionales"
              />
            </div>

            {/* Botones */}
            <DialogFooter className="flex justify-end gap-3 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsSessionDialogOpen(false);
                  setSelectedSessionItem(null);
                  reset(defaultValues);
                  setAcuerdos([]);
                  setActas([]);
                  setDocumentosAdicionales([]);
                  setDeletedFileIds([]);
                }}
              >
                Cancelar
              </Button>
              <Button type="submit">
                {selectedSessionItem ? "Actualizar" : "Crear"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};
