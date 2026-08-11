import { createSfx } from "@shared/components/Sfx";

/** Drop inside any `mode="fixed"` <Timegroup> scene: `<Sfx cue="pop" at={1.2} />` */
export const Sfx = createSfx({
  pop: "/claude-security-demo/src/assets/sfx/claude-security-demo-pop.mp3",
  plop: "/claude-security-demo/src/assets/sfx/claude-security-demo-plop.mp3",
  twinkle: "/claude-security-demo/src/assets/sfx/claude-security-demo-twinkle.mp3",
  reveal: "/claude-security-demo/src/assets/sfx/claude-security-demo-reveal.mp3",
});
