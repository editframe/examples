import { createSfx } from "@shared/components/Sfx";

/** Drop inside any `mode="fixed"` <Timegroup> scene: `<Sfx cue="pop" at={1.2} />` */
export const Sfx = createSfx({
  pop: "/figma-agent-demo/src/assets/sfx/figma-agent-demo-pop.mp3",
  plop: "/figma-agent-demo/src/assets/sfx/figma-agent-demo-plop.mp3",
  reveal: "/figma-agent-demo/src/assets/sfx/figma-agent-demo-reveal.mp3",
  ping: "/figma-agent-demo/src/assets/sfx/figma-agent-demo-ping.mp3",
  confirm: "/figma-agent-demo/src/assets/sfx/figma-agent-demo-confirm.mp3",
});
