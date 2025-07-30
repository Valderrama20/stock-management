import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost";
  size?: "default" | "sm" | "lg";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      type = "button",
      ...props
    },
    ref
  ) => {
    const base =
      "inline-flex items-center justify-center font-medium rounded-full transition-shadow focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer";
    const variants = {
      default: "bg-white text-gray-800 shadow-sm hover:shadow-md",
      secondary: "bg-blue-50 text-blue-600 hover:bg-blue-100",
      destructive: "bg-red-50 text-red-600 hover:bg-red-100",
      outline:
        "bg-transparent border border-gray-300 text-gray-800 hover:bg-gray-50",
      ghost: "bg-transparent text-gray-800 hover:bg-gray-100",
    };
    const sizes = {
      sm: "px-3 py-1 text-xs",
      default: "px-5 py-2 text-sm",
      lg: "px-6 py-3 text-base",
    };

    return (
      <button
        ref={ref}
        type={type}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
