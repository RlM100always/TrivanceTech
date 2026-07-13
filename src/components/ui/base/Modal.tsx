import React, { forwardRef, useEffect, useCallback } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { modalVariants, modalBackdropVariants } from '../../styles/motion';

const modalVariantsCva = cva('fixed inset-0 z-[var(--z-modal-backdrop)] flex items-center justify-center p-4', {
  variants: {
    size: {
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg',
      xl: 'max-w-xl',
      '2xl': 'max-w-2xl',
      '3xl': 'max-w-3xl',
      '4xl': 'max-w-4xl',
      '5xl': 'max-w-5xl',
      full: 'max-w-full',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

const modalContentVariants = cva(
  'relative w-full bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl overflow-hidden',
  {
    variants: {
      variant: {
        default: '',
        centered: '',
        bottom: '',
        fullscreen: 'h-full max-h-full rounded-none',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface ModalProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof modalVariantsCva> {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | 'full';
  variant?: 'default' | 'centered' | 'bottom' | 'fullscreen';
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

const Modal = forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      isOpen,
      onClose,
      title,
      description,
      children,
      size = 'md',
      variant = 'default',
      closeOnOverlayClick = true,
      closeOnEscape = true,
      showCloseButton = true,
      header,
      footer,
      className,
      ...props
    },
    ref
  ) => {
    const handleKeyDown = useCallback(
      (event: KeyboardEvent) => {
        if (event.key === 'Escape' && closeOnEscape) {
          onClose();
        }
      },
      [closeOnEscape, onClose]
    );

    useEffect(() => {
      if (isOpen) {
        document.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';
      }
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'unset';
      };
    }, [isOpen, handleKeyDown]);

    const handleOverlayClick = (event: React.MouseEvent) => {
      if (closeOnOverlayClick && event.target === event.currentTarget) {
        onClose();
      }
    };

    if (!isOpen) return null;

    return (
      <AnimatePresence>
        <motion.div
          {...modalBackdropVariants}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={handleOverlayClick}
          role="presentation"
        />
        <div
          ref={ref}
          className={cn(modalVariantsCva({ size }), className)}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? 'modal-title' : undefined}
          aria-describedby={description ? 'modal-description' : undefined}
          {...props}
        >
          <motion.div
            {...modalVariants}
            className={cn(modalContentVariants({ variant }), 'max-h-[90vh] flex flex-col')}
          >
            {(header || title || showCloseButton) && (
              <div className="flex items-start justify-between p-6 border-b border-neutral-200 dark:border-neutral-700">
                <div>
                  {header ? (
                    header
                  ) : (
                    <>
                      {title && (
                        <h2 id="modal-title" className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                          {title}
                        </h2>
                      )}
                      {description && (
                        <p id="modal-description" className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                          {description}
                        </p>
                      )}
                    </>
                  )}
                </div>
                {showCloseButton && (
                  <button
                    onClick={onClose}
                    className="p-2 rounded-lg text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
                    aria-label="Close modal"
                  >
                    <X className="w-5 h-5" aria-hidden="true" />
                  </button>
                )}
              </div>
            )}
            <div className="flex-1 overflow-y-auto p-6">{children}</div>
            {footer && (
              <div className="flex items-center justify-end gap-3 p-6 border-t border-neutral-200 dark:border-neutral-700">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      </AnimatePresence>
    );
  }
);

Modal.displayName = 'Modal';

const drawerVariants = cva('fixed inset-0 z-[var(--z-modal-backdrop)] flex', {
  variants: {
    side: {
      left: 'items-start justify-start',
      right: 'items-end justify-end',
      top: 'items-start justify-center',
      bottom: 'items-end justify-center',
    },
  },
  defaultVariants: {
    side: 'right',
  },
});

const drawerContentVariants = cva(
  'relative bg-white dark:bg-neutral-900 shadow-2xl flex flex-col max-h-full',
  {
    variants: {
      side: {
        left: 'h-full w-full max-w-sm rounded-r-2xl',
        right: 'h-full w-full max-w-sm rounded-l-2xl',
        top: 'w-full h-auto max-h-[50vh] rounded-b-2xl',
        bottom: 'w-full h-auto max-h-[50vh] rounded-t-2xl',
      },
      size: {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        full: 'max-w-full',
      },
    },
    defaultVariants: {
      side: 'right',
      size: 'md',
    },
  }
);

export interface DrawerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof drawerVariants> {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  side?: 'left' | 'right' | 'top' | 'bottom';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

const Drawer = forwardRef<HTMLDivElement, DrawerProps>(
  (
    {
      isOpen,
      onClose,
      title,
      description,
      children,
      side = 'right',
      size = 'md',
      closeOnOverlayClick = true,
      closeOnEscape = true,
      showCloseButton = true,
      header,
      footer,
      className,
      ...props
    },
    ref
  ) => {
    const handleKeyDown = useCallback(
      (event: KeyboardEvent) => {
        if (event.key === 'Escape' && closeOnEscape) {
          onClose();
        }
      },
      [closeOnEscape, onClose]
    );

    useEffect(() => {
      if (isOpen) {
        document.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';
      }
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'unset';
      };
    }, [isOpen, handleKeyDown]);

    const handleOverlayClick = (event: React.MouseEvent) => {
      if (closeOnOverlayClick && event.target === event.currentTarget) {
        onClose();
      }
    };

    if (!isOpen) return null;

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={handleOverlayClick}
          role="presentation"
        />
        <div ref={ref} className={cn(drawerVariants({ side }), className)} {...props}>
          <motion.div
            initial={{ opacity: 0, x: side === 'left' ? -100 : side === 'right' ? 100 : 0, y: side === 'top' ? -100 : side === 'bottom' ? 100 : 0 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: side === 'left' ? -100 : side === 'right' ? 100 : 0, y: side === 'top' ? -100 : side === 'bottom' ? 100 : 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className={cn(drawerContentVariants({ side, size }), 'flex flex-col')}
          >
            {(header || title || showCloseButton) && (
              <div className="flex items-start justify-between p-6 border-b border-neutral-200 dark:border-neutral-700 flex-shrink-0">
                <div>
                  {header ? (
                    header
                  ) : (
                    <>
                      {title && (
                        <h2 id="drawer-title" className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                          {title}
                        </h2>
                      )}
                      {description && (
                        <p id="drawer-description" className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                          {description}
                        </p>
                      )}
                    </>
                  )}
                </div>
                {showCloseButton && (
                  <button
                    onClick={onClose}
                    className="p-2 rounded-lg text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
                    aria-label="Close drawer"
                  >
                    <X className="w-5 h-5" aria-hidden="true" />
                  </button>
                )}
              </div>
            )}
            <div className="flex-1 overflow-y-auto p-6">{children}</div>
            {footer && (
              <div className="flex items-center justify-end gap-3 p-6 border-t border-neutral-200 dark:border-neutral-700 flex-shrink-0">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      </AnimatePresence>
    );
  }
);

Drawer.displayName = 'Drawer';

const dialogVariants = cva('fixed inset-0 z-[var(--z-modal-backdrop)] flex items-center justify-center p-4', {
  variants: {},
});

const dialogContentVariants = cva(
  'relative w-full max-w-md bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl overflow-hidden',
  {
    variants: {
      variant: {
        default: '',
        alert: '',
        confirm: '',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface DialogProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof dialogContentVariants> {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  variant?: 'default' | 'alert' | 'confirm';
  showCloseButton?: boolean;
  action?: React.ReactNode;
  cancelAction?: React.ReactNode;
}

const Dialog = forwardRef<HTMLDivElement, DialogProps>(
  ({ isOpen, onClose, title, description, children, variant = 'default', action, cancelAction, className, ...props }, ref) => {
    const handleKeyDown = useCallback(
      (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          onClose();
        }
      },
      [onClose]
    );

    useEffect(() => {
      if (isOpen) {
        document.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';
      }
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'unset';
      };
    }, [isOpen, handleKeyDown]);

    if (!isOpen) return null;

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
          role="presentation"
        />
        <div ref={ref} className={cn(dialogVariants(), className)} {...props}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className={cn(dialogContentVariants({ variant }))}
          >
            <div className="p-6">
              {title && (
                <h2 id="dialog-title" className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                  {title}
                </h2>
              )}
              {description && (
                <p id="dialog-description" className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                  {description}
                </p>
              )}
              <div className="mt-4">{children}</div>
            </div>
            {(action || cancelAction) && (
              <div className="flex items-center justify-end gap-3 p-6 border-t border-neutral-200 dark:border-neutral-700">
                {cancelAction && (
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-500"
                  >
                    {cancelAction}
                  </button>
                )}
                {action && (
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  >
                    {action}
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </AnimatePresence>
    );
  }
);

Dialog.displayName = 'Dialog';

export { Modal, Drawer, Dialog, modalVariantsCva, modalContentVariants, drawerVariants, drawerContentVariants, dialogVariants, dialogContentVariants };