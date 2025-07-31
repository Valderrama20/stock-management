// src/app/page.tsx

"use client";

import { useState, useEffect, useRef } from "react";
import { Home, User } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductFilters } from "@/components/product/ProductFilters";
import { CategoryForm } from "@/components/category/CategoryForm";
import { SearchFilters, ProductWithCategory } from "@/lib/types";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [products, setProducts] = useState<ProductWithCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<SearchFilters>({});    
  const [showCategoryForm, setShowCategoryForm] = useState(false);

  // Para búsqueda y sugerencias
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  // 1) Fetch de productos cuando cambian los filtros
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.search) params.append("search", filters.search);
      if (filters.categoryId) params.append("categoryId", filters.categoryId);
      if (filters.inStock) params.append("inStock", "true");
      try {
        const res = await fetch(`/api/products?${params}`);
        const json = await res.json();
        setProducts(json.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [filters]);

  // 2) Fetch de sugerencias (debounced)
  const fetchSuggestions = async (query: string) => {
    if (!query) {
      setSuggestions([]);
      setLoadingSuggestions(false);
      setShowDropdown(false);
      return;
    }
    try {
      const res = await fetch(
        `/api/products?search=${encodeURIComponent(query)}`
      );
      const json = await res.json();
      const names =
        Array.isArray(json.data) && json.data.length > 0
          ? json.data.map((p: ProductWithCategory) => p.name)
          : [];
      setSuggestions(names.slice(0, 5));
    } catch {
      setSuggestions([]);
    } finally {
      setLoadingSuggestions(false);
      setShowDropdown(true);
    }
  };

  // 3) Al tipear: muestro "Buscando..." de inmediato y luego lanzo debounce
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setSearch(q);
    setLoadingSuggestions(true);
    setShowDropdown(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(q);
    }, 300);
  };

  // 4) Cerrar dropdown al click fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 5) Al seleccionar sugerencia dispara búsqueda y limpia filtros
  const handleSelectSuggestion = (name: string) => {
    setSearch(name);
    setFilters({ search: name });
    setShowDropdown(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-2">
            <Home className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold text-gray-900">Inicio</h1>
          </div>
          <Button
            variant="secondary"
            size="default"
            onClick={() => router.push("/admin")}
          >
            <User className="w-4 h-4 mr-1" /> Administrador
          </Button>
        </div>
      </header>

      {/* CONTENT */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* SEARCH + FILTERS */}
          <aside className="w-full lg:w-1/4 space-y-4" ref={dropdownRef}>
            <div className="relative">
              <Input
                placeholder="🔍 Busca un producto…"
                value={search}
                onChange={handleSearchChange}
                onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
              />
              {showDropdown && (
                <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-md mt-1 max-h-60 overflow-auto shadow-sm">
                  {loadingSuggestions ? (
                    <li className="px-4 py-2 text-gray-500 text-sm">
                      Buscando…
                    </li>
                  ) : suggestions.length > 0 ? (
                    suggestions.map((name) => (
                      <li
                        key={name}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                        onClick={() => handleSelectSuggestion(name)}
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

            {/* FILTROS */}
            <ProductFilters
              filters={filters}
              onFiltersChange={setFilters}
              className="sticky top-20"
            />
          </aside>

          {/* PRODUCT GRID */}
          <section className="flex-1">
            <ProductGrid products={products} loading={loading} />
          </section>
        </div>
      </main>

      {/* CATEGORY MODAL */}
      <Modal
        isOpen={showCategoryForm}
        onClose={() => setShowCategoryForm(false)}
        title="Crear Categoría"
      >
        <CategoryForm onSuccess={() => setShowCategoryForm(false)} />
      </Modal>
    </div>
  );
}
