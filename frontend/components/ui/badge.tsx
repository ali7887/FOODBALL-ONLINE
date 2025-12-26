import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-tm-green text-white hover:bg-tm-green/80',
        secondary: 'border-transparent bg-tm-lightGreen text-black hover:bg-tm-lightGreen/80',
        destructive: 'border-transparent bg-red-600 text-white hover:bg-red-600/80',
        outline: 'text-gray-700 border-gray-300',
        food: 'border-transparent bg-food-orange text-white hover:bg-food-orange/80',
        success: 'border-transparent bg-green-600 text-white hover:bg-green-600/80',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };

