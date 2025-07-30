"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { ProductSchema, ProductInput } from "@/lib/validations";
import { ProductWithCategory } from "@/lib/types";
import { Category } from "@/generated/prisma";
interface ProductFormProps {
  product?: ProductWithCategory;
  onSuccess: () => void;
}

export function ProductForm({ product, onSuccess }: ProductFormProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ProductInput>({
    resolver: zodResolver(ProductSchema),
    defaultValues: product
      ? {
          name: product.name,
          description: product.description || "",
          stock: product.stock,
          categoryId: product.categoryId,
          imageUrl: product.imageUrl || "",
        }
      : {
          name: "",
          description: "",
          stock: 0,
          categoryId: "",
          imageUrl: "",
        },
  });

  const imageUrl = watch("imageUrl");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      const result = await response.json();
      if (result.data) {
        setCategories(result.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const onSubmit = async (data: ProductInput) => {
    setLoading(true);
    setError(null);

    try {
      const url = product ? `/api/products/${product.id}` : "/api/products";
      const method = product ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Error al guardar el producto");
      }

      onSuccess();
      if (!product) {
        reset();
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* NUEVA SECCIÓN DE IMAGEN */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Imagen del producto
        </label>
        <ImageUpload
          value={imageUrl}
          onChange={(url) => setValue("imageUrl", url)}
          onRemove={() => setValue("imageUrl", "")}
          disabled={loading}
        />
        {errors.imageUrl && (
          <p className="text-sm text-red-600 mt-1">{errors.imageUrl.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nombre del producto *
        </label>
        <Input {...register("name")} placeholder="Ej: Laptop Dell XPS 13" />
        {errors.name && (
          <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descripción
        </label>
        <textarea
          {...register("description")}
          placeholder="Descripción del producto..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Stock *
          </label>
          <Input
            type="number"
            min="0"
            {...register("stock", { valueAsNumber: true })}
            placeholder="0"
          />
          {errors.stock && (
            <p className="text-sm text-red-600 mt-1">{errors.stock.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Categoría *
          </label>
          <Select {...register("categoryId")}>
            <option value="">Seleccionar categoría</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
          {errors.categoryId && (
            <p className="text-sm text-red-600 mt-1">
              {errors.categoryId.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="submit" disabled={loading} className="px-6">
          {loading ? "Guardando..." : product ? "Actualizar" : "Crear Producto"}
        </Button>
      </div>
    </form>
  );
}
