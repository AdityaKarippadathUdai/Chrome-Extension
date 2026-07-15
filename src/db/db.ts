import Dexie, { Table } from 'dexie';

/**
 * Folder entity representing a folder in the library hierarchy
 */
export interface Folder {
  /** Unique identifier for the folder */
  id: string;
  /** Display name of the folder */
  name: string;
  /** ID of the parent folder (null for root folders) */
  parentId: string | null;
  /** Timestamp when the folder was created */
  createdAt: Date;
  /** Timestamp when the folder was last updated */
  updatedAt: Date;
}

/**
 * Book entity representing a book in the library
 */
export interface Book {
  /** Unique identifier for the book */
  id: string;
  /** Title of the book */
  title: string;
  /** Author(s) of the book */
  author: string;
  /** Detailed description of the book */
  description: string;
  /** ID of the folder containing this book */
  folderId: string;
  /** URL to the book cover image */
  coverUrl: string;
  /** URL to the book file (PDF, EPUB, etc.) */
  fileUrl: string;
  /** Category/genre of the book */
  category: string;
  /** Array of tags for categorisation */
  tags: string[];
  /** Whether the book is marked as favorite */
  isFavorite: boolean;
  /** Current reading status */
  readingStatus: 'unread' | 'reading' | 'completed' | 'on-hold' | 'dropped';
  /** Publisher of the book */
  publisher: string;
  /** Publication year */
  publishYear: number;
  /** ISBN of the book */
  isbn: string;
  /** Timestamp when the book was created */
  createdAt: Date;
  /** Timestamp when the book was last updated */
  updatedAt: Date;
}

/**
 * Database schema for the Book Library Chrome Extension.
 * Uses Dexie.js for IndexedDB wrapper with strong typing.
 */
export class BookLibraryDB extends Dexie {
  /** Table for storing folders */
  folders!: Table<Folder, string>;
  /** Table for storing books */
  books!: Table<Book, string>;

  constructor() {
    super('BookLibraryDB');

    // Define database schema with versioning
    this.version(1).stores({
      // Folders table: indexed by id, parentId, and name
      folders: 'id, parentId, name, createdAt, updatedAt',
      // Books table: indexed by id, folderId, title, author, and isFavorite
      books: 'id, folderId, title, author, isFavorite, createdAt, updatedAt',
    });

    // Future migrations can be added here:
    // this.version(2).stores({
    //   folders: 'id, parentId, name, createdAt, updatedAt',
    //   books: 'id, folderId, title, author, isFavorite, createdAt, updatedAt, readingStatus',
    // });
    // this.version(2).upgrade(trans => { ... });
  }
}

/**
 * Singleton database instance for the entire application
 */
export const db = new BookLibraryDB();

// Export type aliases for convenience
export type BookTable = typeof db.books;
export type FolderTable = typeof db.folders;

// Initialize database and log connection status
db.open()
  .then(() => {
    console.log('📚 Book Library DB initialized successfully');
  })
  .catch((error) => {
    console.error('❌ Failed to open Book Library DB:', error);
  });

export default db;