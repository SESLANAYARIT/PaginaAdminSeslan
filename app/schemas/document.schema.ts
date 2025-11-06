// ~/schemas/document.schema.ts
import { z } from "zod";
import { Area, Topico } from "~/interfaces/documents/document.interfaces";

const baseDocumentSchema = z.object({
  title: z
    .string()
    .min(1, "El título es requerido")
    .max(200, "El título no puede exceder 200 caracteres"),

  description: z
    .string()
    .min(1, "La descripción es requerida")
    .max(500, "La descripción no puede exceder 500 caracteres"),

  documentDate: z
    .string()
    .min(1, "La fecha del documento es requerida")
    .refine((date) => {
      const parsedDate = new Date(date);
      if(parsedDate<new Date("1900-01-01") || parsedDate>new Date("2100-01-01")) return false
      return !isNaN(parsedDate.getTime());
    }, "Fecha inválida"),

  area: z
    .union([z.enum(Object.values(Area) as [Area, ...Area[]]), z.literal("")])
    .refine((val) => val !== "", {
      message: "Debe seleccionar un área válida",
    }),

  topico: z
    .union([
      z.enum(Object.values(Topico) as [Topico, ...Topico[]]),
      z.literal(""),
    ])
    .refine((val) => val !== "", {
      message: "Debe seleccionar un tópico válido",
    }),

  active: z.boolean().default(true),

  file: z
    .any()
    .optional()
    .refine((file) => {
      if (!file) return true; // permitido si no hay archivo
      if (file instanceof File) {
        const validTypes = ["application/pdf"];
        return validTypes.includes(file.type);
      }
      return true;
    }, "El archivo debe ser PDF")
    .refine((file) => {
      if (file instanceof File) {
        return file.size <= 20 * 1024 * 1024; // 10MB max
      }
      return true;
    }, "El archivo no puede exceder 20MB"),
});

// Schema para creación (archivo obligatorio)
export const createDocumentSchema = baseDocumentSchema.refine(
  (data) => data.file instanceof File,
  {
    message: "Debe seleccionar un archivo",
    path: ["file"],
  }
);

// Schema para edición (archivo opcional)
export const updateDocumentSchema = baseDocumentSchema;
