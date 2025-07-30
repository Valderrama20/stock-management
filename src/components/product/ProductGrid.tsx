import { Package } from "lucide-react";
import { ProductCard } from "./ProductCard";
import { ProductWithCategory } from "@/lib/types";

interface ProductGridProps {
  products: ProductWithCategory[];
  loading: boolean;
}

export function ProductGrid({ products, loading }: ProductGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow animate-pulse overflow-hidden"
          >
            <div className="aspect-square bg-gray-200" />
            <div className="p-4 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <Package className="h-12 w-12 text-gray-300" />
        <h2 className="text-lg font-semibold text-gray-600">
          No hay productos
        </h2>
        <p className="text-sm text-gray-500">
          Ajusta los filtros o crea nuevos productos.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
