import React, { memo, useCallback, KeyboardEvent, MouseEvent } from 'react';
import { Folder, FolderOpen, ChevronRight, ChevronDown } from 'lucide-react';

export interface FolderItemData {
  id: string;
  name: string;
  parentId?: string | null;
  childCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface FolderItemProps {
  /** Folder data object containing id, name, and metadata */
  folder: FolderItemData;
  /** Indentation depth level (0-based) */
  level?: number;
  /** Whether this folder is currently selected */
  selected?: boolean;
  /** Whether this folder is expanded (shows children) */
  expanded?: boolean;
  /** Whether this folder has child folders */
  hasChildren?: boolean;
  /** Number of child items (books + folders) */
  childCount?: number;
  /** Callback when folder is selected/clicked */
  onSelect?: (folderId: string) => void;
  /** Callback when expand/collapse toggle is triggered */
  onToggle?: (folderId: string) => void;
  /** Callback when right-click context menu is triggered */
  onContextMenu?: (e: MouseEvent<HTMLElement>, folderId: string) => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Individual folder item component in the folder tree.
 * Supports selection, expand/collapse, and context menu interactions.
 */
const FolderItem = memo(({
  folder,
  level = 0,
  selected = false,
  expanded = false,
  hasChildren = false,
  childCount = 0,
  onSelect,
  onToggle,
  onContextMenu,
  className = '',
}: FolderItemProps) => {
  // Indentation spacing based on tree depth
  const indentAmount = level * 20 + 8;

  // Handle folder click
  const handleClick = useCallback(() => {
    onSelect?.(folder.id);
  }, [folder.id, onSelect]);

  // Handle toggle button click
  const handleToggle = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Prevent folder selection when toggling
    onToggle?.(folder.id);
  }, [folder.id, onToggle]);

  // Handle keyboard navigation (Enter/Space)
  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect?.(folder.id);
    }
    if (e.key === 'ArrowRight' && hasChildren && !expanded) {
      e.preventDefault();
      onToggle?.(folder.id);
    }
    if (e.key === 'ArrowLeft' && hasChildren && expanded) {
      e.preventDefault();
      onToggle?.(folder.id);
    }
  }, [folder.id, hasChildren, expanded, onSelect, onToggle]);

  // Handle right-click
  const handleContextMenu = useCallback((e: MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onContextMenu?.(e, folder.id);
  }, [folder.id, onContextMenu]);

  return (
    <div
      className={`
        group relative flex items-center rounded-md transition-all duration-150
        hover:bg-gray-100 dark:hover:bg-gray-800
        ${selected ? 'bg-blue-50 dark:bg-blue-950/50' : ''}
        ${className}
      `}
      style={{ paddingLeft: `${indentAmount}px` }}
      role="treeitem"
      aria-selected={selected}
      aria-expanded={hasChildren ? expanded : undefined}
      tabIndex={selected ? 0 : -1}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onContextMenu={handleContextMenu}
    >
      {/* Expand/Collapse Toggle */}
      {hasChildren && (
        <button
          onClick={handleToggle}
          className={`
            flex-shrink-0 rounded p-0.5 text-gray-400 transition-transform duration-200
            hover:bg-gray-200 dark:hover:bg-gray-700
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            ${expanded ? 'rotate-90' : 'rotate-0'}
          `}
          aria-label={expanded ? 'Collapse folder' : 'Expand folder'}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      )}
      
      {/* Folder Icon */}
      <div className="flex-shrink-0 p-1">
        {expanded ? (
          <FolderOpen className="h-4 w-4 text-blue-500 dark:text-blue-400" />
        ) : (
          <Folder className="h-4 w-4 text-yellow-500 dark:text-yellow-400" />
        )}
      </div>

      {/* Folder Name */}
      <span
        className={`
          flex-1 truncate px-1 py-1.5 text-sm font-medium
          ${selected 
            ? 'text-blue-700 dark:text-blue-300' 
            : 'text-gray-700 dark:text-gray-300'
          }
          group-hover:text-gray-900 dark:group-hover:text-white
        `}
      >
        {folder.name}
      </span>

      {/* Child Count Badge */}
      {childCount > 0 && (
        <span className="flex-shrink-0 rounded-full bg-gray-200 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-400">
          {childCount}
        </span>
      )}
    </div>
  );
});

FolderItem.displayName = 'FolderItem';

export default FolderItem;