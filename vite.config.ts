import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: "/tu/", // Added base path for deployment
  server: {
    host: "::",
    port: 8080,
    allowedHosts: true,
    // Proxy configuration (equivalent to Next.js rewrites)
    proxy: {
      "/api/v1": {
        target: "https://api-v1-production-1b72.up.railway.app/",
        // target: "https://website-sekolahku-be.up.railway.app/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/v1/, ""),
        // For local development, uncomment below:
        // target: 'http://localhost:7777',
      },
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(
    Boolean
  ),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  // Equivalent to Next.js devIndicators and source maps
  build: {
    sourcemap: false, // equivalent to productionBrowserSourceMaps: false
  },
}));
