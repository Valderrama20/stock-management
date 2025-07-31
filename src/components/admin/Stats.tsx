"use client";

import { Package, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import type { ProductWithCategory } from "@/lib/types";

interface StatsProps {
  products: ProductWithCategory[];
  loading: boolean;
}

export function Stats({ products, loading }: StatsProps) {
  const total = products.length;
  const inStock = products.filter((p) => p.stock > 0).length;
  const outStock = total - inStock;
  const stats = [
    {
      label: "Total",
      value: total,
      icon: <Package />,
      bg: "bg-blue-50",
      border: "border-blue-100",
      text: "text-blue-600",
    },
    {
      label: "En Stock",
      value: inStock,
      icon: <CheckCircle />,
      bg: "bg-green-50",
      border: "border-green-100",
      text: "text-green-600",
    },
    {
      label: "Sin Stock",
      value: outStock,
      icon: <XCircle />,
      bg: "bg-red-50",
      border: "border-red-100",
      text: "text-red-600",
    },
  ];

  return (
    <div className="flex gap-2 sm:grid sm:grid-cols-3 sm:gap-4 mb-6">
      {loading
        ? Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="animate-pulse h-20" />
          ))
        : stats.map((stat) => (
            <Card
              key={stat.label}
              className={`flex-1 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 ${stat.bg} ${stat.border} border`}
            >
              <CardContent className="flex items-center justify-between gap-2 py-3 px-4 sm:py-5 sm:px-6">
                <div className="flex flex-col">
                  <p className="text-xs sm:text-sm text-gray-600 truncate">
                    {stat.label}
                  </p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.text} flex-shrink-0`}>{stat.icon}</div>
              </CardContent>
            </Card>
          ))}
    </div>
  );
}
