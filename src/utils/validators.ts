// src/utils/validators.ts

import { LIMITS, SUPPORTED_PROTOCOLS } from "./constants";

/**
 * Returns true if the value is empty.
 */
export function isEmpty(value: string): boolean {
  return value.trim().length === 0;
}

/**
 * Validate a folder name.
 */
export function validateFolderName(name: string): string | null {
  const value = name.trim();

  if (value.length === 0) {
    return "Folder name is required.";
  }

  if (value.length < LIMITS.FOLDER_NAME_MIN) {
    return `Folder name must be at least ${LIMITS.FOLDER_NAME_MIN} characters.`;
  }

  if (value.length > LIMITS.FOLDER_NAME_MAX) {
    return `Folder name cannot exceed ${LIMITS.FOLDER_NAME_MAX} characters.`;
  }

  return null;
}

/**
 * Validate a link title.
 */
export function validateLinkTitle(title: string): string | null {
  const value = title.trim();

  if (value.length === 0) {
    return "Title is required.";
  }

  if (value.length < LIMITS.LINK_TITLE_MIN) {
    return `Title must be at least ${LIMITS.LINK_TITLE_MIN} characters.`;
  }

  if (value.length > LIMITS.LINK_TITLE_MAX) {
    return `Title cannot exceed ${LIMITS.LINK_TITLE_MAX} characters.`;
  }

  return null;
}

/**
 * Validate a URL.
 */
export function validateUrl(url: string): string | null {
  const value = url.trim();

  if (!value) {
    return "URL is required.";
  }

  try {
    const parsed = new URL(value);

    if (
      !SUPPORTED_PROTOCOLS.includes(
        parsed.protocol as (typeof SUPPORTED_PROTOCOLS)[number]
      )
    ) {
      return "Only HTTP and HTTPS URLs are supported.";
    }
  } catch {
    return "Please enter a valid URL.";
  }

  return null;
}

/**
 * Validate description length.
 */
export function validateDescription(
  description: string
): string | null {
  if (description.length > LIMITS.DESCRIPTION_MAX) {
    return `Description cannot exceed ${LIMITS.DESCRIPTION_MAX} characters.`;
  }

  return null;
}

/**
 * Validate tags.
 */
export function validateTags(
  tags: string[]
): string | null {
  if (tags.length > LIMITS.MAX_TAGS) {
    return `Maximum ${LIMITS.MAX_TAGS} tags are allowed.`;
  }

  const seen = new Set<string>();

  for (const tag of tags) {
    const value = tag.trim();

    if (!value) {
      return "Tags cannot be empty.";
    }

    const lower = value.toLowerCase();

    if (seen.has(lower)) {
      return `Duplicate tag "${value}".`;
    }

    seen.add(lower);
  }

  return null;
}

/**
 * Validate the complete link form.
 */
export function validateLink(values: {
  title: string;
  url: string;
  description?: string;
  tags?: string[];
}): Record<string, string> {
  const errors: Record<string, string> = {};

  const titleError = validateLinkTitle(values.title);
  if (titleError) {
    errors.title = titleError;
  }

  const urlError = validateUrl(values.url);
  if (urlError) {
    errors.url = urlError;
  }

  const descriptionError = validateDescription(
    values.description ?? ""
  );
  if (descriptionError) {
    errors.description = descriptionError;
  }

  const tagError = validateTags(values.tags ?? []);
  if (tagError) {
    errors.tags = tagError;
  }

  return errors;
}

/**
 * Returns true if the object contains no validation errors.
 */
export function isValid(
  errors: Record<string, string>
): boolean {
  return Object.keys(errors).length === 0;
}