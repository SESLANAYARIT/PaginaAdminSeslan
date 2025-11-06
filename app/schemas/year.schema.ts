import z from "zod";
import type { FrequencyType } from "~/interfaces/Article33/types/article33.types";

export const yearSchema = z.object({
  year: z
    .number("Debe ser un número")
    .int("Debe ser un número entero")
    .min(2010, "El año debe ser mayor o igual a 1900")
    .max(2100, "El año debe ser menor o igual a 2100"),
  frequency: z.custom<FrequencyType>(
    (val) =>
      ["ANUAL", "SEMESTRAL", "TRIMESTRAL", "BIMESTRAL"].includes(val as string),
    {
      message: "Selecciona una frecuencia válida",
    }
  ),
});
export type YearForm = z.infer<typeof yearSchema>;
