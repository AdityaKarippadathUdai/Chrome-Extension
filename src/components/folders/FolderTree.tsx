// src/components/folders/FolderTree.tsx

import type { MouseEvent } from "react";

import type { FolderNode } from "../../types/folder";
import { useLibraryStore } from "../../store/libraryStore";

import FolderItem from "./FolderItem";

interface FolderTreeProps {
  /**
   * Root folder nodes.
   */
  folders: FolderNode[];

  /**
   * Called when a folder is selected.
   */
  onSelectFolder?: (folderId: number) => void;

  /**
   * Called when a folder is right-clicked.
   */
  onContextMenu?: (
    event: MouseEvent<HTMLDivElement>,
    folderId: number
  ) => void;
}

export default function FolderTree({
  folders,
  onSelectFolder,
  onContextMenu,
}: FolderTreeProps) {
  const {
    selectedFolderId,
    expandedFolders,
    toggleFolder,
    setSelectedFolder,
  } = useLibraryStore();

  function renderNode(
    node: FolderNode,
    level: number
  ): React.ReactNode {
    const folderId = node.id!;

    const expanded = expandedFolders.has(folderId);

    return (
      <div key={folderId}>
        <FolderItem
          folder={node}
          level={level}
          selected={selectedFolderId === folderId}
          expanded={expanded}
          hasChildren={node.children.length > 0}
          childCount={node.children.length}
          onSelect={(id) => {
            setSelectedFolder(id);

            onSelectFolder?.(id);
          }}
          onToggle={toggleFolder}
          onContextMenu={(event, id) => {
            onContextMenu?.(event, id);
          }}
        />

        {expanded &&
          node.children.map((child) =>
            renderNode(child, level + 1)
          )}
      </div>
    );
  }

  if (folders.length === 0) {
    return (
      <div className="p-4 text-center text-sm text-gray-500">
        No folders yet.
      </div>
    );
  }

  return (
    <div
      role="tree"
      className="space-y-1"
    >
      {folders.map((folder) =>
        renderNode(folder, 0)
      )}
    </div>
  );
}