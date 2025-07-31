"use client";

import { Input } from "@/components/ui/Input";
import { ProductFilters } from "@/components/product/ProductFilters";
import type { SearchFilters } from "@/lib/types";

interface SearchPanelProps {
  query: string;
  suggestions: string[];
  loading: boolean;
  onQueryChange: (q: string) => void;
  onSelect: (name: string) => void;
  filters: SearchFilters;
  onFiltersChange: (f: SearchFilters) => void;
}

export function SearchPanel({
  query,
  suggestions,
  loading,
  onQueryChange,
  onSelect,
  filters,
  onFiltersChange,
}: SearchPanelProps) {
  return (
    <aside className="w-full lg:w-2/4 space-y-4" ref={null}>
      <div className="relative">
        <Input
          placeholder="🔍 Busca un producto…"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
        />
        {suggestions.length > 0 && (
          <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-md mt-1 max-h-60 overflow-auto shadow-sm">
            {loading ? (
              <li className="px-4 py-2 text-gray-500 text-sm">Buscando…</li>
            ) : (
              suggestions.map((name) => (
                <li
                  key={name}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                  onClick={() => onSelect(name)}
                >
                  {name}
                </li>
              ))
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
