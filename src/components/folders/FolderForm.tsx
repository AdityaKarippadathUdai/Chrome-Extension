// src/components/folders/FolderForm.tsx

import { useEffect, useState } from "react";

import Button from "../common/Button";
import Input from "../common/Input";

interface FolderFormValues {
  name: string;
}

interface FolderFormProps {
  /**
   * Initial folder name.
   * Used for editing existing folders.
   */
  initialValues?: FolderFormValues;

  /**
   * Loading state.
   */
  loading?: boolean;

  /**
   * Form submission.
   */
  onSubmit: (values: FolderFormValues) => void;

  /**
   * Cancel button.
   */
  onCancel: () => void;
}

export default function FolderForm({
  initialValues = {
    name: "",
  },
  loading = false,
  onSubmit,
  onCancel,
}: FolderFormProps) {
  const [name, setName] = useState(initialValues.name);
  const [error, setError] = useState("");

  useEffect(() => {
    setName(initialValues.name);
  }, [initialValues]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Folder name is required.");
      return;
    }

    if (trimmedName.length < 2) {
      setError("Folder name must contain at least 2 characters.");
      return;
    }

    if (trimmedName.length > 50) {
      setError("Folder name cannot exceed 50 characters.");
      return;
    }

    setError("");

    onSubmit({
      name: trimmedName,
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-6"
    >
      <Input
        label="Folder Name"
        placeholder="e.g. Programming"
        value={name}
        onChange={(e) => {
          setName(e.target.value);

          if (error) {
            setError("");
          }
        }}
        error={error}
        autoFocus
        maxLength={50}
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
          Save Folder
        </Button>
      </div>
    </form>
  );
}