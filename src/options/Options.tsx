import { useEffect, useState } from "react";
import db from "../db/db";

import Button from "../components/common/Button";

export default function Options() {
  const [folderCount, setFolderCount] = useState(0);
  const [linkCount, setLinkCount] = useState(0);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    setFolderCount(await db.folders.count());
    setLinkCount(await db.links.count());
  }

  async function exportLibrary() {
    const folders = await db.folders.toArray();
    const links = await db.links.toArray();

    const data = {
      exportedAt: new Date().toISOString(),
      folders,
      links,
    };

    const blob = new Blob(
      [JSON.stringify(data, null, 2)],
      {
        type: "application/json",
      }
    );

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "link-library.json";
    a.click();

    URL.revokeObjectURL(url);
  }

  async function importLibrary(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    const text = await file.text();

    try {
      const data = JSON.parse(text);

      if (data.folders) {
        await db.folders.bulkPut(data.folders);
      }

      if (data.links) {
        await db.links.bulkPut(data.links);
      }

      await loadStats();

      alert("Library imported successfully.");
    } catch {
      alert("Invalid backup file.");
    }
  }

  async function clearLibrary() {
    const confirmed = window.confirm(
      "Delete all folders and links?"
    );

    if (!confirmed) return;

    await db.transaction(
      "rw",
      db.folders,
      db.links,
      async () => {
        await db.links.clear();
        await db.folders.clear();
      }
    );

    await loadStats();

    alert("Library cleared.");
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8 p-8">
      <h1 className="text-3xl font-bold">
        Extension Settings
      </h1>

      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold">
          Database
        </h2>

        <div className="space-y-2 text-gray-700">
          <p>Folders: {folderCount}</p>
          <p>Links: {linkCount}</p>
        </div>
      </section>

      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold">
          Backup
        </h2>

        <div className="flex flex-wrap gap-4">
          <Button onClick={exportLibrary}>
            Export Library
          </Button>

          <label>
            <input
              type="file"
              accept=".json"
              className="hidden"
              onChange={importLibrary}
            />

            <span className="inline-flex cursor-pointer items-center rounded-lg border px-4 py-2 hover:bg-gray-100">
              Import Library
            </span>
          </label>
        </div>
      </section>

      <section className="rounded-xl border border-red-200 bg-red-50 p-6">
        <h2 className="mb-4 text-xl font-semibold text-red-600">
          Danger Zone
        </h2>

        <Button
          variant="danger"
          onClick={clearLibrary}
        >
          Delete Everything
        </Button>
      </section>
    </div>
  );
}