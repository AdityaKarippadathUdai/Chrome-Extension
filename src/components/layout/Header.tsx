// src/components/layout/Header.tsx

import {
  FolderPlus,
  Link2,
  Search,
  Settings,
} from "lucide-react";

import Input from "../common/Input";
import Button from "../common/Button";

interface HeaderProps {
  /**
   * Current search query.
   */
  searchQuery: string;

  /**
   * Search query changed.
   */
  onSearchChange: (value: string) => void;

  /**
   * Create a new folder.
   */
  onAddFolder: () => void;

  /**
   * Create a new link.
   */
  onAddLink: () => void;

  /**
   * Open settings.
   */
  onOpenSettings: () => void;
}

export default function Header({
  searchQuery,
  onSearchChange,
  onAddFolder,
  onAddLink,
  onOpenSettings,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
          <Link2 size={20} />
        </div>

        <div>
          <h1 className="text-lg font-bold text-gray-900">
            Link Library
          </h1>

          <p className="text-xs text-gray-500">
            Organize your saved websites
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="mx-8 w-full max-w-lg">
        <Input
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search links..."
          leftIcon={<Search size={18} />}
          clearable
          onClear={() => onSearchChange("")}
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          leftIcon={<FolderPlus size={18} />}
          onClick={onAddFolder}
        >
          Folder
        </Button>

        <Button
          leftIcon={<Link2 size={18} />}
          onClick={onAddLink}
        >
          Link
        </Button>

        <Button
          variant="ghost"
          onClick={onOpenSettings}
          aria-label="Settings"
        >
          <Settings size={18} />
        </Button>
      </div>
    </header>
  );
}