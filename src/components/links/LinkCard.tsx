// src/components/links/LinkCard.tsx

import {
  ExternalLink,
  MoreVertical,
  Star,
  Globe,
} from "lucide-react";

import type { Link } from "../../types/link";

interface LinkCardProps {
  /**
   * Link to display.
   */
  link: Link;

  /**
   * Whether this link is selected.
   */
  selected?: boolean;

  /**
   * Called when the card is clicked.
   */
  onSelect?: (id: number) => void;

  /**
   * Toggle favorite.
   */
  onToggleFavorite?: (id: number) => void;

  /**
   * Open context menu.
   */
  onMenuClick?: (
    event: React.MouseEvent<HTMLButtonElement>,
    id: number
  ) => void;

  /**
   * Open link in a new tab.
   */
  onOpen?: (url: string) => void;
}

export default function LinkCard({
  link,
  selected = false,
  onSelect,
  onToggleFavorite,
  onMenuClick,
  onOpen,
}: LinkCardProps) {
  return (
    <div
      className={`
        group
        rounded-xl
        border
        bg-white
        p-4
        shadow-sm
        transition
        hover:shadow-md
        cursor-pointer
        ${
          selected
            ? "border-blue-500 ring-2 ring-blue-100"
            : "border-gray-200"
        }
      `}
      onClick={() => {
        if (link.id !== undefined) {
          onSelect?.(link.id);
        }
      }}
    >
      {/* Header */}

      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3 min-w-0">
          {link.favicon ? (
            <img
              src={link.favicon}
              alt=""
              className="h-8 w-8 rounded"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded bg-gray-100">
              <Globe size={18} />
            </div>
          )}

          <div className="min-w-0">
            <h3 className="truncate font-semibold text-gray-900">
              {link.title}
            </h3>

            <p className="truncate text-xs text-gray-500">
              {link.url}
            </p>
          </div>
        </div>

        <button
          type="button"
          className="rounded p-1 hover:bg-gray-100"
          onClick={(e) => {
            e.stopPropagation();

            if (link.id !== undefined) {
              onMenuClick?.(e, link.id);
            }
          }}
        >
          <MoreVertical size={18} />
        </button>
      </div>

      {/* Description */}

      {link.description && (
        <p className="mt-3 line-clamp-2 text-sm text-gray-600">
          {link.description}
        </p>
      )}

      {/* Tags */}

      {link.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {link.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}

      <div className="mt-4 flex items-center justify-between">
        <button
          type="button"
          className="rounded p-1 hover:bg-yellow-50"
          onClick={(e) => {
            e.stopPropagation();

            if (link.id !== undefined) {
              onToggleFavorite?.(link.id);
            }
          }}
        >
          <Star
            size={18}
            className={
              link.favorite
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-400"
            }
          />
        </button>

        <button
          type="button"
          className="flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
          onClick={(e) => {
            e.stopPropagation();

            onOpen?.(link.url);
          }}
        >
          <ExternalLink size={16} />
          Open
        </button>
      </div>
    </div>
  );
}