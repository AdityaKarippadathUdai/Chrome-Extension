// src/store/libraryStore.ts

import { create } from "zustand";

interface LibraryStore {
  /**
   * Currently selected folder.
   * Null means no folder is selected.
   */
  selectedFolderId: number | null;

  /**
   * Currently selected link.
   * Null means no link is selected.
   */
  selectedLinkId: number | null;

  /**
   * Search query.
   */
  searchQuery: string;

  /**
   * IDs of expanded folders.
   */
  expandedFolders: Set<number>;

  /**
   * Display only favorite links.
   */
  showFavorites: boolean;

  /**
   * Actions
   */
  setSelectedFolder: (id: number | null) => void;
  setSelectedLink: (id: number | null) => void;
  setSearchQuery: (query: string) => void;

  expandFolder: (id: number) => void;
  collapseFolder: (id: number) => void;
  toggleFolder: (id: number) => void;

  toggleFavorites: () => void;

  resetSelection: () => void;
}

export const useLibraryStore = create<LibraryStore>((set) => ({
  selectedFolderId: null,

  selectedLinkId: null,

  searchQuery: "",

  expandedFolders: new Set<number>(),

  showFavorites: false,

  setSelectedFolder: (id) =>
    set({
      selectedFolderId: id,
    }),

  setSelectedLink: (id) =>
    set({
      selectedLinkId: id,
    }),

  setSearchQuery: (query) =>
    set({
      searchQuery: query,
    }),

  expandFolder: (id) =>
    set((state) => {
      const expanded = new Set(state.expandedFolders);
      expanded.add(id);

      return {
        expandedFolders: expanded,
      };
    }),

  collapseFolder: (id) =>
    set((state) => {
      const expanded = new Set(state.expandedFolders);
      expanded.delete(id);

      return {
        expandedFolders: expanded,
      };
    }),

  toggleFolder: (id) =>
    set((state) => {
      const expanded = new Set(state.expandedFolders);

      if (expanded.has(id)) {
        expanded.delete(id);
      } else {
        expanded.add(id);
      }

      return {
        expandedFolders: expanded,
      };
    }),

  toggleFavorites: () =>
    set((state) => ({
      showFavorites: !state.showFavorites,
    })),

  resetSelection: () =>
    set({
      selectedFolderId: null,
      selectedLinkId: null,
      searchQuery: "",
      expandedFolders: new Set<number>(),
      showFavorites: false,
    }),
}));