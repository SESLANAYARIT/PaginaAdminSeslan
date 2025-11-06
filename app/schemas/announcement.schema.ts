import { z } from "zod";

export const announcementSchema = z.object({
    title: z.string().min(3, { message: "Mínimo 3 caracteres" }),
    description : z.string().min(3, { message: "Mínimo 3 caracteres" }),
    date: z.string().min(3, { message: "Mínimo 3 caracteres" }),
    file: z
    .union([
      z.string().min(3, { message: "Seleccione un archivo" }),
      z.instanceof(File),
      z.instanceof(Blob),
    ])
}) 