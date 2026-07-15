import React, {
  forwardRef,
  InputHTMLAttributes,
  ReactNode,
  useState,
  useId,
} from 'react';
import { Eye, EyeOff, LucideIcon } from 'lucide-react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Label text for the input */
  label?: string;
  /** Helper text displayed below the input */
  helperText?: string;
  /** Error message - when present, input enters error state */
  error?: string;
  /** Optional icon displayed on the left side of the input */
  leadingIcon?: LucideIcon;
  /** Optional icon displayed on the right side of the input */
  trailingIcon?: LucideIcon;
  /** Enables password visibility toggle (only for type="password") */
  showPasswordToggle?: boolean;
}

/**
 * Reusable Input component with full accessibility support.
 * Features: label, helper text, error states, icons, and password toggle.
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      error,
      leadingIcon: LeadingIcon,
      trailingIcon: TrailingIcon,
      showPasswordToggle = false,
      type = 'text',
      id,
      className = '',
      disabled = false,
      required = false,
      ...props
    },
    ref
  ) => {
    // Generate unique ID for label-input association
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    // State for password visibility
    const [showPassword, setShowPassword] = useState(false);

    // Determine input type based on password toggle
    const inputType = showPasswordToggle && type === 'password'
      ? showPassword ? 'text' : 'password'
      : type;

    const hasError = Boolean(error);
    const hasLeadingIcon = Boolean(LeadingIcon);
    const hasTrailingIcon = Boolean(trailingIcon) || showPasswordToggle;

    // Base input styles
    const baseInputStyles =
      'w-full rounded-lg border bg-white px-4 py-2.5 text-base transition-all duration-200 focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-900';

    // Input styles based on state
    const inputStyles = {
      default:
        'border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 dark:border-gray-600 dark:focus:border-blue-400',
      error:
        'border-red-500 focus:border-red-500 focus:ring-red-500/20 dark:border-red-400 dark:focus:border-red-400',
    };

    // Padding adjustments for icons
    const paddingStyles = {
      left: hasLeadingIcon ? 'pl-10' : 'pl-4',
      right: hasTrailingIcon ? 'pr-10' : 'pr-4',
    };

    return (
      <div className={`w-full ${className}`}>
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}

        {/* Input wrapper */}
        <div className="relative">
          {/* Leading Icon */}
          {LeadingIcon && (
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <LeadingIcon className="h-5 w-5" aria-hidden="true" />
            </div>
          )}

          {/* Input element */}
          <input
            ref={ref}
            id={inputId}
            type={inputType}
            disabled={disabled}
            required={required}
            aria-invalid={hasError}
            aria-describedby={
              hasError
                ? errorId
                : helperText
                ? helperId
                : undefined
            }
            className={`
              ${baseInputStyles}
              ${hasError ? inputStyles.error : inputStyles.default}
              ${paddingStyles.left}
              ${paddingStyles.right}
            `}
            {...props}
          />

          {/* Trailing Icon / Password Toggle */}
          {showPasswordToggle && type === 'password' ? (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:hover:text-gray-300"
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Eye className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          ) : (
            TrailingIcon && (
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                <TrailingIcon className="h-5 w-5" aria-hidden="true" />
              </div>
            )
          )}
        </div>

        {/* Helper/Error text */}
        {helperText && !hasError && (
          <p id={helperId} className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
            {helperText}
          </p>
        )}
        {hasError && (
          <p id={errorId} className="mt-1.5 text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;