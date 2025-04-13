import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "~": path.resolve(__dirname),
    },
    extensions: [".ts", ".tsx", ".js", ".jsx", ".scss"],
  },
  css: { preprocessorOptions: { scss: { api: "modern-compiler" } } },
});
