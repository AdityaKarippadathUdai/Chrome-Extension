import React from 'react';
import { BookOpen, Search, Settings } from 'lucide-react';
import Button from './Button';

export interface HeaderProps {
  /** Search query value (controlled from parent) */
  searchValue?: string;
  /** Callback when search input changes */
  onSearchChange?: (value: string) => void;
  /** Callback when settings button is clicked */
  onSettingsClick?: () => void;
  /** Additional header content (e.g., user actions) */
  actions?: React.ReactNode;
}

/**
 * Main application header with branding, search, and settings.
 * Serves as the top navigation for the Book Library.
 */
const Header = ({
  searchValue = '',
  onSearchChange,
  onSettingsClick,
  actions,
}: HeaderProps) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange?.(e.target.value);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-700 dark:bg-gray-900/80">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <BookOpen className="h-8 w-8" aria-hidden="true" />
            <span className="text-xl font-bold text-gray-900 dark:text-white hidden sm:block">
              Book Library
            </span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-4 hidden md:block">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
              aria-hidden="true"
            />
            <input
              type="search"
              placeholder="Search books, authors, folders..."
              value={searchValue}
              onChange={handleSearchChange}
              className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2 pl-9 pr-4 text-sm transition-colors focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-blue-400"
              aria-label="Search books"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {actions}

          {/* Settings Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onSettingsClick}
            aria-label="Open settings"
            className="!p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Settings className="h-5 w-5" aria-hidden="true" />
          </Button>

          {/* Mobile Search Toggle - placeholder for future */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden !p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Search"
          >
            <Search className="h-5 w-5" aria-hidden="true" />
          </Button>
        </div>
      </div>

      {/* Mobile Search Bar - shown below header on mobile */}
      <div className="border-t border-gray-200 px-4 py-2 md:hidden dark:border-gray-700">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
            aria-hidden="true"
          />
          <input
            type="search"
            placeholder="Search books..."
            value={searchValue}
            onChange={handleSearchChange}
            className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2 pl-9 pr-4 text-sm transition-colors focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-blue-400"
            aria-label="Search books"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;