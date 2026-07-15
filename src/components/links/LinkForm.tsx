// src/components/links/LinkForm.tsx

import { useEffect, useState } from "react";

import Button from "../common/Button";
import Input from "../common/Input";

interface LinkFormValues {
  title: string;
  url: string;
  description: string;
  tags: string[];
}

interface LinkFormProps {
  /**
   * Initial values for edit mode.
   */
  initialValues?: LinkFormValues;

  /**
   * Loading state.
   */
  loading?: boolean;

  /**
   * Submit handler.
   */
  onSubmit: (values: LinkFormValues) => void;

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
};

export default function LinkForm({
  initialValues = DEFAULT_VALUES,
  loading = false,
  onSubmit,
  onCancel,
}: LinkFormProps) {
  const [title, setTitle] = useState(initialValues.title);
  const [url, setUrl] = useState(initialValues.url);
  const [description, setDescription] = useState(
    initialValues.description
  );
  const [tags, setTags] = useState(
    initialValues.tags.join(", ")
  );

  const [errors, setErrors] = useState<{
    title?: string;
    url?: string;
  }>({});

  useEffect(() => {
    setTitle(initialValues.title);
    setUrl(initialValues.url);
    setDescription(initialValues.description);
    setTags(initialValues.tags.join(", "));
  }, [initialValues]);

  function validate() {
    const nextErrors: {
      title?: string;
      url?: string;
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

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
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
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
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

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Description
        </label>

        <textarea
          rows={4}
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
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

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          loading={loading}
        >
          Save Link
        </Button>
      </div>
    </form>
  );
}