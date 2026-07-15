// src/components/folders/FolderContextMenu.tsx

import { useEffect, useRef } from "react";
import {
  FolderPlus,
  Pencil,
  Trash2,
  FolderInput,
  Link2,
} from "lucide-react";

interface FolderContextMenuProps {
  isOpen: boolean;

  x: number;
  y: number;

  onClose: () => void;

  onCreateFolder: () => void;
  onRenameFolder: () => void;
  onMoveFolder: () => void;
  onDeleteFolder: () => void;
  onAddLink: () => void;
}

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  danger?: boolean;
  onClick: () => void;
}

function MenuItem({
  icon,
  label,
  danger = false,
  onClick,
}: MenuItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex
        w-full
        items-center
        gap-3
        rounded-lg
        px-3
        py-2
        text-left
        text-sm
        transition-colors
        ${
          danger
            ? "text-red-600 hover:bg-red-50"
            : "text-gray-700 hover:bg-gray-100"
        }
      `}
    >
      {icon}

      <span>{label}</span>
    </button>
  );
}

export default function FolderContextMenu({
  isOpen,
  x,
  y,
  onClose,
  onCreateFolder,
  onRenameFolder,
  onMoveFolder,
  onDeleteFolder,
  onAddLink,
}: FolderContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    function handleClick(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [isOpen, onClose]);

  // Close with Escape
  useEffect(() => {
    if (!isOpen) return;

    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKey);

    return () => {
      document.removeEventListener("keydown", handleKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      role="menu"
      className="
        fixed
        z-50
        w-56
        rounded-xl
        border
        border-gray-200
        bg-white
        p-2
        shadow-xl
      "
      style={{
        left: x,
        top: y,
      }}
    >
      <MenuItem
        icon={<FolderPlus size={18} />}
        label="New Folder"
        onClick={() => {
          onCreateFolder();
          onClose();
        }}
      />

      <MenuItem
        icon={<Link2 size={18} />}
        label="Add Link"
        onClick={() => {
          onAddLink();
          onClose();
        }}
      />

      <div className="my-2 border-t" />

      <MenuItem
        icon={<Pencil size={18} />}
        label="Rename Folder"
        onClick={() => {
          onRenameFolder();
          onClose();
        }}
      />

      <MenuItem
        icon={<FolderInput size={18} />}
        label="Move Folder"
        onClick={() => {
          onMoveFolder();
          onClose();
        }}
      />

      <div className="my-2 border-t" />

      <MenuItem
        danger
        icon={<Trash2 size={18} />}
        label="Delete Folder"
        onClick={() => {
          onDeleteFolder();
          onClose();
        }}
      />
    </div>
  );
}