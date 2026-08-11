import path from "node:path";
import { vitePluginEditframe } from "@editframe/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

const RENDER_PROJECT_ID = process.env.EF_RENDER_PROJECT || null;

const VIRTUAL_RENDER_ENTRY_ID = "virtual:editframe-render-entry";
const RESOLVED_VIRTUAL_RENDER_ENTRY_ID = `\0${VIRTUAL_RENDER_ENTRY_ID}`;

/**
 * Resolves `virtual:editframe-render-entry`, statically importing the single
 * target project's composition + stylesheet URL when `EF_RENDER_PROJECT` is
 * set (see `render:<example>` npm scripts), or a no-op module otherwise.
 *
 * This exists instead of the project registry's normal per-project *dynamic*
 * `import()` (see `src/projects.ts`) because `editframe render` needs an
 * `ef-timegroup` to already exist in the DOM essentially the instant the
 * page's `load` event fires (it checks almost immediately after, with no
 * deliberate delay) -- confirmed empirically that a `useEffect`-triggered
 * dynamic import loses this race intermittently, and that a page-load-blocking
 * top-level `await` around that same dynamic import *also* doesn't reliably
 * delay `load` in Chromium. A *static* import graph, by contrast, is always
 * fully fetched and linked before any of the entry module's own top-level
 * code runs at all (a basic ES module guarantee, unlike `import()`), so
 * resolving this project's `Video` + `styles.css` here removes the race
 * entirely -- exactly like each example's original standalone entry point,
 * which statically imported its own single `Video`.
 */
const editframeRenderEntryPlugin = (): Plugin => ({
  name: "editframe-render-entry",
  resolveId(id) {
    if (id === VIRTUAL_RENDER_ENTRY_ID) return RESOLVED_VIRTUAL_RENDER_ENTRY_ID;
  },
  load(id) {
    if (id !== RESOLVED_VIRTUAL_RENDER_ENTRY_ID) return;
    if (!RENDER_PROJECT_ID) return "export default null;";

    const exampleDir = path.join(__dirname, RENDER_PROJECT_ID, "src");
    const videoPath = JSON.stringify(path.join(exampleDir, "Video.tsx"));
    const stylesPath = JSON.stringify(`${path.join(exampleDir, "styles.css")}?url`);
    return `
import { Video } from ${videoPath};
import stylesUrl from ${stylesPath};
export default { Video, stylesUrl };
`;
  },
});

// One shared dev server for every example. The Editframe vite-plugin resolves
// local asset URLs (e.g. "/figma-agent-demo/src/assets/music-bed.mp3") relative
// to `root` below, so `root` is the repo root rather than a single example's
// `src/` directory — each example's own path segment disambiguates its assets
// from every other example's.
export default defineConfig({
  cacheDir: path.join(__dirname, ".vite-cache"),
  resolve: {
    alias: {
      "@shared": path.join(__dirname, "shared"),
    },
  },
  plugins: [
    tailwindcss(),
    vitePluginEditframe({
      root: __dirname,
      cacheRoot: path.join(__dirname, ".editframe-cache"),
    }),
    viteSingleFile(),
    react(),
    editframeRenderEntryPlugin(),
  ],
});
