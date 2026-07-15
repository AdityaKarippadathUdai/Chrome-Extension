// src/components/layout/Sidebar.tsx

import type { ReactNode } from "react";
import { FolderPlus, PanelLeftClose, PanelLeftOpen } from "lucide-react";

import Button from "../common/Button";

interface SidebarProps {
  /**
   * Sidebar title.
   */
  title?: string;

  /**
   * Sidebar content.
   */
  children: ReactNode;

  /**
   * Whether the sidebar is collapsed.
   */
  collapsed?: boolean;

  /**
   * Toggle collapse.
   */
  onToggleCollapse?: () => void;

  /**
   * Add folder button.
   */
  onAddFolder?: () => void;

  /**
   * Width when expanded.
   */
  width?: string;

  /**
   * Additional Tailwind classes.
   */
  className?: string;
}

export default function Sidebar({
  title = "Folders",
  children,
  collapsed = false,
  onToggleCollapse,
  onAddFolder,
  width = "w-72",
  className = "",
}: SidebarProps) {
  return (
    <aside
      className={`
        flex
        h-full
        flex-col
        border-r
        border-gray-200
        bg-white
        transition-all
        duration-300
        ${collapsed ? "w-16" : width}
        ${className}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b p-4">
        {!collapsed && (
          <h2 className="text-lg font-semibold text-gray-900">
            {title}
          </h2>
        )}

        {onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            className="rounded-lg p-2 transition hover:bg-gray-100"
            aria-label={
              collapsed ? "Expand sidebar" : "Collapse sidebar"
            }
          >
            {collapsed ? (
              <PanelLeftOpen size={18} />
            ) : (
              <PanelLeftClose size={18} />
            )}
          </button>
        )}
      </div>

      {/* Add Folder */}
      {!collapsed && onAddFolder && (
        <div className="border-b p-4">
          <Button
            fullWidth
            leftIcon={<FolderPlus size={18} />}
            onClick={onAddFolder}
          >
            Add Folder
          </Button>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-2">
        {children}
      </div>
    </aside>
  );
}