import { z } from "zod";

export const sectionSchema = z.object({
    name: z.string().min(3, { message: "Mínimo 3 caracteres" }),
})