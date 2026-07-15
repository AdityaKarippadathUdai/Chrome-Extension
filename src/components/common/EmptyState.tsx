// src/components/common/EmptyState.tsx

import type { ReactNode } from "react";
import { Inbox } from "lucide-react";

interface EmptyStateProps {
  /**
   * Main heading.
   */
  title: string;

  /**
   * Additional descriptive text.
   */
  description?: string;

  /**
   * Optional custom icon.
   */
  icon?: ReactNode;

  /**
   * Optional action button or other content.
   */
  action?: ReactNode;

  /**
   * Additional Tailwind classes.
   */
  className?: string;
}

export default function EmptyState({
  title,
  description,
  icon,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`
        flex
        min-h-[280px]
        flex-col
        items-center
        justify-center
        rounded-xl
        border
        border-dashed
        border-gray-300
        bg-gray-50
        px-6
        py-10
        text-center
        ${className}
      `}
    >
      <div className="mb-4 text-gray-400">
        {icon ?? <Inbox className="h-14 w-14" />}
      </div>

      <h2 className="text-lg font-semibold text-gray-900">
        {title}
      </h2>

      {description && (
        <p className="mt-2 max-w-md text-sm text-gray-500">
          {description}
        </p>
      )}

      {action && (
        <div className="mt-6">
          {action}
        </div>
      )}
    </div>
  );
}