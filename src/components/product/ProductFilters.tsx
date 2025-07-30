"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Card, CardContent } from "@/components/ui/Card";
import { SearchFilters } from "@/lib/types";
import { Category } from "@/generated/prisma";

interface ProductFiltersProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  className?: string;
}

export function ProductFilters({
  filters,
  onFiltersChange,
  className,
}: ProductFiltersProps) {
  const [categories, setCategories] = useState<Category[]>([]);

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

  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = filters.categoryId || filters.inStock;

  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-gray-900">Filtros</h3>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4 mr-1" />
              Limpiar
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoría
            </label>
            <Select
              value={filters.categoryId || ""}
              onChange={(value) =>
                onFiltersChange({ ...filters, categoryId: value.target.value || undefined })
              }
            >
              <option value="">Todas las categorías</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Disponibilidad
            </label>
            <Select
              value={filters.inStock ? "true" : ""}
              onChange={(value) =>
                onFiltersChange({
                  ...filters,
                  inStock: value.target.value === "true" || undefined,
                })
              }
            >
              <option value="">Todos los productos</option>
              <option value="true">Solo con stock</option>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
