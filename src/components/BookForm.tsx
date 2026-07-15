import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { BookOpen, X, Save, Folder, Tag as TagIcon } from 'lucide-react';
import Input from './Input';
import Button from './Button';

export interface BookFormData {
  id?: string;
  title: string;
  author: string;
  description: string;
  folderId: string;
  coverUrl: string;
  fileUrl: string;
  category: string;
  tags: string[];
  isFavorite: boolean;
  readingStatus: 'unread' | 'reading' | 'completed' | 'on-hold' | 'dropped';
  publisher?: string;
  publishYear?: number;
  isbn?: string;
}

export interface BookFormProps {
  /** Initial values for editing mode */
  initialValues?: Partial<BookFormData>;
  /** Available folders for selection */
  folders: Array<{ id: string; name: string }>;
  /** Loading state for form submission */
  loading?: boolean;
  /** Called when form is submitted with valid data */
  onSubmit: (data: BookFormData) => void;
  /** Called when form is cancelled */
  onCancel: () => void;
  /** Form title (e.g., "Add Book", "Edit Book") */
  title?: string;
  /** Submit button text */
  submitLabel?: string;
}

/**
 * Reusable BookForm component for adding and editing books.
 * Features validation, error states, and folder selection.
 */
const BookForm = ({
  initialValues = {},
  folders,
  loading = false,
  onSubmit,
  onCancel,
  title = 'Book Details',
  submitLabel = 'Save Book',
}: BookFormProps) => {
  // Form state
  const [formData, setFormData] = useState<Partial<BookFormData>>({
    title: '',
    author: '',
    description: '',
    folderId: '',
    coverUrl: '',
    fileUrl: '',
    category: '',
    tags: [],
    isFavorite: false,
    readingStatus: 'unread',
    ...initialValues,
  });

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Set initial values when they change (for editing mode)
  useEffect(() => {
    setFormData({
      title: '',
      author: '',
      description: '',
      folderId: '',
      coverUrl: '',
      fileUrl: '',
      category: '',
      tags: [],
      isFavorite: false,
      readingStatus: 'unread',
      ...initialValues,
    });
  }, [initialValues]);

  // Validation function
  const validateField = useCallback((name: string, value: any): string => {
    switch (name) {
      case 'title':
        return !value?.trim() ? 'Title is required' : '';
      case 'author':
        return !value?.trim() ? 'Author is required' : '';
      case 'folderId':
        return !value ? 'Please select a folder' : '';
      case 'coverUrl':
        if (value && !isValidUrl(value)) return 'Please enter a valid URL';
        return '';
      case 'fileUrl':
        if (value && !isValidUrl(value)) return 'Please enter a valid URL';
        return '';
      default:
        return '';
    }
  }, []);

  // URL validation helper
  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Validate all fields
  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    // Required fields
    const requiredFields = ['title', 'author', 'folderId'];
    requiredFields.forEach((field) => {
      const error = validateField(field, formData[field as keyof BookFormData]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    // Optional fields with validation
    if (formData.coverUrl && !isValidUrl(formData.coverUrl)) {
      newErrors.coverUrl = 'Please enter a valid URL';
      isValid = false;
    }
    if (formData.fileUrl && !isValidUrl(formData.fileUrl)) {
      newErrors.fileUrl = 'Please enter a valid URL';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  }, [formData, validateField]);

  // Handle field changes
  const handleChange = useCallback(
    (name: keyof BookFormData, value: any) => {
      setFormData((prev) => ({ ...prev, [name]: value }));
      setTouched((prev) => ({ ...prev, [name]: true }));

      // Clear error on change
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: '' }));
      }
    },
    [errors]
  );

  // Handle tags input (comma-separated)
  const handleTagsChange = useCallback((value: string) => {
    const tags = value
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);
    setFormData((prev) => ({ ...prev, tags }));
  }, []);

  // Handle form submission
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      
      if (validateForm()) {
        onSubmit(formData as BookFormData);
      }
    },
    [formData, validateForm, onSubmit]
  );

  // Reading status options
  const readingStatusOptions = [
    { value: 'unread', label: 'Unread' },
    { value: 'reading', label: 'Reading' },
    { value: 'completed', label: 'Completed' },
    { value: 'on-hold', label: 'On Hold' },
    { value: 'dropped', label: 'Dropped' },
  ];

  // Tags as string for input
  const tagsString = useMemo(() => formData.tags?.join(', ') || '', [formData.tags]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Form Title */}
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
        {title}
      </h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Title */}
        <div className="md:col-span-2">
          <Input
            label="Title"
            value={formData.title || ''}
            onChange={(e) => handleChange('title', e.target.value)}
            onBlur={() => setTouched((prev) => ({ ...prev, title: true }))}
            error={touched.title ? errors.title : undefined}
            required
            placeholder="Enter book title"
          />
        </div>

        {/* Author */}
        <div className="md:col-span-2">
          <Input
            label="Author"
            value={formData.author || ''}
            onChange={(e) => handleChange('author', e.target.value)}
            onBlur={() => setTouched((prev) => ({ ...prev, author: true }))}
            error={touched.author ? errors.author : undefined}
            required
            placeholder="Enter author name"
            leadingIcon={BookOpen}
          />
        </div>

        {/* Folder Selection */}
        <div className="md:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Folder <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.folderId || ''}
            onChange={(e) => handleChange('folderId', e.target.value)}
            onBlur={() => setTouched((prev) => ({ ...prev, folderId: true }))}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-base transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
            required
          >
            <option value="">Select a folder</option>
            {folders.map((folder) => (
              <option key={folder.id} value={folder.id}>
                {folder.name}
              </option>
            ))}
          </select>
          {touched.folderId && errors.folderId && (
            <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">
              {errors.folderId}
            </p>
          )}
        </div>

        {/* Category */}
        <div className="md:col-span-2">
          <Input
            label="Category"
            value={formData.category || ''}
            onChange={(e) => handleChange('category', e.target.value)}
            placeholder="e.g., Fiction, Science, History"
            leadingIcon={TagIcon}
          />
        </div>

        {/* Tags */}
        <div className="md:col-span-2">
          <Input
            label="Tags"
            value={tagsString}
            onChange={(e) => handleTagsChange(e.target.value)}
            placeholder="e.g., Fantasy, Adventure, Sci-Fi"
            helperText="Separate tags with commas"
          />
        </div>

        {/* Cover URL */}
        <div className="md:col-span-2">
          <Input
            label="Cover Image URL"
            value={formData.coverUrl || ''}
            onChange={(e) => handleChange('coverUrl', e.target.value)}
            error={touched.coverUrl ? errors.coverUrl : undefined}
            placeholder="https://example.com/cover.jpg"
            helperText="Enter a URL to the book cover image"
          />
        </div>

        {/* File URL */}
        <div className="md:col-span-2">
          <Input
            label="Book File URL"
            value={formData.fileUrl || ''}
            onChange={(e) => handleChange('fileUrl', e.target.value)}
            error={touched.fileUrl ? errors.fileUrl : undefined}
            placeholder="https://example.com/book.pdf"
            helperText="Enter a URL to the book file (PDF, EPUB, etc.)"
          />
        </div>

        {/* Reading Status */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Reading Status
          </label>
          <select
            value={formData.readingStatus || 'unread'}
            onChange={(e) => handleChange('readingStatus', e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-base transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
          >
            {readingStatusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Favorite Toggle */}
        <div className="flex items-center">
          <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={formData.isFavorite || false}
              onChange={(e) => handleChange('isFavorite', e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
            />
            Add to Favorites
          </label>
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Description
          </label>
          <textarea
            value={formData.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
            rows={4}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-base transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
            placeholder="Enter book description..."
          />
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 border-t border-gray-200 pt-6 dark:border-gray-700">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={loading}
          leftIcon={Save}
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};

export default BookForm;