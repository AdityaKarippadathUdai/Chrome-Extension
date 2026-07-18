// src/background/background.ts

/**
 * Background Service Worker (Chrome MV3) / Background Script (Firefox MV3)
 *
 * Uses webextension-polyfill so that `browser.*` works on both Chrome and Firefox.
 *
 * Responsibilities:
 * - Runs when the extension is installed or updated.
 * - Handles runtime messages from popup / options pages.
 * - Opens links in new tabs.
 * - Initializes extension defaults.
 */

import browser from "webextension-polyfill";

browser.runtime.onInstalled.addListener((details) => {
  console.log("Link Library extension installed.");

  switch (details.reason) {
    case "install":
      console.log("First installation.");

      browser.storage.local.set({
        initialized: true,
      });

      break;

    case "update":
      console.log("Extension updated.");
      break;

    // "browser_update" is the Firefox equivalent of "chrome_update"
    case "browser_update":
      console.log("Browser updated.");
      break;
  }
});

/**
 * Listen for messages from popup / options pages.
 *
 * Returning a Promise keeps the channel open for the async response.
 * This pattern works in both Chrome MV3 and Firefox MV3.
 */
browser.runtime.onMessage.addListener(
  (
    message: unknown,
    _sender: browser.Runtime.MessageSender
  ): Promise<unknown> => {
    const msg = message as { type: string; url?: string };

    switch (msg.type) {
      case "OPEN_LINK": {
        if (typeof msg.url === "string") {
          browser.tabs.create({ url: msg.url });
          return Promise.resolve({ success: true });
        }
        return Promise.resolve({ success: false, error: "No URL provided." });
      }

      case "PING": {
        return Promise.resolve({
          success: true,
          message: "Background script is running.",
        });
      }

      default:
        return Promise.resolve({
          success: false,
          error: "Unknown message type.",
        });
    }
  }
);