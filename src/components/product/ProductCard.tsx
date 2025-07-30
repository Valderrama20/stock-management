import { Package, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProductWithCategory } from "@/lib/types";
import { formatStock } from "@/lib/utils";
import Image from "next/image";

interface ProductCardProps {
  product: ProductWithCategory;
}

export function ProductCard({ product }: ProductCardProps) {
  const isOutOfStock = product.stock === 0;

  return (
    <Card className="group overflow-hidden">
      <div className="relative aspect-square bg-gray-100">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            width={100}
            height={100}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-200"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <Package className="h-12 w-12 text-gray-300" />
          </div>
        )}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <Badge variant="destructive" className="px-3 py-1 text-sm">
              <AlertCircle className="h-4 w-4 mr-1" />
              Sin Stock
            </Badge>
          </div>
        )}
      </div>

      <CardContent>
        <h3 className="text-base font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>
        <div className="mt-2 flex items-center justify-between">
          <Badge variant="secondary" className="text-xs">
            {product.category.name}
          </Badge>
          <span
            className={`text-sm font-medium ${
              isOutOfStock ? "text-red-600" : "text-green-600"
            }`}
          >
            {formatStock(product.stock)}
          </span>
        </div>
        {product.description && (
          <p className="mt-2 text-sm text-gray-600 line-clamp-2">
            {product.description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
