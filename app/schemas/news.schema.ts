import { z } from "zod";
import { NewsCategory, NewsStatus } from "~/interfaces/news.interfaces";

export const newsSchema = z.object({
  title: z.string().min(3, { message: "Mínimo 3 caracteres" }),
  excerpt: z.string().min(3, { message: "Mínimo 3 caracteres" }),
  category: z.enum(NewsCategory, { message: "Debe seleccionar una categoría" }),
  publishDate: z.string().min(3, { message: "Por favor seleccione una fecha" }),
  content: z.string().min(3, { message: "Mínimo 3 caracteres" }),
  featured: z.boolean(),
  status: z.enum(NewsStatus, { message: "Debe seleccionar un estado" }),
  tags: z.array(z.string()).min(1, "Debe agregar al menos un tag"),
  file: z
    .union([
      z.string().min(3, { message: "Mínimo 3 caracteres" }),
      z.instanceof(File),
      z.instanceof(Blob),
    ])
    .optional(),
});
