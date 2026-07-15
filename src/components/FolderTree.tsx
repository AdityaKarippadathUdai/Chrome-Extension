import React, { memo, useCallback, MouseEvent } from 'react';
import { FolderTree as FolderTreeIcon } from 'lucide-react';
import FolderItem, { FolderItemData } from './FolderItem';

export interface FolderTreeProps {
  /** Array of folder data items */
  folders: FolderItemData[];
  /** ID of the currently selected folder */
  selectedFolderId?: string | null;
  /** Set of expanded folder IDs */
  expandedFolders?: Set<string>;
  /** Callback when a folder is selected */
  onFolderSelect?: (folderId: string) => void;
  /** Callback when a folder is expanded/collapsed */
  onFolderToggle?: (folderId: string) => void;
  /** Callback when context menu is triggered on a folder */
  onFolderContextMenu?: (e: MouseEvent<HTMLElement>, folderId: string) => void;
  /** Custom empty state component or text */
  emptyState?: React.ReactNode;
}

/**
 * Recursive folder tree component that displays hierarchical folder structure.
 * Supports infinite nesting with proper indentation and interactions.
 */
const FolderTree = memo(({
  folders,
  selectedFolderId = null,
  expandedFolders = new Set(),
  onFolderSelect,
  onFolderToggle,
  onFolderContextMenu,
  emptyState,
}: FolderTreeProps) => {
  // Build folder hierarchy from flat array
  const buildFolderTree = useCallback((): FolderItemData[] => {
    const folderMap = new Map<string, FolderItemData & { children: FolderItemData[] }>();
    const rootFolders: FolderItemData[] = [];

    // First pass: create map entries
    folders.forEach(folder => {
      folderMap.set(folder.id, { ...folder, children: [] });
    });

    // Second pass: build hierarchy
    folders.forEach(folder => {
      const node = folderMap.get(folder.id);
      if (!node) return;

      if (folder.parentId && folderMap.has(folder.parentId)) {
        const parent = folderMap.get(folder.parentId);
        if (parent) {
          parent.children.push(node);
        }
      } else {
        rootFolders.push(node);
      }
    });

    return rootFolders;
  }, [folders]);

  // Recursive render function
  const renderFolderTree = useCallback((folderItems: FolderItemData[], level: number = 0): React.ReactNode => {
    return folderItems.map((folder) => {
      const isSelected = folder.id === selectedFolderId;
      const isExpanded = expandedFolders.has(folder.id);
      
      // Check if this folder has children by looking at original data
      const hasChildren = folders.some(f => f.parentId === folder.id);
      
      // Count total children (folders + books - we'll count only folders for now)
      const childFolders = folders.filter(f => f.parentId === folder.id);
      const childCount = childFolders.length;

      return (
        <div key={folder.id} className="flex flex-col">
          <FolderItem
            folder={folder}
            level={level}
            selected={isSelected}
            expanded={isExpanded}
            hasChildren={hasChildren}
            childCount={childCount}
            onSelect={onFolderSelect}
            onToggle={onFolderToggle}
            onContextMenu={onFolderContextMenu}
          />
          {isExpanded && hasChildren && (
            <div className="flex flex-col">
              {renderFolderTree(childFolders, level + 1)}
            </div>
          )}
        </div>
      );
    });
  }, [folders, selectedFolderId, expandedFolders, onFolderSelect, onFolderToggle, onFolderContextMenu]);

  const treeRoots = buildFolderTree();

  // Empty state
  if (folders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        {emptyState || (
          <>
            <FolderTreeIcon className="mb-3 h-12 w-12 text-gray-300 dark:text-gray-600" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No folders yet
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Click "Add Folder" to create your first folder
            </p>
          </>
        )}
      </div>
    );
  }

  return (
    <div 
      className="flex flex-col space-y-0.5"
      role="tree"
      aria-label="Folder navigation tree"
    >
      {renderFolderTree(treeRoots)}
    </div>
  );
});

FolderTree.displayName = 'FolderTree';

export default FolderTree;