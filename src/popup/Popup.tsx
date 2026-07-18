// src/popup/Popup.tsx

import { useEffect, useState, useMemo } from "react";
import { ExternalLink, Library, Settings, Search, Star, Plus, Check, AlertCircle } from "lucide-react";
import browser from "../browser";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import { useLinks } from "../hooks/useLinks";
import { getFavicon } from "../utils/favicon";
import db from "../db/db";

export default function Popup() {
  const { allLinks, toggleFavorite, createLink } = useLinks();
  const [currentTab, setCurrentTab] = useState<{ title: string; url: string } | null>(null);
  const [activeTab, setActiveTab] = useState<"recent" | "favorites">("recent");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  // Fetch current active tab info
  useEffect(() => {
    async function fetchTab() {
      try {
        const tabs = await browser.tabs.query({ active: true, currentWindow: true });
        if (tabs[0] && tabs[0].url && tabs[0].title) {
          setCurrentTab({
            title: tabs[0].title,
            url: tabs[0].url,
          });
        }
      } catch (e) {
        console.error("Failed to query tabs:", e);
      }
    }
    fetchTab();
  }, []);

  const isSupportedPage = useMemo(() => {
    if (!currentTab) return false;
    return currentTab.url.startsWith("http:") || currentTab.url.startsWith("https:");
  }, [currentTab]);

  const isAlreadySaved = useMemo(() => {
    if (!currentTab) return false;
    return allLinks.some((link) => link.url === currentTab.url);
  }, [currentTab, allLinks]);

  // Handle adding current tab to default folder
  const handleAddCurrentTab = async () => {
    if (!currentTab || isAlreadySaved || !isSupportedPage || isAdding) return;

    setIsAdding(true);
    try {
      let targetFolderId: number;
      const allFolders = await db.folders.toArray();
      const defaultFolder = allFolders.find((f) => f.name === "Unsorted");

      if (defaultFolder && defaultFolder.id !== undefined) {
        targetFolderId = defaultFolder.id;
      } else {
        if (allFolders.length > 0 && allFolders[0].id !== undefined) {
          targetFolderId = allFolders[0].id;
        } else {
          const now = new Date();
          const newFolderId = await db.folders.add({
            name: "Unsorted",
            parentId: null,
            createdAt: now,
            updatedAt: now,
          });
          targetFolderId = newFolderId;
        }
      }

      const faviconUrl = getFavicon(currentTab.url);

      await createLink({
        title: currentTab.title,
        url: currentTab.url,
        description: "",
        tags: [],
        folderId: targetFolderId,
        favorite: false,
        favicon: faviconUrl,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    } catch (e) {
      console.error("Failed to save current tab link:", e);
    } finally {
      setIsAdding(false);
    }
  };

  // Open the main options library
  const handleOpenLibrary = () => {
    browser.runtime.openOptionsPage();
  };

  // Open the options library with settings open
  const handleOpenSettings = () => {
    browser.tabs.create({ url: browser.runtime.getURL("options.html?settings=true") });
  };

  // Filter links based on query and tab
  const displayLinks = useMemo(() => {
    let list = [...allLinks];
    if (activeTab === "favorites") {
      list = list.filter((l) => l.favorite);
    }

    const q = searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (l) =>
          l.title.toLowerCase().includes(q) ||
          l.url.toLowerCase().includes(q)
      );
    }

    if (activeTab === "recent") {
      return list.slice(0, 10);
    }
    return list;
  }, [allLinks, activeTab, searchQuery]);

  return (
    <div className="w-[400px] h-[600px] flex flex-col bg-gray-50 overflow-hidden font-sans border border-gray-200">
      {/* Header */}
      <header className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4 shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
            <Library size={16} />
          </div>
          <span className="font-bold text-gray-900 text-base">Link Library</span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleOpenLibrary}
            className="flex items-center gap-1 text-gray-600 hover:text-blue-600 px-2 py-1"
            title="Open Library"
          >
            <Library size={16} />
            <span className="text-xs">Library</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleOpenSettings}
            className="text-gray-500 hover:text-blue-600 p-1"
            title="Settings"
            aria-label="Settings"
          >
            <Settings size={16} />
          </Button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-0 p-4 gap-4 overflow-hidden">
        {/* Quick Add Current Tab */}
        <section className="bg-white rounded-xl border border-gray-200 p-3 shadow-sm shrink-0 flex flex-col gap-2">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Current Page
          </h2>
          {currentTab ? (
            <div className="flex flex-col gap-3">
              <div className="flex gap-2.5 items-start">
                <img
                  src={getFavicon(currentTab.url)}
                  alt=""
                  className="w-5 h-5 rounded mt-0.5 object-contain bg-gray-50"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/icons/icon32.png";
                  }}
                />
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-medium text-gray-900 truncate" title={currentTab.title}>
                    {currentTab.title}
                  </h3>
                  <p className="text-xs text-gray-500 truncate" title={currentTab.url}>
                    {currentTab.url}
                  </p>
                </div>
              </div>

              {!isSupportedPage ? (
                <div className="flex items-center gap-1.5 text-amber-600 bg-amber-50 p-2 rounded-lg text-xs">
                  <AlertCircle size={14} />
                  <span>Cannot save browser internal pages</span>
                </div>
              ) : isAlreadySaved ? (
                <Button
                  fullWidth
                  disabled
                  variant="secondary"
                  size="sm"
                  className="bg-green-50 text-green-700 border border-green-200 hover:bg-green-50 cursor-default"
                  leftIcon={<Check size={14} />}
                >
                  Saved to Library
                </Button>
              ) : (
                <Button
                  fullWidth
                  size="sm"
                  onClick={handleAddCurrentTab}
                  loading={isAdding}
                  leftIcon={<Plus size={14} />}
                >
                  Add Current Tab
                </Button>
              )}
            </div>
          ) : (
            <div className="animate-pulse flex flex-col gap-2 py-1">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              <div className="h-8 bg-gray-200 rounded mt-1"></div>
            </div>
          )}
        </section>

        {/* Saved Links Explorer */}
        <section className="flex-1 flex flex-col min-h-0 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-100 shrink-0">
            <button
              onClick={() => setActiveTab("recent")}
              className={`flex-1 py-2 text-center text-sm font-medium border-b-2 transition-colors ${
                activeTab === "recent"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-900"
              }`}
            >
              Recent
            </button>
            <button
              onClick={() => setActiveTab("favorites")}
              className={`flex-1 py-2 text-center text-sm font-medium border-b-2 transition-colors ${
                activeTab === "favorites"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-900"
              }`}
            >
              Favorites ({allLinks.filter((l) => l.favorite).length})
            </button>
          </div>

          {/* Quick Search */}
          <div className="p-2 border-b border-gray-100 shrink-0">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${activeTab}...`}
              leftIcon={<Search size={14} className="text-gray-400" />}
              clearable
              onClear={() => setSearchQuery("")}
            />
          </div>

          {/* Links List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1.5 min-h-0">
            {displayLinks.length > 0 ? (
              displayLinks.map((link) => (
                <div
                  key={link.id}
                  className="flex items-center justify-between gap-3 p-2 rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all group"
                >
                  <div
                    className="flex gap-2 items-center min-w-0 flex-1 cursor-pointer"
                    onClick={() => browser.tabs.create({ url: link.url })}
                  >
                    <img
                      src={link.favicon || getFavicon(link.url)}
                      alt=""
                      className="w-4.5 h-4.5 rounded object-contain bg-white"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/icons/icon32.png";
                      }}
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-semibold text-gray-800 truncate group-hover:text-blue-600">
                        {link.title}
                      </h4>
                      <p className="text-[10px] text-gray-400 truncate">
                        {link.url}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => link.id !== undefined && toggleFavorite(link.id)}
                      className={`p-1 rounded hover:bg-gray-200 transition ${
                        link.favorite ? "text-yellow-500" : "text-gray-300 hover:text-gray-500"
                      }`}
                      title={link.favorite ? "Unfavorite" : "Favorite"}
                    >
                      <Star size={13} fill={link.favorite ? "currentColor" : "none"} />
                    </button>
                    <button
                      onClick={() => browser.tabs.create({ url: link.url })}
                      className="p-1 rounded text-gray-400 hover:text-blue-600 hover:bg-gray-200 transition"
                      title="Open in New Tab"
                    >
                      <ExternalLink size={13} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                <p className="text-xs text-gray-400">
                  {searchQuery ? "No matching links found" : `No ${activeTab} links found`}
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}