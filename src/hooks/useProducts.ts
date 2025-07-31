"use client";

import { useState, useEffect, useCallback } from "react";
import type { ProductWithCategory, SearchFilters } from "@/lib/types";

export function useProducts() {
  const [products, setProducts] = useState<ProductWithCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<SearchFilters>({});

  const fetchProducts = useCallback(async () => {
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
  }, [filters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    filters,
    setFilters,
    refresh: fetchProducts,
  };
}
