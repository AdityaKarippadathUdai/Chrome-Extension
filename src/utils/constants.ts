// src/utils/constants.ts

/**
 * Application constants for the Link Library extension.
 */

/* -------------------------------------------------------------------------- */
/*                                 APP CONFIG                                 */
/* -------------------------------------------------------------------------- */

export const APP_NAME = "Link Library";

export const APP_VERSION = "1.0.0";

/* -------------------------------------------------------------------------- */
/*                                 DATABASE                                   */
/* -------------------------------------------------------------------------- */

export const DATABASE_NAME = "LinkLibraryDB";

/* -------------------------------------------------------------------------- */
/*                              STORAGE KEYS                                  */
/* -------------------------------------------------------------------------- */

export const STORAGE_KEYS = {
  SETTINGS: "settings",
  THEME: "theme",
  SIDEBAR_WIDTH: "sidebar-width",
  LAST_SELECTED_FOLDER: "last-selected-folder",
  LAST_SELECTED_LINK: "last-selected-link",
} as const;

/* -------------------------------------------------------------------------- */
/*                              DEFAULT VALUES                                */
/* -------------------------------------------------------------------------- */

export const DEFAULT_FOLDER_NAME = "New Folder";

export const ROOT_FOLDER_ID = null;

export const DEFAULT_GRID_COLUMNS = 3;

/* -------------------------------------------------------------------------- */
/*                             VALIDATION RULES                               */
/* -------------------------------------------------------------------------- */

export const LIMITS = {
  FOLDER_NAME_MIN: 2,
  FOLDER_NAME_MAX: 50,

  LINK_TITLE_MIN: 2,
  LINK_TITLE_MAX: 150,

  DESCRIPTION_MAX: 500,

  MAX_TAGS: 20,
} as const;

/* -------------------------------------------------------------------------- */
/*                            SUPPORTED URL TYPES                             */
/* -------------------------------------------------------------------------- */

export const SUPPORTED_PROTOCOLS = [
  "http:",
  "https:",
] as const;

/* -------------------------------------------------------------------------- */
/*                                SEARCH                                      */
/* -------------------------------------------------------------------------- */

export const SEARCH_DEBOUNCE_MS = 300;

/* -------------------------------------------------------------------------- */
/*                                UI                                          */
/* -------------------------------------------------------------------------- */

export const SIDEBAR_WIDTH = 280;

export const DETAILS_PANEL_WIDTH = 360;

/* -------------------------------------------------------------------------- */
/*                              SORT OPTIONS                                  */
/* -------------------------------------------------------------------------- */

export const SORT_OPTIONS = {
  TITLE: "title",
  CREATED: "createdAt",
  UPDATED: "updatedAt",
  FAVORITE: "favorite",
} as const;

/* -------------------------------------------------------------------------- */
/*                              FILTER OPTIONS                                */
/* -------------------------------------------------------------------------- */

export const FILTERS = {
  ALL: "all",
  FAVORITES: "favorites",
} as const;

/* -------------------------------------------------------------------------- */
/*                              MESSAGES                                      */
/* -------------------------------------------------------------------------- */

export const SUCCESS_MESSAGES = {
  FOLDER_CREATED: "Folder created successfully.",
  FOLDER_UPDATED: "Folder updated.",
  FOLDER_DELETED: "Folder deleted.",

  LINK_CREATED: "Link saved successfully.",
  LINK_UPDATED: "Link updated.",
  LINK_DELETED: "Link deleted.",
} as const;

export const ERROR_MESSAGES = {
  INVALID_URL: "Please enter a valid URL.",
  REQUIRED_FOLDER_NAME: "Folder name is required.",
  REQUIRED_LINK_TITLE: "Link title is required.",
  REQUIRED_LINK_URL: "Link URL is required.",
} as const;