import path from "node:path";
import { vitePluginEditframe } from "@editframe/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

export default defineConfig({
  server: { port: 5261, strictPort: true },
  // project-local vite cache (node_modules is symlinked + shared across forks; a shared
  // .vite cache causes the dep-optimizer to RELOAD the page mid-render → "Target page closed").
  cacheDir: path.join(__dirname, ".vite-cache"),
  // pre-bundle the SDK + react so there is NO late dependency discovery (the late discovery
  // is what triggers vite's full-page reload during editframe's renderStreaming).
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-dom/client",
      "@editframe/react",
    ],
    holdUntilCrawlEnd: true,
  },
  plugins: [
    tailwindcss(),
    vitePluginEditframe({
      root: path.join(__dirname, "src"),
      cacheRoot: path.join(__dirname, "src", "assets"),
    }),
    // singlefile inlines a 9MB HTML that parses too slowly for the CLI's 10s SDK-ready wait
    // on the --url render path. Set EF_NO_SINGLEFILE=1 to build multi-chunk (fast parse).
    ...(process.env.EF_NO_SINGLEFILE ? [] : [viteSingleFile()]),
    react(),
  ],
});
