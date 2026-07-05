/** A procedural tree-fiber KNIT weave texture (layered dotted gradients) — used as a macro backdrop / material swatch fallback. */
export const knitTexture = (tone: string, alt: string): string =>
  `radial-gradient(circle at 0 0, ${alt} 18%, transparent 19%) 0 0/22px 22px,
   radial-gradient(circle at 11px 11px, ${alt} 18%, transparent 19%) 0 0/22px 22px,
   linear-gradient(135deg, ${tone} 0%, ${alt} 100%)`;
