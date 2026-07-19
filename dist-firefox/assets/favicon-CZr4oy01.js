const DEFAULT_FAVICON = "/icons/icon32.png";
function getHostname(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return "";
  }
}
function getGoogleFavicon(url, size = 64) {
  const hostname = getHostname(url);
  if (!hostname) {
    return DEFAULT_FAVICON;
  }
  return `https://www.google.com/s2/favicons?domain=${hostname}&sz=${size}`;
}
function getDuckDuckGoFavicon(url) {
  const hostname = getHostname(url);
  if (!hostname) {
    return DEFAULT_FAVICON;
  }
  return `https://icons.duckduckgo.com/ip3/${hostname}.ico`;
}
function getWebsiteFavicon(url) {
  try {
    const parsed = new URL(url);
    return `${parsed.protocol}//${parsed.hostname}/favicon.ico`;
  } catch {
    return DEFAULT_FAVICON;
  }
}
function getFavicon(url) {
  return getGoogleFavicon(url);
}
function isValidUrl(url) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}
async function resolveFavicon(url) {
  if (!isValidUrl(url)) {
    return DEFAULT_FAVICON;
  }
  const favicon = getGoogleFavicon(url);
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve(favicon);
    image.onerror = () => resolve(getWebsiteFavicon(url));
    image.src = favicon;
  });
}
function getDefaultFavicon() {
  return DEFAULT_FAVICON;
}
export {
  getDefaultFavicon,
  getDuckDuckGoFavicon,
  getFavicon,
  getGoogleFavicon,
  getHostname,
  getWebsiteFavicon,
  isValidUrl,
  resolveFavicon
};
