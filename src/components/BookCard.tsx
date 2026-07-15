import React, { memo, useState, useCallback, KeyboardEvent } from 'react';
import { 
  Star, 
  StarOff, 
  MoreVertical, 
  BookOpen, 
  User,
  Tag
} from 'lucide-react';

export interface BookData {
  id: string;
  title: string;
  author: string;
  coverUrl?: string | null;
  category?: string;
  isFavorite?: boolean;
  description?: string;
  publisher?: string;
  publishYear?: number;
  isbn?: string;
}

export interface BookCardProps {
  /** Book data object containing all book information */
  book: BookData;
  /** Callback when card is clicked */
  onClick?: (bookId: string) => void;
  /** Callback when favorite button is toggled */
  onFavorite?: (bookId: string, isFavorite: boolean) => void;
  /** Callback when menu button is clicked */
  onMenu?: (e: React.MouseEvent, bookId: string) => void;
  /** Whether the card is in a loading state */
  isLoading?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * BookCard component displaying a book in a grid or list layout.
 * Features cover image, title, author, favorite toggle, and action menu.
 */
const BookCard = memo(({
  book,
  onClick,
  onFavorite,
  onMenu,
  isLoading = false,
  className = '',
}: BookCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Handle card click
  const handleClick = useCallback(() => {
    onClick?.(book.id);
  }, [book.id, onClick]);

  // Handle favorite toggle
  const handleFavorite = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onFavorite?.(book.id, !book.isFavorite);
  }, [book.id, book.isFavorite, onFavorite]);

  // Handle menu button click
  const handleMenu = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onMenu?.(e, book.id);
  }, [book.id, onMenu]);

  // Handle keyboard events (Enter/Space for selection)
  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.(book.id);
    }
  }, [book.id, onClick]);

  // Handle image error (fallback to placeholder)
  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  // Determine cover image source
  const coverSrc = book.coverUrl && !imageError ? book.coverUrl : null;
  const hasCover = Boolean(coverSrc);

  return (
    <div
      className={`
        group relative flex flex-col overflow-hidden rounded-xl border border-gray-200 
        bg-white transition-all duration-200 hover:shadow-lg hover:scale-[1.02]
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        dark:border-gray-700 dark:bg-gray-800
        ${isLoading ? 'animate-pulse opacity-60' : ''}
        ${className}
      `}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      tabIndex={0}
      aria-label={`Book: ${book.title} by ${book.author}`}
    >
      {/* Cover Image Section */}
      <div className="relative aspect-[2/3] overflow-hidden bg-gray-100 dark:bg-gray-700">
        {hasCover ? (
          <img
            src={coverSrc}
            alt={`Cover of ${book.title}`}
            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
            onError={handleImageError}
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center p-4 text-center">
            <BookOpen className="mb-2 h-12 w-12 text-gray-400 dark:text-gray-500" />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              No Cover
            </p>
          </div>
        )}

        {/* Favorite Badge */}
        <button
          className={`
            absolute top-2 right-2 rounded-full bg-white/90 p-1.5 transition-all
            hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500
            dark:bg-gray-800/90
            ${book.isFavorite ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
          `}
          onClick={handleFavorite}
          aria-label={book.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          {book.isFavorite ? (
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          ) : (
            <StarOff className="h-4 w-4 text-gray-400 dark:text-gray-500" />
          )}
        </button>
      </div>

      {/* Book Info Section */}
      <div className="flex flex-1 flex-col p-3">
        {/* Title */}
        <h3 className="mb-1 line-clamp-2 text-sm font-semibold text-gray-900 dark:text-white">
          {book.title}
        </h3>

        {/* Author */}
        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
          <User className="h-3 w-3 flex-shrink-0" />
          <span className="truncate">{book.author || 'Unknown Author'}</span>
        </div>

        {/* Category/Tag */}
        {book.category && (
          <div className="mt-2 flex items-center gap-1">
            <Tag className="h-3 w-3 text-gray-400 dark:text-gray-500" />
            <span className="inline-flex rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              {book.category}
            </span>
          </div>
        )}

        {/* Additional Info */}
        <div className="mt-2 flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
          {book.publishYear && (
            <span>{book.publishYear}</span>
          )}
          {book.publisher && (
            <span className="truncate ml-2">{book.publisher}</span>
          )}
        </div>

        {/* Actions */}
        <div className="mt-2 flex items-center justify-end border-t border-gray-100 pt-2 dark:border-gray-700">
          <button
            className={`
              rounded-full p-1 transition-colors hover:bg-gray-100
              focus:outline-none focus:ring-2 focus:ring-blue-500
              dark:hover:bg-gray-700
            `}
            onClick={handleMenu}
            aria-label="More actions"
          >
            <MoreVertical className="h-4 w-4 text-gray-400 dark:text-gray-500" />
          </button>
        </div>
      </div>
    </div>
  );
});

BookCard.displayName = 'BookCard';

export default BookCard;