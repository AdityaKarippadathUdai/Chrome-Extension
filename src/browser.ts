// src/browser.ts
//
// Cross-browser WebExtension API wrapper.
// Imports the WebExtension polyfill so that `browser.*` works identically
// on Chrome (MV3) and Firefox (MV3).

import browser from "webextension-polyfill";

export default browser;
