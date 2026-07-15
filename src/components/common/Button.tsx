// src/components/common/Button.tsx

import { Loader2 } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Button style variant.
   */
  variant?: "primary" | "secondary" | "danger" | "ghost";

  /**
   * Button size.
   */
  size?: "sm" | "md" | "lg";

  /**
   * Display loading spinner.
   */
  loading?: boolean;

  /**
   * Expand button to full width.
   */
  fullWidth?: boolean;

  /**
   * Optional icon shown before the label.
   */
  leftIcon?: ReactNode;

  /**
   * Optional icon shown after the label.
   */
  rightIcon?: ReactNode;

  children: ReactNode;
}

const variantClasses = {
  primary:
    "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",

  secondary:
    "bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-400",

  danger:
    "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",

  ghost:
    "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-300",
};

const sizeClasses = {
  sm: "px-3 py-1.5 text-sm",

  md: "px-4 py-2 text-sm",

  lg: "px-5 py-3 text-base",
};

export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  children,
  className = "",
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      type="button"
      disabled={isDisabled}
      className={`
        inline-flex
        items-center
        justify-center
        gap-2
        rounded-lg
        font-medium
        transition-colors
        duration-200
        focus:outline-none
        focus:ring-2
        disabled:cursor-not-allowed
        disabled:opacity-60
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        leftIcon
      )}

      <span>{children}</span>

      {!loading && rightIcon}
    </button>
  );
}