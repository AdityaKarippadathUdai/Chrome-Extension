// src/background/background.ts

/// <reference types="chrome"/>

/**
 * Background Service Worker
 *
 * Responsibilities:
 * - Runs when the extension is installed or updated.
 * - Handles future messaging.
 * - Opens links in new tabs.
 * - Initializes extension defaults.
 */

chrome.runtime.onInstalled.addListener((details) => {
  console.log("Link Library extension installed.");

  switch (details.reason) {
    case "install":
      console.log("First installation.");

      chrome.storage.local.set({
        initialized: true,
      });

      break;

    case "update":
      console.log("Extension updated.");
      break;

    case "chrome_update":
      console.log("Chrome updated.");
      break;
  }
});

/**
 * Listen for messages from popup/options pages.
 */
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  switch (message.type) {
    case "OPEN_LINK": {
      if (typeof message.url === "string") {
        chrome.tabs.create({
          url: message.url,
        });

        sendResponse({
          success: true,
        });
      }

      break;
    }

    case "PING": {
      sendResponse({
        success: true,
        message: "Background service worker is running.",
      });

      break;
    }

    default:
      sendResponse({
        success: false,
        error: "Unknown message type.",
      });
  }

  return true;
});

/**
 * Handle toolbar icon click.
 *
 * Currently only logs.
 * Popup UI will open automatically because
 * popup is defined in manifest.json.
 */
chrome.action.onClicked.addListener(() => {
  console.log("Extension icon clicked.");
});

/**
 * Optional:
 * Open the Options page from anywhere.
 */
export function openOptionsPage() {
  chrome.runtime.openOptionsPage();
}

/**
 * Optional:
 * Open a URL in a new tab.
 */
export function openLink(url: string) {
  chrome.tabs.create({
    url,
  });
}