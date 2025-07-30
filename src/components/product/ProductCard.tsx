import { Package, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProductWithCategory } from "@/lib/types";
import { formatStock } from "@/lib/utils";

interface ProductCardProps {
  product: ProductWithCategory;
}

export function ProductCard({ product }: ProductCardProps) {
  const isOutOfStock = product.stock === 0;

  return (
    <Card className="group hover:shadow-md transition-shadow duration-200 overflow-hidden">
      <div className="aspect-square relative bg-gray-100 overflow-hidden">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="h-12 w-12 text-gray-400" />
          </div>
        )}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="destructive" className="text-white">
              <AlertCircle className="h-3 w-3 mr-1" />
              Sin Stock
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          <h3 className="font-medium text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>

          <div className="flex items-center justify-between">
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
            <p className="text-sm text-gray-600 line-clamp-2">
              {product.description}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
