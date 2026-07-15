// src/hooks/useSearch.ts

import { useEffect, useState } from "react";

import { useLibraryStore } from "../store/libraryStore";

/**
 * Search hook.
 *
 * Provides:
 * - current search query
 * - debounced query
 * - update function
 * - clear function
 */
export function useSearch(delay = 300) {
  const searchQuery = useLibraryStore(
    (state) => state.searchQuery
  );

  const setSearchQuery = useLibraryStore(
    (state) => state.setSearchQuery
  );

  const [debouncedQuery, setDebouncedQuery] =
    useState(searchQuery);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, delay);

    return () => {
      window.clearTimeout(timer);
    };
  }, [searchQuery, delay]);

  function clearSearch() {
    setSearchQuery("");
  }

  return {
    searchQuery,
    debouncedQuery,
    setSearchQuery,
    clearSearch,
  };
}

export default useSearch;