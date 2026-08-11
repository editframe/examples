/// <reference types="vite/client" />

/**
 * Resolved by the `editframe-render-entry` plugin in `vite.config.ts`. `null`
 * in dev/preview mode; otherwise the target project's composition + styles
 * URL, statically imported so it's guaranteed ready before the page's `load`
 * event fires. See that plugin's doc comment for why. Consumed by `main.tsx`.
 */
declare module "virtual:editframe-render-entry" {
  import type { ComponentType } from "react";

  const entry: { Video: ComponentType; stylesUrl: string } | null;
  export default entry;
}
