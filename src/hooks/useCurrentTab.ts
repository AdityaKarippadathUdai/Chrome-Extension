// src/hooks/useCurrentTab.ts

import { useEffect, useState, useCallback } from "react";
import browser from "../browser";

export interface CurrentTabInfo {
  title: string;
  url: string;
  faviconUrl: string;
}

export function useCurrentTab() {
  const [currentTab, setCurrentTab] = useState<CurrentTabInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCurrentTab = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const tabs = await browser.tabs.query({ active: true, currentWindow: true });
      const tab = tabs[0];
      if (tab && tab.url && tab.title) {
        const { getFavicon } = await import("../utils/favicon");
        const faviconUrl = getFavicon(tab.url);

        setCurrentTab({
          title: tab.title,
          url: tab.url,
          faviconUrl,
        });
      } else {
        setError("No active tab found.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to query tab information.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentTab();
  }, [fetchCurrentTab]);

  return {
    currentTab,
    loading,
    error,
    refresh: fetchCurrentTab,
  };
}
