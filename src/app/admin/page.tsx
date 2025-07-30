"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, Package, House } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";

import { ProductForm } from "@/components/product/ProductForm";
import { CategoryForm } from "@/components/category/CategoryForm";
import { ProductWithCategory } from "@/lib/types";
import { formatStock } from "@/lib/utils";
import Image from "next/image";

export default function AdminPage() {
  const [products, setProducts] = useState<ProductWithCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] =
    useState<ProductWithCategory | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/products");
      const json = await res.json();
      setProducts(json.data || []);
    } catch {
      // handle error
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este producto?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    setProducts(products.filter((p) => p.id !== id));
  };

  const closeProductModal = () => {
    setShowProductModal(false);
    setEditingProduct(null);
    fetchProducts();
  };

  const closeCategoryModal = () => {
    setShowCategoryModal(false);
    // optionally reload categories
  };

  const total = products.length;
  const inStock = products.filter((p) => p.stock > 0).length;
  const outStock = total - inStock;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Panel Admin</h1>
          <div className="flex items-center space-x-3">
            <Button
              variant="secondary"
              onClick={() => setShowCategoryModal(true)}
            >
              <Plus className="w-4 h-4 mr-1" /> Categoría
            </Button>
            <Button variant="default" onClick={() => setShowProductModal(true)}>
              <Plus className="w-4 h-4 mr-1" /> Producto
            </Button>
            <Link
              href="/"
              className="text-md text-blue-600  flex text-center space-x-2 "
            >
              <House />
              <span>Inicio</span>
            </Link>
          </div>
        </div>
      </header>

      {/* STATS */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 px-6 pt-6">
        {[
          { label: "Total", value: total, color: "blue" },
          { label: "En Stock", value: inStock, color: "green" },
          { label: "Sin Stock", value: outStock, color: "red" },
        ].map((stat) => (
          <Card key={stat.label} className="rounded-xl">
            <CardContent>
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-xl font-semibold text-gray-900">
                  {stat.value}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* PRODUCTS TABLE */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <Card className="overflow-x-auto">
          <CardHeader>
            <CardTitle>Productos</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-100">
                  {["Producto", "Categoría", "Stock", "Acciones"].map(
                    (head) => (
                      <th
                        key={head}
                        className="text-left px-4 py-2 text-sm font-medium text-gray-700"
                      >
                        {head}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="divide-y">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-4 py-3 h-8 bg-gray-200 rounded"></td>
                      <td className="px-4 py-3 h-8 bg-gray-200 rounded"></td>
                      <td className="px-4 py-3 h-8 bg-gray-200 rounded"></td>
                      <td className="px-4 py-3 h-8 bg-gray-200 rounded"></td>
                    </tr>
                  ))
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-gray-500">
                      No hay productos registrados.
                    </td>
                  </tr>
                ) : (
                  products.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                          {p.imageUrl ? (
                            <Image
                              src={p.imageUrl}
                              alt={p.name}
                              className="w-full h-full object-cover"
                              width={100}
                              height={100}
                            />
                          ) : (
                            <Package className="w-6 h-6 text-gray-400 m-3" />
                          )}
                        </div>
                        <span className="text-gray-900 font-medium truncate">
                          {p.name}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="secondary" className="text-xs">
                          {p.category.name}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={
                            p.stock ? "text-green-600" : "text-red-600"
                          }
                        >
                          {formatStock(p.stock)}
                        </span>
                      </td>
                      <td className="px-4 py-3 space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingProduct(p)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(p.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      {/* MODALS */}
      <Modal
        isOpen={showProductModal}
        onClose={closeProductModal}
        title={editingProduct ? "Editar Producto" : "Nuevo Producto"}
      >
        <ProductForm
          product={editingProduct || undefined}
          onSuccess={closeProductModal}
        />
      </Modal>
      <Modal
        isOpen={showCategoryModal}
        onClose={closeCategoryModal}
        title="Crear Categoría"
      >
        <CategoryForm onSuccess={closeCategoryModal} />
      </Modal>
    </div>
  );
}
