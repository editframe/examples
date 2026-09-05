import React, { useCallback, useRef } from "react";
import { Timegroup } from "@editframe/react";
import { MORPH_MS } from "../constants";
import { keys, track, lerp, outCubic, outQuint, PAL, flowerSpin, SPIN_OFF } from "../helpers";
import { useFrameTask } from "../useFrameTask";
import { FlowerStem, FlowerSpokes, FlowerPetals } from "../components/Flower";
import { ModernGarden } from "../components/ModernGarden";

/**
 * S02 — Liquid morph = zoom-OUT of the Light Guide flower  ·  1.5–3.4s
 * We start zoomed deep into one white petal (continuing S01's oval), then pull
 * back: the 6-petal flower + green asterisk + stem resolve on lime. The
 * "metaball" look is just the flower at huge scale. Ends ~card-size (→ S03).
 */
export const Scene02_Morph: React.FC = () => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const green = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const handoff = useRef<HTMLDivElement>(null);
  const handoffPage = useRef<HTMLDivElement>(null);

  const handleFrame = useCallback(({ ownCurrentTimeMs }: { ownCurrentTimeMs: number }) => {
    const ms = ownCurrentTimeMs;
    // zoom-out decelerates: stay deep in the petal (soft) through ~ms500, then resolve flower
    // per-segment hard decel (outQuint) → the pull-back "lands and stops" instead of drifting (paper feel).
    // morph milestones: big white blobs ~4.4x at ms500 · TIGHT full flower resolving by ms1000 · settle 1.0.
    // …then, after settling at 1.0 (~ms1583), the flower SHRINKS on down to card-size (~0.34) so it
    // ZOOMS OUT and BECOMES the centre "Light Guide" card (a continuous morph, NOT a crossfade).
    // Scale is UNCHANGED through ms1500 so the settle→shrink handoff stays seamless.
    // mid keys tightened so the flower nearly fills the frame height mid-morph;
    // the flower still FILLS the card as it pulls back · editor page fully in by ms1500.
    const scale = keys(ms, [[0, 6.5], [500, 4.4], [1000, 3.2], [1167, 2.5], [1333, 1.85], [1583, 1.1], [1917, 0.4]], outQuint);
    const blur = keys(ms, [[0, 22], [450, 12], [800, 6], [1250, 0]]); // motion blur persists through most of the pull-back
    // the zoom-origin PANS from a white petal (white-blob phase) to the flower centre (asterisk centred) —
    // the deep zoom starts inside a white petal and pulls back centring on the asterisk
    const op = track(ms, 500, 1300, outCubic);
    const ox = lerp(62, 50, op), oy = lerp(67, 46, op);
    if (wrapRef.current) {
      wrapRef.current.style.transformOrigin = `${ox}% ${oy}%`;
      wrapRef.current.style.transform = `scale(${scale})`;
      wrapRef.current.style.filter = blur > 0.2 ? `blur(${blur}px)` : "none";
    }
    // WINDMILL: clockwise decelerating spin that does NOT stop here — it continues (same flowerSpin
    // curve, offset per scene) through S03/S04 so the flower keeps turning to the end of the card
    // scene. Head = spokes + petals rotate together (rigid, in sync).
    if (green.current) green.current.style.transform = `rotate(${flowerSpin(SPIN_OFF.s02 + ms)}deg)`;
    // camera pulls back: the lime fill resolves into a rounded CARD on dark-green.
    // card formation is keyed fast: full-bleed until ~ms1250, fully formed by ~ms1583.
    const pb = keys(ms, [[1170, 0], [1250, 0.3], [1333, 0.55], [1417, 0.75], [1583, 1]]);
    if (card.current) {
      const w = lerp(1920, 1180, pb), h = lerp(1080, 1000, pb);
      card.current.style.width = `${w}px`; card.current.style.height = `${h}px`;
      card.current.style.marginLeft = `${-w / 2}px`; card.current.style.marginTop = `${-h / 2}px`;
      card.current.style.borderRadius = `${lerp(0, 46, pb)}px`;
      // fade the lime flower-card out AS it shrinks into the page, so no lime full-frame ghost lingers
      card.current.style.opacity = String(1 - track(ms, 1500, 1660, outCubic));
    }
    // S03 HANDOFF: the 3-card "The Latest" site reads in by the scene boundary — but DELAYED to ~ms1700 so the flower
    // has already shrunk small before the page appears. The page then arrives fast over a tiny centred
    // flower (which lands where the Light Guide card is) = a morph, not a full-frame double-exposure.
    if (handoff.current) handoff.current.style.opacity = String(track(ms, 1300, 1480, outCubic));
    // the handoff page keeps ZOOMING OUT through the boundary: S02's final frame must show the
    // cards LARGE, edge-cropped (scale ≈1.5) — S03 then continues 1.5 -> 1.0 -> 0.92.
    if (handoffPage.current) handoffPage.current.style.transform = `scale(${keys(ms, [[1500, 1.9], [1917, 1.5]], outCubic)})`;
  }, []);

  const frameRef = useFrameTask(handleFrame);
  return (
    <Timegroup mode="fixed" duration={`${MORPH_MS}ms`} ref={frameRef} className="absolute inset-0" style={{ background: "#16361E" }}>
      {/* the flower lives inside a card that pulls back from full-frame to card-size —
          drawn ABOVE the incoming page (the shrinking card morphs INTO the page's card) */}
      <div ref={card} style={{ position: "absolute", left: "50%", top: "50%", width: 1920, height: 1080, marginLeft: -960, marginTop: -540, background: PAL.lime, overflow: "hidden", zIndex: 2 }}>
        {/* zooming flower — origin on the lower-left petal we were inside at the end of S01.
            Stem static + spokes windmill-rotating, BOTH BEHIND the petals. */}
        <div ref={wrapRef} style={{ position: "absolute", left: "50%", top: "50%", width: 1080, height: 1080, marginLeft: -540, marginTop: -540, transformOrigin: "62% 67%", transform: "scale(6.5)", willChange: "transform" }}>
          <FlowerStem size={1080} style={{ position: "absolute", left: 0, top: 0 }} />
          {/* rigid HEAD: spokes + petals rotate together (windmill IN SYNC, never detach) */}
          <div ref={green} style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1080, transformOrigin: "50% 45.8%", transform: "rotate(-280deg)" }}>
            <FlowerSpokes size={1080} style={{ position: "absolute", left: 0, top: 0 }} />
            <FlowerPetals size={1080} style={{ position: "absolute", left: 0, top: 0 }} />
          </div>
        </div>
      </div>
      {/* S03 handoff: 3-card "The Latest" site fading in BEHIND the shrinking card */}
      <div ref={handoff} style={{ position: "absolute", inset: 0, opacity: 0, overflow: "hidden", background: PAL.lime, zIndex: 1 }}>
        <div ref={handoffPage} style={{ position: "absolute", left: "50%", top: "50%", width: 1920, height: 1080, marginLeft: -960, marginTop: -540, transformOrigin: "50% 46%", transform: "scale(1.85)" }}>
          <ModernGarden />
        </div>
      </div>
    </Timegroup>
  );
};

export default Scene02_Morph;
