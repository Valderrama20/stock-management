'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { ProductSchema, ProductInput } from '@/lib/validations';
import { ProductWithCategory } from '@/lib/types';
import { Category } from '@prisma/client';

interface ProductFormProps {
    product?: ProductWithCategory;
    onSuccess: () => void;
}

export function ProductForm({ product, onSuccess }: ProductFormProps) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        watch,
    } = useForm<ProductInput>({
        resolver: zodResolver(ProductSchema),
        defaultValues: product
            ? {
                  name: product.name,
                  description: product.description || '',
                  stock: product.stock,
                  categoryId: product.categoryId,
                  imageUrl: product.imageUrl || '',
              }
            : {
                  name: '',
                  description: '',
                  stock: 0,
                  categoryId: '',
                  imageUrl: '',
              },
    });

    useEffect(() => {
        if (product?.categoryId) {
            setValue('categoryId', product.categoryId);
        }
    }, [product, setValue]);

    const imageUrl = watch('imageUrl');

    useEffect(() => {
        fetch('/api/categories')
            .then((res) => res.json())
            .then((json) => json.data && setCategories(json.data))
            .catch((err) => console.error('Error fetching categories:', err));
    }, []);

    const onSubmit = async (data: ProductInput) => {
        setLoading(true);
        setError(null);
        try {
            const url = product
                ? `/api/products/${product.id}`
                : '/api/products';
            const method = product ? 'PUT' : 'POST';
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            const result = await res.json();
            if (!res.ok)
                throw new Error(result.error || 'Error saving product');
            onSuccess();
            if (!product) reset();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-3">
                    {error}
                </div>
            )}

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Imagen del producto
                </label>
                <ImageUpload
                    value={imageUrl}
                    onChange={(url) => setValue('imageUrl', url)}
                    onRemove={() => setValue('imageUrl', '')}
                    disabled={loading}
                />
                {errors.imageUrl && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.imageUrl.message}
                    </p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre *
                </label>
                <Input
                    {...register('name')}
                    placeholder="Ej: Laptop Dell XPS 13"
                    className="w-full"
                />
                {errors.name && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.name.message}
                    </p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción
                </label>
                <textarea
                    {...register('description')}
                    placeholder="Descripción del producto..."
                    className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-transparent shadow-sm hover:shadow transition-shadow resize-none"
                    rows={3}
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Stock *
                    </label>
                    <Input
                        type="number"
                        min={0}
                        {...register('stock', { valueAsNumber: true })}
                        className="w-full"
                    />
                    {errors.stock && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.stock.message}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Categoría *
                    </label>
                    <Select
                        value={watch('categoryId')}
                        onChange={(e) => setValue('categoryId', e.target.value)}
                        className="w-full"
                    >
                        <option value="">Seleccionar categoría</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </Select>
                    {errors.categoryId && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.categoryId.message}
                        </p>
                    )}
                </div>
            </div>

            <div className="flex justify-end">
                <Button
                    type="submit"
                    size="lg"
                    className="w-full sm:w-auto"
                    disabled={loading}
                >
                    {loading
                        ? 'Guardando...'
                        : product
                          ? 'Actualizar'
                          : 'Crear'}
                </Button>
            </div>
        </form>
    );
}
