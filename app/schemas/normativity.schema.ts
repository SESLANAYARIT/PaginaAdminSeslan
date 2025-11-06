import { z } from "zod";
import { TipoNormatividad } from "~/interfaces/normativity.interfaces";

// Schema base compartido
const baseNormativitySchema = z.object({
  title: z
    .string()
    .min(1, "El título es requerido")
    .min(3, "El título debe tener al menos 3 caracteres")
    .max(200, "El título no puede exceder 200 caracteres"),

  description: z
    .string()
    .max(1000, "La descripción no puede exceder 1000 caracteres")
    .optional()
    .or(z.literal("")),

  documentDate: z
    .string()
    .min(1, "La fecha del documento es requerida")
    .refine(
      (date) => !isNaN(new Date(date).getTime()),
      "Formato de fecha inválido"
    ),

  tipoNormatividad: z
    .enum(
      Object.values(TipoNormatividad) as [
        TipoNormatividad,
        ...TipoNormatividad[],
      ]
    )
    .or(z.literal(""))
    .superRefine((val, ctx) => {
      if (val === "") {
        ctx.addIssue({
          code: "custom",
          message: "El tipo de normatividad es requerido",
        });
      }
    }),
  active: z.boolean().default(true),
});

// Schema para crear documento (archivo obligatorio)
export const createNormativitySchema = baseNormativitySchema.extend({
  file: z
    .instanceof(File, { message: "Debe seleccionar un archivo" })
    .refine((file) => file.size > 0, "El archivo no puede estar vacío")
    .refine(
      (file) => file.size <= 20 * 1024 * 1024,
      "El archivo no puede exceder 20MB"
    )
    .refine(
      (file) => file.type === "application/pdf",
      "Tipo de archivo no permitido. Solo PDF"
    ),
});

// Schema para actualizar documento (archivo opcional)
export const updateNormativitySchema = baseNormativitySchema.extend({
  file: z
    .instanceof(File)
    .refine((file) => file.size > 0, "El archivo no puede estar vacío")
    .refine(
      (file) => file.size <= 20 * 1024 * 1024,
      "El archivo no puede exceder 10MB"
    )
    .refine(
      (file) => file.type === "application/pdf",
      "Tipo de archivo no permitido. Solo PDF"
    )
    .optional()
    .nullable(),
});

// Tipos TypeScript
export type CreateNormativityForm = z.infer<typeof createNormativitySchema>;
export type UpdateNormativityForm = z.infer<typeof updateNormativitySchema>;
export type NormativityForm = CreateNormativityForm | UpdateNormativityForm;
