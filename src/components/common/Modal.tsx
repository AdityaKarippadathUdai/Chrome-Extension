// src/components/common/Modal.tsx

import {
  type ReactNode,
  useEffect,
  useRef,
} from "react";
import { X } from "lucide-react";

interface ModalProps {
  /**
   * Whether the modal is open.
   */
  isOpen: boolean;

  /**
   * Called when the modal should close.
   */
  onClose: () => void;

  /**
   * Optional modal title.
   */
  title?: string;

  /**
   * Modal body.
   */
  children: ReactNode;

  /**
   * Optional footer.
   */
  footer?: ReactNode;

  /**
   * Maximum width.
   */
  maxWidth?: "sm" | "md" | "lg" | "xl";

  /**
   * Close when clicking outside.
   */
  closeOnOverlayClick?: boolean;

  /**
   * Additional Tailwind classes.
   */
  className?: string;
}

const maxWidthClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-2xl",
};

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  maxWidth = "md",
  closeOnOverlayClick = true,
  className = "",
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  // Close with Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Prevent background scrolling
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={() => {
        if (closeOnOverlayClick) {
          onClose();
        }
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
        onClick={(event) => event.stopPropagation()}
        className={`
          w-full
          ${maxWidthClasses[maxWidth]}
          rounded-xl
          bg-white
          shadow-2xl
          animate-in
          fade-in
          zoom-in-95
          duration-200
          ${className}
        `}
      >
        {(title || onClose) && (
          <div className="flex items-center justify-between border-b px-5 py-4">
            <h2
              id="modal-title"
              className="text-lg font-semibold text-gray-900"
            >
              {title}
            </h2>

            <button
              type="button"
              onClick={onClose}
              className="rounded-md p-1 text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>
        )}

        <div className="max-h-[70vh] overflow-y-auto px-5 py-4">
          {children}
        </div>

        {footer && (
          <div className="flex justify-end gap-3 border-t px-5 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}