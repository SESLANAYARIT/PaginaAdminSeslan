import { zodResolver } from "@hookform/resolvers/zod";
import {
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@radix-ui/react-dialog";
import { Plus, Upload } from "lucide-react";
import React, { useEffect, useRef } from "react";
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
import { Textarea } from "~/components/ui/textarea";
import type {
  AnnouncementForm,
  AnnouncementFormUpdate,
  AnnouncementInterface,
} from "~/interfaces/announcement.interfaces";
import { announcementSchema } from "~/schemas/announcement.schema";
import {
  createAnnouncement,
  updateAnnouncement,
} from "~/api/announcements/announcements.api";
import { Suspense } from "react";
import PdfViewer from "~/components/ui/PdfViewer";

interface Props {
  isAnnouncementDialogOpen: boolean;
  setIsAnnouncementDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedAnnouncementItem: React.Dispatch<
    React.SetStateAction<AnnouncementInterface | null>
  >;
  selectedAnnouncementItem: AnnouncementInterface | null;
  setAnnouncementItems: React.Dispatch<
    React.SetStateAction<AnnouncementInterface[]>
  >;
}

export const AnnouncementDialog = ({
  isAnnouncementDialogOpen,
  setIsAnnouncementDialogOpen,
  setSelectedAnnouncementItem,
  selectedAnnouncementItem,
  setAnnouncementItems,
}: Props) => {
  const defaultValues: AnnouncementForm = {
    title: "",
    description: "",
    date: "",
    file: "",
  };

  const {
    register,
    reset,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AnnouncementForm>({
    resolver: zodResolver(announcementSchema),
    mode: "onBlur",
    defaultValues,
  });

  useEffect(() => {
    if (selectedAnnouncementItem) {
      const { date, ...rest } = selectedAnnouncementItem;
      reset({
        date: selectedAnnouncementItem.date.split("T")[0],
        ...rest,
      });
    } else {
      reset(defaultValues);
    }
  }, [selectedAnnouncementItem, reset]);

  const handleAnnouncementSubmit = async (formDataInf: AnnouncementForm) => {
    if (selectedAnnouncementItem) {
      const { file, ...rest } = formDataInf;
      let payload: AnnouncementFormUpdate;
      if (file instanceof File || file instanceof Blob) {
        payload = { ...rest, file };
      } else {
        payload = rest;
      }
      const response = await updateAnnouncement(
        selectedAnnouncementItem.id,
        payload
      );
      setAnnouncementItems((items) =>
        items.map((item) => (item.id === response.id ? response : item))
      );
    } else {
      const response = await createAnnouncement(formDataInf);

      setAnnouncementItems((items) => {
        return [...items, response];
      });
    }
    setIsAnnouncementDialogOpen(false);
    setSelectedAnnouncementItem(null);
    reset(defaultValues);
  };

  const onError = (errors: any) => {
    if (errors.file) toast.error("El archivo debe ser una imagen o PDF");
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleImageClick = () => fileInputRef.current?.click();
  const watchedFile = watch("file");

  let isPdf = false;
  if (watchedFile instanceof File || watchedFile instanceof Blob) {
    isPdf = watchedFile.type === "application/pdf";
  } else if (typeof watchedFile === "string") {
    isPdf = watchedFile.toLowerCase().endsWith(".pdf");
  }
  const previewSrc =
    watchedFile instanceof File
      ? URL.createObjectURL(watchedFile)
      : typeof watchedFile === "string" && watchedFile.length > 0
        ? `${import.meta.env.VITE_BACKEND_BASE_URL}/files/s3/${watchedFile}`
        : selectedAnnouncementItem?.file || "";

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (file) setValue("file", file, { shouldDirty: true, shouldTouch: true });
  };

  return (
    <Dialog
      open={isAnnouncementDialogOpen}
      onOpenChange={setIsAnnouncementDialogOpen}
    >
      <DialogTrigger asChild>
        <Button
          onClick={() => {
            setSelectedAnnouncementItem(null);
            reset(defaultValues);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Agregar Convocatoria
        </Button>
      </DialogTrigger>

      <DialogPortal>
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1000]" />
        <DialogContent className="fixed top-1/2 left-1/2 z-[1001] w-full max-w-3xl -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-xl overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {selectedAnnouncementItem
                ? "Editar Convocatoria"
                : "Nueva Convocatoria"}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Completa la información para la convocatoria
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={handleSubmit(handleAnnouncementSubmit, onError)}
            className="mt-6 space-y-6"
          >
            {/* Título y extracto */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title" className="font-medium text-gray-700">
                  Título
                </Label>
                <Input
                  id="title"
                  {...register("title")}
                  placeholder="Título de la convocatoria"
                  className="focus:ring-2 focus:ring-blue-500"
                  required
                />
                {errors.title && (
                  <p className="text-red-500 text-sm">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="description"
                  className="font-medium text-gray-700"
                >
                  Descripción
                </Label>
                <Textarea
                  id="description"
                  {...register("description")}
                  placeholder="Breve resumen de la convocatoria"
                  rows={2}
                  className="focus:ring-2 focus:ring-blue-500"
                />
                {errors.description && (
                  <p className="text-red-500 text-sm">
                    {errors.description.message}
                  </p>
                )}
              </div>
            </div>

            {/* Fecha */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label
                  htmlFor="publishDate"
                  className="font-medium text-gray-700"
                >
                  Fecha de la convocatoria
                </Label>
                <Input
                  id="publishDate"
                  type="date"
                  {...register("date")}
                  className="focus:ring-2 focus:ring-blue-500"
                />
                {errors.date && (
                  <p className="text-red-500 text-sm">{errors.date.message}</p>
                )}
              </div>
              {/* Imagen o PDF */}
              <div className="space-y-2">
                <Label className="font-medium text-gray-700">
                  Documento o imagen
                </Label>
                {previewSrc &&
                  (isPdf ? (
                    <Suspense fallback={<p>Cargando visor...</p>}>
                      <PdfViewer
                        fileUrl={previewSrc}
                        classname="h-40 w-full rounded-md border cursor-pointer shadow-sm"
                      />
                    </Suspense>
                  ) : (
                    <img
                      src={previewSrc}
                      alt="Vista previa"
                      className="h-40 w-full object-cover rounded-md border cursor-pointer shadow-sm"
                      onClick={handleImageClick}
                    />
                  ))}
                {errors.file && (
                  <p className="text-red-500 text-sm">{errors.file.message}</p>
                )}
                <div className="flex gap-2">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleImageClick}
                    className="flex items-center"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {watchedFile ? "Cambiar archivo" : "Subir archivo"}
                  </Button>
                </div>
              </div>
            </div>

            {/* Botones */}
            <DialogFooter className="flex justify-end gap-3 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsAnnouncementDialogOpen(false);
                  setSelectedAnnouncementItem(null);
                  reset(defaultValues);
                }}
              >
                Cancelar
              </Button>
              <Button type="submit">
                {selectedAnnouncementItem ? "Actualizar" : "Crear"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};
