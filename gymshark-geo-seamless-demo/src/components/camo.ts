import type { CSSProperties } from "react";
import { GREY_LINE, CHARCOAL_2, BLACK } from "../constants";

/**
 * Geo-camo halftone background — a two-layer dot grid (offset half-cell) that reads as
 * the brand's camo motif. Reused by every scene that shows the ambient camo texture
 * (Hook, Fabric, Colorways). Pair with the `camo-drift` `@keyframes` in styles.css for
 * the continuous ambient drift (infinite, no JS) — the object below is the static base.
 */
export const camoBg: CSSProperties = {
  backgroundImage: `radial-gradient(circle, ${GREY_LINE} 1.4px, transparent 1.6px), radial-gradient(circle, ${CHARCOAL_2} 1.4px, transparent 1.6px)`,
  backgroundSize: "18px 18px, 18px 18px",
  backgroundPosition: "0 0, 9px 9px",
};

/**
 * Hard-edged faceted geo-camo slab — angular, coded, near-black. Used only by the
 * transition mechanics (shutter slabs, panel shatter, rack split, halftone converge) so
 * those reads as the geo pattern in motion, not a soft dissolve.
 */
export const facetedCamo: CSSProperties = {
  backgroundColor: BLACK,
  backgroundImage:
    `linear-gradient(135deg, #141414 0 25%, transparent 25% 50%, #0c0c0c 50% 75%, transparent 75%),` +
    `linear-gradient(45deg, #0e0e0e 0 25%, transparent 25% 50%, #161616 50% 75%, transparent 75%),` +
    `radial-gradient(circle, rgba(120,140,150,0.10) 1px, transparent 1.6px)`,
  backgroundSize: "180px 180px, 240px 240px, 9px 9px",
};
