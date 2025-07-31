import * as React from 'react';
import { cn } from '@/lib/utils';

// Tarjeta base con sombras suaves y bordes redondeados estilo Wallapop
const Card = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            'bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border-transparent overflow-hidden',
            className
        )}
        {...props}
    />
));
Card.displayName = 'Card';

// Header de tarjeta con fondo semitransparente ligero
const CardHeader = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            'bg-gradient-to-br from-white/90 to-white/70 p-4',
            className
        )}
        {...props}
    />
));
CardHeader.displayName = 'CardHeader';

// Título destacado dentro de la tarjeta
const CardTitle = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
    <h3
        ref={ref}
        className={cn(
            'text-lg font-semibold text-gray-900 truncate',
            className
        )}
        {...props}
    />
));
CardTitle.displayName = 'CardTitle';

// Contenido principal con padding y espaciado
const CardContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-4 space-y-2', className)} {...props} />
));
CardContent.displayName = 'CardContent';

export { Card, CardHeader, CardTitle, CardContent };
