import * as React from 'react';
import { cn } from '@/lib/utils';

const Select = React.forwardRef<
    HTMLSelectElement,
    React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, ...props }, ref) => {
    return (
        <select
            ref={ref}
            className={cn(
                'w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent shadow-sm hover:shadow transition-shadow cursor-pointer',
                className
            )}
            {...props}
        >
            {children}
        </select>
    );
});
Select.displayName = 'Select';

export { Select };
