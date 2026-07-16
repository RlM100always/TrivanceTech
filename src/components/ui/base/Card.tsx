import React, { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const cardVariants = cva(
  'transition-all duration-300 ease-out bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700',
  {
    variants: {
      variant: {
        default: 'rounded-2xl shadow-sm',
        elevated: 'rounded-2xl shadow-lg hover:shadow-xl',
        outlined: 'rounded-2xl border-2 border-neutral-200 dark:border-neutral-700',
        glass: 'rounded-2xl bg-white/10 dark:bg-neutral-900/10 backdrop-blur-xl border-white/20 dark:border-neutral-800/20',
        gradient: 'rounded-2xl bg-gradient-to-br from-primary-500/10 via-transparent to-primary-500/10 border-primary-500/20 dark:from-primary-500/20 dark:to-primary-500/20',
        interactive: 'rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 cursor-pointer',
        featured: 'rounded-2xl shadow-xl border-primary-500/30 bg-gradient-to-br from-primary-500/5 to-transparent',
      },
      padding: {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
        xl: 'p-10',
      },
      hover: {
        true: 'hover:shadow-lg hover:-translate-y-1 transition-all duration-300',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'md',
      hover: false,
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, hover, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(cardVariants({ variant, padding, hover }), className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

const cardHeaderVariants = cva('mb-4', {
  variants: {
    align: {
      left: '',
      center: 'text-center',
      right: 'text-right',
    },
  },
  defaultVariants: {
    align: 'left',
  },
});

export interface CardHeaderProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardHeaderVariants> {}

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, align, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(cardHeaderVariants({ align }), className)} {...props}>
        {children}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

const cardTitleVariants = cva('font-display font-bold tracking-tight', {
  variants: {
    size: {
      sm: 'text-xl',
      md: 'text-2xl',
      lg: 'text-3xl',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export interface CardTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof cardTitleVariants> {}

const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, size, children, ...props }, ref) => {
    return (
      <h3 ref={ref} className={cn(cardTitleVariants({ size }), className)} {...props}>
        {children}
      </h3>
    );
  }
);

CardTitle.displayName = 'CardTitle';

const cardDescriptionVariants = cva('text-neutral-600 dark:text-neutral-400', {
  variants: {
    size: {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export interface CardDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof cardDescriptionVariants> {}

const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, size, children, ...props }, ref) => {
    return (
      <p ref={ref} className={cn(cardDescriptionVariants({ size }), className)} {...props}>
        {children}
      </p>
    );
  }
);

CardDescription.displayName = 'CardDescription';

const cardContentVariants = cva('', {
  variants: {
    align: {
      left: '',
      center: 'text-center',
      right: 'text-right',
    },
  },
  defaultVariants: {
    align: 'left',
  },
});

export interface CardContentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardContentVariants> {}

const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, align, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(cardContentVariants({ align }), className)} {...props}>
        {children}
      </div>
    );
  }
);

CardContent.displayName = 'CardContent';

const cardFooterVariants = cva('mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700 flex items-center gap-3', {
  variants: {
    align: {
      left: 'justify-start',
      center: 'justify-center',
      right: 'justify-end',
      between: 'justify-between',
    },
  },
  defaultVariants: {
    align: 'left',
  },
});

export interface CardFooterProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardFooterVariants> {}

const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, align, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(cardFooterVariants({ align }), className)} {...props}>
        {children}
      </div>
    );
  }
);

CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };