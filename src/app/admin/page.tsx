"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { ProductWithCategory, SearchFilters } from "@/lib/types";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProductForm } from "@/components/product/ProductForm";
import { Modal } from "@/components/ui/Modal";
import { Edit, Package, Plus, Trash2 } from "lucide-react";
import { formatStock } from "@/lib/utils"; // IMPORT FALTANTE

export default function AdminPage() {
  // CAMBIÉ HomePage por AdminPage
  const [products, setProducts] = useState<ProductWithCategory[]>([]);
  // ELIMINÉ filters y showFilters ya que no se usan en el admin
  const [loading, setLoading] = useState(true);

  // ESTADOS FALTANTES PARA LOS MODALES
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] =
    useState<ProductWithCategory | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []); // ELIMINÉ filters de la dependencia

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // SIMPLIFICADO: sin filtros para el admin, mostramos todos los productos
      const response = await fetch("/api/products");
      const result = await response.json();

      if (result.data) {
        setProducts(result.data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  // FUNCIÓN FALTANTE PARA ELIMINAR PRODUCTOS
  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este producto?"))
      return;

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setProducts(products.filter((p) => p.id !== id));
      } else {
        alert("Error al eliminar el producto");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Error al eliminar el producto");
    }
  };

  // FUNCIÓN FALTANTE PARA MANEJAR EL ÉXITO DEL FORMULARIO
  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingProduct(null);
    fetchProducts(); // Recargar la lista de productos
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Panel de Administración
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Producto
              </Button>
              <Link
                href="/"
                className="text-sm text-blue-600 hover:text-blue-500 font-medium"
              >
                Ver Tienda
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Package className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Total Productos
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {products.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Package className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Con Stock</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {products.filter((p) => p.stock > 0).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Package className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Sin Stock</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {products.filter((p) => p.stock === 0).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Products Table */}
        <Card>
          <CardHeader>
            <CardTitle>Productos</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center space-x-4 animate-pulse"
                  >
                    <div className="w-16 h-16 bg-gray-200 rounded" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/4" />
                      <div className="h-3 bg-gray-200 rounded w-1/6" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No hay productos registrados</p>
                <div className="mt-4">
                  <Button onClick={() => setShowForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Crear primer producto
                  </Button>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">
                        Producto
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">
                        Categoría
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">
                        Stock
                      </th>
                      <th className="text-right py-3 px-4 font-medium text-gray-900">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr
                        key={product.id}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                              {product.imageUrl ? (
                                <img
                                  src={product.imageUrl}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Package className="h-5 w-5 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {product.name}
                              </p>
                              {product.description && (
                                <p className="text-sm text-gray-500 truncate max-w-xs">
                                  {product.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <Badge variant="secondary">
                            {product.category.name}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`font-medium ${
                              product.stock === 0
                                ? "text-red-600"
                                : "text-green-600"
                            }`}
                          >
                            {formatStock(product.stock)}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingProduct(product)}
                              title="Editar producto"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(product.id)}
                              title="Eliminar producto"
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title="Nuevo Producto"
      >
        <ProductForm onSuccess={handleFormSuccess} />
      </Modal>

      <Modal
        isOpen={!!editingProduct}
        onClose={() => setEditingProduct(null)}
        title="Editar Producto"
      >
        {editingProduct && (
          <ProductForm product={editingProduct} onSuccess={handleFormSuccess} />
        )}
      </Modal>
    </div>
  );
}
