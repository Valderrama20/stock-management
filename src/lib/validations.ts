import { z } from "zod";

export const ProductSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre es requerido")
    .max(100, "El nombre es muy largo"),
  description: z.string().optional(),
  stock: z.number().min(0, "El stock no puede ser negativo"),
  categoryId: z.string().min(1, "La categoría es requerida"),
  // MODIFICADO: Hacer imageUrl opcional sin validación de URL estricta
  imageUrl: z.string().optional().or(z.literal("")),
});

export const CategorySchema = z.object({
  name: z
    .string()
    .min(1, "El nombre es requerido")
    .max(50, "El nombre es muy largo"),
  slug: z
    .string()
    .min(1, "El slug es requerido")
    .max(50, "El slug es muy largo"),
});

export type ProductInput = z.infer<typeof ProductSchema>;
export type CategoryInput = z.infer<typeof CategorySchema>;
