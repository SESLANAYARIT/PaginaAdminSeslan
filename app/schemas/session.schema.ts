import { z } from "zod";
import { CommitteeType } from "~/interfaces/sessions.interfaces";

// Schema para validar archivos
const fileDataSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "El nombre del archivo es requerido"),
  size: z.number().positive("El tamaño del archivo debe ser positivo"),
  type: z.string().min(1, "El tipo de archivo es requerido"),
  uploadDate: z.string(),
  url: z.string().optional(),
  file: z.any().optional(), // Para archivos File del navegador
});

// Schema principal para sesiones
export const sessionSchema = z
  .object({
    name: z
      .string()
      .min(1, "El nombre de la sesión es requerido")
      .min(3, "El nombre debe tener al menos 3 caracteres")
      .max(200, "El nombre no puede exceder 200 caracteres"),

    date: z
      .string()
      .min(1, "La fecha es requerida")
      .refine((date) => {
        const selectedDate = new Date(date);
        const year2010 = new Date("2010-01-01");
        return selectedDate >= year2010;
      }, "La fecha no puede ser anterior al año 2010"),

    committee: z.union([
      z.enum(
        Object.values(CommitteeType) as [CommitteeType, ...CommitteeType[]]
      ),
    ]),

    acuerdos: z
      .array(fileDataSchema)
      .default([])
      .refine((files) => {
        return files.every((file) => file.type === "application/pdf");
      }, "Los acuerdos solo pueden ser archivos PDF"),

    actas: z
      .array(fileDataSchema)
      .default([])
      .refine((files) => {
        return files.every((file) => file.type === "application/pdf");
      }, "Las actas solo pueden ser archivos PDF"),

    documentosAdicionales: z.array(fileDataSchema).default([]),
  })
  .refine((data) => {
    const totalFiles =
      data.acuerdos.length +
      data.actas.length +
      data.documentosAdicionales.length;
    return totalFiles <= 20;
  }, "No se pueden subir más de 20 archivos en total")
  .refine((data) => {
    const allFiles = [
      ...data.acuerdos,
      ...data.actas,
      ...data.documentosAdicionales,
    ];
    const totalSize = allFiles.reduce((sum, file) => sum + file.size, 0);
    const maxSize = 100 * 1024 * 1024; // 100MB
    return totalSize <= maxSize;
  }, "El tamaño total de archivos no puede exceder 100MB");

export type SessionSchema = z.infer<typeof sessionSchema>;
