// src/popup/Popup.tsx

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";

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

import type { Link } from "../types/link";

export default function Popup() {
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
  } = useLinks();

  const {
    searchQuery,
    setSearchQuery,
    clearSearch,
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

  const toggleFolder = useLibraryStore(
    (state) => state.toggleFolder
  );

  const expandedFolders = useLibraryStore(
    (state) => state.expandedFolders
  );

  const [folderModalOpen, setFolderModalOpen] =
    useState(false);

  const [linkModalOpen, setLinkModalOpen] =
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

  /**
   * Initial values.
   */

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
    <div className="flex h-screen bg-gray-100">
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

      {/* Main */}

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
            chrome.runtime.openOptionsPage();
        }}
        />

        <div className="flex flex-1 overflow-hidden">
          {/* Links */}

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

          {/* Details */}

          <aside className="w-96 border-l bg-white p-6 overflow-y-auto">
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
          description:
            editingLink?.description ?? "",
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
  </>
);
}