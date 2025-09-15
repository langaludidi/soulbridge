import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

export default defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: path.resolve(import.meta.dirname, "client", "index.html"),
      },
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-accordion', '@radix-ui/react-dialog', '@radix-ui/react-select'],
          forms: ['react-hook-form', '@hookform/resolvers', 'zod'],
          query: ['@tanstack/react-query'],
          utils: ['clsx', 'class-variance-authority', 'tailwind-merge'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    target: 'es2020',
    minify: 'esbuild',
  },
  publicDir: path.resolve(import.meta.dirname, "client", "public"),
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
