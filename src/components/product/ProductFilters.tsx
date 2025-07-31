"use client";

import { useState, useEffect } from "react";
import { Select } from "@/components/ui/Select";
import { cn } from "@/lib/utils";
import { SearchFilters } from "@/lib/types";
import { Category } from "@prisma/client";
import { ChevronDown, ChevronUp } from "lucide-react";

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
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((json) => json.data && setCategories(json.data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  const clearFilters = () => onFiltersChange({});
  const hasActive = Boolean(filters.categoryId || filters.inStock);

  return (
    <div
      className={cn("bg-white rounded-lg shadow-sm overflow-hidden", className)}
    >
      {/* Header toggler */}
      <button
        type="button"
        className="w-full flex items-center justify-between p-4 py-2 cursor-pointer"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="text-md font-semibold text-gray-900">Filtros</span>
        {open ? (
          <ChevronUp className="w-5 h-5 text-gray-700 transition-transform duration-300" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-700 transition-transform duration-300" />
        )}
      </button>

      {/* Animated container */}
      <div
        className={cn(
          "transition-[max-height] duration-500 ease-in-out",
          open ? "max-h-[600px]" : "max-h-0"
        )}
      >
        <div className="p-6">
          {/* Clear button */}
          <div className="mb-4 flex items-center justify-between">
            {hasActive && (
              <button
                onClick={clearFilters}
                className="text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                Limpiar
              </button>
            )}
          </div>

          <div className="space-y-4">
            {/* Filtro de Categoría */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoría
              </label>
              <Select
                value={filters.categoryId || ""}
                onChange={(e) =>
                  onFiltersChange({
                    ...filters,
                    categoryId: e.target.value || undefined,
                  })
                }
              >
                <option value="">Todas</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </Select>
            </div>

            {/* Filtro de Stock */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Disponibilidad
              </label>
              <Select
                value={filters.inStock ? "true" : ""}
                onChange={(e) =>
                  onFiltersChange({
                    ...filters,
                    inStock: e.target.value === "true" ? true : undefined,
                  })
                }
              >
                <option value="">Todos</option>
                <option value="true">Con stock</option>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
