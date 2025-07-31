"use client";

import { useRef } from "react";
import { Input } from "@/components/ui/Input";
import { ProductFilters } from "@/components/product/ProductFilters";
import type { SearchFilters } from "@/lib/types";

interface SearchPanelProps {
  query: string;
  suggestions: string[];
  loading: boolean;
  showDropdown: boolean;
  onQueryChange: (q: string) => void;
  onSelect: (name: string) => void;
  filters: SearchFilters;
  onFiltersChange: (f: SearchFilters) => void;
}

export function SearchPanel({
  query,
  suggestions,
  loading,
  showDropdown,
  onQueryChange,
  onSelect,
  filters,
  onFiltersChange,
}: SearchPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  console.log(showDropdown, suggestions.length);

  return (
    <aside className="w-full lg:w-2/4 space-y-4" ref={panelRef}>
      <div className="relative suggestion-panel">
        <Input
          placeholder="🔍 Busca un producto…"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
        />
        {showDropdown && (
          <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-md mt-1 max-h-60 overflow-auto shadow-sm suggestion-panel">
            {loading ? (
              <li className="px-4 py-2 text-gray-500 text-sm">Buscando…</li>
            ) : suggestions.length > 0 ? (
              suggestions.map((name) => (
                <li
                  key={name}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                  onClick={() => onSelect(name)}
                >
                  {name}
                </li>
              ))
            ) : (
              <li className="px-4 py-2 text-gray-500 text-sm">
                Sin resultados
              </li>
            )}
          </ul>
        )}
      </div>
      <ProductFilters
        filters={filters}
        onFiltersChange={onFiltersChange}
        className="sticky top-20"
      />
    </aside>
  );
}
