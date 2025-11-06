import { z } from "zod";

const allowedTypes = ["application/pdf"];

export const committeeSchema = z.object({
  title: z.string().min(1, "El título es obligatorio"),
  description: z.string().min(1, "La descripción es obligatoria"),
  date: z.iso.date("Formato de fecha inválido"),
  file: z.union([z.string(), z.instanceof(File), z.instanceof(Blob)]).refine(
    (val) => {
      if (typeof val === "string") return true;
      if (val instanceof File || val instanceof Blob) {
        return allowedTypes.includes(val.type);
      }
      return false;
    },
    { message: "El archivo debe ser PDF" }
  ),
});
