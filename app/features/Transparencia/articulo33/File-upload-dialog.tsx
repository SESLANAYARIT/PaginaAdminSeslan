import { zodResolver } from "@hookform/resolvers/zod";
import { DialogDescription } from "@radix-ui/react-dialog";
import { File, Upload } from "lucide-react";
import React, { useRef, useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createFile } from "~/api/Article33/files.api";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Label } from "~/components/ui/label";
import type { Section } from "~/interfaces/Article33/types/article33.types";

import {
  fileUploaArticulo33Schema,
  type FileUploadFormArticulo33,
} from "~/schemas/fileUploadArticulo33.schema";

interface FileUploadDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDataPoint: {
    sectionId: string;
    year: number;
    period: string;
  } | null;
  setIsUploadFileOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedDataPoint: React.Dispatch<
    React.SetStateAction<{
      sectionId: string;
      year: number;
      period: string;
    } | null>
  >;
  sections: Section[];
  setSections: React.Dispatch<React.SetStateAction<Section[]>>;
}

export function FileUploadDialog({
  isOpen,
  onOpenChange,
  selectedDataPoint,
  setIsUploadFileOpen,
  setSelectedDataPoint,
  sections,
  setSections,
}: FileUploadDialogProps) {
  const defaultValues: FileUploadFormArticulo33 = {
    file: "" as unknown as File,
  };

  const {
    handleSubmit,
    setValue,
    watch,
    reset,
    clearErrors,
    trigger,
    formState: { errors },
  } = useForm<FileUploadFormArticulo33>({
    resolver: zodResolver(fileUploaArticulo33Schema),
    defaultValues,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const watchedFile = watch("file");

  // Preview del archivo
  const preview = useMemo(() => {
    if (!watchedFile) return null;
    const name = watchedFile.name;
    const isPdf = name.toLowerCase().endsWith(".pdf");
    const isExcel =
      name.toLowerCase().endsWith(".xlsx") ||
      name.toLowerCase().endsWith(".xls");
    return { name, type: isPdf ? "pdf" : isExcel ? "excel" : "other" };
  }, [watchedFile]);

  // Manejo de selección de archivo
  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = async (
    e
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("file", file, { shouldDirty: true, shouldTouch: true });
      clearErrors("file");
      await trigger("file");
    }
  };

  const handleFileSubmit = async (data: FileUploadFormArticulo33) => {
    if (!selectedDataPoint) return;
    const formData = new FormData();
    formData.append("file", data.file);
    const queryParams = {
      sectionId: selectedDataPoint.sectionId,
      year: selectedDataPoint.year,
      period: selectedDataPoint.period,
    };
    const res = await createFile(queryParams, formData);
    try {
      if (!selectedDataPoint) return;
      const updateDataPoint = (data: (typeof sections)[0]["data"]) =>
        data.map((dp) =>
          dp.year === selectedDataPoint.year &&
          dp.period === selectedDataPoint.period
            ? { ...dp, file: res }
            : dp
        );

      const updatedSections = sections.map((section) => {
        if (section.id === selectedDataPoint.sectionId) {
          return { ...section, data: updateDataPoint(section.data) };
        }

        if (section.subsections) {
          return {
            ...section,
            subsections: section.subsections.map((sub) =>
              sub.id === selectedDataPoint.sectionId
                ? { ...sub, data: updateDataPoint(sub.data) }
                : sub
            ),
          };
        }
        return section;
      });

      setSections(updatedSections);
      toast.success("Archivo subido correctamente");
      setIsUploadFileOpen(false);
      setSelectedDataPoint(null);
      reset(defaultValues);
      onOpenChange(false);
    } catch (err) {
      toast.error("Error al subir el archivo");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-6 rounded-2xl shadow-lg">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-lg font-semibold">
            Subir Archivo
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Selecciona o arrastra el archivo que deseas subir. Solo se permiten{" "}
            <span className="font-medium">.pdf, .xlsx o .xls</span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFileSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label className="block text-sm font-medium">Archivo</Label>

            {/* Zona de Drag & Drop */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
                e.currentTarget.classList.add("border-blue-500", "bg-blue-50");
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                e.stopPropagation();
                e.currentTarget.classList.remove(
                  "border-blue-500",
                  "bg-blue-50"
                );
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                e.currentTarget.classList.remove(
                  "border-blue-500",
                  "bg-blue-50"
                );
                const file = e.dataTransfer.files?.[0];
                if (file) {
                  setValue("file", file, {
                    shouldDirty: true,
                    shouldTouch: true,
                  });
                  clearErrors("file");
                  trigger("file");
                }
              }}
              className="w-full p-6 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer transition-colors"
            >
              <p className="text-sm text-gray-500">
                Arrastra y suelta tu archivo aquí
              </p>

              <Button
                type="button"
                variant="outline"
                className="mt-3 flex items-center justify-center w-full"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                {watchedFile ? "Cambiar archivo" : "Seleccionar archivo"}
              </Button>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".xlsx,.xls,.pdf"
              />
            </div>

            {/* Vista previa */}
            {preview && (
              <div className="flex items-center gap-3 mt-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
                {preview.type === "pdf" && (
                  <File className="w-6 h-6 text-red-600" />
                )}
                {preview.type === "excel" && (
                  <File className="w-6 h-6 text-green-600" />
                )}
                <span className="text-sm font-medium truncate">
                  {preview.name}
                </span>
              </div>
            )}

            {/* Errores */}
            {errors.file && typeof errors.file.message === "string" && (
              <p className="text-red-600 text-sm mt-1">{errors.file.message}</p>
            )}
          </div>

          <DialogFooter className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset(defaultValues);
                onOpenChange(false);
              }}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={!watchedFile || !!errors.file}>
              Subir
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
