import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Upload } from "lucide-react";
import React, { Suspense, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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
import { Textarea } from "~/components/ui/textarea";
import {
  updateCommittee,
  createCommittee,
} from "~/api/Committee/committee.api";
import type {
  Committee,
  CommitteeForm,
  CommitteeFormUpdate,
} from "~/interfaces/committe.interface";
import { committeeSchema } from "~/schemas/committee.schema";
import PdfViewer from "~/components/ui/PdfViewer";

interface Props {
  isCommitteeDialogOpen: boolean;
  setIsCommitteeDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedCommitteeItem: React.Dispatch<
    React.SetStateAction<Committee | null>
  >;
  selectedCommitteeItem: Committee | null;
  setCommitteeItems: React.Dispatch<React.SetStateAction<Committee[]>>;
}

export const CommitteeDialog = ({
  isCommitteeDialogOpen,
  setIsCommitteeDialogOpen,
  setSelectedCommitteeItem,
  selectedCommitteeItem,
  setCommitteeItems,
}: Props) => {
  const defaultValues: CommitteeForm = {
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
  } = useForm<CommitteeForm>({
    resolver: zodResolver(committeeSchema),
    mode: "onBlur",
    defaultValues,
  });

  useEffect(() => {
    if (selectedCommitteeItem) {
      const { date, ...rest } = selectedCommitteeItem;
      reset({
        date: selectedCommitteeItem.date.split("T")[0],
        ...rest,
      });
    } else {
      reset(defaultValues);
    }
  }, [selectedCommitteeItem, reset]);

  const handleCommitteeSubmit = async (formDataInf: CommitteeForm) => {
    if (selectedCommitteeItem) {
      const { file, ...rest } = formDataInf;
      let payload: CommitteeFormUpdate;
      if (file instanceof File || file instanceof Blob) {
        payload = { ...rest, file };
      } else {
        payload = rest;
      }
      const response = await updateCommittee(selectedCommitteeItem.id, payload);
      setCommitteeItems((items) =>
        items.map((item) => (item.id === response.id ? response : item))
      );
    } else {
      const response = await createCommittee(formDataInf);

      setCommitteeItems((items) => {
        return [...items, response];
      });
    }
    setIsCommitteeDialogOpen(false);
    setSelectedCommitteeItem(null);
    reset(defaultValues);
  };

  const onError = (errors: any) => {
    if (errors.file) toast.error("El archivo debe ser un PDF");
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleImageClick = () => fileInputRef.current?.click();
  const watchedFile = watch("file");

  const previewSrc =
    watchedFile instanceof File
      ? URL.createObjectURL(watchedFile)
      : typeof watchedFile === "string" && watchedFile.length > 0
        ? `${import.meta.env.VITE_BACKEND_BASE_URL}/files/s3/${watchedFile}`
        : selectedCommitteeItem?.file || "";

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (file) setValue("file", file, { shouldDirty: true, shouldTouch: true });
  };

  return (
    <Dialog
      open={isCommitteeDialogOpen}
      onOpenChange={setIsCommitteeDialogOpen}
    >
      <DialogTrigger asChild>
        <Button
          onClick={() => {
            setSelectedCommitteeItem(null);
            reset(defaultValues);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Agregar archivo de comite
        </Button>
      </DialogTrigger>

      <DialogPortal>
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1000]" />
        <DialogContent className="fixed top-1/2 left-1/2 z-[1001] w-full max-w-3xl -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-xl overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {selectedCommitteeItem ? "Editar documento" : "Nuevo documento"}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Completa la información
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={handleSubmit(handleCommitteeSubmit, onError)}
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
                  placeholder="Título del documento"
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
                  placeholder="Breve resumen del documento"
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
                  Fecha del documento
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
              {/* PDF */}
              <div className="space-y-2">
                <Label className="font-medium text-gray-700">Documento</Label>
                {previewSrc && (
                  <Suspense fallback={<p>Cargando visor...</p>}>
                    <PdfViewer
                      fileUrl={previewSrc}
                      classname="h-40 w-full rounded-md border cursor-pointer shadow-sm"
                    />
                  </Suspense>
                )}
                {errors.file && (
                  <p className="text-red-500 text-sm">{errors.file.message}</p>
                )}
                <div className="flex gap-2">
                  <input
                    type="file"
                    accept="application/pdf"
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
                  setIsCommitteeDialogOpen(false);
                  setSelectedCommitteeItem(null);
                  reset(defaultValues);
                }}
              >
                Cancelar
              </Button>
              <Button type="submit">
                {selectedCommitteeItem ? "Actualizar" : "Crear"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};
