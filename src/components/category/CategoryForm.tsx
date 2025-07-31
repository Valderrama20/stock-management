'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CategorySchema } from '@/lib/validations';

interface CategoryFormProps {
    onSuccess: () => void;
}

export function CategoryForm({ onSuccess }: CategoryFormProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
    } = useForm<{ name: string }>({
        resolver: zodResolver(CategorySchema.pick({ name: true })),
        defaultValues: { name: '' },
    });

    const generateSlug = (name: string) =>
        name
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');

    const onSubmit = async () => {
        setLoading(true);
        setError(null);
        const { name } = getValues();
        try {
            const slug = generateSlug(name);
            const res = await fetch('/api/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, slug }),
            });
            const result = await res.json();
            if (!res.ok)
                throw new Error(result.error || 'Error al crear categoría');
            onSuccess();
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre de la categoría *
                </label>
                <Input {...register('name')} placeholder="Ej: Electrónica" />
                {errors.name && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.name.message}
                    </p>
                )}
            </div>

            <div className="flex justify-end">
                <Button
                    type="submit"
                    size="lg"
                    className="w-full sm:w-auto"
                    disabled={loading}
                >
                    {loading ? 'Guardando...' : 'Crear Categoría'}
                </Button>
            </div>
        </form>
    );
}
