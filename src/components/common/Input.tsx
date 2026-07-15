// src/components/common/Input.tsx

import {
  Eye,
  EyeOff,
  Search,
  X,
} from "lucide-react";
import {
  forwardRef,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";

interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  /**
   * Label displayed above the input.
   */
  label?: string;

  /**
   * Helper text displayed below the input.
   */
  helperText?: string;

  /**
   * Error message.
   */
  error?: string;

  /**
   * Left icon.
   */
  leftIcon?: ReactNode;

  /**
   * Right icon.
   */
  rightIcon?: ReactNode;

  /**
   * Show a clear button.
   */
  clearable?: boolean;

  /**
   * Called when clear button is clicked.
   */
  onClear?: () => void;

  /**
   * Full width input.
   */
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      error,
      leftIcon,
      rightIcon,
      clearable = false,
      onClear,
      fullWidth = true,
      className = "",
      type = "text",
      value,
      disabled,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === "password";

    const inputType =
      isPassword && showPassword ? "text" : type;

    return (
      <div
        className={`flex flex-col gap-1 ${
          fullWidth ? "w-full" : ""
        }`}
      >
        {label && (
          <label className="text-sm font-medium text-gray-700">
            {label}
          </label>
        )}

        <div
          className={`
            flex
            items-center
            rounded-lg
            border
            bg-white
            transition-colors
            ${
              error
                ? "border-red-500 focus-within:border-red-500"
                : "border-gray-300 focus-within:border-blue-500"
            }
            ${
              disabled
                ? "cursor-not-allowed bg-gray-100"
                : ""
            }
          `}
        >
          {leftIcon && (
            <div className="pl-3 text-gray-400">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            type={inputType}
            value={value}
            disabled={disabled}
            className={`
              w-full
              bg-transparent
              px-3
              py-2.5
              text-sm
              outline-none
              placeholder:text-gray-400
              ${className}
            `}
            {...props}
          />

          {clearable &&
            value &&
            !disabled && (
              <button
                type="button"
                onClick={onClear}
                className="mr-2 text-gray-400 hover:text-gray-700"
                aria-label="Clear input"
              >
                <X size={18} />
              </button>
            )}

          {isPassword && (
            <button
              type="button"
              className="mr-2 text-gray-400 hover:text-gray-700"
              onClick={() =>
                setShowPassword((prev) => !prev)
              }
              aria-label={
                showPassword
                  ? "Hide password"
                  : "Show password"
              }
            >
              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          )}

          {!isPassword && rightIcon && (
            <div className="pr-3 text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>

        {error ? (
          <p className="text-sm text-red-600">
            {error}
          </p>
        ) : helperText ? (
          <p className="text-sm text-gray-500">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;