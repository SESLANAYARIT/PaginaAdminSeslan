import { z } from "zod";

export const loginSchema = z.object({
  email: z.email({ message: "Correo inválido" }),
  password: z.string().min(6, { message: "Mínimo 6 caracteres" }),
});
