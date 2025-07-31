"use client";

import { Modal } from "@/components/ui/Modal";
import { CategoryForm } from "@/components/category/CategoryForm";

interface CategoryModalProps {
  onClose: () => void;
}

export function CategoryModal({ onClose }: CategoryModalProps) {
  return (
    <Modal isOpen={true} onClose={onClose} title="Crear Categoría">
      <CategoryForm onSuccess={onClose} />
    </Modal>
  );
}
