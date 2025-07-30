"use client";

import { useState, useRef } from "react";
import { Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

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

    if (!file.type.startsWith("image/")) {
      setError("Selecciona una imagen válida");
      return;
    }
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
      if (!response.ok)
        throw new Error(result.error || "Error al subir imagen");

      onChange(result.url);
    } catch (err: any) {
      setError(err?.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
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
          <div className="aspect-square w-full max-w-sm mx-auto overflow-hidden rounded-lg border-2 border-gray-200">
            <Image
              src={value}
              alt="Imagen del producto"
              width={100}
              height={100}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform"
            />
          </div>
          <button
            type="button"
            onClick={handleRemove}
            disabled={disabled}
            className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-gray-100 transition-opacity opacity-0 group-hover:opacity-100"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      ) : (
        <div className="aspect-square w-full max-w-sm mx-auto">
          <label
            htmlFor="image-upload"
            className={cn(
              "flex flex-col items-center justify-center h-full border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-white hover:bg-gray-50 transition",
              disabled && "opacity-50 cursor-not-allowed",
              uploading && "cursor-wait"
            )}
          >
            <div className="flex flex-col items-center">
              {uploading ? (
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-600" />
              ) : (
                <Upload className="w-8 h-8 mb-2 text-gray-500" />
              )}
              <span className="text-sm font-medium text-gray-700">
                {uploading ? "Subiendo..." : "Sube tu imagen"}
              </span>
              <span className="text-xs text-gray-500 mt-1">
                PNG, JPG o WEBP (max 5MB)
              </span>
            </div>
            <input
              id="image-upload"
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              disabled={disabled || uploading}
              className="hidden"
            />
          </label>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded p-2 text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
