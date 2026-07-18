// src/utils/favicon.ts

/**
 * Utility functions for working with website favicons.
 */

const DEFAULT_FAVICON = "/icons/icon32.png";

/**
 * Extract the hostname from a URL.
 */
export function getHostname(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return "";
  }
}

/**
 * Returns a Google favicon URL.
 *
 * Example:
 * https://www.google.com/s2/favicons?domain=github.com&sz=64
 */
export function getGoogleFavicon(
  url: string,
  size = 64
): string {
  const hostname = getHostname(url);

  if (!hostname) {
    return DEFAULT_FAVICON;
  }

  return `https://www.google.com/s2/favicons?domain=${hostname}&sz=${size}`;
}

/**
 * Returns a DuckDuckGo favicon URL.
 *
 * Useful as a fallback.
 */
export function getDuckDuckGoFavicon(
  url: string
): string {
  const hostname = getHostname(url);

  if (!hostname) {
    return DEFAULT_FAVICON;
  }

  return `https://icons.duckduckgo.com/ip3/${hostname}.ico`;
}

/**
 * Returns the website's own favicon.
 *
 * Example:
 * https://github.com/favicon.ico
 */
export function getWebsiteFavicon(
  url: string
): string {
  try {
    const parsed = new URL(url);

    return `${parsed.protocol}//${parsed.hostname}/favicon.ico`;
  } catch {
    return DEFAULT_FAVICON;
  }
}

/**
 * Default favicon strategy.
 *
 * Uses Google's favicon service.
 */
export function getFavicon(url: string): string {
  return getGoogleFavicon(url);
}

/**
 * Returns true if the URL is valid.
 */
export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);

    return (
      parsed.protocol === "http:" ||
      parsed.protocol === "https:"
    );
  } catch {
    return false;
  }
}

/**
 * Loads a favicon and falls back if unavailable.
 */
export async function resolveFavicon(
  url: string
): Promise<string> {
  if (!isValidUrl(url)) {
    return DEFAULT_FAVICON;
  }

  const favicon = getGoogleFavicon(url);

  return new Promise((resolve) => {
    const image = new Image();

    image.onload = () => resolve(favicon);

    image.onerror = () =>
      resolve(getWebsiteFavicon(url));

    image.src = favicon;
  });
}

/**
 * Placeholder favicon used when no favicon is available.
 */
export function getDefaultFavicon(): string {
  return DEFAULT_FAVICON;
}