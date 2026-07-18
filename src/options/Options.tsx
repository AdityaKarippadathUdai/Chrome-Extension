// src/options/Options.tsx

import { useMemo, useState, useEffect } from "react";
import { Plus } from "lucide-react";
import browser from "../browser";
import db from "../db/db";

import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";

import FolderTree from "../components/folders/FolderTree";
import FolderForm from "../components/folders/FolderForm";
import FolderContextMenu from "../components/folders/FolderContextMenu";

import LinkGrid from "../components/links/LinkGrid";
import LinkDetails from "../components/links/LinkDetails";
import LinkForm from "../components/links/LinkForm";

import Button from "../components/common/Button";
import Modal from "../components/common/Modal";

import { useFolders } from "../hooks/useFolders";
import { useLinks } from "../hooks/useLinks";
import { useSearch } from "../hooks/useSearch";

import { useLibraryStore } from "../store/libraryStore";

export default function Options() {
  const {
    folderTree,
    folders,
    createFolder,
    updateFolder,
    deleteFolder,
  } = useFolders();

  const {
    links,
    loading,
    createLink,
    updateLink,
    deleteLink,
    toggleFavorite,
    reload: reloadLinks,
  } = useLinks();

  const {
    searchQuery,
    setSearchQuery,
  } = useSearch();

  const selectedFolderId = useLibraryStore(
    (state) => state.selectedFolderId
  );

  const setSelectedFolder = useLibraryStore(
    (state) => state.setSelectedFolder
  );

  const selectedLinkId = useLibraryStore(
    (state) => state.selectedLinkId
  );

  const setSelectedLink = useLibraryStore(
    (state) => state.setSelectedLink
  );

  const [folderModalOpen, setFolderModalOpen] =
    useState(false);

  const [linkModalOpen, setLinkModalOpen] =
    useState(false);

  const [settingsModalOpen, setSettingsModalOpen] =
    useState(false);

  const [editingFolderId, setEditingFolderId] =
    useState<number | null>(null);

  const [editingLinkId, setEditingLinkId] =
    useState<number | null>(null);

  const [menuOpen, setMenuOpen] =
    useState(false);

  const [menuFolderId, setMenuFolderId] =
    useState<number | null>(null);

  const [menuX, setMenuX] = useState(0);

  const [menuY, setMenuY] = useState(0);

  // Settings Stats State
  const [folderCount, setFolderCount] = useState(0);
  const [linkCount, setLinkCount] = useState(0);

  // Check URL params on mount to trigger Settings Modal
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("settings") === "true") {
      setSettingsModalOpen(true);
    }
  }, []);

  // Update Settings Stats whenever Settings Modal is opened
  useEffect(() => {
    if (settingsModalOpen) {
      loadStats();
    }
  }, [settingsModalOpen]);

  async function loadStats() {
    try {
      setFolderCount(await db.folders.count());
      setLinkCount(await db.links.count());
    } catch (e) {
      console.error("Failed to load statistics:", e);
    }
  }

  // Settings: Export
  async function exportLibrary() {
    try {
      const foldersList = await db.folders.toArray();
      const linksList = await db.links.toArray();

      const data = {
        exportedAt: new Date().toISOString(),
        folders: foldersList,
        links: linksList,
      };

      const blob = new Blob(
        [JSON.stringify(data, null, 2)],
        { type: "application/json" }
      );

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "link-library.json";
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Failed to export library:", e);
    }
  }

  // Settings: Import
  async function importLibrary(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      if (data.folders) {
        await db.folders.bulkPut(data.folders);
      }

      if (data.links) {
        await db.links.bulkPut(data.links);
      }

      await loadStats();
      await reloadLinks();
      alert("Library imported successfully.");
    } catch (e) {
      console.error("Failed to import library:", e);
      alert("Invalid backup file.");
    }
  }

  // Settings: Clear
  async function clearLibrary() {
    const confirmed = window.confirm(
      "Delete all folders and links?"
    );
    if (!confirmed) return;

    try {
      await db.transaction(
        "rw",
        db.folders,
        db.links,
        async () => {
          await db.links.clear();
          await db.folders.clear();
        }
      );

      await loadStats();
      await reloadLinks();
      alert("Library cleared.");
    } catch (e) {
      console.error("Failed to clear library:", e);
    }
  }

  /**
   * Currently selected link.
   */
  const selectedLink = useMemo(() => {
    return (
      links.find(
        (link) => link.id === selectedLinkId
      ) ?? null
    );
  }, [links, selectedLinkId]);

  /**
   * Selected folder object.
   */
  const selectedFolder = useMemo(() => {
    return (
      folders.find(
        (folder) =>
          folder.id === selectedFolderId
      ) ?? null
    );
  }, [folders, selectedFolderId]);

  /**
   * Open URL.
   */
  function openLink(url: string) {
    window.open(url, "_blank");
  }

  /**
   * Folder context menu.
   */
  function openFolderMenu(
    event: React.MouseEvent,
    folderId: number
  ) {
    event.preventDefault();
    setMenuFolderId(folderId);
    setMenuX(event.clientX);
    setMenuY(event.clientY);
    setMenuOpen(true);
  }

  /**
   * Add folder.
   */
  async function handleCreateFolder(values: {
    name: string;
  }) {
    await createFolder({
      name: values.name,
      parentId: selectedFolderId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    setFolderModalOpen(false);
  }

  /**
   * Rename folder.
   */
  async function handleRenameFolder(values: {
    name: string;
  }) {
    if (editingFolderId === null) return;

    await updateFolder(editingFolderId, {
      name: values.name,
    });
    setEditingFolderId(null);
    setFolderModalOpen(false);
  }

  /**
   * Delete folder.
   */
  async function handleDeleteFolder() {
    if (menuFolderId === null) return;

    if (
      !window.confirm(
        "Delete this folder?"
      )
    ) {
      return;
    }

    await deleteFolder(menuFolderId);
    setMenuOpen(false);
  }

  /**
   * Add link.
   */
  async function handleCreateLink(values: {
    title: string;
    url: string;
    description: string;
    tags: string[];
  }) {
    if (selectedFolderId === null) {
      alert(
        "Please select a folder first."
      );
      return;
    }

    await createLink({
      ...values,
      folderId: selectedFolderId,
      favorite: false,
      favicon: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    setLinkModalOpen(false);
  }

  /**
   * Edit link.
   */
  async function handleUpdateLink(values: {
    title: string;
    url: string;
    description: string;
    tags: string[];
  }) {
    if (editingLinkId === null) return;

    await updateLink(editingLinkId, values);
    setEditingLinkId(null);
    setLinkModalOpen(false);
  }

  /**
   * Delete link.
   */
  async function handleDeleteLink(id: number) {
    if (
      !window.confirm(
        "Delete this link?"
      )
    ) {
      return;
    }

    await deleteLink(id);
    setSelectedLink(null);
  }

  const editingFolder =
    folders.find(
      (folder) =>
        folder.id === editingFolderId
    ) ?? null;

  const editingLink =
    links.find(
      (link) =>
        link.id === editingLinkId
    ) ?? null;

  return (
    <>
      <div className="flex h-full w-full bg-gray-100 overflow-hidden">
        {/* Sidebar */}
        <Sidebar>
          <div className="mb-4">
            <Button
              fullWidth
              leftIcon={<Plus size={18} />}
              onClick={() => {
                setEditingFolderId(null);
                setFolderModalOpen(true);
              }}
            >
              New Folder
            </Button>
          </div>

          <FolderTree
            folders={folderTree}
            onSelectFolder={setSelectedFolder}
            onContextMenu={openFolderMenu}
          />
        </Sidebar>

        {/* Main Content Area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onAddFolder={() => {
              setEditingFolderId(null);
              setFolderModalOpen(true);
            }}
            onAddLink={() => {
              setEditingLinkId(null);
              setLinkModalOpen(true);
            }}
            onOpenSettings={() => {
              setSettingsModalOpen(true);
            }}
          />

          <div className="flex flex-1 overflow-hidden">
            {/* Links Grid */}
            <main className="flex-1 overflow-y-auto p-6">
              <div className="mb-5 flex justify-end">
                <Button
                  leftIcon={<Plus size={18} />}
                  onClick={() => {
                    setEditingLinkId(null);
                    setLinkModalOpen(true);
                  }}
                >
                  Add Link
                </Button>
              </div>

              <LinkGrid
                links={links}
                loading={loading}
                selectedLinkId={selectedLinkId}
                onSelect={setSelectedLink}
                onToggleFavorite={toggleFavorite}
                onOpen={openLink}
              />
            </main>

            {/* Details Panel */}
            <aside className="w-96 border-l bg-white p-6 overflow-y-auto shrink-0">
              <LinkDetails
                link={selectedLink}
                folderName={selectedFolder?.name}
                onOpen={openLink}
                onToggleFavorite={toggleFavorite}
                onDelete={handleDeleteLink}
                onEdit={(id) => {
                  setEditingLinkId(id);
                  setLinkModalOpen(true);
                }}
              />
            </aside>
          </div>
        </div>
      </div>

      {/* Folder Context Menu */}
      <FolderContextMenu
        isOpen={menuOpen}
        x={menuX}
        y={menuY}
        onClose={() => setMenuOpen(false)}
        onCreateFolder={() => {
          setEditingFolderId(null);
          setFolderModalOpen(true);
        }}
        onRenameFolder={() => {
          if (menuFolderId !== null) {
            setEditingFolderId(menuFolderId);
            setFolderModalOpen(true);
          }
        }}
        onMoveFolder={() => {
          alert("Move folder coming soon.");
        }}
        onDeleteFolder={handleDeleteFolder}
        onAddLink={() => {
          if (menuFolderId !== null) {
            setSelectedFolder(menuFolderId);
          }
          setEditingLinkId(null);
          setLinkModalOpen(true);
        }}
      />

      {/* Folder Modal */}
      <Modal
        isOpen={folderModalOpen}
        title={
          editingFolder
            ? "Rename Folder"
            : "New Folder"
        }
        onClose={() => {
          setFolderModalOpen(false);
          setEditingFolderId(null);
        }}
      >
        <FolderForm
          initialValues={{
            name: editingFolder?.name ?? "",
          }}
          onCancel={() => {
            setFolderModalOpen(false);
            setEditingFolderId(null);
          }}
          onSubmit={
            editingFolder
              ? handleRenameFolder
              : handleCreateFolder
          }
        />
      </Modal>

      {/* Link Modal */}
      <Modal
        isOpen={linkModalOpen}
        title={
          editingLink
            ? "Edit Link"
            : "Add Link"
        }
        onClose={() => {
          setLinkModalOpen(false);
          setEditingLinkId(null);
        }}
      >
        <LinkForm
          initialValues={{
            title: editingLink?.title ?? "",
            url: editingLink?.url ?? "",
            description: editingLink?.description ?? "",
            tags: editingLink?.tags ?? [],
          }}
          onCancel={() => {
            setLinkModalOpen(false);
            setEditingLinkId(null);
          }}
          onSubmit={
            editingLink
              ? handleUpdateLink
              : handleCreateLink
          }
        />
      </Modal>

      {/* Extension Settings Modal */}
      <Modal
        isOpen={settingsModalOpen}
        title="Extension Settings"
        maxWidth="md"
        onClose={() => setSettingsModalOpen(false)}
      >
        <div className="space-y-6">
          <section className="rounded-xl border bg-white p-4 shadow-sm">
            <h3 className="mb-2 text-sm font-semibold text-gray-900">Database Statistics</h3>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                <span className="block text-xs text-gray-400 font-medium uppercase tracking-wider">Folders</span>
                <span className="text-xl font-bold text-gray-800">{folderCount}</span>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                <span className="block text-xs text-gray-400 font-medium uppercase tracking-wider">Links</span>
                <span className="text-xl font-bold text-gray-800">{linkCount}</span>
              </div>
            </div>
          </section>

          <section className="rounded-xl border bg-white p-4 shadow-sm">
            <h3 className="mb-2 text-sm font-semibold text-gray-900">Backup & Restore</h3>
            <div className="flex flex-wrap gap-3">
              <Button size="sm" onClick={exportLibrary}>
                Export Library
              </Button>
              <label>
                <input
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={importLibrary}
                />
                <span className="inline-flex cursor-pointer items-center rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-100 font-medium text-gray-700">
                  Import Library
                </span>
              </label>
            </div>
          </section>

          <section className="rounded-xl border border-red-200 bg-red-50 p-4">
            <h3 className="mb-1 text-sm font-semibold text-red-600">Danger Zone</h3>
            <p className="text-xs text-red-500 mb-3">Deleting your library is permanent and cannot be undone.</p>
            <Button
              variant="danger"
              size="sm"
              onClick={clearLibrary}
            >
              Delete Everything
            </Button>
          </section>
        </div>
      </Modal>
    </>
  );
}