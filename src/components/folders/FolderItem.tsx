// src/components/folders/FolderItem.tsx

import {
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
} from "lucide-react";

import type { Folder as FolderType } from "../../types/folder";

interface FolderItemProps {
  /**
   * Folder data.
   */
  folder: FolderType;

  /**
   * Tree depth.
   */
  level: number;

  /**
   * Whether this folder is selected.
   */
  selected: boolean;

  /**
   * Whether this folder is expanded.
   */
  expanded: boolean;

  /**
   * Whether this folder has children.
   */
  hasChildren: boolean;

  /**
   * Number of direct child folders.
   */
  childCount?: number;

  /**
   * Select folder.
   */
  onSelect: (folderId: number) => void;

  /**
   * Expand / collapse folder.
   */
  onToggle: (folderId: number) => void;

  /**
   * Open context menu.
   */
  onContextMenu: (
    event: React.MouseEvent<HTMLDivElement>,
    folderId: number
  ) => void;
}

export default function FolderItem({
  folder,
  level,
  selected,
  expanded,
  hasChildren,
  childCount = 0,
  onSelect,
  onToggle,
  onContextMenu,
}: FolderItemProps) {
  const indentation = level * 20;

  return (
    <div
      role="treeitem"
      aria-expanded={hasChildren ? expanded : undefined}
      aria-selected={selected}
      className={`
        flex
        items-center
        rounded-lg
        px-2
        py-2
        transition-colors
        cursor-pointer
        select-none
        ${
          selected
            ? "bg-blue-100 text-blue-700"
            : "hover:bg-gray-100"
        }
      `}
      style={{
        paddingLeft: `${indentation + 8}px`,
      }}
      onClick={() => folder.id && onSelect(folder.id)}
      onContextMenu={(event) => {
        event.preventDefault();

        if (folder.id) {
          onContextMenu(event, folder.id);
        }
      }}
    >
      {/* Expand / Collapse */}

      <button
        type="button"
        className="mr-1 rounded p-1 hover:bg-gray-200"
        onClick={(event) => {
          event.stopPropagation();

          if (hasChildren && folder.id) {
            onToggle(folder.id);
          }
        }}
        disabled={!hasChildren}
        aria-label={
          expanded ? "Collapse folder" : "Expand folder"
        }
      >
        {hasChildren ? (
          expanded ? (
            <ChevronDown size={16} />
          ) : (
            <ChevronRight size={16} />
          )
        ) : (
          <span className="block w-4" />
        )}
      </button>

      {/* Folder Icon */}

      <div className="mr-2">
        {expanded ? (
          <FolderOpen
            size={18}
            className="text-yellow-500"
          />
        ) : (
          <Folder
            size={18}
            className="text-yellow-500"
          />
        )}
      </div>

      {/* Folder Name */}

      <span className="flex-1 truncate text-sm font-medium">
        {folder.name}
      </span>

      {/* Child Count */}

      {childCount > 0 && (
        <span className="ml-2 rounded bg-gray-200 px-2 py-0.5 text-xs text-gray-600">
          {childCount}
        </span>
      )}
    </div>
  );
}