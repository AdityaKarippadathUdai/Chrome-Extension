import React, { useState, ReactNode } from 'react';
import { FolderPlus, ChevronLeft, ChevronRight } from 'lucide-react';
import Button from './Button';

export interface SidebarProps {
  /** Sidebar title */
  title?: string;
  /** Content to render inside the sidebar (folder tree) */
  children: ReactNode;
  /** Callback when "Add Folder" button is clicked */
  onAddFolder?: () => void;
  /** Initial collapsed state */
  defaultCollapsed?: boolean;
  /** Controlled collapsed state */
  collapsed?: boolean;
  /** Callback when collapse state changes */
  onCollapseChange?: (collapsed: boolean) => void;
  /** Width of the sidebar when expanded */
  width?: string;
  /** Width of the sidebar when collapsed */
  collapsedWidth?: string;
}

/**
 * Sidebar component for folder navigation and management.
 * Features collapsible behavior and scrollable content area.
 */
const Sidebar = ({
  title = 'Folders',
  children,
  onAddFolder,
  defaultCollapsed = false,
  collapsed: controlledCollapsed,
  onCollapseChange,
  width = 'w-64',
  collapsedWidth = 'w-16',
}: SidebarProps) => {
  // Use controlled or uncontrolled state for collapse
  const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed);
  const isCollapsed = controlledCollapsed !== undefined
    ? controlledCollapsed
    : internalCollapsed;

  const handleToggleCollapse = () => {
    const newState = !isCollapsed;
    if (controlledCollapsed === undefined) {
      setInternalCollapsed(newState);
    }
    onCollapseChange?.(newState);
  };

  return (
    <aside
      className={`
        flex flex-col border-r border-gray-200 bg-gray-50 transition-all duration-300
        dark:border-gray-700 dark:bg-gray-900
        ${isCollapsed ? collapsedWidth : width}
        flex-shrink-0
      `}
      aria-label="Folder sidebar"
    >
      {/* Header */}
      <div className="flex h-14 items-center justify-between border-b border-gray-200 px-3 dark:border-gray-700">
        {!isCollapsed && (
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 truncate">
            {title}
          </h2>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleToggleCollapse}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="!p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          ) : (
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          )}
        </Button>
      </div>

      {/* Content area - scrollable */}
      <div className="flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
        {isCollapsed ? (
          // Collapsed view - just show icons
          <div className="flex flex-col items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onAddFolder}
              aria-label="Add folder"
              className="!p-2 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <FolderPlus className="h-5 w-5" aria-hidden="true" />
            </Button>
          </div>
        ) : (
          // Expanded view - show all content
          <div className="space-y-2">
            {children}
          </div>
        )}
      </div>

      {/* Footer with Add Folder button */}
      {!isCollapsed && (
        <div className="border-t border-gray-200 p-3 dark:border-gray-700">
          <Button
            variant="primary"
            size="sm"
            fullWidth
            leftIcon={FolderPlus}
            onClick={onAddFolder}
          >
            Add Folder
          </Button>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;