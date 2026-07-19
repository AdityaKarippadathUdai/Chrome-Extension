import { b as browser } from "./assets/browser-polyfill-CTIq9JCV.js";
import "./assets/_commonjsHelpers-DWwsNxpa.js";
browser.runtime.onInstalled.addListener((details) => {
  console.log("Link Library extension installed.");
  switch (details.reason) {
    case "install":
      console.log("First installation.");
      browser.storage.local.set({
        initialized: true
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
browser.runtime.onMessage.addListener(
  (message, _sender) => {
    const msg = message;
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
          message: "Background script is running."
        });
      }
      default:
        return Promise.resolve({
          success: false,
          error: "Unknown message type."
        });
    }
  }
);
