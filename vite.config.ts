import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { fileURLToPath, URL } from "node:url";

// https://vitejs.dev/config/
export default defineConfig({
  // Relative asset URLs so the build works from chrome-extension:// and moz-extension://
  base: "./",
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    // Matches minimum_chrome_version / strict_min_version in the manifests
    target: ["chrome95", "firefox109"],
    // Extension pages only load local module scripts; the polyfill is dead weight
    modulePreload: { polyfill: false },
    emptyOutDir: true,
  },
});
