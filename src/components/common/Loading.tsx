// src/components/common/Loading.tsx

import { Loader2 } from "lucide-react";

interface LoadingProps {
  /**
   * Loading style.
   */
  variant?: "spinner" | "skeleton" | "page";

  /**
   * Optional loading message.
   */
  text?: string;

  /**
   * Number of skeleton rows.
   */
  rows?: number;

  /**
   * Additional Tailwind classes.
   */
  className?: string;
}

export default function Loading({
  variant = "spinner",
  text = "Loading...",
  rows = 5,
  className = "",
}: LoadingProps) {
  if (variant === "page") {
    return (
      <div
        className={`flex min-h-screen flex-col items-center justify-center gap-4 ${className}`}
      >
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />

        <p className="text-sm text-gray-500">{text}</p>
      </div>
    );
  }

  if (variant === "skeleton") {
    return (
      <div className={`space-y-3 ${className}`}>
        {Array.from({ length: rows }).map((_, index) => (
          <div
            key={index}
            className="h-20 animate-pulse rounded-xl bg-gray-200"
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-center gap-3 py-6 ${className}`}
    >
      <Loader2 className="h-6 w-6 animate-spin text-blue-600" />

      <span className="text-sm text-gray-500">{text}</span>
    </div>
  );
}