import React, { useEffect, useRef, useCallback, KeyboardEvent } from 'react';
import { 
  FolderPlus, 
  Pencil, 
  Trash2, 
  Move, 
  BookPlus,
  X 
} from 'lucide-react';

export interface FolderContextMenuProps {
  /** Whether the context menu is open */
  isOpen: boolean;
  /** X position (pixels) from the left edge */
  x?: number;
  /** Y position (pixels) from the top edge */
  y?: number;
  /** Folder ID that the context menu is for */
  folderId?: string;
  /** Folder name (for display in menu items) */
  folderName?: string;
  /** Callback to close the menu */
  onClose: () => void;
  /** Callback for "New Folder" action */
  onCreateFolder?: (parentId: string) => void;
  /** Callback for "Rename Folder" action */
  onRenameFolder?: (folderId: string) => void;
  /** Callback for "Delete Folder" action */
  onDeleteFolder?: (folderId: string) => void;
  /** Callback for "Move Folder" action */
  onMoveFolder?: (folderId: string) => void;
  /** Callback for "Add Book" action */
  onAddBook?: (folderId: string) => void;
}

interface MenuItem {
  label: string;
  icon: React.ElementType;
  onClick: () => void;
  color?: string;
  shortcut?: string;
}

/**
 * Context menu component for folder operations.
 * Appears at cursor position with smooth animation and keyboard support.
 */
const FolderContextMenu = ({
  isOpen,
  x = 0,
  y = 0,
  folderId = '',
  folderName = '',
  onClose,
  onCreateFolder,
  onRenameFolder,
  onDeleteFolder,
  onMoveFolder,
  onAddBook,
}: FolderContextMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);

  // Adjust position to stay within viewport
  const getAdjustedPosition = useCallback(() => {
    if (!menuRef.current) return { x, y };

    const menuRect = menuRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let adjustedX = x;
    let adjustedY = y;

    if (x + menuRect.width > viewportWidth) {
      adjustedX = viewportWidth - menuRect.width - 10;
    }
    if (y + menuRect.height > viewportHeight) {
      adjustedY = viewportHeight - menuRect.height - 10;
    }

    return { x: Math.max(10, adjustedX), y: Math.max(10, adjustedY) };
  }, [x, y]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('contextmenu', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('contextmenu', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown as any);
      // Focus the menu when it opens
      setTimeout(() => menuRef.current?.focus(), 0);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown as any);
    };
  }, [isOpen, onClose]);

  // Menu items configuration
  const menuItems: MenuItem[] = [
    {
      label: 'New Folder',
      icon: FolderPlus,
      onClick: () => {
        onCreateFolder?.(folderId);
        onClose();
      },
      shortcut: 'Ctrl+N',
    },
    {
      label: 'Rename Folder',
      icon: Pencil,
      onClick: () => {
        onRenameFolder?.(folderId);
        onClose();
      },
      shortcut: 'Ctrl+R',
    },
    {
      label: 'Delete Folder',
      icon: Trash2,
      onClick: () => {
        onDeleteFolder?.(folderId);
        onClose();
      },
      color: 'text-red-600 dark:text-red-400',
      shortcut: 'Del',
    },
    {
      label: 'Move Folder',
      icon: Move,
      onClick: () => {
        onMoveFolder?.(folderId);
        onClose();
      },
      shortcut: 'Ctrl+M',
    },
    {
      label: 'Add Book',
      icon: BookPlus,
      onClick: () => {
        onAddBook?.(folderId);
        onClose();
      },
      shortcut: 'Ctrl+B',
    },
  ];

  if (!isOpen) return null;

  const { x: adjustedX, y: adjustedY } = getAdjustedPosition();

  return (
    <div
      ref={menuRef}
      className={`
        fixed z-50 min-w-[220px] rounded-lg bg-white py-1 shadow-lg ring-1 ring-black/5
        animate-in fade-in zoom-in-95 duration-100
        dark:bg-gray-800 dark:ring-white/10
      `}
      style={{
        left: `${adjustedX}px`,
        top: `${adjustedY}px`,
      }}
      role="menu"
      aria-label="Folder context menu"
      tabIndex={-1}
    >
      {/* Folder info header */}
      {folderName && (
        <div className="border-b border-gray-100 px-3 py-2 dark:border-gray-700">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
            {folderName}
          </p>
        </div>
      )}

      {/* Menu items */}
      {menuItems.map((item, index) => (
        <button
          key={index}
          className={`
            flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors
            hover:bg-gray-100 dark:hover:bg-gray-700
            focus:bg-gray-100 dark:focus:bg-gray-700 focus:outline-none
            ${item.color || 'text-gray-700 dark:text-gray-300'}
          `}
          onClick={item.onClick}
          role="menuitem"
          tabIndex={0}
        >
          <item.icon className="h-4 w-4 flex-shrink-0" />
          <span className="flex-1 text-left">{item.label}</span>
          {item.shortcut && (
            <span className="ml-4 text-xs text-gray-400 dark:text-gray-500">
              {item.shortcut}
            </span>
          )}
        </button>
      ))}

      {/* Separator and close option */}
      <div className="border-t border-gray-100 dark:border-gray-700" />
      <button
        className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
        onClick={onClose}
        role="menuitem"
        tabIndex={0}
      >
        <X className="h-4 w-4" />
        <span>Close</span>
      </button>
    </div>
  );
};

export default FolderContextMenu;