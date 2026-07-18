// src/utils/tree.ts

import type { Folder, FolderNode } from "../types/folder";

/**
 * Convert a flat folder list into a tree.
 */
export function buildFolderTree(
  folders: Folder[]
): FolderNode[] {
  const map = new Map<number, FolderNode>();
  const roots: FolderNode[] = [];

  // Create nodes
  for (const folder of folders) {
    if (folder.id === undefined) continue;

    map.set(folder.id, {
      ...folder,
      children: [],
    });
  }

  // Build hierarchy
  for (const folder of folders) {
    if (folder.id === undefined) continue;

    const node = map.get(folder.id);
    if (!node) continue;

    if (folder.parentId === null) {
      roots.push(node);
      continue;
    }

    const parent = map.get(folder.parentId);

    if (parent) {
      parent.children.push(node);
    } else {
      roots.push(node);
    }
  }

  // Sort alphabetically
  const sortNodes = (nodes: FolderNode[]) => {
    nodes.sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    nodes.forEach((child) =>
      sortNodes(child.children)
    );
  };

  sortNodes(roots);

  return roots;
}

/**
 * Find a folder node recursively.
 */
export function findFolderNode(
  tree: FolderNode[],
  folderId: number
): FolderNode | undefined {
  for (const node of tree) {
    if (node.id === folderId) {
      return node;
    }

    const child = findFolderNode(
      node.children,
      folderId
    );

    if (child) {
      return child;
    }
  }

  return undefined;
}

/**
 * Return every descendant ID.
 */
export function getDescendantFolderIds(
  tree: FolderNode[],
  folderId: number
): number[] {
  const node = findFolderNode(tree, folderId);

  if (!node) {
    return [];
  }

  const ids: number[] = [];

  function walk(current: FolderNode) {
    for (const child of current.children) {
      if (child.id !== undefined) {
        ids.push(child.id);
      }

      walk(child);
    }
  }

  walk(node);

  return ids;
}

/**
 * Return ancestor IDs from root to parent.
 */
export function getAncestorFolderIds(
  folders: Folder[],
  folderId: number
): number[] {
  const lookup = new Map(
    folders.map((folder) => [folder.id, folder])
  );

  const ancestors: number[] = [];

  let current = lookup.get(folderId);

  while (current && current.parentId !== null) {
    ancestors.unshift(current.parentId);

    current = lookup.get(current.parentId);
  }

  return ancestors;
}

/**
 * Returns true if candidate is inside target folder.
 */
export function isDescendant(
  tree: FolderNode[],
  targetFolderId: number,
  candidateFolderId: number
): boolean {
  const descendants = getDescendantFolderIds(
    tree,
    targetFolderId
  );

  return descendants.includes(candidateFolderId);
}

/**
 * Flatten a folder tree.
 */
export function flattenFolderTree(
  tree: FolderNode[]
): FolderNode[] {
  const result: FolderNode[] = [];

  function walk(nodes: FolderNode[]) {
    for (const node of nodes) {
      result.push(node);

      walk(node.children);
    }
  }

  walk(tree);

  return result;
}

/**
 * Remove a folder from the tree.
 */
export function removeFolderFromTree(
  tree: FolderNode[],
  folderId: number
): FolderNode[] {
  return tree
    .filter((node) => node.id !== folderId)
    .map((node) => ({
      ...node,
      children: removeFolderFromTree(
        node.children,
        folderId
      ),
    }));
}

/**
 * Count total folders.
 */
export function countFolders(
  tree: FolderNode[]
): number {
  let count = 0;

  function walk(nodes: FolderNode[]) {
    for (const node of nodes) {
      count++;

      walk(node.children);
    }
  }

  walk(tree);

  return count;
}