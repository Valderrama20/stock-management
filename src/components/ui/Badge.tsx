import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline";
}

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  const baseStyles =
    "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition-all";
  const variantStyles = {
    default: "bg-gray-100 text-gray-800", // fondo claro, texto oscuro
    secondary: "bg-blue-50 text-blue-600", // fondo azul suave, texto azul
    destructive: "bg-red-50 text-red-600", // fondo rojo suave, texto rojo
    outline: "border border-gray-300 text-gray-800", // borde gris claro, texto oscuro
  };

  return (
    <div
      className={cn(baseStyles, variantStyles[variant], className)}
      {...props}
    />
  );
}
