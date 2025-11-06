import { z } from "zod";

export const carrouselSchema = z.object({
  title: z.string().min(3, { message: "Mínimo 3 caracteres" }),
  description: z.string().min(3, { message: "Mínimo 3 caracteres" }),
  file: z
    .union([
      z.string().min(3, { message: "Mínimo 3 caracteres" }),
      z.instanceof(File),
      z.instanceof(Blob),
    ])
    .optional(),
  link: z.string().min(1, { message: "Mínimo 1 caracter" }),
  active: z.boolean(),
  order: z.number(),
  startDate: z.string().min(3, { message: "Mínimo 3 caracteres" }),
  endDate: z.string().min(3, { message: "Mínimo 3 caracteres" }),
});
