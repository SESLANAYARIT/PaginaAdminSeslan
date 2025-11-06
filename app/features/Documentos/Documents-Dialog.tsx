import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Upload } from "lucide-react";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { createDocument, updateDocument } from "~/api/documents/documents.api";
import { getUrlS3 } from "~/api/files";
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
  Area,
  AreaLabels,
  Topico,
  TopicoLabels,
  type DocumentForm,
  type DocumentInterface,
} from "~/interfaces/documents/document.interfaces";
import {
  createDocumentSchema,
  updateDocumentSchema,
} from "~/schemas/document.schema";

// Configuración de tópicos por área
const AREA_TOPICOS: Record<Area, Topico[]> = {
  [Area.CC]: [Topico.CONVENIO, Topico.SLF, Topico.PP, Topico.INFORMES],
  [Area.OG]: [Topico.INFORMES],
  [Area.CE]: [Topico.INFORMES],
  [Area.SEIP]: [Topico.INFORMES, Topico.PP],
  [Area.CET]: [Topico.NORMAS],
  [Area.CON]: [Topico.CONVENIO, Topico.CC],
};

interface Props {
  isDocumentDialogOpen: boolean;
  setIsDocumentDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedDocumentItem: React.Dispatch<
    React.SetStateAction<DocumentInterface | null>
  >;
  selectedDocumentItem: DocumentInterface | null;
  setDocumentItems: React.Dispatch<React.SetStateAction<DocumentInterface[]>>;
}
/*!NOTA: Este componente se penso en principio en dejar vistas previas de los documentos pero al final se cambio por un link para verlos directamente en la pagina donde estan los documentos* */
export const DocumentsDialog = ({
  isDocumentDialogOpen,
  setIsDocumentDialogOpen,
  setSelectedDocumentItem,
  selectedDocumentItem,
  setDocumentItems,
}: Props) => {
  const defaultValues: DocumentForm = {
    title: "",
    description: "",
    documentDate: "",
    area: "",
    topico: "",
    active: true,
    file: null,
  };

  const {
    register,
    reset,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<DocumentForm>({
    resolver: zodResolver(
      selectedDocumentItem ? updateDocumentSchema : createDocumentSchema
    ),
    mode: "onBlur",
    defaultValues,
  });

  // Estado para los selectores anidados
  const [selectedArea, setSelectedArea] = useState<Area | "">("");
  const [availableTopicos, setAvailableTopicos] = useState<Topico[]>([]);

  // Estado para vista previa
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  // Observar cambios en area para actualizar topico
  const watchedArea = watch("area");

  useEffect(() => {
    if (watchedArea && Object.values(Area).includes(watchedArea as Area)) {
      const area = watchedArea as Area;
      setSelectedArea(area);
      setAvailableTopicos(AREA_TOPICOS[area].slice());

      const currentTopico = watch("topico");
      if (!AREA_TOPICOS[area].includes(currentTopico as Topico)) {
        setValue("topico", "");
      }
    } else {
      setSelectedArea("");
      setAvailableTopicos([]);
      setValue("topico", "");
    }
  }, [watchedArea, setValue, watch]);

  useEffect(() => {
    if (selectedDocumentItem) {
      reset({
        title: selectedDocumentItem.title,
        description: selectedDocumentItem.description,
        documentDate: selectedDocumentItem.documentDate.split("T")[0],
        area: selectedDocumentItem.area || "",
        topico: selectedDocumentItem.topico || "",
        active: selectedDocumentItem.active ?? true,
        file: null,
      });

      if (
        selectedDocumentItem.fileData?.url &&
        selectedDocumentItem.fileData.type === "application/pdf"
      ) {
        setPreviewUrl(
          `${import.meta.env.VITE_BACKEND_BASE_URL}/files/s3/${selectedDocumentItem.fileData.url}`
        );
      } else {
        setPreviewUrl(null);
      }

      // Configurar área y tópicos
      if (selectedDocumentItem.area) {
        setSelectedArea(selectedDocumentItem.area);
        if (selectedDocumentItem.area in AREA_TOPICOS) {
          setAvailableTopicos(AREA_TOPICOS[selectedDocumentItem.area].slice());
        }
      }
    } else {
      reset(defaultValues);
      setSelectedArea("");
      setAvailableTopicos([]);
      setPreviewUrl(null);
    }
  }, [selectedDocumentItem, reset]);

  const handleDocumentSubmit = async (formDataInf: DocumentForm) => {
    if (selectedDocumentItem) {
      const response = await updateDocument(
        selectedDocumentItem.id,
        formDataInf
      );
      toast.success(`El documento ${response.title} ha sido actualizado`);
      setDocumentItems((items) =>
        items.map((item) => (item.id === response.id ? response : item))
      );
    } else {
      const response = await createDocument(formDataInf);
      toast.success(
        `El documento ${response.title} ha sido creado en el area ${response.area}`
      );
      setDocumentItems((items) => [response, ...items]);
    }
    setIsDocumentDialogOpen(false);
    setSelectedDocumentItem(null);
    reset(defaultValues);
    setSelectedArea("");
    setAvailableTopicos([]);
  };

  const onError = (errors: any) => {
    if (errors.file) {
      if (selectedDocumentItem) {
        toast.error("Error con el archivo seleccionado");
      } else {
        toast.error("Debe seleccionar un archivo");
      }
    }
    if (errors.area) toast.error("Debe seleccionar un área");
    if (errors.topico) toast.error("Debe seleccionar un tópico");
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
    } else if (selectedDocumentItem?.fileData) {
      return {
        name: selectedDocumentItem.fileData.name,
        size: selectedDocumentItem.fileData.size,
        type: selectedDocumentItem.fileData.type,
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
      open={isDocumentDialogOpen}
      onOpenChange={(open) => {
        setIsDocumentDialogOpen(open);
        if (!open) {
          setSelectedArea("");
          setAvailableTopicos([]);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          onClick={() => {
            setSelectedDocumentItem(null);
            reset(defaultValues);
            setSelectedArea("");
            setAvailableTopicos([]);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Agregar Documento
        </Button>
      </DialogTrigger>

      <DialogPortal>
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1000]" />
        <DialogContent className="fixed top-1/2 left-1/2 z-[1001] w-full max-w-3xl -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-xl overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {selectedDocumentItem ? "Editar Documento" : "Nuevo Documento"}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Completa la información para el documento
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={handleSubmit(handleDocumentSubmit, onError)}
            className="mt-6 space-y-6"
          >
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title" className="font-medium text-gray-700">
                  Título del documento
                </Label>
                <Input
                  id="title"
                  {...register("title")}
                  placeholder="Título del documento"
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
                Descripción del documento
              </Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Breve descripción del contenido del documento"
                rows={3}
                className="focus:ring-2 focus:ring-blue-500"
              />
              {errors.description && (
                <p className="text-red-500 text-sm">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Fecha del documento */}
            <div className="space-y-2">
              <Label
                htmlFor="documentDate"
                className="font-medium text-gray-700"
              >
                Fecha del documento
              </Label>
              <Input
                id="documentDate"
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

            {/* Selectores de Área y Tópico */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="area" className="font-medium text-gray-700">
                  Área
                </Label>
                <select
                  id="area"
                  {...register("area")}
                  className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Seleccionar área</option>
                  {Object.values(Area).map((area) => (
                    <option key={area} value={area}>
                      {AreaLabels[area]}
                    </option>
                  ))}
                </select>
                {errors.area && (
                  <p className="text-red-500 text-sm">{errors.area.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="topico" className="font-medium text-gray-700">
                  Tópico
                </Label>
                <select
                  id="topico"
                  {...register("topico")}
                  className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  disabled={!selectedArea}
                  required
                >
                  <option value="">
                    {selectedArea
                      ? "Seleccionar tópico"
                      : "Primero selecciona un área"}
                  </option>
                  {availableTopicos.map((topico) => (
                    <option key={topico} value={topico}>
                      {TopicoLabels[topico]}
                    </option>
                  ))}
                </select>
                {errors.topico && (
                  <p className="text-red-500 text-sm">
                    {errors.topico.message}
                  </p>
                )}
              </div>
            </div>

            {/* Subida de archivo */}
            <div className="space-y-2">
              <Label className="font-medium text-gray-700">
                Archivo del documento
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
                      {selectedDocumentItem?.fileData?.uploadDate && (
                        <p className="text-xs text-gray-500">
                          Subido:{" "}
                          {new Date(
                            selectedDocumentItem.fileData.uploadDate
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
                  {selectedDocumentItem?.fileData?.url && (
                    <a
                      onClick={(e) =>
                        onFileClick(e, selectedDocumentItem.fileData!.url!)
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
                  accept=".pdf,.doc,.docx,.txt,.xlsx,.xls"
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
                  <Switch
                    id="active"
                    checked={!!field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Label htmlFor="active" className="text-gray-700">
                Documento activo
              </Label>
            </div>

            {/* Botones */}
            <DialogFooter className="flex justify-end gap-3 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsDocumentDialogOpen(false);
                  setSelectedDocumentItem(null);
                  reset(defaultValues);
                  setSelectedArea("");
                  setAvailableTopicos([]);
                }}
              >
                Cancelar
              </Button>
              <Button type="submit">
                {selectedDocumentItem ? "Actualizar" : "Crear"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};
