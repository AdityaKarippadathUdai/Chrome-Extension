// src/components/links/LinkGrid.tsx

import type { Link } from "../../types/link";
import LinkCard from "./LinkCard";
import EmptyState from "../common/EmptyState";

interface LinkGridProps {
  /**
   * Links to display.
   */
  links: Link[];

  /**
   * Currently selected link ID.
   */
  selectedLinkId?: number | null;

  /**
   * Loading state.
   */
  loading?: boolean;

  /**
   * Called when a link is selected.
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
   * Open the link.
   */
  onOpen?: (url: string) => void;
}

export default function LinkGrid({
  links,
  selectedLinkId,
  loading = false,
  onSelect,
  onToggleFavorite,
  onMenuClick,
  onOpen,
}: LinkGridProps) {
  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-48 animate-pulse rounded-xl bg-gray-200"
          />
        ))}
      </div>
    );
  }

  if (links.length === 0) {
    return (
      <EmptyState
        title="No links found"
        description="Save your first website to get started."
      />
    );
  }

  return (
    <div
      className="
        grid
        gap-4
        sm:grid-cols-2
        lg:grid-cols-3
      "
    >
      {links.map((link) => (
        <LinkCard
          key={link.id}
          link={link}
          selected={selectedLinkId === link.id}
          onSelect={onSelect}
          onToggleFavorite={onToggleFavorite}
          onMenuClick={onMenuClick}
          onOpen={onOpen}
        />
      ))}
    </div>
  );
}