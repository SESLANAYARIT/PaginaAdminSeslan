import { zodResolver } from "@hookform/resolvers/zod";
import {
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@radix-ui/react-dialog";
import { Plus, Upload } from "lucide-react";
import React, { useEffect, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  createCarrousel,
  updateCarrousel,
} from "~/api/Principal/carrousel.api";
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
import { Switch } from "~/components/ui/switch";
import { Textarea } from "~/components/ui/textarea";
import type {
  CarrouselForm,
  ItemCarrousel,
} from "~/interfaces/carrousel.interfaces";
import { carrouselSchema } from "~/schemas/carrousel.schema";

interface Props {
  isCarouselDialogOpen: boolean;
  setIsCarouselDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedCarouselItem: React.Dispatch<
    React.SetStateAction<ItemCarrousel | null>
  >;
  selectedCarouselItem: ItemCarrousel | null;
  setCarouselItems: React.Dispatch<React.SetStateAction<ItemCarrousel[]>>;
}

export const CarruselDialog = ({
  isCarouselDialogOpen,
  setIsCarouselDialogOpen,
  setSelectedCarouselItem,
  selectedCarouselItem,
  setCarouselItems,
}: Props) => {
  const defaultValues: CarrouselForm = {
    title: "",
    description: "",
    file: "" as unknown as File | string,
    link: "",
    active: true,
    order: 1,
    startDate: "",
    endDate: "",
  };

  const {
    register,
    reset,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CarrouselForm>({
    resolver: zodResolver(carrouselSchema),
    mode: "onBlur",
    defaultValues,
  });
  // Cuando cambia el item seleccionado para editar, resetea el formulario
  useEffect(() => {
    if (selectedCarouselItem) {
      const { startDate, endDate, ...rest } = selectedCarouselItem;
      reset({
        startDate: selectedCarouselItem.startDate.split("T")[0],
        endDate: selectedCarouselItem.endDate.split("T")[0],
        ...rest,
      });
    } else {
      reset(defaultValues);
    }
  }, [selectedCarouselItem, reset]);

  const handleCarouselSubmit = async (formDataInf: CarrouselForm) => {
    if (selectedCarouselItem) {
      // Actualizar item
      const { file, ...rest } = formDataInf;
      let payload: CarrouselForm;
      if (file instanceof File || file instanceof Blob) {
        payload = { ...rest, file };
      } else {
        payload = rest;
      }
      const response = await updateCarrousel(selectedCarouselItem.id, payload);
      setCarouselItems((items) =>
        items.map((item) => (item.id === response.id ? response : item))
      );
      toast.success("Carrusel actualizado correctamente");
    } else {
      // Crear nuevo item
      const formData = new FormData();
      Object.entries(formDataInf).forEach(([key, value]) => {
        if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, String(value));
        }
      });
      const response = await createCarrousel(formData);
      setCarouselItems((items) => [...items, response]);
    }
    toast.success("Imagen de carrusel creada correctamente");
    setIsCarouselDialogOpen(false);
    setSelectedCarouselItem(null);
    reset(defaultValues);
  };

  const onError = (errors: any) => {
    if (errors.file) {
      toast.error("El archivo debe ser una imagen");
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const watchedFile = watch("file");

  const previewSrc =
    watchedFile instanceof File
      ? URL.createObjectURL(watchedFile)
      : typeof watchedFile === "string" && watchedFile.length > 0
        ? `${import.meta.env.VITE_BACKEND_BASE_URL}/files/s3/${watchedFile}`
        : selectedCarouselItem?.file || "";

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("file", file, { shouldDirty: true, shouldTouch: true });
    }
  };

  return (
    <Dialog open={isCarouselDialogOpen} onOpenChange={setIsCarouselDialogOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={() => {
            setSelectedCarouselItem(null);
            reset(defaultValues);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Agregar Elemento
        </Button>
      </DialogTrigger>

      <DialogPortal>
        {/* Overlay oscuro con blur */}
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1000]" />

        <DialogContent className="fixed top-1/2 left-1/2 z-[1001] w-full max-w-3xl -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-xl overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {selectedCarouselItem
                ? "Editar Elemento"
                : "Nuevo Elemento del Carrusel"}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Completa la información para el elemento del carrusel
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={handleSubmit(handleCarouselSubmit, onError)}
            className="mt-4 space-y-4"
          >
            {/* Grid de título y orden */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  {...register("title")}
                  placeholder="Título del elemento"
                  required
                />
                {errors.title && (
                  <p className="text-red-600 text-sm">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="order">Orden</Label>
                <Input
                  id="order"
                  type="number"
                  {...register("order", { valueAsNumber: true })}
                  min={1}
                  required
                />
                {errors.order && (
                  <p className="text-red-600 text-sm">{errors.order.message}</p>
                )}
              </div>
            </div>

            {/* Descripción */}
            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                {...register("description")}
                rows={3}
              />
              {errors.description && (
                <p className="text-red-600 text-sm">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Imagen con preview */}
            <div className="space-y-2">
              <Label>Imagen</Label>
              {previewSrc && (
                <img
                  src={previewSrc}
                  alt="Vista previa"
                  className="h-32 w-full object-cover rounded border cursor-pointer"
                  onClick={handleImageClick}
                />
              )}
              <div className="flex gap-2">
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleImageClick}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {watchedFile ? "Cambiar imagen" : "Subir imagen"}
                </Button>
              </div>
            </div>

            {/* Link y fechas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="link">Enlace</Label>
                <Input
                  id="link"
                  {...register("link")}
                  placeholder="/ruta-del-enlace"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Fecha de Inicio</Label>
                  <Input
                    id="startDate"
                    type="date"
                    {...register("startDate")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">Fecha de Fin</Label>
                  <Input id="endDate" type="date" {...register("endDate")} />
                </div>
              </div>
            </div>

            {/* Switch activo */}
            <div className="flex items-center gap-2 mt-2">
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
              <Label htmlFor="active">Elemento activo</Label>
            </div>

            <DialogFooter className="flex justify-end gap-2 mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsCarouselDialogOpen(false);
                  setSelectedCarouselItem(null);
                  reset(defaultValues);
                }}
              >
                Cancelar
              </Button>
              <Button type="submit">
                {selectedCarouselItem ? "Actualizar" : "Crear"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};
