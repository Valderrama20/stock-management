// src/app/page.tsx

"use client";

import { useState, useEffect } from "react";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductFilters } from "@/components/product/ProductFilters";
import { SearchFilters, ProductWithCategory } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { CategoryForm } from "@/components/category/CategoryForm";

export default function HomePage() {
  const [products, setProducts] = useState<ProductWithCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [showCategoryForm, setShowCategoryForm] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filters.categoryId) params.append("categoryId", filters.categoryId);
    if (filters.inStock) params.append("inStock", "true");

    try {
      const res = await fetch(`/api/products?${params.toString()}`);
      const result = await res.json();
      setProducts(result.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltersChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
  };

  const handleCategorySuccess = () => {
    setShowCategoryForm(false);
    // optionally refetch filters or categories
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Mercado</h1>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCategoryForm(true)}
          >
            <Plus className="h-4 w-4 mr-2" /> Nueva Categoría
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="w-full lg:w-1/4">
            <ProductFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              className="sticky top-20"
            />
          </aside>
          <section className="flex-1">
            <ProductGrid products={products} loading={loading} />
          </section>
        </div>
      </main>

      <Modal
        isOpen={showCategoryForm}
        onClose={() => setShowCategoryForm(false)}
        title="Crear Categoría"
      >
        <CategoryForm onSuccess={handleCategorySuccess} />
      </Modal>
    </div>
  );
}
