import React, { memo, useState, useCallback } from 'react';
import {
  BookOpen,
  User,
  Tag,
  Calendar,
  Link2,
  Star,
  StarOff,
  Clock,
  FileText,
  Pencil,
  Trash2,
  ExternalLink,
  Bookmark,
} from 'lucide-react';
import Button from './Button';
import { BookData } from './BookCard';

export interface BookDetailsProps {
  /** Book data to display */
  book: BookData;
  /** Callback when book should be opened/read */
  onOpen?: (bookId: string) => void;
  /** Callback when edit action is triggered */
  onEdit?: (bookId: string) => void;
  /** Callback when delete action is triggered */
  onDelete?: (bookId: string) => void;
  /** Callback when favorite is toggled */
  onFavorite?: (bookId: string, isFavorite: boolean) => void;
  /** Whether the details are in a loading state */
  loading?: boolean;
  /** Additional CSS classes */
  className?: string;
}

// Reading status options
type ReadingStatus = 'unread' | 'reading' | 'completed' | 'on-hold' | 'dropped';

// Status configuration for display
const statusConfig: Record<ReadingStatus, { label: string; color: string; icon: React.ElementType }> = {
  unread: { label: 'Unread', color: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300', icon: Clock },
  reading: { label: 'Reading', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300', icon: BookOpen },
  completed: { label: 'Completed', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300', icon: Bookmark },
  'on-hold': { label: 'On Hold', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300', icon: Clock },
  dropped: { label: 'Dropped', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300', icon: FileText },
};

/**
 * BookDetails component - Displays detailed book information with action buttons.
 * Optimized for use in modals or side panels.
 */
const BookDetails = memo(({
  book,
  onOpen,
  onEdit,
  onDelete,
  onFavorite,
  loading = false,
  className = '',
}: BookDetailsProps) => {
  const [imageError, setImageError] = useState(false);

  // Handle image error
  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  // Get status config
  const status = book.readingStatus as ReadingStatus;
  const statusInfo = status && statusConfig[status];

  // Format date
  const formatDate = (date?: Date | string) => {
    if (!date) return 'N/A';
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="flex flex-col gap-6 md:flex-row">
          <div className="aspect-[2/3] w-full max-w-xs rounded-lg bg-gray-200 dark:bg-gray-700" />
          <div className="flex-1 space-y-4">
            <div className="h-8 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="space-y-2">
              <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-4 w-5/6 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-4 w-4/6 rounded bg-gray-200 dark:bg-gray-700" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <div className="flex flex-col gap-6 md:flex-row">
        {/* Cover Image */}
        <div className="flex-shrink-0">
          <div className="aspect-[2/3] w-full max-w-xs overflow-hidden rounded-lg bg-gray-100 shadow-lg dark:bg-gray-700">
            {book.coverUrl && !imageError ? (
              <img
                src={book.coverUrl}
                alt={`Cover of ${book.title}`}
                className="h-full w-full object-cover"
                onError={handleImageError}
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center p-4 text-center">
                <BookOpen className="mb-2 h-16 w-16 text-gray-400 dark:text-gray-500" />
                <p className="text-sm text-gray-500 dark:text-gray-400">No Cover</p>
              </div>
            )}
          </div>
        </div>

        {/* Book Information */}
        <div className="flex-1 space-y-4">
          {/* Title and Favorite */}
          <div className="flex items-start justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {book.title}
            </h2>
            <button
              onClick={() => onFavorite?.(book.id, !book.isFavorite)}
              className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label={book.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              {book.isFavorite ? (
                <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
              ) : (
                <StarOff className="h-6 w-6 text-gray-400 dark:text-gray-500" />
              )}
            </button>
          </div>

          {/* Author */}
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
            <User className="h-4 w-4 flex-shrink-0" />
            <span className="text-lg">{book.author || 'Unknown Author'}</span>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {/* Category */}
            {book.category && (
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <Tag className="h-4 w-4 flex-shrink-0" />
                <span className="rounded-full bg-blue-50 px-3 py-1 text-sm dark:bg-blue-900/30 dark:text-blue-300">
                  {book.category}
                </span>
              </div>
            )}

            {/* Reading Status */}
            {statusInfo && (
              <div className="flex items-center gap-2 text-sm">
                <statusInfo.icon className="h-4 w-4 flex-shrink-0" />
                <span className={`rounded-full px-3 py-1 text-sm ${statusInfo.color}`}>
                  {statusInfo.label}
                </span>
              </div>
            )}

            {/* Publish Year */}
            {book.publishYear && (
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <Calendar className="h-4 w-4 flex-shrink-0" />
                <span>{book.publishYear}</span>
              </div>
            )}

            {/* Publisher */}
            {book.publisher && (
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <BookOpen className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{book.publisher}</span>
              </div>
            )}

            {/* ISBN */}
            {book.isbn && (
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <FileText className="h-4 w-4 flex-shrink-0" />
                <span>ISBN: {book.isbn}</span>
              </div>
            )}

            {/* File URL */}
            {book.fileUrl && (
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <Link2 className="h-4 w-4 flex-shrink-0" />
                <a
                  href={book.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline dark:text-blue-400"
                  onClick={(e) => e.stopPropagation()}
                >
                  View File
                </a>
              </div>
            )}
          </div>

          {/* Description */}
          {book.description && (
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Description
              </h3>
              <p className="max-h-40 overflow-y-auto text-sm text-gray-600 dark:text-gray-400">
                {book.description}
              </p>
            </div>
          )}

          {/* Date Added */}
          {book.createdAt && (
            <div className="text-xs text-gray-400 dark:text-gray-500">
              Added: {formatDate(book.createdAt)}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 pt-4">
            {onOpen && (
              <Button
                variant="primary"
                size="sm"
                leftIcon={ExternalLink}
                onClick={() => onOpen(book.id)}
              >
                Open Book
              </Button>
            )}
            {onEdit && (
              <Button
                variant="secondary"
                size="sm"
                leftIcon={Pencil}
                onClick={() => onEdit(book.id)}
              >
                Edit
              </Button>
            )}
            {onDelete && (
              <Button
                variant="danger"
                size="sm"
                leftIcon={Trash2}
                onClick={() => onDelete(book.id)}
              >
                Delete
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

BookDetails.displayName = 'BookDetails';

export default BookDetails;