// src/components/links/LinkForm.tsx

import { useEffect, useState } from "react";
import Button from "../common/Button";
import Input from "../common/Input";
import FolderSelector from "../folders/FolderSelector";

export interface LinkFormValues {
  title: string;
  url: string;
  description: string;
  tags: string[];
  folderId?: number;
  favorite: boolean;
}

interface LinkFormProps {
  /**
   * Initial values for edit/pre-fill mode.
   */
  initialValues?: LinkFormValues;

  /**
   * Loading state.
   */
  loading?: boolean;

  /**
   * Submit handler.
   */
  onSubmit: (values: Required<LinkFormValues>) => void;

  /**
   * Cancel handler.
   */
  onCancel: () => void;
}

const DEFAULT_VALUES: LinkFormValues = {
  title: "",
  url: "",
  description: "",
  tags: [],
  folderId: undefined,
  favorite: false,
};

export default function LinkForm({
  initialValues = DEFAULT_VALUES,
  loading = false,
  onSubmit,
  onCancel,
}: LinkFormProps) {
  const [title, setTitle] = useState(initialValues.title);
  const [url, setUrl] = useState(initialValues.url);
  const [description, setDescription] = useState(initialValues.description);
  const [tags, setTags] = useState(initialValues.tags.join(", "));
  const [folderId, setFolderId] = useState<number | undefined>(initialValues.folderId);
  const [favorite, setFavorite] = useState(initialValues.favorite);

  const [errors, setErrors] = useState<{
    title?: string;
    url?: string;
    folderId?: string;
  }>({});

  useEffect(() => {
    setTitle(initialValues.title);
    setUrl(initialValues.url);
    setDescription(initialValues.description);
    setTags(initialValues.tags.join(", "));
    setFolderId(initialValues.folderId);
    setFavorite(initialValues.favorite);
  }, [initialValues]);

  function validate() {
    const nextErrors: {
      title?: string;
      url?: string;
      folderId?: string;
    } = {};

    if (!title.trim()) {
      nextErrors.title = "Title is required.";
    }

    if (!url.trim()) {
      nextErrors.url = "URL is required.";
    } else {
      try {
        new URL(url);
      } catch {
        nextErrors.url = "Please enter a valid URL.";
      }
    }

    if (folderId === undefined || isNaN(folderId) || folderId <= 0) {
      nextErrors.folderId = "Please select a folder.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    onSubmit({
      title: title.trim(),
      url: url.trim(),
      description: description.trim(),
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      folderId: folderId!,
      favorite,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input
        label="Title"
        placeholder="React Documentation"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        error={errors.title}
        autoFocus
      />

      <Input
        label="URL"
        placeholder="https://react.dev"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        error={errors.url}
      />

      <FolderSelector
        value={folderId}
        onChange={setFolderId}
        error={errors.folderId}
      />

      <div>
        <label htmlFor="link-description" className="mb-1 block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="link-description"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional description..."
          className="
            w-full
            rounded-lg
            border
            border-gray-300
            px-3
            py-2
            text-sm
            outline-none
            focus:border-blue-500
          "
        />
      </div>

      <Input
        label="Tags"
        placeholder="react, frontend, docs"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        helperText="Separate tags with commas."
      />

      <div className="flex items-center gap-2 py-1">
        <input
          type="checkbox"
          id="link-favorite"
          checked={favorite}
          onChange={(e) => setFavorite(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
        />
        <label htmlFor="link-favorite" className="text-sm font-medium text-gray-700 cursor-pointer select-none">
          Add to Favorites
        </label>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          Save Link
        </Button>
      </div>
    </form>
  );
}