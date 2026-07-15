// src/components/links/LinkDetails.tsx

import {
  Calendar,
  ExternalLink,
  Folder,
  Globe,
  Pencil,
  Star,
  Tag,
  Trash2,
} from "lucide-react";

import Button from "../common/Button";
import type { Link } from "../../types/link";

interface LinkDetailsProps {
  /**
   * Selected link.
   */
  link: Link | null;

  /**
   * Folder name (optional).
   */
  folderName?: string;

  /**
   * Edit callback.
   */
  onEdit?: (id: number) => void;

  /**
   * Delete callback.
   */
  onDelete?: (id: number) => void;

  /**
   * Toggle favorite callback.
   */
  onToggleFavorite?: (id: number) => void;

  /**
   * Open callback.
   */
  onOpen?: (url: string) => void;
}

export default function LinkDetails({
  link,
  folderName,
  onEdit,
  onDelete,
  onToggleFavorite,
  onOpen,
}: LinkDetailsProps) {
  if (!link) {
    return (
      <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50">
        <p className="text-gray-500">
          Select a link to view its details.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-start gap-4">
        {link.favicon ? (
          <img
            src={link.favicon}
            alt=""
            className="h-14 w-14 rounded-lg"
          />
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-gray-100">
            <Globe size={28} />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <h2 className="truncate text-xl font-bold">
            {link.title}
          </h2>

          <p className="mt-1 break-all text-sm text-gray-500">
            {link.url}
          </p>
        </div>
      </div>

      {/* Description */}
      {link.description && (
        <section className="mt-6">
          <h3 className="mb-2 font-semibold">
            Description
          </h3>

          <p className="text-sm text-gray-600">
            {link.description}
          </p>
        </section>
      )}

      {/* Metadata */}
      <section className="mt-6 space-y-3">
        <div className="flex items-center gap-3 text-sm">
          <Folder size={18} />
          <span>{folderName ?? "Unknown Folder"}</span>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <Calendar size={18} />
          <span>
            Created{" "}
            {link.createdAt.toLocaleDateString()}
          </span>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <Star size={18} />

          <span>
            {link.favorite
              ? "Favorite"
              : "Not Favorite"}
          </span>
        </div>
      </section>

      {/* Tags */}
      {link.tags.length > 0 && (
        <section className="mt-6">
          <div className="mb-2 flex items-center gap-2">
            <Tag size={18} />
            <span className="font-semibold">
              Tags
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {link.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-blue-100 px-3 py-1 text-xs text-blue-700"
              >
                #{tag}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Actions */}
      <div className="mt-8 flex flex-wrap gap-3">
        <Button
          leftIcon={<ExternalLink size={18} />}
          onClick={() => onOpen?.(link.url)}
        >
          Open
        </Button>

        <Button
          variant="secondary"
          leftIcon={<Pencil size={18} />}
          onClick={() =>
            link.id !== undefined &&
            onEdit?.(link.id)
          }
        >
          Edit
        </Button>

        <Button
          variant="ghost"
          leftIcon={<Star size={18} />}
          onClick={() =>
            link.id !== undefined &&
            onToggleFavorite?.(link.id)
          }
        >
          {link.favorite
            ? "Unfavorite"
            : "Favorite"}
        </Button>

        <Button
          variant="danger"
          leftIcon={<Trash2 size={18} />}
          onClick={() =>
            link.id !== undefined &&
            onDelete?.(link.id)
          }
        >
          Delete
        </Button>
      </div>
    </div>
  );
}