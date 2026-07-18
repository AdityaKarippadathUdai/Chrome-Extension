// src/components/links/AddCurrentTabModal.tsx

import { useState } from "react";
import Modal from "../common/Modal";
import LinkForm from "./LinkForm";
import type { CurrentTabInfo } from "../../hooks/useCurrentTab";

interface AddCurrentTabModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTab: CurrentTabInfo | null;
  onSave: (values: {
    title: string;
    url: string;
    description: string;
    tags: string[];
    folderId: number;
    favorite: boolean;
  }) => Promise<void>;
}

export default function AddCurrentTabModal({
  isOpen,
  onClose,
  currentTab,
  onSave,
}: AddCurrentTabModalProps) {
  const [loading, setLoading] = useState(false);

  const initialValues = {
    title: currentTab?.title ?? "",
    url: currentTab?.url ?? "",
    description: "",
    tags: [],
    folderId: undefined,
    favorite: false,
  };

  async function handleSubmit(values: {
    title: string;
    url: string;
    description: string;
    tags: string[];
    folderId: number;
    favorite: boolean;
  }) {
    setLoading(true);
    try {
      await onSave(values);
      onClose();
    } catch (e) {
      console.error(e);
      alert("Failed to save bookmark.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal isOpen={isOpen} title="Save Current Tab" onClose={onClose}>
      <LinkForm
        initialValues={initialValues}
        loading={loading}
        onSubmit={handleSubmit}
        onCancel={onClose}
      />
    </Modal>
  );
}
