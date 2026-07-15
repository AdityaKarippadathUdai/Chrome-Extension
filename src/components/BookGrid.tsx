import React, { memo, useMemo } from 'react';
import { BookOpen, Library } from 'lucide-react';
import BookCard, { BookData } from './BookCard';

export interface BookGridProps {
  /** Array of books to display */
  books: BookData[];
  /** Whether the grid is in a loading state */
  loading?: boolean;
  /** Number of skeleton placeholders to show when loading */
  skeletonCount?: number;
  /** Callback when a book is clicked */
  onBookClick?: (bookId: string) => void;
  /** Callback when favorite is toggled on a book */
  onFavorite?: (bookId: string, isFavorite: boolean) => void;
  /** Callback when menu button is clicked on a book */
  onMenu?: (e: React.MouseEvent, bookId: string) => void;
  /** Custom empty state component or text */
  emptyState?: React.ReactNode;
  /** Custom loading state component */
  loadingState?: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Skeleton loader for book cards
 */
const BookSkeleton = memo(() => (
  <div className="animate-pulse overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
    <div className="aspect-[2/3] bg-gray-200 dark:bg-gray-700" />
    <div className="p-3 space-y-2">
      <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
      <div className="h-3 w-1/2 rounded bg-gray-200 dark:bg-gray-700" />
      <div className="h-3 w-1/3 rounded bg-gray-200 dark:bg-gray-700" />
    </div>
  </div>
));

BookSkeleton.displayName = 'BookSkeleton';

/**
 * Empty state component for when no books are available
 */
const EmptyState = memo(() => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="mb-4 rounded-full bg-blue-50 p-6 dark:bg-blue-900/20">
      <Library className="h-12 w-12 text-blue-400 dark:text-blue-300" />
    </div>
    <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
      No Books Yet
    </h3>
    <p className="max-w-sm text-sm text-gray-500 dark:text-gray-400">
      Start building your library by adding your first book to this folder.
      Click the "Add Book" button to get started.
    </p>
  </div>
));

EmptyState.displayName = 'EmptyState';

/**
 * BookGrid component - Displays books in a responsive grid layout.
 * Uses BookCard for individual book rendering with loading and empty states.
 */
const BookGrid = memo(({
  books,
  loading = false,
  skeletonCount = 6,
  onBookClick,
  onFavorite,
  onMenu,
  emptyState,
  loadingState,
  className = '',
}: BookGridProps) => {
  // Generate skeleton placeholders
  const skeletons = useMemo(() => {
    return Array.from({ length: skeletonCount }, (_, index) => (
      <BookSkeleton key={`skeleton-${index}`} />
    ));
  }, [skeletonCount]);

  // Loading state
  if (loading) {
    return (
      <div className={className}>
        {loadingState || (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {skeletons}
          </div>
        )}
      </div>
    );
  }

  // Empty state
  if (books.length === 0) {
    return (
      <div className={className}>
        {emptyState || <EmptyState />}
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Book count */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Showing {books.length} book{books.length !== 1 ? 's' : ''}
        </p>
        {/* Future: Add view toggle (grid/list) and sort options here */}
      </div>

      {/* Responsive grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {books.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            onClick={onBookClick}
            onFavorite={onFavorite}
            onMenu={onMenu}
          />
        ))}
      </div>
    </div>
  );
});

BookGrid.displayName = 'BookGrid';

export default BookGrid;