// src/hooks/useLinks.ts

import { useCallback, useEffect, useMemo, useState } from "react";

import db from "../db/db";
import type {
  Link,
  CreateLinkInput,
  UpdateLinkInput,
} from "../types/link";

import { useLibraryStore } from "../store/libraryStore";

export function useLinks() {
  const selectedFolderId = useLibraryStore(
    (state) => state.selectedFolderId
  );

  const searchQuery = useLibraryStore(
    (state) => state.searchQuery
  );

  const showFavorites = useLibraryStore(
    (state) => state.showFavorites
  );

  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load all links.
   */
  const loadLinks = useCallback(async () => {
    try {
      setLoading(true);

      const data = await db.links
        .orderBy("createdAt")
        .reverse()
        .toArray();

      setLinks(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to load links.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLinks();
  }, [loadLinks]);

  /**
   * Add a new link.
   */
  const createLink = useCallback(
    async (input: CreateLinkInput) => {
      const now = new Date();

      await db.links.add({
        ...input,
        createdAt: now,
        updatedAt: now,
      });

      await loadLinks();
    },
    [loadLinks]
  );

  /**
   * Update an existing link.
   */
  const updateLink = useCallback(
    async (
      id: number,
      updates: UpdateLinkInput
    ) => {
      await db.links.update(id, {
        ...updates,
        updatedAt: new Date(),
      });

      await loadLinks();
    },
    [loadLinks]
  );

  /**
   * Delete a link.
   */
  const deleteLink = useCallback(
    async (id: number) => {
      await db.links.delete(id);

      await loadLinks();
    },
    [loadLinks]
  );

  /**
   * Toggle favorite.
   */
  const toggleFavorite = useCallback(
    async (id: number) => {
      const link = await db.links.get(id);

      if (!link) return;

      await db.links.update(id, {
        favorite: !link.favorite,
        updatedAt: new Date(),
      });

      await loadLinks();
    },
    [loadLinks]
  );

  /**
   * Filtered links.
   */
  const filteredLinks = useMemo(() => {
    let result = [...links];

    if (selectedFolderId !== null) {
      result = result.filter(
        (link) => link.folderId === selectedFolderId
      );
    }

    if (showFavorites) {
      result = result.filter(
        (link) => link.favorite
      );
    }

    const query = searchQuery.trim().toLowerCase();

    if (query) {
      result = result.filter((link) => {
        return (
          link.title.toLowerCase().includes(query) ||
          link.url.toLowerCase().includes(query) ||
          (link.description ?? "")
            .toLowerCase()
            .includes(query) ||
          link.tags.some((tag) =>
            tag.toLowerCase().includes(query)
          )
        );
      });
    }

    return result;
  }, [
    links,
    selectedFolderId,
    showFavorites,
    searchQuery,
  ]);

  return {
    links: filteredLinks,

    allLinks: links,

    loading,

    error,

    reload: loadLinks,

    createLink,

    updateLink,

    deleteLink,

    toggleFavorite,
  };
}