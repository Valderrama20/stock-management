"use client";

import { Plus, House } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: () => void;
  onAddCategory: () => void;
  onHome: () => void;
}

export function Sidebar({
  isOpen,
  onClose,
  onAddProduct,
  onAddCategory,
  onHome,
}: SidebarProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose}>
      <div
        className="fixed left-0 top-0 w-64 h-full bg-white shadow-lg p-6 z-60"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold mb-4">Menú</h2>
        <div className="flex flex-col space-y-3">
          <Button
            variant="default"
            onClick={() => {
              onAddProduct();
              onClose();
            }}
          >
            <Plus className="w-4 h-4 mr-1" /> Producto
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              onAddCategory();
              onClose();
            }}
          >
            <Plus className="w-4 h-4 mr-1" /> Categoría
          </Button>
          <Button
            onClick={() => {
              onHome();
              onClose();
            }}
            className="text-blue-600"
          >
            <House className="w-4 h-4 mr-1" /> Inicio
          </Button>
        </div>
      </div>
    </div>
  );
}
