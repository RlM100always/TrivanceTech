import React, { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 font-medium transition-all duration-200 ease-out select-none',
  {
    variants: {
      variant: {
        default: 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300',
        primary: 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300',
        secondary: 'bg-secondary-100 text-secondary-700 dark:bg-secondary-900/30 dark:text-secondary-300',
        accent: 'bg-accent-100 text-accent-700 dark:bg-accent-900/30 dark:text-accent-300',
        success: 'bg-success/10 text-success dark:bg-success/20',
        warning: 'bg-warning/10 text-warning dark:bg-warning/20',
        error: 'bg-error/10 text-error dark:bg-error/20',
        info: 'bg-info/10 text-info dark:bg-info/20',
        outline: 'border border-neutral-300 dark:border-neutral-600 bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800',
        ghost: 'bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300',
        dot: 'bg-transparent px-2',
      },
      size: {
        xs: 'px-2 py-0.5 text-[10px] gap-1 rounded',
        sm: 'px-2.5 py-1 text-xs gap-1 rounded-lg',
        md: 'px-3 py-1 text-sm gap-1.5 rounded-xl',
        lg: 'px-4 py-1.5 text-base gap-2 rounded-2xl',
      },
      shape: {
        rounded: 'rounded-xl',
        pill: 'rounded-full',
        square: 'rounded-md',
      },
      dot: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      {
        variant: 'dot',
        className: 'px-2',
      },
    ],
    defaultVariants: {
      variant: 'default',
      size: 'md',
      shape: 'rounded',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dotColor?: string;
  icon?: React.ReactNode;
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, size, shape, dot, dotColor, icon, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(badgeVariants({ variant, size, shape, dot }), className)}
        {...props}
      >
        {variant === 'dot' && (
          <span
            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: dotColor || 'currentColor' }}
            aria-hidden="true"
          />
        )}
        {icon && <span className="flex-shrink-0" aria-hidden="true">{icon}</span>}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

const avatarVariants = cva(
  'inline-flex items-center justify-center font-semibold select-none overflow-hidden bg-neutral-200 dark:bg-neutral-700',
  {
    variants: {
      size: {
        xs: 'w-6 h-6 text-xs',
        sm: 'w-8 h-8 text-sm',
        md: 'w-10 h-10 text-base',
        lg: 'w-12 h-12 text-lg',
        xl: 'w-16 h-16 text-xl',
        '2xl': 'w-20 h-20 text-2xl',
        '3xl': 'w-24 h-24 text-3xl',
      },
      shape: {
        circle: 'rounded-full',
        square: 'rounded-xl',
        rounded: 'rounded-lg',
      },
      variant: {
        default: '',
        bordered: 'ring-2 ring-white dark:ring-neutral-900',
        gradient: 'bg-gradient-to-br from-primary-500 to-secondary-500 text-white',
        image: '',
      },
    },
    defaultVariants: {
      size: 'md',
      shape: 'circle',
      variant: 'default',
    },
  }
);

export interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  src?: string;
  alt?: string;
  fallback?: string;
  status?: 'online' | 'offline' | 'busy' | 'away';
  statusPosition?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, size, shape, variant, src, alt, fallback, status, statusPosition = 'bottom-right', children, ...props }, ref) => {
    const statusVariants = {
      online: 'bg-success',
      offline: 'bg-neutral-400',
      busy: 'bg-error',
      away: 'bg-warning',
    };

    const statusPositions = {
      'bottom-right': 'bottom-0 right-0',
      'bottom-left': 'bottom-0 left-0',
      'top-right': 'top-0 right-0',
      'top-left': 'top-0 left-0',
    };

    const initials = fallback
      ? fallback
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2)
      : children;

    return (
      <div
        ref={ref}
        className={cn(
          avatarVariants({ size, shape, variant }),
          'relative',
          className
        )}
        {...props}
      >
        {src ? (
          <img
            src={src}
            alt={alt || initials || 'Avatar'}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <span className="w-full h-full flex items-center justify-center" aria-hidden="true">
            {initials}
          </span>
        )}
        {status && (
          <span
            className={cn(
              'absolute w-3 h-3 rounded-full ring-2 ring-white dark:ring-neutral-900',
              statusVariants[status],
              statusPositions[statusPosition]
            )}
            aria-label={status}
          />
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';

const avatarGroupVariants = cva('inline-flex -space-x-2', {
  variants: {
    max: {
      true: '',
      false: '',
    },
  },
  defaultVariants: {
    max: false,
  },
});

export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof avatarGroupVariants> {
  max?: number;
  maxAriaLabel?: string;
}

const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ className, max, maxAriaLabel, children, ...props }, ref) => {
    const avatarElements = React.Children.toArray(children);
    const visibleAvatars = max ? avatarElements.slice(0, max) : avatarElements;
    const remainingCount = max && avatarElements.length > max ? avatarElements.length - max : 0;

    return (
      <div
        ref={ref}
        className={cn(avatarGroupVariants({ max }), className)}
        role="group"
        aria-label={maxAriaLabel || 'Avatar group'}
        {...props}
      >
        {visibleAvatars.map((child, index) => (
          <span key={index} className="relative z-[calc(var(--avatar-index, 0) + 1)]">
            {React.isValidElement(child) ? React.cloneElement(child) : child}
          </span>
        ))}
        {remainingCount > 0 && (
          <div
            className={cn(
              avatarVariants({ size: 'md', shape: 'circle', variant: 'default' }),
              'bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400 font-medium'
            )}
            aria-label={`${remainingCount} more people`}
          >
            +{remainingCount}
          </div>
        )}
      </div>
    );
  }
);

AvatarGroup.displayName = 'AvatarGroup';

const dividerVariants = cva('border-0', {
  variants: {
    orientation: {
      horizontal: 'w-full',
      vertical: 'h-full',
    },
    variant: {
      default: 'bg-neutral-200 dark:bg-neutral-700',
      strong: 'bg-neutral-300 dark:bg-neutral-600',
      subtle: 'bg-neutral-100 dark:bg-neutral-800',
      gradient: 'bg-gradient-to-r from-transparent via-primary-500/50 to-transparent',
      dashed: 'border-t-2 border-dashed border-neutral-200 dark:border-neutral-700',
      dotted: 'border-t-2 border-dotted border-neutral-200 dark:border-neutral-700',
    },
    size: {
      xs: 'h-px',
      sm: 'h-0.5',
      md: 'h-1',
      lg: 'h-2',
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
    variant: 'default',
    size: 'xs',
  },
});

export interface DividerProps
  extends React.HTMLAttributes<HTMLHRElement>,
    VariantProps<typeof dividerVariants> {
  label?: string;
}

const Divider = forwardRef<HTMLHRElement, DividerProps>(
  ({ className, orientation, variant, size, label, ...props }, ref) => {
    if (label) {
      return (
        <div className={cn('flex items-center gap-4', className)} role="separator" aria-label={label} {...props}>
          <div className={cn(dividerVariants({ orientation: 'horizontal', variant, size }), 'flex-1')} />
          <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400 whitespace-nowrap flex-shrink-0">
            {label}
          </span>
          <div className={cn(dividerVariants({ orientation: 'horizontal', variant, size }), 'flex-1')} />
        </div>
      );
    }

    return (
      <hr
        ref={ref}
        className={cn(dividerVariants({ orientation, variant, size }), className)}
        role="separator"
        {...props}
      />
    );
  }
);

Divider.displayName = 'Divider';

const tooltipVariants = cva(
  'absolute z-[var(--z-tooltip)] px-3 py-1.5 text-xs font-medium text-white bg-neutral-900 dark:bg-neutral-100 dark:text-neutral-900 rounded-lg shadow-lg pointer-events-none',
  {
    variants: {
      side: {
        top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
        left: 'right-full top-1/2 -translate-y-1/2 mr-2',
        right: 'left-full top-1/2 -translate-y-1/2 ml-2',
      },
      align: {
        start: '',
        center: '',
        end: '',
      },
    },
    defaultVariants: {
      side: 'top',
      align: 'center',
    },
  }
);

const tooltipArrowVariants = cva(
  'absolute w-2 h-2 bg-neutral-900 dark:bg-neutral-100 rotate-45',
  {
    variants: {
      side: {
        top: 'bottom-[-4px] left-1/2 -translate-x-1/2',
        bottom: 'top-[-4px] left-1/2 -translate-x-1/2',
        left: 'right-[-4px] top-1/2 -translate-y-1/2',
        right: 'left-[-4px] top-1/2 -translate-y-1/2',
      },
    },
    defaultVariants: {
      side: 'top',
    },
  }
);

export interface TooltipProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof tooltipVariants> {
  content: React.ReactNode;
  children: React.ReactElement;
  side?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
  delay?: number;
  disabled?: boolean;
}

const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  ({ className, content, children, side = 'top', align = 'center', delay = 200, disabled, ...props }, ref) => {
    const [isVisible, setIsVisible] = React.useState(false);
    const timeoutRef = React.useRef<NodeJS.Timeout>();

    const showTooltip = () => {
      if (disabled) return;
      timeoutRef.current = setTimeout(() => setIsVisible(true), delay);
    };

    const hideTooltip = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setIsVisible(false);
    };

    React.useEffect(() => {
      return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
    }, []);

    if (!React.isValidElement(children)) {
      return <>{children}</>;
    }

    return (
      <div
        ref={ref}
        className={cn('relative inline-block', className)}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        {...props}
      >
        {React.cloneElement(children, {
          onMouseEnter: showTooltip,
          onMouseLeave: hideTooltip,
          onFocus: showTooltip,
          onBlur: hideTooltip,
        })}
        {isVisible && (
          <div
            className={cn(tooltipVariants({ side, align }), className)}
            role="tooltip"
            aria-label={typeof content === 'string' ? content : undefined}
          >
            {typeof content === 'string' ? <span>{content}</span> : content}
            <div className={cn(tooltipArrowVariants({ side }))} aria-hidden="true" />
          </div>
        )}
      </div>
    );
  }
);

Tooltip.displayName = 'Tooltip';

export { Badge, Avatar, AvatarGroup, Divider, Tooltip, badgeVariants, avatarVariants, avatarGroupVariants, dividerVariants, tooltipVariants };