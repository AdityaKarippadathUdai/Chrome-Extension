import { c as createLucideIcon, r as reactExports, _ as __vitePreload, j as jsxRuntimeExports, M as Modal, L as LinkForm, e as useLinks, B as Button, a as Settings, P as Plus, I as Input, S as Search, b as Star, E as ExternalLink, R as ReactDOM, g as React } from "./index-Jl4alu2V.js";
import { b as browser } from "./browser-polyfill-CTIq9JCV.js";
import { getFavicon } from "./favicon-CZr4oy01.js";
import "./_commonjsHelpers-DWwsNxpa.js";
const __iconNode$2 = [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]];
const Check = createLucideIcon("check", __iconNode$2);
const __iconNode$1 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["line", { x1: "12", x2: "12", y1: "8", y2: "12", key: "1pkeuh" }],
  ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16", key: "4dfq90" }]
];
const CircleAlert = createLucideIcon("circle-alert", __iconNode$1);
const __iconNode = [
  ["path", { d: "m16 6 4 14", key: "ji33uf" }],
  ["path", { d: "M12 6v14", key: "1n7gus" }],
  ["path", { d: "M8 8v12", key: "1gg7y9" }],
  ["path", { d: "M4 4v16", key: "6qkkli" }]
];
const Library = createLucideIcon("library", __iconNode);
function useCurrentTab() {
  const [currentTab, setCurrentTab] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState(null);
  const fetchCurrentTab = reactExports.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const tabs = await browser.tabs.query({ active: true, currentWindow: true });
      const tab = tabs[0];
      if (tab && tab.url && tab.title) {
        const { getFavicon: getFavicon2 } = await __vitePreload(async () => {
          const { getFavicon: getFavicon3 } = await import("./favicon-CZr4oy01.js");
          return { getFavicon: getFavicon3 };
        }, true ? [] : void 0);
        const faviconUrl = getFavicon2(tab.url);
        setCurrentTab({
          title: tab.title,
          url: tab.url,
          faviconUrl
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
  reactExports.useEffect(() => {
    fetchCurrentTab();
  }, [fetchCurrentTab]);
  return {
    currentTab,
    loading,
    error,
    refresh: fetchCurrentTab
  };
}
function AddCurrentTabModal({
  isOpen,
  onClose,
  currentTab,
  onSave
}) {
  const [loading, setLoading] = reactExports.useState(false);
  const initialValues = {
    title: currentTab?.title ?? "",
    url: currentTab?.url ?? "",
    description: "",
    tags: [],
    folderId: void 0,
    favorite: false
  };
  async function handleSubmit(values) {
    setLoading(true);
    try {
      await onSave(values);
      onClose();
    } catch (e) {
      console.error(e);
      alert("Failed to save bookmark.");
    } finally {
      setLoading(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Modal, { isOpen, title: "Save Current Tab", onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    LinkForm,
    {
      initialValues,
      loading,
      onSubmit: handleSubmit,
      onCancel: onClose
    }
  ) });
}
function Popup() {
  const { allLinks, toggleFavorite, createLink } = useLinks();
  const { currentTab, loading: tabLoading } = useCurrentTab();
  const [activeTab, setActiveTab] = reactExports.useState("recent");
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [isModalOpen, setIsModalOpen] = reactExports.useState(false);
  const isSupportedPage = reactExports.useMemo(() => {
    if (!currentTab) return false;
    return currentTab.url.startsWith("http:") || currentTab.url.startsWith("https:");
  }, [currentTab]);
  const isAlreadySaved = reactExports.useMemo(() => {
    if (!currentTab) return false;
    return allLinks.some((link) => link.url === currentTab.url);
  }, [currentTab, allLinks]);
  const handleSaveCurrentTab = async (values) => {
    const faviconUrl = getFavicon(values.url);
    await createLink({
      ...values,
      favicon: faviconUrl,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    });
  };
  const handleOpenLibrary = () => {
    browser.runtime.openOptionsPage();
  };
  const handleOpenSettings = () => {
    browser.tabs.create({ url: browser.runtime.getURL("options.html?settings=true") });
  };
  const displayLinks = reactExports.useMemo(() => {
    let list = [...allLinks];
    if (activeTab === "favorites") {
      list = list.filter((l) => l.favorite);
    }
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (l) => l.title.toLowerCase().includes(q) || l.url.toLowerCase().includes(q)
      );
    }
    if (activeTab === "recent") {
      return list.slice(0, 10);
    }
    return list;
  }, [allLinks, activeTab, searchQuery]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-[400px] h-[600px] flex flex-col bg-gray-50 overflow-hidden font-sans border border-gray-200", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4 shrink-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Library, { size: 16 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-gray-900 text-base", children: "Link Library" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "ghost",
              size: "sm",
              onClick: handleOpenLibrary,
              className: "flex items-center gap-1 text-gray-600 hover:text-blue-600 px-2 py-1",
              title: "Open Library",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Library, { size: 16 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", children: "Library" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "sm",
              onClick: handleOpenSettings,
              className: "text-gray-500 hover:text-blue-600 p-1",
              title: "Settings",
              "aria-label": "Settings",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { size: 16 })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col min-h-0 p-4 gap-4 overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "bg-white rounded-xl border border-gray-200 p-3 shadow-sm shrink-0 flex flex-col gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xs font-semibold text-gray-400 uppercase tracking-wider", children: "Current Page" }),
          !tabLoading ? currentTab ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2.5 items-start", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: currentTab.faviconUrl,
                  alt: "",
                  className: "w-5 h-5 rounded mt-0.5 object-contain bg-gray-50",
                  onError: (e) => {
                    e.target.src = "/icons/icon32.png";
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-medium text-gray-900 truncate", title: currentTab.title, children: currentTab.title }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500 truncate", title: currentTab.url, children: currentTab.url })
              ] })
            ] }),
            !isSupportedPage ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-amber-600 bg-amber-50 p-2 rounded-lg text-xs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { size: 14 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Cannot save browser internal pages" })
            ] }) : isAlreadySaved ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                fullWidth: true,
                disabled: true,
                variant: "secondary",
                size: "sm",
                className: "bg-green-50 text-green-700 border border-green-200 hover:bg-green-50 cursor-default",
                leftIcon: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 14 }),
                children: "Saved to Library"
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                fullWidth: true,
                size: "sm",
                onClick: () => setIsModalOpen(true),
                leftIcon: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 14 }),
                children: "Add Current Tab"
              }
            )
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-amber-600 bg-amber-50 p-2 rounded-lg text-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { size: 14 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "No active tab found" })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "animate-pulse flex flex-col gap-2 py-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 bg-gray-200 rounded w-3/4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 bg-gray-200 rounded w-1/2" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 bg-gray-200 rounded mt-1" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "flex-1 flex flex-col min-h-0 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex border-b border-gray-100 shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => setActiveTab("recent"),
                className: `flex-1 py-2 text-center text-sm font-medium border-b-2 transition-colors ${activeTab === "recent" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-900"}`,
                children: "Recent"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: () => setActiveTab("favorites"),
                className: `flex-1 py-2 text-center text-sm font-medium border-b-2 transition-colors ${activeTab === "favorites" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-900"}`,
                children: [
                  "Favorites (",
                  allLinks.filter((l) => l.favorite).length,
                  ")"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 border-b border-gray-100 shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value: searchQuery,
              onChange: (e) => setSearchQuery(e.target.value),
              placeholder: `Search ${activeTab}...`,
              leftIcon: /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 14, className: "text-gray-400" }),
              clearable: true,
              onClear: () => setSearchQuery("")
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto p-2 space-y-1.5 min-h-0", children: displayLinks.length > 0 ? displayLinks.map((link) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center justify-between gap-3 p-2 rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all group",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "flex gap-2 items-center min-w-0 flex-1 cursor-pointer",
                    onClick: () => browser.tabs.create({ url: link.url }),
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "img",
                        {
                          src: link.favicon || getFavicon(link.url),
                          alt: "",
                          className: "w-4.5 h-4.5 rounded object-contain bg-white",
                          onError: (e) => {
                            e.target.src = "/icons/icon32.png";
                          }
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-xs font-semibold text-gray-800 truncate group-hover:text-blue-600", children: link.title }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-gray-400 truncate", children: link.url })
                      ] })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 shrink-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      onClick: () => link.id !== void 0 && toggleFavorite(link.id),
                      className: `p-1 rounded hover:bg-gray-200 transition ${link.favorite ? "text-yellow-500" : "text-gray-300 hover:text-gray-500"}`,
                      title: link.favorite ? "Unfavorite" : "Favorite",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { size: 13, fill: link.favorite ? "currentColor" : "none" })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      onClick: () => browser.tabs.create({ url: link.url }),
                      className: "p-1 rounded text-gray-400 hover:text-blue-600 hover:bg-gray-200 transition",
                      title: "Open in New Tab",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { size: 13 })
                    }
                  )
                ] })
              ]
            },
            link.id
          )) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col items-center justify-center py-8 px-4 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400", children: searchQuery ? "No matching links found" : `No ${activeTab} links found` }) }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AddCurrentTabModal,
      {
        isOpen: isModalOpen,
        onClose: () => setIsModalOpen(false),
        currentTab,
        onSave: handleSaveCurrentTab
      }
    )
  ] });
}
ReactDOM.createRoot(
  document.getElementById("root")
).render(
  /* @__PURE__ */ jsxRuntimeExports.jsx(React.StrictMode, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Popup, {}) })
);
