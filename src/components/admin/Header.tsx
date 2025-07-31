"use client";

import { Plus, House } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface HeaderProps {
  onAddProduct: () => void;
  onAddCategory: () => void;
  onHome: () => void;
  onToggleSidebar: () => void;
}

export function Header({
  onAddProduct,
  onAddCategory,
  onHome,
  onToggleSidebar,
}: HeaderProps) {
  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900">Panel Admin</h1>
        <div className="hidden md:flex items-center space-x-3">
          <Button variant="secondary" onClick={onAddCategory}>
            <Plus className="w-4 h-4 mr-1" /> Categoría
          </Button>
          <Button variant="default" onClick={onAddProduct}>
            <Plus className="w-4 h-4 mr-1" /> Producto
          </Button>
          <Button onClick={onHome} className="text-blue-600">
            <House className="w-4 h-4 mr-1" /> Inicio
          </Button>
        </div>
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-2 rounded hover:bg-gray-100"
        >
          <svg
            className="w-6 h-6 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </header>
  );
}
