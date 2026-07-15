import React, {
  ReactNode,
  useEffect,
  useRef,
  useCallback,
  MouseEvent,
  KeyboardEvent,
} from 'react';
import { X } from 'lucide-react';
import Button from './Button';

export interface ModalProps {
  /** Controls modal visibility */
  isOpen: boolean;
  /** Callback when modal should close */
  onClose: () => void;
  /** Modal title displayed in header */
  title?: string;
  /** Modal content */
  children: ReactNode;
  /** Custom footer content (buttons, etc.) */
  footer?: ReactNode;
  /** Size variant of the modal */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** Close button variant (uses Button component) */
  closeButtonVariant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  /** Close button text */
  closeButtonText?: string;
  /** Disable click outside to close */
  disableOutsideClick?: boolean;
  /** Disable ESC key to close */
  disableEscapeKey?: boolean;
}

/**
 * Accessible Modal component with animations and focus management.
 * Follows WAI-ARIA Dialog pattern.
 */
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeButtonVariant = 'secondary',
  closeButtonText = 'Close',
  disableOutsideClick = false,
  disableEscapeKey = false,
}: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Size classes for the modal
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[90vw]',
  };

  // Handle ESC key press
  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (!disableEscapeKey && event.key === 'Escape') {
        onClose();
      }
    },
    [disableEscapeKey, onClose]
  );

  // Handle backdrop click
  const handleBackdropClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (disableOutsideClick) return;
      if (event.target === event.currentTarget) {
        onClose();
      }
    },
    [disableOutsideClick, onClose]
  );

  // Focus management and body scroll lock
  useEffect(() => {
    if (isOpen) {
      // Save current focus
      previousFocusRef.current = document.activeElement as HTMLElement;

      // Prevent body scroll
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = 'var(--scrollbar-width, 0px)';

      // Focus the modal
      setTimeout(() => {
        modalRef.current?.focus();
      }, 100);

      return () => {
        // Restore body scroll
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';

        // Restore previous focus
        if (previousFocusRef.current) {
          previousFocusRef.current.focus();
        }
      };
    }
  }, [isOpen]);

  // Handle window scrollbar width for layout shift prevention
  useEffect(() => {
    if (isOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.documentElement.style.setProperty(
        '--scrollbar-width',
        `${scrollbarWidth}px`
      );
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
    >
      {/* Backdrop overlay with animation */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
        aria-hidden="true"
      />

      {/* Modal container */}
      <div
        ref={modalRef}
        className={`
          relative w-full ${sizeClasses[size]} max-h-[90vh] overflow-y-auto
          rounded-xl bg-white shadow-2xl transition-all duration-300
          animate-in zoom-in-95 fade-in slide-in-from-bottom-4
          dark:bg-gray-800
        `}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside modal from closing
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-gray-200 bg-white px-6 py-4 dark:border-gray-700 dark:bg-gray-800">
          {title ? (
            <h2
              id="modal-title"
              className="text-xl font-semibold text-gray-900 dark:text-white"
            >
              {title}
            </h2>
          ) : (
            <div />
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            aria-label="Close modal"
            className="!p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </Button>
        </div>

        {/* Body */}
        <div className="px-6 py-4 text-gray-700 dark:text-gray-300">
          {children}
        </div>

        {/* Footer */}
        {footer !== undefined ? (
          <div className="border-t border-gray-200 px-6 py-4 dark:border-gray-700">
            {footer}
          </div>
        ) : (
          // Default footer with close button
          <div className="border-t border-gray-200 px-6 py-4 dark:border-gray-700">
            <div className="flex justify-end">
              <Button variant={closeButtonVariant} onClick={onClose}>
                {closeButtonText}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;