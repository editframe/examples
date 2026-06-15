import path from "node:path";
import { vitePluginEditframe } from "@editframe/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

export default defineConfig({
  // Dedicated per-worktree cache dir. node_modules is a junction shared across
  // sibling worktrees (b01-b05/base); sharing node_modules/.vite causes EPERM
  // rename collisions and dep-optimizer stalls during concurrent renders.
  cacheDir: path.join(__dirname, ".vite-cache"),
  plugins: [
    tailwindcss(),
    vitePluginEditframe({
      root: path.join(__dirname, "src"),
      cacheRoot: path.join(__dirname, "src", "assets"),
    }),
    viteSingleFile(),
    react(),
  ],
});
