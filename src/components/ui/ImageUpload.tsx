"use client";

import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { Button } from "./Button";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove: () => void;
  disabled?: boolean;
  className?: string;
}

export function ImageUpload({
  value,
  onChange,
  onRemove,
  disabled,
  className,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith("image/")) {
      setError("Por favor selecciona una imagen válida");
      return;
    }

    // Validar tamaño (5MB máximo)
    if (file.size > 5 * 1024 * 1024) {
      setError("La imagen debe ser menor a 5MB");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Error al subir imagen");
      }

      onChange(result.url);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Error al subir imagen"
      );
    } finally {
      setUploading(false);
      // Limpiar el input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = () => {
    onRemove();
    setError(null);
  };

  return (
    <div className={cn("space-y-2", className)}>
      {value ? (
        <div className="relative group">
          <div className="aspect-square w-full max-w-xs mx-auto overflow-hidden rounded-lg border-2 border-dashed border-gray-300">
            <img
              src={value}
              alt="Imagen del producto"
              className="w-full h-full object-cover"
            />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleRemove}
            disabled={disabled}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="aspect-square w-full max-w-xs mx-auto">
          <label
            htmlFor="image-upload"
            className={cn(
              "flex flex-col items-center justify-center w-full h-full border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors",
              disabled && "cursor-not-allowed opacity-50",
              uploading && "cursor-wait"
            )}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              {uploading ? (
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
              ) : (
                <ImageIcon className="w-8 h-8 mb-4 text-gray-500" />
              )}
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">
                  {uploading ? "Subiendo..." : "Click para subir"}
                </span>
              </p>
              <p className="text-xs text-gray-500">
                PNG, JPG o WEBP (MAX. 5MB)
              </p>
            </div>
            <input
              id="image-upload"
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileSelect}
              disabled={disabled || uploading}
            />
          </label>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
}
