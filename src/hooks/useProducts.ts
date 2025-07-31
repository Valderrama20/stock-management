'use client';

import { useState, useEffect, useCallback } from 'react';
import type { ProductWithCategory, SearchFilters } from '@/lib/types';

export function useProducts() {
    const [products, setProducts] = useState<ProductWithCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState<SearchFilters>({});

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        const params = new URLSearchParams();
        if (filters.search) params.append('search', filters.search);
        if (filters.categoryId) params.append('categoryId', filters.categoryId);
        if (filters.inStock) params.append('inStock', 'true');
        try {
            const res = await fetch(`/api/products?${params}`);

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(
                    errorData.message || 'Error al obtener los productos.'
                );
            }
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

    const deleteProduct = async (id: string) => {
        const confirmed = confirm('¿Eliminar este producto?');
        if (!confirmed) return;

        try {
            const response = await fetch(`/api/products/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.message || 'Error al eliminar el producto.'
                );
            }

            setProducts((prevProducts) =>
                prevProducts.filter((p) => p.id !== id)
            );
            alert('Producto eliminado correctamente.');
        } catch (error) {
            console.error('Error eliminando el producto:', error);
            alert(
                'Hubo un problema al eliminar el producto. Intenta de nuevo.'
            );
        }
    };

    return {
        products,
        loading,
        filters,
        setFilters,
        deleteProduct,
        refresh: fetchProducts,
    };
}
