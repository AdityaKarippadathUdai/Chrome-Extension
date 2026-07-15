// src/db/db.ts

import Dexie, { type Table } from "dexie";

import type { Folder } from "../types/folder";
import type { Link } from "../types/link";

/**
 * IndexedDB database for the Link Library.
 */
class LinkLibraryDB extends Dexie {
  /**
   * Folder table
   */
  folders!: Table<Folder, number>;

  /**
   * Link table
   */
  links!: Table<Link, number>;

  constructor() {
    super("LinkLibraryDB");

    this.version(1).stores({
      folders: "++id,parentId,name,createdAt,updatedAt",

      links:
        "++id,folderId,title,url,favorite,createdAt,updatedAt,*tags",
    });
  }
}

/**
 * Singleton database instance.
 */
export const db = new LinkLibraryDB();

export default db;