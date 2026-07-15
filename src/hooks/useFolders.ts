// src/hooks/useFolders.ts

import { useCallback, useEffect, useMemo, useState } from "react";

import db from "../db/db";
import type {
  CreateFolderInput,
  Folder,
  FolderNode,
  UpdateFolderInput,
} from "../types/folder";

/**
 * Builds a hierarchical tree from a flat folder list.
 */
function buildFolderTree(folders: Folder[]): FolderNode[] {
  const map = new Map<number, FolderNode>();
  const roots: FolderNode[] = [];

  // Create nodes
  folders.forEach((folder) => {
    if (folder.id === undefined) return;

    map.set(folder.id, {
      ...folder,
      children: [],
    });
  });

  // Build tree
  map.forEach((node) => {
    if (node.parentId === null) {
      roots.push(node);
      return;
    }

    const parent = map.get(node.parentId);

    if (parent) {
      parent.children.push(node);
    } else {
      roots.push(node);
    }
  });

  return roots;
}

export function useFolders() {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Reload folders from IndexedDB.
   */
  const loadFolders = useCallback(async () => {
    try {
      setLoading(true);

      const data = await db.folders
        .orderBy("name")
        .toArray();

      setFolders(data);

      setError(null);
    } catch (err) {
      console.error(err);

      setError("Failed to load folders.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFolders();
  }, [loadFolders]);

  /**
   * Create folder.
   */
  const createFolder = useCallback(
    async (input: CreateFolderInput) => {
      const now = new Date();

      await db.folders.add({
        ...input,
        createdAt: now,
        updatedAt: now,
      });

      await loadFolders();
    },
    [loadFolders]
  );

  /**
   * Rename / update folder.
   */
  const updateFolder = useCallback(
    async (
      id: number,
      updates: UpdateFolderInput
    ) => {
      await db.folders.update(id, {
        ...updates,
        updatedAt: new Date(),
      });

      await loadFolders();
    },
    [loadFolders]
  );

  /**
   * Move folder.
   */
  const moveFolder = useCallback(
    async (
      folderId: number,
      newParentId: number | null
    ) => {
      await db.folders.update(folderId, {
        parentId: newParentId,
        updatedAt: new Date(),
      });

      await loadFolders();
    },
    [loadFolders]
  );

  /**
   * Delete folder.
   *
   * NOTE:
   * This currently deletes only the selected folder.
   * Recursive deletion can be added later.
   */
  const deleteFolder = useCallback(
    async (id: number) => {
      await db.folders.delete(id);

      await loadFolders();
    },
    [loadFolders]
  );

  /**
   * Folder tree.
   */
  const folderTree = useMemo(
    () => buildFolderTree(folders),
    [folders]
  );

  return {
    folders,

    folderTree,

    loading,

    error,

    reload: loadFolders,

    createFolder,

    updateFolder,

    moveFolder,

    deleteFolder,
  };
}