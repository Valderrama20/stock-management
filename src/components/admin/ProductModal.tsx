'use client';

import { Modal } from '@/components/ui/Modal';
import { ProductForm } from '@/components/product/ProductForm';
import type { ProductWithCategory } from '@/lib/types';

interface ProductModalProps {
    product: ProductWithCategory | null;
    onClose: () => void;
}

export function ProductModal({ product, onClose }: ProductModalProps) {
    return (
        <Modal
            isOpen={true}
            onClose={onClose}
            title={product ? 'Editar Producto' : 'Nuevo Producto'}
        >
            <ProductForm product={product || undefined} onSuccess={onClose} />
        </Modal>
    );
}
