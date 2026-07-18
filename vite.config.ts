// vite.config.ts

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";
import { copyFileSync, mkdirSync, rmSync } from "fs";
import type { Plugin } from "vite";

/**
 * Which browser are we building for?
 * Controlled by the BROWSER env-var set in package.json scripts.
 * Defaults to "chrome".
 */
const targetBrowser = process.env.BROWSER ?? "chrome";

/**
 * Separate output directories keep both builds side-by-side.
 */
const outDir =
  targetBrowser === "firefox" ? "dist-firefox" : "dist-chrome";

/**
 * Source manifest to promote as manifest.json in the output.
 */
const manifestSrc =
  targetBrowser === "firefox"
    ? resolve(__dirname, "public/manifest.firefox.json")
    : resolve(__dirname, "public/manifest.json");

// ---------------------------------------------------------------------------
// Plugin: copy the correct manifest and clean up the alternate one.
// ---------------------------------------------------------------------------
const manifestPlugin: Plugin = {
  name: "extension-manifest",
  apply: "build",
  enforce: "post",
  closeBundle() {
    const dest = resolve(__dirname, outDir);

    mkdirSync(dest, { recursive: true });

    // Write the correct browser manifest as manifest.json
    copyFileSync(manifestSrc, resolve(dest, "manifest.json"));

    // Remove manifest.firefox.json from the Chrome build (publicDir copies both)
    try {
      rmSync(resolve(dest, "manifest.firefox.json"));
    } catch {
      // doesn't exist in Firefox build – ignore
    }
  },
};

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    manifestPlugin,
  ],

  build: {
    outDir,
    emptyOutDir: true,
    sourcemap: false,
    minify: false,

    rollupOptions: {
      // -----------------------------------------------------------------------
      // Three entry points:
      //   popup   → popup.html  (imports src/popup/main.tsx)
      //   options → options.html (imports src/options/main.tsx)
      //   background → src/background/background.ts (plain JS module)
      // -----------------------------------------------------------------------
      input: {
        popup: resolve(__dirname, "popup.html"),
        options: resolve(__dirname, "options.html"),
        background: resolve(__dirname, "src/background/background.ts"),
      },

      output: {
        // Keep background script at the root so the manifest can reference
        // it as "background.js" without any path prefix.
        entryFileNames: (chunk) =>
          chunk.name === "background"
            ? "background.js"
            : "assets/[name]-[hash].js",

        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]",
      },
    },
  },

  // publicDir copies everything from /public into outDir.
  // The manifestPlugin hook then fixes the manifests.
  publicDir: "public",
});