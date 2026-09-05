import React from "react";
import { FlowerStem, FlowerSpokes, FlowerPetals } from "./Flower";
import { limeMorphPath } from "../helpers";

/** Seed-card grey tile — even-odd fill so the white quarter-circle "bites"
 *  read as holes. viewBox 0..100. */
const SEED_TILE_PATH = "M75.33 99.92 77.58 99.92 77.83 99.08 78.58 97.67 80.33 95.08 81.83 93.25 85.17 90.17 87.08 88.83 90.00 87.25 91.08 86.92 92.25 86.33 93.67 86.00 93.83 85.83 93.83 85.50 93.42 85.25 75.58 85.33 75.33 85.58Z M31.08 85.50 31.25 86.00 33.75 86.75 37.58 88.58 41.42 91.42 43.25 93.17 45.67 96.17 47.42 99.17 47.58 99.92 52.33 99.92 52.50 99.17 54.25 96.17 56.67 93.17 58.50 91.42 62.92 88.25 66.17 86.75 68.83 85.83 68.83 85.50 68.42 85.25 31.50 85.25Z M6.08 85.50 6.08 85.83 6.25 86.00 7.67 86.33 8.83 86.92 9.92 87.25 12.83 88.83 14.75 90.17 18.08 93.25 19.58 95.08 21.33 97.67 22.08 99.08 22.33 99.92 24.58 99.92 24.58 85.58 24.33 85.33 6.50 85.25Z M0.00 44.67 0.00 59.83 7.17 60.92 14.33 64.42 19.75 69.58 24.08 77.25 25.00 59.75 32.92 60.92 41.08 65.58 46.58 72.17 49.92 80.42 55.33 69.17 59.75 64.83 65.08 61.67 71.33 59.83 75.42 60.08 75.83 77.25 80.17 69.58 85.58 64.42 92.75 60.92 99.92 59.83 99.92 44.67 94.67 52.17 89.58 56.25 82.75 59.17 75.75 60.00 75.25 42.33 74.58 42.17 71.75 48.67 66.83 54.50 61.75 57.92 56.00 60.08 43.92 60.08 36.75 57.17 29.83 51.08 25.08 42.08 24.67 59.67 17.17 59.17 7.50 54.25 3.33 49.92Z M0.00 6.75 0.00 9.33 24.67 9.67 23.50 17.67 20.25 24.00 14.92 29.50 5.92 33.83 6.17 34.58 24.33 34.42 27.17 25.00 31.83 18.58 39.00 13.50 49.00 11.08 58.42 12.50 66.58 17.17 72.67 24.83 75.58 34.42 93.75 34.58 94.00 33.83 85.00 29.50 79.67 24.00 76.42 17.67 75.25 9.67 99.92 9.33 99.92 6.75 97.83 3.58 92.33 0.00 7.58 0.00 3.00 2.67Z";

/** Modern Garden marketing site — "The Latest" + 3 cards. Reused by S03 (fills
 *  frame) and S04 (inside the Figma editor canvas). Built at a fixed 1920x1080
 *  layout so it can be scaled/placed by the parent scene.
 *
 *  Each card exposes refs to its ANIMATED sub-element only (so the parent can run
 *  the per-card "Figma Motion" mini-animation without spinning the whole card):
 *   - plant: pink star (starRef) + white starburst rays (raysRef)
 *   - light: flower HEAD = spokes+petals rigid group (flowerRef, windmills) — stem + bg stay fixed
 *   - seed:  grey tile + lime disc stay fixed; only the pink ball (pinkRef) drops down & rises
 */

export type ArtRefs = {
  starRef?: React.Ref<SVGGElement>;
  raysRef?: React.Ref<SVGGElement>;
  flowerRef?: React.Ref<HTMLDivElement>;
  ringRef?: React.Ref<HTMLDivElement>;
  tileRowRefs?: React.Ref<HTMLDivElement>[];
  leavesRef?: React.Ref<HTMLDivElement>;   // plant card: stem + leaves group (rises up)
  dotsRef?: React.Ref<HTMLDivElement>;     // plant card: blue dot row (appears once settled)
  foldLRef?: React.Ref<HTMLDivElement>;    // plant card: main pair LEFT leaf (unfurls from droop)
  foldRRef?: React.Ref<HTMLDivElement>;    // plant card: main pair RIGHT leaf
  topPairRef?: React.Ref<HTMLDivElement>;  // plant card: the pair ABOVE the main one — grows in AFTER the rise
  limePathRef?: React.Ref<SVGPathElement>;           // seed card: lime silhouette (morphs disc→bowtie→tulip)
  pinkRef?: React.Ref<HTMLDivElement>;               // seed card: pink ball (drops down into the flower, then rises)
};

const GREEN_BG = "#15311C";      // website canvas
const NAV_TXT = "#EDEFE6";       // cream
const CARD_FRAME = "#21422C";    // lighter green card frame
const LIME = "#D9F66B";
const DGREEN = "#005C2D";
const PINK = "#FF7FA6";
const MAUVE = "#E3C3CE";
const SERIF = "'Newsreader','EB Garamond',Georgia,serif";

const starPts = (cx: number, cy: number, n: number, ro: number, ri: number) => {
  const pts: string[] = [];
  for (let i = 0; i < n * 2; i++) {
    const r = i % 2 === 0 ? ro : ri;
    const a = ((i * 180) / n - 90) * Math.PI / 180;
    pts.push(`${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`);
  }
  return pts.join(" ");
};

/** Plant-card top band: LIME bg + giant 16-point WHITE star whose points
 *  overflow the band edges (lime shows as triangular gaps between points —
 *  reads as white petals on green), + big pink 10-point star. Band = 448x242 (53.5% of art). */
export const STAR_CX = 202, STAR_CY = 118; // star centre in band SVG coords
const Starburst: React.FC<{ starRef?: React.Ref<SVGGElement>; raysRef?: React.Ref<SVGGElement> }> = ({ starRef, raysRef }) => (
  <svg viewBox="0 0 448 242" width="100%" height="100%" preserveAspectRatio="none">
    <rect width="448" height="242" fill={LIME} />
    <g ref={raysRef}>
      {/* a WHITE-dominant field (≈45% white vs ≈14% lime) with a FEW FAT lime wedges, not
          many thin white spokes — fewer points + large inner radius. */}
      <polygon points={starPts(STAR_CX, STAR_CY, 13, 280, 140)} fill="#FFFFFF" />
    </g>
    <g ref={starRef} transform={`translate(${STAR_CX},${STAR_CY})`}>
      <polygon points={starPts(0, 0, 10, 90, 50)} fill="#FD9CBD" />
    </g>
  </svg>
);

/** One plant leaf pair: two mirror-symmetric, fat, rounded dark-green paddles
 *  flanking the central stem (viewBox 448x136, centre x=224). Leaves only
 *  translate with the stem (no unfurl), so this is a static shape. */
const PaddlePair: React.FC = () => (
  <svg viewBox="0 0 448 136" width="100%" height="100%" preserveAspectRatio="none">
    {/* left leaf: FAT paddle, rounding to a pointed outer tip, but PINCHED where it meets the
        stem so a PINK triangle shows above & below the centre (4-paddle propeller look). */}
    <path d="M 224 36 C 150 2, 58 2, 10 46 C 0 57, 0 79, 10 90 C 58 134, 150 130, 224 100 Z" fill={DGREEN} />
    {/* right leaf: mirror */}
    <path d="M 224 36 C 298 2, 390 2, 438 46 C 448 57, 448 79, 438 90 C 390 134, 298 130, 224 100 Z" fill={DGREEN} />
  </svg>
);

// plant band pink->pale-grey vertical gradient, faked as 14 solid strips (EF mangles gradients)
const GRAD_STRIPS = Array.from({ length: 14 }, (_, i) => {
  const t = i / 13;
  const c = [236 + (225 - 236) * t, 160 + (221 - 160) * t, 188 + (217 - 188) * t].map(Math.round);
  return `rgb(${c[0]},${c[1]},${c[2]})`;
});

const CardArt: React.FC<{ kind: "plant" | "light" | "seed"; refs?: ArtRefs }> = ({ kind, refs }) => {
  if (kind === "light")
    return (
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        {/* stacked flat tone-bands (EF renders SVG gradients transparent): top lime, lower pale-green */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "60%", background: LIME }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "40%", background: "#C9E89A" }} />
        {/* dark-green V groundline at the bottom (two triangles meeting at centre) */}
        <div style={{ position: "absolute", left: 0, bottom: 0, width: 0, height: 0, borderLeft: "100px solid transparent", borderBottom: "120px solid " + DGREEN }} />
        <div style={{ position: "absolute", right: 0, bottom: 0, width: 0, height: 0, borderRight: "100px solid transparent", borderBottom: "120px solid " + DGREEN }} />
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 28, background: DGREEN }} />
        {/* flower: static STEM (planted) + rotating HEAD. The head = green spokes + white petals
            drawn as ONE rigid group, so they windmill IN SYNC and never detach. The
            stem stays put; only the head spins about the bloom centre; bg bands stay fixed. */}
        <div style={{ position: "absolute", left: "50%", top: "44%", width: 440, height: 440, marginLeft: -220, marginTop: -220 }}>
          <FlowerStem size={440} style={{ position: "absolute", left: 0, top: 0 }} />
          <div ref={refs?.flowerRef} style={{ position: "absolute", left: 0, top: 0, width: 440, height: 440, transformOrigin: "50% 45.8%", willChange: "transform" }}>
            <FlowerSpokes size={440} style={{ position: "absolute", left: 0, top: 0 }} />
            <FlowerPetals size={440} style={{ position: "absolute", left: 0, top: 0 }} />
          </div>
        </div>
      </div>
    );
  if (kind === "plant")
    return (
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        {/* starburst band = top 53.5% of the art */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "53.5%" }}><Starburst starRef={refs?.starRef} raysRef={refs?.raysRef} /></div>
        {/* plant band (bottom 46.5%): pink→pale-grey gradient bg + centred stem + TWO tiers
            of symmetric paddle pairs. The whole plant group RISES up once
            (grows in, then holds); leaves only translate — no unfurl. */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "46.5%", overflow: "hidden" }}>
          {GRAD_STRIPS.map((c, i) => (
            <div key={i} style={{ position: "absolute", left: 0, right: 0, top: `${i * 7.15}%`, height: "7.5%", background: c }} />
          ))}
          {/* light blue-grey CURVED BASE band at the bottom (the leaves sit on a periwinkle
              base carrying the blue dots — #D1D9DF). Behind the leaves, above the dots. */}
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "19%", background: "rgb(209,217,223)", borderRadius: "45% 45% 0 0 / 60% 60% 0 0" }} />
          <div ref={refs?.leavesRef} style={{ position: "absolute", inset: 0, willChange: "transform" }}>
            {/* central stem running through both tiers + the PINK GAP between them (a clear
                band of pink + stem separates the tiers) */}
            <div style={{ position: "absolute", left: "50%", marginLeft: -23, width: 46, top: "-9%", height: "91%", background: DGREEN }} />
            {/* upper tier — FLUSH against the burst/pink transition (no pink gap above it) */}
            <div ref={refs?.topPairRef} style={{ position: "absolute", left: 0, right: 0, top: "-9%", height: "40%" }}><PaddlePair /></div>
            {/* lower tier — small pink+stem gap above it, room above the dots */}
            <div style={{ position: "absolute", left: 0, right: 0, top: "37%", height: "40%" }}><PaddlePair /></div>
          </div>
          {/* row of small blue dots (hidden on the plain site; S04 playback shows them) */}
          <div ref={refs?.dotsRef} style={{ position: "absolute", inset: 0, opacity: 0 }}>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} style={{ position: "absolute", bottom: "4%", left: `${13 + i * 13}%`, width: 20, height: 20, borderRadius: "50%", background: "rgb(150,196,255)" }} />
            ))}
          </div>
        </div>
      </div>
    );
  // seed (Seed Starting): a mid-century geometric floral TILE on WHITE (grey quarter-circle
  // leaf pattern). The central LIME (rests as a disc) OPENS like a seed pod — disc →
  // bowtie/butterfly → tulip — while a PINK ball (r12.5%) drops down into it and rises back up
  // (S04 drives limePathRef + pinkRef; both rest at their disc/centred state in S03).
  return (
    <div style={{ position: "absolute", inset: 0, background: "#FFFFFF", overflow: "hidden" }}>
      {/* grey floral tile — even-odd fill: the inner contours are the white quarter-circle "bites" */}
      <svg viewBox="0 0 100 100" width="100%" height="100%" preserveAspectRatio="none" style={{ position: "absolute", inset: 0 }}>
        <path fillRule="evenodd" fill="#D6D6D6" d={SEED_TILE_PATH} />
      </svg>
      {/* LIME silhouette — morphs (disc at rest → bowtie → tulip). Same 0..100 card space. */}
      <svg viewBox="0 0 100 100" width="100%" height="100%" preserveAspectRatio="none" style={{ position: "absolute", inset: 0 }}>
        <path ref={refs?.limePathRef} fill={LIME} d={limeMorphPath(0, 0)} />
      </svg>
      {/* PINK ball — top IS the centre (translate). Rests at 37.5% (centred in the lime); S04 drops
          it to the lime's lower rim (~62.8%) then lifts it back up. Drawn last = on top. */}
      <div ref={refs?.pinkRef} style={{ position: "absolute", left: "50%", top: "37.5%", width: "25%", height: "25%", transform: "translate(-50%,-50%)", background: "#FC9CBB", borderRadius: "50%" }} />
    </div>
  );
};

const Card: React.FC<{ kind: "plant" | "light" | "seed"; min: string; title: string; refs?: ArtRefs }> = ({ kind, min, title, refs }) => (
  <div style={{ width: 484, height: 640, background: CARD_FRAME, borderRadius: 28, padding: 18, position: "relative" }}>
    <div style={{ position: "absolute", left: 18, right: 18, top: 18, height: 452, borderRadius: 18, overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0 }}>
        <CardArt kind={kind} refs={refs} />
      </div>
    </div>
    <div style={{ position: "absolute", left: 28, bottom: 92, color: "rgba(237,239,230,0.7)", fontFamily: "Inter", fontSize: 24 }}>{min}</div>
    <div style={{ position: "absolute", left: 28, right: 70, bottom: 28, color: NAV_TXT, fontFamily: SERIF, fontSize: 44, whiteSpace: "nowrap" }}>{title}</div>
    <div style={{ position: "absolute", right: 26, bottom: 30, width: 58, height: 58, borderRadius: "50%", border: "1.5px solid rgba(237,239,230,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke={NAV_TXT} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7" /><polyline points="8,7 17,7 17,16" /></svg>
    </div>
  </div>
);

export const ModernGarden: React.FC<{ cardRefs?: { plant?: ArtRefs; light?: ArtRefs; seed?: ArtRefs } }> = ({ cardRefs }) => (
  <div style={{ position: "absolute", inset: 0, background: GREEN_BG, overflow: "hidden" }}>
    {/* nav */}
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 96, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 56px", color: NAV_TXT, fontFamily: SERIF }}>
      <div style={{ fontSize: 30 }}>🌱 Modern Garden</div>
      <div style={{ display: "flex", gap: 40, fontSize: 26 }}>
        <span>Explore</span>
        <span style={{ borderBottom: `3px solid ${LIME}`, paddingBottom: 4 }}>Guides</span>
        <span>Collections</span>
        <span>Shop</span>
      </div>
    </div>
    {/* heading */}
    <div style={{ position: "absolute", top: 150, left: 0, right: 0, textAlign: "center", color: NAV_TXT, fontFamily: SERIF, fontSize: 64 }}>The Latest</div>
    {/* cards */}
    <div style={{ position: "absolute", top: 250, left: 0, right: 0, display: "flex", gap: 42, justifyContent: "center" }}>
      <Card kind="plant" min="12 min" title="Plant Care 101" refs={cardRefs?.plant} />
      <Card kind="light" min="15 min" title="Light Guide" refs={cardRefs?.light} />
      <Card kind="seed" min="8 min" title="Seed Starting" refs={cardRefs?.seed} />
    </div>
  </div>
);

export default ModernGarden;
