"use client";

import Image from "next/image";
import { Edit, Trash2, Package } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { ProductWithCategory } from "@/lib/types";
import { formatStock } from "@/lib/utils";

interface TableProps {
  products: ProductWithCategory[];
  loading: boolean;
  onEdit: (p: ProductWithCategory) => void;
  onDelete: () => void;
}

export function ProductsTable({
  products,
  loading,
  onEdit,
  onDelete,
}: TableProps) {
  return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Productos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full table-auto min-w-[600px]">
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
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gray-200 rounded-lg" />
                          <div className="h-4 w-24 bg-gray-200 rounded" />
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="h-4 w-16 bg-gray-200 rounded" />
                      </td>
                      <td className="px-4 py-3">
                        <div className="h-4 w-12 bg-gray-200 rounded" />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex space-x-2">
                          <div className="w-6 h-6 bg-gray-200 rounded-full" />
                          <div className="w-6 h-6 bg-gray-200 rounded-full" />
                        </div>
                      </td>
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
                          onClick={() => onEdit(p)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={onDelete}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
  );
}
