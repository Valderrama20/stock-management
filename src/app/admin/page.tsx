// src/app/admin/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Header } from "@/components/admin/Header";
import { Sidebar } from "@/components/admin/Sidebar";
import { Stats } from "@/components/admin/Stats";
import { SearchPanel } from "@/components/admin/SearchPanel";
import { ProductsTable } from "@/components/admin/ProductsTable";
import { ProductModal } from "@/components/admin/ProductModal";
import { CategoryModal } from "@/components/admin/CategoryModal";

import { useProducts } from "@/hooks/useProducts";
import { useSearchSuggestions } from "@/hooks/useSearchSuggestions";

export default function AdminPage() {
  const router = useRouter();

  // Products state and actions
  const { products, loading, filters, setFilters, refresh } = useProducts();

  // Search suggestions
  const {
    query,
    suggestions,
    loading: loadingSuggestions,
    showDropdown,
    onQueryChange,
    selectSuggestion,
  } = useSearchSuggestions(setFilters);

  // UI state
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<null | any>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const openProductModal = (product: any = null) => {
    setEditingProduct(product);
    setShowProductModal(true);
  };
  const closeProductModal = () => {
    setShowProductModal(false);
    setEditingProduct(null);
    refresh();
  };

  const openCategoryModal = () => setShowCategoryModal(true);
  const closeCategoryModal = () => setShowCategoryModal(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onAddProduct={() => openProductModal()}
        onAddCategory={openCategoryModal}
        onHome={() => router.push("/")}
        onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
      />

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onAddProduct={() => openProductModal()}
        onAddCategory={openCategoryModal}
        onHome={() => router.push("/")}
      />

      <main className="max-w-7xl mx-auto px-6 py-6">
        <Stats products={products} loading={loading} />

        <div className="flex flex-col lg:flex-row gap-6">
          <SearchPanel
            query={query}
            suggestions={suggestions}
            loading={loadingSuggestions}
            showDropdown={showDropdown}
            onQueryChange={onQueryChange}
            onSelect={selectSuggestion}
            filters={filters}
            onFiltersChange={setFilters}
          />

          <ProductsTable
            products={products}
            loading={loading}
            onEdit={openProductModal}
            onDelete={refresh}
          />
        </div>
      </main>

      {showProductModal && (
        <ProductModal product={editingProduct} onClose={closeProductModal} />
      )}

      {showCategoryModal && <CategoryModal onClose={closeCategoryModal} />}
    </div>
  );
}