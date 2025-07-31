import { Category, Product } from '@prisma/client';

export type ProductWithCategory = Product & {
    category: Category;
};

export interface SearchFilters {
    search?: string;
    categoryId?: string;
    inStock?: boolean;
}

export interface ApiResponse<T> {
    data?: T;
    error?: string;
    message?: string;
}
