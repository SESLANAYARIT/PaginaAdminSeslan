import { z } from "zod";

export const fileUploaArticulo33Schema = z.object({
  file: z
    .any()
    .refine((file) => file instanceof File, {
      message: "Debes seleccionar un archivo",
    })
    .refine((file: File) => file.size <= 20 * 1024 * 1024, {
      message: "El archivo no debe superar los 20MB",
    })
    .refine(
      (file: File) =>
        [".xlsx", ".xls", ".pdf"].some((ext) => file.name.endsWith(ext)),
      { message: "Solo se permiten archivos Excel o PDF" }
    ),
});
export type FileUploadFormArticulo33 = z.infer<typeof fileUploaArticulo33Schema>;