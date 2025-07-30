"use client";

import { useState, useEffect } from "react";
import { Home, User } from "lucide-react";

import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductFilters } from "@/components/product/ProductFilters";
import { CategoryForm } from "@/components/category/CategoryForm";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { SearchFilters, ProductWithCategory } from "@/lib/types";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [products, setProducts] = useState<ProductWithCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [showCategoryForm, setShowCategoryForm] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const params = new URLSearchParams();
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900 flex justify-center items-center space-x-2">
            <Home />
            <span>Inicio</span>
          </h1>
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
          {/* FILTERS */}
          <aside className="w-full lg:w-1/4">
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
