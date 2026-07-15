import React, { forwardRef, ButtonHTMLAttributes, ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style variant of the button */
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  /** Size of the button */
  size?: 'sm' | 'md' | 'lg';
  /** Optional icon to display on the left side */
  leftIcon?: LucideIcon;
  /** Optional icon to display on the right side */
  rightIcon?: LucideIcon;
  /** Shows loading spinner and disables button interactions */
  isLoading?: boolean;
  /** Makes button take full width of its container */
  fullWidth?: boolean;
  /** Button content */
  children: ReactNode;
}

/**
 * Reusable Button component with multiple variants, sizes, and states.
 * Follows accessibility best practices with proper ARIA attributes.
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      isLoading = false,
      fullWidth = false,
      children,
      className = '',
      disabled,
      type = 'button',
      ...props
    },
    ref
  ) => {
    // Base styles that apply to all button variants
    const baseStyles =
      'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';

    // Size-specific styling
    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    // Variant-specific styling
    const variantStyles = {
      primary:
        'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 focus-visible:ring-blue-500 shadow-sm hover:shadow',
      secondary:
        'bg-gray-200 text-gray-800 hover:bg-gray-300 active:bg-gray-400 focus-visible:ring-gray-500 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600',
      danger:
        'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus-visible:ring-red-500 shadow-sm hover:shadow',
      ghost:
        'bg-transparent text-gray-700 hover:bg-gray-100 active:bg-gray-200 focus-visible:ring-gray-500 dark:text-gray-300 dark:hover:bg-gray-800',
    };

    // Loading spinner component
    const Spinner = () => (
      <svg
        className="h-4 w-4 animate-spin"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    );

    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        className={`
          ${baseStyles}
          ${sizeStyles[size]}
          ${variantStyles[variant]}
          ${fullWidth ? 'w-full' : ''}
          ${className}
        `}
        aria-busy={isLoading}
        aria-disabled={isDisabled}
        {...props}
      >
        {isLoading && <Spinner />}
        {!isLoading && LeftIcon && <LeftIcon className="h-4 w-4" aria-hidden="true" />}
        {children}
        {!isLoading && RightIcon && <RightIcon className="h-4 w-4" aria-hidden="true" />}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;