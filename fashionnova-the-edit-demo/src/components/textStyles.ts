import React from "react";

/** Text masked by an image (type-as-window) — the core FN "The Edit" concept. */
export const textWindow = (src: string, pos = "center 16%", size = "150%"): React.CSSProperties => ({
  backgroundImage: `url(${src})`,
  backgroundSize: size,
  backgroundPosition: pos,
  backgroundRepeat: "no-repeat",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  WebkitTextFillColor: "transparent",
  color: "transparent",
});

/** Plain full-bleed background image fill. */
export const imgFill = (src: string, pos = "center 18%", size = "cover"): React.CSSProperties => ({
  backgroundImage: `url(${src})`,
  backgroundSize: size,
  backgroundPosition: pos,
  backgroundRepeat: "no-repeat",
});
