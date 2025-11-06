import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Upload } from "lucide-react";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { getUrlS3 } from "~/api/files";
import { createNormativity, updateNormativity } from "~/api/Normativity/normativity.api";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import PdfViewer from "~/components/ui/PdfViewer";
import { Switch } from "~/components/ui/switch";
import { Textarea } from "~/components/ui/textarea";
import {
  TipoNormatividad,
  TipoNormatividadLabels,
  type NormativityInterface,
} from "~/interfaces/normativity.interfaces";
import {
  createNormativitySchema,
  updateNormativitySchema,
  type NormativityForm,
} from "~/schemas/normativity.schema";

interface Props {
  isNormativityDialogOpen: boolean;
  setIsNormativityDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedNormativityItem: React.Dispatch<
    React.SetStateAction<NormativityInterface | null>
  >;
  selectedNormativityItem: NormativityInterface | null;
  setNormativityItems: React.Dispatch<
    React.SetStateAction<NormativityInterface[]>
  >;
}

export const NormativityDialog = ({
  isNormativityDialogOpen,
  setIsNormativityDialogOpen,
  setSelectedNormativityItem,
  selectedNormativityItem,
  setNormativityItems,
}: Props) => {
  const defaultValues: NormativityForm = {
    title: "",
    description: "",
    documentDate: "",
    tipoNormatividad: "",
    active: true,
    file: null,
  };

  const isUpdate = !!selectedNormativityItem;

  const {
    register,
    handleSubmit,
    watch,
    reset,
    control,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(
      isUpdate ? updateNormativitySchema : createNormativitySchema
    ),
    mode: "onBlur",
    defaultValues,
  });

  // Estado para vista previa
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (selectedNormativityItem) {
      reset({
        title: selectedNormativityItem.title,
        description: selectedNormativityItem.description,
        documentDate: selectedNormativityItem.documentDate.split("T")[0],
        tipoNormatividad: selectedNormativityItem.tipoNormatividad || "",
        active: selectedNormativityItem.active ?? true,
        file: null,
      });

      if (
        selectedNormativityItem.fileData?.url &&
        selectedNormativityItem.fileData.type === "application/pdf"
      ) {
        setPreviewUrl(
          `${import.meta.env.VITE_BACKEND_BASE_URL}/files/s3/${selectedNormativityItem.fileData.url}`
        );
      } else {
        setPreviewUrl(null);
      }
    } else {
      reset(defaultValues);
      setPreviewUrl(null);
    }
  }, [selectedNormativityItem, reset]);

  const handleNormativitySubmit = async (formDataInf: NormativityForm) => {
    if (selectedNormativityItem) {
      const response = await updateNormativity(
        selectedNormativityItem.id,
        formDataInf
      );
      toast.success(`La normatividad ${response.title} ha sido actualizado`);
      setNormativityItems((items) =>
        items.map((item) => (item.id === response.id ? response : item))
      );
    } else {
      const response = await createNormativity(formDataInf);
      toast.success(
        `El documento ${response.title} ha sido creado como normatividad ${TipoNormatividadLabels[response.tipoNormatividad as TipoNormatividad]}`
      );
      setNormativityItems((items) => [response, ...items]);
    }
    setIsNormativityDialogOpen(false);
    setSelectedNormativityItem(null);
    reset(defaultValues);
  };

  const onError = (errors: any) => {
    if (errors.file) {
      if (selectedNormativityItem) {
        toast.error("Error con el archivo seleccionado");
      } else {
        toast.error("Debe seleccionar un archivo");
      }
    }
    if (errors.tipoNormatividad)
      toast.error("Debe seleccionar un tipo de normatividad");
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleFileClick = () => fileInputRef.current?.click();

  const onFileClick = async (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    path: string
  ) => {
    e.stopPropagation();
    const a = document.createElement("a");
    a.href = await getUrlS3(path);
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("file", file, { shouldDirty: true, shouldTouch: true });
      // Crear vista previa si es PDF
      if (file.type === "application/pdf") {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else {
        setPreviewUrl(null);
      }
    }
  };

  // Función para obtener información del archivo actual
  const getCurrentFileInfo = () => {
    const file = watch("file");
    if (file instanceof File) {
      return {
        name: file.name,
        size: file.size,
        type: file.type,
      };
    } else if (selectedNormativityItem?.fileData) {
      return {
        name: selectedNormativityItem.fileData.name,
        size: selectedNormativityItem.fileData.size,
        type: selectedNormativityItem.fileData.type,
      };
    }
    return null;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <Dialog
      open={isNormativityDialogOpen}
      onOpenChange={(open) => {
        setIsNormativityDialogOpen(open);
      }}
    >
      <DialogTrigger asChild>
        <Button
          onClick={() => {
            setSelectedNormativityItem(null);
            reset(defaultValues);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Agregar Normatividad
        </Button>
      </DialogTrigger>

      <DialogPortal>
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1000]" />
        <DialogContent className="fixed top-1/2 left-1/2 z-[1001] w-full max-w-3xl -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-xl overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {selectedNormativityItem
                ? "Editar Normatividad"
                : "Nueva Normatividad"}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Completa la información para el documento de normatividad
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={handleSubmit(handleNormativitySubmit, onError)}
            className="mt-6 space-y-6"
          >
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title" className="font-medium text-gray-700">
                  Título de la normativa
                </Label>
                <Input
                  id="title"
                  {...register("title")}
                  placeholder="Título de la normativa"
                  className="focus:ring-2 focus:ring-blue-500"
                  required
                />
                {errors.title && (
                  <p className="text-red-500 text-sm">{errors.title.message}</p>
                )}
              </div>
            </div>

            {/* Descripción */}
            <div className="space-y-2">
              <Label
                htmlFor="description"
                className="font-medium text-gray-700"
              >
                Descripción de la normativa
              </Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Breve descripción del contenido de la normativa"
                rows={3}
                className="focus:ring-2 focus:ring-blue-500"
              />
              {errors.description && (
                <p className="text-red-500 text-sm">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Fecha de la Normativa */}
            <div className="space-y-2">
              <Label
                htmlFor="normativityDate"
                className="font-medium text-gray-700"
              >
                Fecha de la normativa
              </Label>
              <Input
                id="normativityDate"
                type="date"
                {...register("documentDate")}
                className="focus:ring-2 focus:ring-blue-500"
                required
              />
              {errors.documentDate && (
                <p className="text-red-500 text-sm">
                  {errors.documentDate.message}
                </p>
              )}
            </div>

            {/* Selector de Tipo de Normatividad */}
            <div className="space-y-2">
              <Label
                htmlFor="tipoNormatividad"
                className="font-medium text-gray-700"
              >
                Tipo de Normatividad
              </Label>
              <select
                id="tipoNormatividad"
                {...register("tipoNormatividad")}
                className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Seleccionar tipo de normatividad</option>
                {Object.values(TipoNormatividad).map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {TipoNormatividadLabels[tipo]}
                  </option>
                ))}
              </select>
              {errors.tipoNormatividad && (
                <p className="text-red-500 text-sm">
                  {errors.tipoNormatividad.message}
                </p>
              )}
            </div>

            {/* Subida de archivo */}
            <div className="space-y-2">
              <Label className="font-medium text-gray-700">
                Archivo de la normativa
              </Label>

              {/* Mostrar información del archivo actual */}
              {getCurrentFileInfo() && (
                <div className="p-3 bg-gray-50 rounded-md border">
                  <div className="flex justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-700">
                        {getCurrentFileInfo()?.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {getCurrentFileInfo()?.type} •{" "}
                        {formatFileSize(getCurrentFileInfo()?.size || 0)}
                      </p>
                      {selectedNormativityItem?.fileData?.uploadDate && (
                        <p className="text-xs text-gray-500">
                          Subido:{" "}
                          {new Date(
                            selectedNormativityItem.fileData.uploadDate
                          ).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    {previewUrl && (
                      <Suspense fallback={<p>Cargando visor...</p>}>
                        <PdfViewer
                          fileUrl={previewUrl}
                          classname="flex-2 h-40 w-full rounded-md border cursor-pointer shadow-sm"
                        />
                      </Suspense>
                    )}
                  </div>
                  {selectedNormativityItem?.fileData?.url && (
                    <a
                      onClick={(e) =>
                        onFileClick(e, selectedNormativityItem.fileData!.url!)
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm cursor-pointer"
                    >
                      Ver archivo actual
                    </a>
                  )}
                </div>
              )}

              <div className="flex gap-2">
                <input
                  type="file"
                  accept=".pdf"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleFileClick}
                  className="flex items-center"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {getCurrentFileInfo() ? "Cambiar archivo" : "Subir archivo"}
                </Button>
              </div>
              {errors.file && (
                <p className="text-red-500 text-sm">{errors.file.message}</p>
              )}
            </div>

            {/* Switch de activo */}
            <div className="flex items-center gap-2">
              <Controller
                control={control}
                name="active"
                render={({ field }) => (
                  <>
                    <Switch
                      id="active"
                      checked={!!field.value}
                      onCheckedChange={field.onChange}
                    />
                    <Label htmlFor="active" className="text-gray-700">
                      {field.value ? "Activo" : "Inactivo"}
                    </Label>
                  </>
                )}
              />
            </div>

            {/* Botones */}
            <DialogFooter className="flex justify-end gap-3 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsNormativityDialogOpen(false);
                  setSelectedNormativityItem(null);
                  reset(defaultValues);
                }}
              >
                Cancelar
              </Button>
              <Button type="submit">
                {selectedNormativityItem ? "Actualizar" : "Crear"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};
