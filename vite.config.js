import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@user": path.resolve(__dirname, "./src/user"),
      "@website": path.resolve(__dirname, "./src/website"),
      "@superadmin": path.resolve(__dirname, "./src/superadmin"),
    },
  },
});
