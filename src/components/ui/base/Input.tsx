import React, { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const inputVariants = cva(
  'w-full font-medium transition-all duration-200 ease-out bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-500 dark:placeholder:text-neutral-400 disabled:opacity-50 disabled:cursor-not-allowed selection:bg-primary-500/30',
  {
    variants: {
      variant: {
        default: 'border border-neutral-300 dark:border-neutral-600 hover:border-neutral-400 dark:hover:border-neutral-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20',
        outline: 'border-2 border-neutral-300 dark:border-neutral-600 hover:border-neutral-400 dark:hover:border-neutral-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20',
        filled: 'bg-neutral-100 dark:bg-neutral-800 border border-transparent hover:bg-neutral-200 dark:hover:bg-neutral-700 focus:bg-white dark:focus:bg-neutral-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20',
        flushed: 'border-0 border-b-2 border-neutral-300 dark:border-neutral-600 bg-transparent hover:border-neutral-400 dark:hover:border-neutral-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 rounded-none',
        underlined: 'border-0 border-b border-neutral-300 dark:border-neutral-600 bg-transparent hover:border-neutral-400 dark:hover:border-neutral-500 focus:border-primary-500 focus:ring-0 rounded-none',
      },
      size: {
        sm: 'px-3 py-2 text-sm rounded-lg',
        md: 'px-4 py-3 text-base rounded-xl',
        lg: 'px-5 py-4 text-lg rounded-2xl',
      },
      radius: {
        none: 'rounded-none',
        sm: 'rounded-md',
        md: 'rounded-lg',
        lg: 'rounded-xl',
        xl: 'rounded-2xl',
        full: 'rounded-full',
      },
      error: {
        true: 'border-error focus:border-error focus:ring-error/20',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      radius: 'lg',
    },
  }
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      variant,
      size,
      radius,
      error,
      label,
      helperText,
      leftIcon,
      rightIcon,
      id,
      disabled,
      required,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).slice(2, 9)}`;
    const errorId = error ? `${inputId}-error` : undefined;
    const helperId = helperText ? `${inputId}-helper` : undefined;
    const describedBy = [errorId, helperId].filter(Boolean).join(' ') || undefined;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
          >
            {label}
            {required && <span className="text-error ml-1" aria-hidden="true">*</span>}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 dark:text-neutral-400 pointer-events-none"
              aria-hidden="true"
            >
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              inputVariants({ variant, size, radius, error: !!error }),
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              className
            )}
            disabled={disabled}
            required={required}
            aria-invalid={!!error}
            aria-describedby={describedBy}
            {...props}
          />
          {rightIcon && (
            <div
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 dark:text-neutral-400 pointer-events-none"
              aria-hidden="true"
            >
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p id={errorId} className="mt-1.5 text-sm text-error flex items-center gap-1" role="alert">
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={helperId} className="mt-1.5 text-sm text-neutral-500 dark:text-neutral-400">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

const textareaVariants = cva(
  'w-full font-medium transition-all duration-200 ease-out resize-y bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-500 dark:placeholder:text-neutral-400 disabled:opacity-50 disabled:cursor-not-allowed selection:bg-primary-500/30',
  {
    variants: {
      variant: {
        default: 'border border-neutral-300 dark:border-neutral-600 hover:border-neutral-400 dark:hover:border-neutral-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20',
        outline: 'border-2 border-neutral-300 dark:border-neutral-600 hover:border-neutral-400 dark:hover:border-neutral-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20',
        filled: 'bg-neutral-100 dark:bg-neutral-800 border border-transparent hover:bg-neutral-200 dark:hover:bg-neutral-700 focus:bg-white dark:focus:bg-neutral-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20',
      },
      size: {
        sm: 'px-3 py-2 text-sm rounded-lg min-h-[80px]',
        md: 'px-4 py-3 text-base rounded-xl min-h-[100px]',
        lg: 'px-5 py-4 text-lg rounded-2xl min-h-[120px]',
      },
      error: {
        true: 'border-error focus:border-error focus:ring-error/20',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant, size, error, label, helperText, id, disabled, required, ...props }, ref) => {
    const textareaId = id || `textarea-${Math.random().toString(36).slice(2, 9)}`;
    const errorId = error ? `${textareaId}-error` : undefined;
    const helperId = helperText ? `${textareaId}-helper` : undefined;
    const describedBy = [errorId, helperId].filter(Boolean).join(' ') || undefined;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
          >
            {label}
            {required && <span className="text-error ml-1" aria-hidden="true">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(textareaVariants({ variant, size, error: !!error }), className)}
          disabled={disabled}
          required={required}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          {...props}
        />
        {error && (
          <p id={errorId} className="mt-1.5 text-sm text-error flex items-center gap-1" role="alert">
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={helperId} className="mt-1.5 text-sm text-neutral-500 dark:text-neutral-400">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

const selectVariants = cva(
  'w-full font-medium transition-all duration-200 ease-out appearance-none bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed selection:bg-primary-500/30',
  {
    variants: {
      variant: {
        default: 'border border-neutral-300 dark:border-neutral-600 hover:border-neutral-400 dark:hover:border-neutral-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20',
        outline: 'border-2 border-neutral-300 dark:border-neutral-600 hover:border-neutral-400 dark:hover:border-neutral-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20',
        filled: 'bg-neutral-100 dark:bg-neutral-800 border border-transparent hover:bg-neutral-200 dark:hover:bg-neutral-700 focus:bg-white dark:focus:bg-neutral-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20',
      },
      size: {
        sm: 'px-3 py-2 text-sm rounded-lg pr-10',
        md: 'px-4 py-3 text-base rounded-xl pr-10',
        lg: 'px-5 py-4 text-lg rounded-2xl pr-12',
      },
      error: {
        true: 'border-error focus:border-error focus:ring-error/20',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement>,
    VariantProps<typeof selectVariants> {
  label?: string;
  error?: string;
  helperText?: string;
  options: { value: string; label: string; disabled?: boolean }[];
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, variant, size, error, label, helperText, options, placeholder, id, disabled, required, ...props }, ref) => {
    const selectId = id || `select-${Math.random().toString(36).slice(2, 9)}`;
    const errorId = error ? `${selectId}-error` : undefined;
    const helperId = helperText ? `${selectId}-helper` : undefined;
    const describedBy = [errorId, helperId].filter(Boolean).join(' ') || undefined;

    return (
      <div className="w-full relative">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
          >
            {label}
            {required && <span className="text-error ml-1" aria-hidden="true">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(selectVariants({ variant, size, error: !!error }), className)}
            disabled={disabled}
            required={required}
            aria-invalid={!!error}
            aria-describedby={describedBy}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value} disabled={option.disabled}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500 dark:text-neutral-400" aria-hidden="true">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {error && (
          <p id={errorId} className="mt-1.5 text-sm text-error flex items-center gap-1" role="alert">
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={helperId} className="mt-1.5 text-sm text-neutral-500 dark:text-neutral-400">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

const checkboxVariants = cva(
  'relative appearance-none cursor-pointer transition-all duration-200 ease-out border-2 flex items-center justify-center bg-white dark:bg-neutral-900',
  {
    variants: {
      size: {
        sm: 'w-4 h-4 rounded',
        md: 'w-5 h-5 rounded-lg',
        lg: 'w-6 h-6 rounded-lg',
      },
      checked: {
        true: 'bg-primary-600 border-primary-600',
        false: 'border-neutral-300 dark:border-neutral-600 hover:border-primary-500',
      },
      error: {
        true: 'border-error bg-error/10',
        false: '',
      },
      indeterminate: {
        true: 'bg-primary-600 border-primary-600',
        false: '',
      },
    },
    defaultVariants: {
      size: 'md',
      checked: false,
      error: false,
      indeterminate: false,
    },
  }
);

export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof checkboxVariants> {
  label?: string;
  description?: string;
  indeterminate?: boolean;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, size, checked, error, indeterminate, label, description, id, disabled, required, ...props }, ref) => {
    const checkboxId = id || `checkbox-${Math.random().toString(36).slice(2, 9)}`;
    const descriptionId = description ? `${checkboxId}-description` : undefined;

    return (
      <div className="flex items-start gap-3">
        <div className="relative flex-shrink-0 mt-0.5">
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            className={cn(
              checkboxVariants({ size, checked, error, indeterminate }),
              'peer sr-only',
              className
            )}
            checked={checked}
            disabled={disabled}
            required={required}
            aria-describedby={descriptionId}
            aria-checked={indeterminate ? 'mixed' : checked}
            {...props}
          />
          <div
            className={cn(
              checkboxVariants({ size, checked, error, indeterminate }),
              'pointer-events-none'
            )}
            aria-hidden="true"
          >
            {indeterminate && (
              <svg className="absolute inset-0 w-full h-full text-white dark:text-neutral-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            )}
            {checked && !indeterminate && (
              <svg className="absolute inset-0 w-full h-full text-white dark:text-neutral-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </div>
        </div>
        {(label || description) && (
          <div className="flex flex-col">
            {label && (
              <label
                htmlFor={checkboxId}
                className="text-sm font-medium text-neutral-700 dark:text-neutral-300 cursor-pointer select-none"
              >
                {label}
              </label>
            )}
            {description && (
              <p id={descriptionId} className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
                {description}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

const radioVariants = cva(
  'relative appearance-none cursor-pointer transition-all duration-200 ease-out border-2 flex items-center justify-center bg-white dark:bg-neutral-900',
  {
    variants: {
      size: {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6',
      },
      checked: {
        true: 'border-primary-600',
        false: 'border-neutral-300 dark:border-neutral-600 hover:border-primary-500',
      },
      error: {
        true: 'border-error',
        false: '',
      },
    },
    defaultVariants: {
      size: 'md',
      checked: false,
      error: false,
    },
  }
);

export interface RadioProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof radioVariants> {
  label?: string;
  description?: string;
}

const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ className, size, checked, error, label, description, id, disabled, required, ...props }, ref) => {
    const radioId = id || `radio-${Math.random().toString(36).slice(2, 9)}`;
    const descriptionId = description ? `${radioId}-description` : undefined;

    return (
      <div className="flex items-start gap-3">
        <div className="relative flex-shrink-0 mt-0.5">
          <input
            ref={ref}
            type="radio"
            id={radioId}
            className={cn(
              radioVariants({ size, checked, error }),
              'peer sr-only rounded-full',
              className
            )}
            checked={checked}
            disabled={disabled}
            required={required}
            aria-describedby={descriptionId}
            {...props}
          />
          <div
            className={cn(
              radioVariants({ size, checked, error }),
              'pointer-events-none rounded-full'
            )}
            aria-hidden="true"
          >
            {checked && (
              <div className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-primary-600" aria-hidden="true" />
            )}
          </div>
        </div>
        {(label || description) && (
          <div className="flex flex-col">
            {label && (
              <label
                htmlFor={radioId}
                className="text-sm font-medium text-neutral-700 dark:text-neutral-300 cursor-pointer select-none"
              >
                {label}
              </label>
            )}
            {description && (
              <p id={descriptionId} className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
                {description}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Radio.displayName = 'Radio';

const labelVariants = cva('block text-sm font-medium text-neutral-700 dark:text-neutral-300', {
  variants: {
    required: {
      true: 'after:content-["*"] after:text-error after:ml-1',
      false: '',
    },
  },
  defaultVariants: {
    required: false,
  },
});

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement>, VariantProps<typeof labelVariants> {}

const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, required, children, ...props }, ref) => {
    return (
      <label ref={ref} className={cn(labelVariants({ required }), className)} {...props}>
        {children}
      </label>
    );
  }
);

Label.displayName = 'Label';

export { Input, Textarea, Select, Checkbox, Radio, Label, inputVariants, textareaVariants, selectVariants, checkboxVariants, radioVariants, labelVariants };