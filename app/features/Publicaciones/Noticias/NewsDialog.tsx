import { zodResolver } from "@hookform/resolvers/zod";
import {
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@radix-ui/react-dialog";
import { Plus, Upload } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { createNews, updateNews } from "~/api/News/news.api";
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
import {
  NewsCategory,
  NewsCategoryLabels,
  NewsStatus,
  NewsStatusLabels,
  type NewsForm,
  type NewsInterface,
} from "~/interfaces/news.interfaces";
import { newsSchema } from "~/schemas/news.schema";

interface Props {
  isNewsDialogOpen: boolean;
  setIsNewsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedNewsItem: React.Dispatch<
    React.SetStateAction<NewsInterface | null>
  >;
  selectedNewsItem: NewsInterface | null;
  setNewsItems: React.Dispatch<React.SetStateAction<NewsInterface[]>>;
}

export const NewsDialog = ({
  isNewsDialogOpen,
  setIsNewsDialogOpen,
  setSelectedNewsItem,
  selectedNewsItem,
  setNewsItems,
}: Props) => {
  const defaultValues: NewsForm = {
    title: "",
    excerpt: "",
    category: NewsCategory.SECRETARIA_EJECUTIVA,
    publishDate: "",
    content: "",
    featured: false,
    status: NewsStatus.DRAFT,
    tags: [],
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
  } = useForm<NewsForm>({
    resolver: zodResolver(newsSchema),
    mode: "onBlur",
    defaultValues,
  });

  // TAGS
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  useEffect(() => {
    setValue("tags", tags); // Mantiene los tags en RHF
  }, [tags, setValue]);

  useEffect(() => {
    if (selectedNewsItem) {
      const { publishDate, ...rest } = selectedNewsItem;
      reset({
        publishDate: selectedNewsItem.publishDate.split("T")[0],
        ...rest,
      });
      setTags(selectedNewsItem.tags || []);
    } else {
      reset(defaultValues);
      setTags([]);
    }
  }, [selectedNewsItem, reset]);

  const handleNewsSubmit = async (formDataInf: NewsForm) => {
    if (selectedNewsItem) {
      const { file, ...rest } = formDataInf;
      let payload: NewsForm;
      if (file instanceof File || file instanceof Blob) {
        payload = { ...rest, file };
      } else {
        payload = rest;
      }
      const response = await updateNews(selectedNewsItem.id, payload);
      setNewsItems((items) =>
        items.map((item) => (item.id === response.id ? response : item))
      );
    } else {
      const response = await createNews(formDataInf);
      setNewsItems((items) => [...items, response]);
    }
    setIsNewsDialogOpen(false);
    setSelectedNewsItem(null);
    reset(defaultValues);
    setTags([]);
  };

  const onError = (errors: any) => {
    if (errors.file) toast.error("El archivo debe ser una imagen");
    if (errors.tags) toast.error("Debe agregar al menos un tag");
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleImageClick = () => fileInputRef.current?.click();
  const watchedFile = watch("file");

  const previewSrc =
    watchedFile instanceof File
      ? URL.createObjectURL(watchedFile)
      : typeof watchedFile === "string" && watchedFile.length > 0
        ? `${import.meta.env.VITE_BACKEND_BASE_URL}/files/s3/${watchedFile}`
        : selectedNewsItem?.file || "";

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (file) setValue("file", file, { shouldDirty: true, shouldTouch: true });
  };

  return (
    <Dialog
      open={isNewsDialogOpen}
      onOpenChange={(open) => {
        setIsNewsDialogOpen(open);
        setTagInput("");
        setTags(selectedNewsItem?.tags || []);
      }}
    >
      <DialogTrigger asChild>
        <Button
          onClick={() => {
            setSelectedNewsItem(null);
            reset(defaultValues);
            setTags([]);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Agregar Noticia
        </Button>
      </DialogTrigger>

      <DialogPortal>
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1000]" />
        <DialogContent className="fixed top-1/2 left-1/2 z-[1001] w-full max-w-3xl -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-xl overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {selectedNewsItem ? "Editar Noticia" : "Nueva Noticia"}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Completa la información para la noticia
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={handleSubmit(handleNewsSubmit, onError)}
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
                  placeholder="Título de la noticia"
                  className="focus:ring-2 focus:ring-blue-500"
                  required
                />
                {errors.title && (
                  <p className="text-red-500 text-sm">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt" className="font-medium text-gray-700">
                  Extracto
                </Label>
                <Textarea
                  id="excerpt"
                  {...register("excerpt")}
                  placeholder="Breve resumen de la noticia"
                  rows={2}
                  className="focus:ring-2 focus:ring-blue-500"
                />
                {errors.excerpt && (
                  <p className="text-red-500 text-sm">
                    {errors.excerpt.message}
                  </p>
                )}
              </div>
            </div>

            {/* Categoría y fecha */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category" className="font-medium text-gray-700">
                  Categoría
                </Label>
                <select
                  id="category"
                  {...register("category")}
                  className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                >
                  {Object.values(NewsCategory).map((cat) => (
                    <option key={cat} value={cat}>
                      {NewsCategoryLabels[cat]}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-red-500 text-sm">
                    {errors.category.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="publishDate"
                  className="font-medium text-gray-700"
                >
                  Fecha de publicación
                </Label>
                <Input
                  id="publishDate"
                  type="date"
                  {...register("publishDate")}
                  className="focus:ring-2 focus:ring-blue-500"
                />
                {errors.publishDate && (
                  <p className="text-red-500 text-sm">
                    {errors.publishDate.message}
                  </p>
                )}
              </div>
            </div>

            {/* Contenido */}
            <div className="space-y-2">
              <Label htmlFor="content" className="font-medium text-gray-700">
                Contenido
              </Label>
              <Textarea
                id="content"
                {...register("content")}
                placeholder="Contenido completo de la noticia"
                rows={6}
                className="focus:ring-2 focus:ring-blue-500"
              />
              {errors.content && (
                <p className="text-red-500 text-sm">{errors.content.message}</p>
              )}
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label htmlFor="tags" className="font-medium text-gray-700">
                Tags
              </Label>
              <div className="flex gap-2">
                <Controller
                  control={control}
                  name="tags"
                  render={() => (
                    <Input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                      placeholder="Escribe un tag y presiona Enter"
                      className="focus:ring-2 focus:ring-blue-500"
                    />
                  )}
                />
                <Button
                  type="button"
                  onClick={handleAddTag}
                  variant="secondary"
                >
                  Agregar
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              {errors.title && (
                <p className="text-red-500 text-sm">{errors.tags?.message}</p>
              )}
            </div>

            {/* Imagen destacada */}
            <div className="space-y-2">
              <Label className="font-medium text-gray-700">
                Imagen destacada
              </Label>
              {previewSrc && (
                <img
                  src={previewSrc}
                  alt="Vista previa"
                  className="h-40 w-full object-cover rounded-md border cursor-pointer shadow-sm"
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
                  className="flex items-center"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {watchedFile ? "Cambiar imagen" : "Subir imagen"}
                </Button>
              </div>
            </div>

            {/* Switches y estado */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="flex items-center gap-2">
                <Controller
                  control={control}
                  name="featured"
                  render={({ field }) => (
                    <Switch
                      id="featured"
                      checked={!!field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <Label htmlFor="featured" className="text-gray-700">
                  Noticia destacada
                </Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status" className="font-medium text-gray-700">
                  Estado
                </Label>
                <select
                  id="status"
                  {...register("status")}
                  className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                >
                  {Object.values(NewsStatus).map((st) => (
                    <option key={st} value={st}>
                      {NewsStatusLabels[st]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Botones */}
            <DialogFooter className="flex justify-end gap-3 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsNewsDialogOpen(false);
                  setSelectedNewsItem(null);
                  reset(defaultValues);
                  setTags([]);
                }}
              >
                Cancelar
              </Button>
              <Button type="submit">
                {selectedNewsItem ? "Actualizar" : "Crear"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};
