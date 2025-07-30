"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { CategorySchema, FormData } from "@/lib/validations";

interface CategoryFormProps {
  onSuccess: () => void;
}

export function CategoryForm({ onSuccess }: CategoryFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<{ name: string }>({
    resolver: zodResolver(CategorySchema.pick({ name: true })),
    defaultValues: { name: "" },
  });

  const generateSlug = (name: string) =>
    name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const onSubmit = async () => {
    const data = getValues();
    console.log("submit");
    setLoading(true);
    setError(null);
    try {
      const slug = generateSlug(data.name);
      console.log("antes de hacer la peticion");
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: data.name, slug }),
      });
      console.log("despues de hacer la peticion", res);
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Error");
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && <p className="text-red-600">{error}</p>}
      <div>
        <label className="block text-sm">Nombre *</label>
        <Input {...register("name")} placeholder="Ej: Electrónica" />
        {errors.name && (
          <p className="text-red-600 text-sm">{errors.name.message}</p>
        )}
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading ? "Guardando..." : "Crear Categoría"}
        </Button>
      </div>
    </form>
  );
}
