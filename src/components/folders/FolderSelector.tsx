// src/components/folders/FolderSelector.tsx

import { useMemo } from "react";
import { useFolders } from "../../hooks/useFolders";
import type { FolderNode } from "../../types/folder";

interface FolderSelectorProps {
  value?: number;
  onChange: (id: number) => void;
  error?: string;
}

interface FlattenedFolder {
  id: number;
  name: string;
  depth: number;
}

export default function FolderSelector({
  value,
  onChange,
  error,
}: FolderSelectorProps) {
  const { folderTree, folders, loading } = useFolders();

  const flattenedFolders = useMemo(() => {
    const result: FlattenedFolder[] = [];
    function traverse(nodes: FolderNode[], depth: number) {
      // Sort folders by name at the same level
      const sorted = [...nodes].sort((a, b) => a.name.localeCompare(b.name));
      for (const node of sorted) {
        if (node.id !== undefined) {
          result.push({
            id: node.id,
            name: node.name,
            depth,
          });
          if (node.children && node.children.length > 0) {
            traverse(node.children, depth + 1);
          }
        }
      }
    }
    traverse(folderTree, 0);
    return result;
  }, [folderTree]);

  if (loading) {
    return (
      <div className="h-10 w-full animate-pulse rounded-lg bg-gray-100" />
    );
  }

  if (folders.length === 0) {
    return (
      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-gray-700">Folder</span>
        <div className="rounded-lg border border-red-200 bg-red-50 p-2.5 text-xs text-red-600 font-medium">
          Create a folder first.
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor="folder-selector" className="text-sm font-medium text-gray-700">
        Folder <span className="text-red-500">*</span>
      </label>
      <select
        id="folder-selector"
        value={value || ""}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`
          w-full
          rounded-lg
          border
          bg-white
          px-3
          py-2.5
          text-sm
          outline-none
          transition-colors
          focus:border-blue-500
          ${error ? "border-red-500 focus:border-red-500" : "border-gray-300"}
        `}
      >
        <option value="" disabled>Select a folder...</option>
        {flattenedFolders.map((folder) => (
          <option key={folder.id} value={folder.id}>
            {"\u00A0\u00A0".repeat(folder.depth) + folder.name}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-xs text-red-600 mt-1">
          {error}
        </p>
      )}
    </div>
  );
}
