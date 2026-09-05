/**
 * Native watercolor globe — irreducible canvas warp (addFrameTask + drawGlobe).
 * Circle/shading stay put; the paint swirls via two octaves of sine fields.
 */
import React from "react";
import { Image as EfImage } from "@editframe/react";

export const EARTH_TEX = "/elevenlabs-montage-demo/src/assets/earth-texture.png";
export const GLOBE_W = 250;
export const GLOBE_R = 122;
export const GLOBE_T0 = 13.3;
export const GLOBE_PHASE = 3.46; /* keeps the olive landmass left / blue right */
export const GLOBE_DRIFT = 0.014; /* texture-widths per second, left->right */
const TAU = Math.PI * 2;
/* warp octave 1 — feature size ~60-100% of diameter. Strength cranked
   for a visible swash: ~25-30% diameter blob-edge travel, with amplitude
   and evolution speed tuned for a lively (not placid) morph */
const W1AU = 0.034, W1AV = 0.057, W1FV = 1.6, W1FU = 2.2, W1S = 1.1, W1S2 = 0.9;
/* warp octave 2 — mid-scale eddies */
const W2AU = 0.0085, W2AV = 0.017, W2FU = 9, W2FV = 4, W2S = 1.6;
const W3FU = 7, W3FV = 5, W3S = 1.4;
/* coherent vortex advection — the paint sweeps along a
   rotational path (not just in-place wiggle): sampling coords orbit the
   window center with an exp falloff, angle growing with t */
const VCU = GLOBE_PHASE / TAU, VCV = 0.5, VORT = 0.125, VRAD = 0.08;

type GlobeSampler = {
  tex: Uint8ClampedArray;
  tw: number;
  th: number;
  out: ImageData;
  scratch: HTMLCanvasElement;
  sctx: CanvasRenderingContext2D;
  dest: Int32Array;
  u0: Float32Array;
  v0: Float32Array;
  n: number;
};
let globeSampler: GlobeSampler | null = null;

function buildGlobeSampler(img: HTMLImageElement) {
  const tw = img.naturalWidth, th = img.naturalHeight;
  if (!tw || !th) return;
  const off = document.createElement("canvas");
  off.width = tw;
  off.height = th;
  const octx = off.getContext("2d")!;
  /* the globe is very diffuse — soften the map before sampling
     (wet-on-wet watercolor bleed: coastlines must not read as hard edges) */
  octx.filter = "blur(14px)";
  octx.drawImage(img, 0, 0, tw, th);
  octx.filter = "none";
  const tex = octx.getImageData(0, 0, tw, th).data;
  /* grade toward the target palette: the blur
     above washes color out, so re-saturate past neutral to the intended
     jewel tones; oceans shifted toward cyan, land greens toward yellow */
  const SAT = -0.3; /* negative = push away from luma = +30% saturation */
  for (let i = 0; i < tex.length; i += 4) {
    let r = tex[i], g = tex[i + 1], b = tex[i + 2];
    const l = 0.3 * r + 0.59 * g + 0.11 * b;
    r += (l - r) * SAT; g += (l - g) * SAT; b += (l - b) * SAT;
    if (b > r && b > g) g += (b - g) * 0.25;
    else if (g > b) r += (g - r) * 0.35;
    tex[i] = r; tex[i + 1] = g; tex[i + 2] = b;
  }
  const W = GLOBE_W, c = W / 2, R = GLOBE_R;
  /* ZOOM < 1 samples a narrower window: land blobs read ~35% larger,
     matching big simple shapes */
  const ZOOM = 0.72;
  const dest: number[] = [], u0: number[] = [], v0: number[] = [];
  for (let y = 0; y < W; y++)
    for (let x = 0; x < W; x++) {
      const nx = (x - c + 0.5) / R, ny = (y - c + 0.5) / R;
      const d2 = nx * nx + ny * ny;
      if (d2 > 1) continue;
      dest.push((y * W + x) * 4);
      /* static spherical base UV (texture-width / texture-height units) */
      u0.push((Math.atan2(nx, Math.sqrt(1 - d2)) * ZOOM + GLOBE_PHASE) / TAU);
      v0.push((Math.asin(Math.max(-1, Math.min(1, ny))) / Math.PI) * ZOOM + 0.5);
    }
  const scratch = document.createElement("canvas");
  scratch.width = W;
  scratch.height = W;
  globeSampler = {
    tex, tw, th,
    out: new ImageData(W, W),
    scratch,
    sctx: scratch.getContext("2d")!,
    dest: Int32Array.from(dest),
    u0: Float32Array.from(u0),
    v0: Float32Array.from(v0),
    n: dest.length,
  };
}

export function primeGlobeTexture() {
  if (globeSampler) return;
  const texImg = new window.Image();
  texImg.onload = () => buildGlobeSampler(texImg);
  texImg.src = "/api/v1/assets/image?src=" + encodeURIComponent("/elevenlabs-montage-demo/src/assets/earth-texture.png");
}

export function drawGlobe(ctx: CanvasRenderingContext2D, t: number) {
  const W = GLOBE_W, H = GLOBE_W, cx = W / 2, cy = H / 2, R = GLOBE_R;
  ctx.clearRect(0, 0, W, H);
  const s = globeSampler;
  if (!s) return; /* texture not decoded yet — globe is offscreen until 12.9s */
  const tt = t - GLOBE_T0;
  const { tex, tw, th, out, dest, u0, v0, n } = s;
  const od = out.data;
  /* fluid swirl: the paint morphs in place — two octaves of slowly
     evolving sine warps on the static base UV, plus a slow rightward
     drift. No rotation; circle/shading stay put. */
  const dr = GLOBE_DRIFT * tt;
  const ph1 = W1S * tt, ph1b = W1S2 * tt, ph2 = W2S * tt, ph3 = W3S * tt;
  const vAng = VORT * tt;
  for (let i = 0; i < n; i++) {
    let bu = u0[i], bv = v0[i];
    /* coherent swirl: orbit the sampling point around the window center,
       strongest at the middle, fading toward the rim */
    const du = bu - VCU, dv = bv - VCV;
    const va = vAng * Math.exp(-Math.sqrt(du * du + dv * dv) / VRAD);
    if (va !== 0) {
      const ca = Math.cos(va), sa = Math.sin(va);
      bu = VCU + du * ca - dv * sa;
      bv = VCV + du * sa + dv * ca;
    }
    const wu = bu - dr
      + W1AU * Math.sin(TAU * W1FV * bv + ph1)
      + W2AU * Math.sin(TAU * (W2FU * bu + W2FV * bv) + ph2 + 2.1);
    let wv = bv
      + W1AV * Math.sin(TAU * W1FU * bu + ph1b + 4.2)
      + W2AV * Math.sin(TAU * (W3FU * bu + W3FV * bv) + ph3 + 1.3);
    if (wv < 0) wv = 0;
    else if (wv > 1) wv = 1;
    /* mirrored-repeat longitude sampling keeps the wrap seam invisible */
    let m = wu % 2;
    if (m < 0) m += 2;
    const u = m < 1 ? m : 2 - m;
    const ti = (((wv * (th - 1)) | 0) * tw + Math.min(tw - 1, (u * tw) | 0)) * 4;
    const di = dest[i];
    od[di] = tex[ti];
    od[di + 1] = tex[ti + 1];
    od[di + 2] = tex[ti + 2];
    od[di + 3] = 255;
  }
  s.sctx.putImageData(out, 0, 0);
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, Math.PI * 2);
  ctx.clip();
  ctx.drawImage(s.scratch, 0, 0);

  /* spherical shading — multiply falloff away from the 10-o'clock light */
  ctx.globalCompositeOperation = "multiply";
  const sh = ctx.createRadialGradient(cx - 62, cy - 66, 12, cx + 26, cy + 30, R + 42);
  sh.addColorStop(0, "#ffffff");
  sh.addColorStop(0.6, "#f4f6fb");
  sh.addColorStop(0.88, "#ccd4e5");
  sh.addColorStop(1, "#b7c1d6");
  ctx.fillStyle = sh;
  ctx.fillRect(0, 0, W, H);

  /* bright cyan-white specular highlight at 10 o'clock */
  ctx.globalCompositeOperation = "screen";
  const hl = ctx.createRadialGradient(cx - 58, cy - 62, 10, cx - 58, cy - 62, 150);
  hl.addColorStop(0, "rgba(208,232,255,0.18)");
  hl.addColorStop(0.55, "rgba(160,210,250,0.1)");
  hl.addColorStop(1, "rgba(160,210,250,0)");
  ctx.fillStyle = hl;
  ctx.fillRect(0, 0, W, H);

  /* limb darkening — deep navy, strongest on the lower-right edge */
  ctx.globalCompositeOperation = "source-over";
  const lg = ctx.createRadialGradient(cx - 34, cy - 36, R * 0.42, cx - 4, cy - 4, R + 6);
  lg.addColorStop(0, "rgba(20,54,116,0)");
  lg.addColorStop(0.7, "rgba(20,54,116,0.04)");
  lg.addColorStop(0.9, "rgba(20,54,116,0.24)");
  lg.addColorStop(1, "rgba(20,54,116,0.5)");
  ctx.fillStyle = lg;
  ctx.fillRect(0, 0, W, H);
  ctx.restore();
}

/** Hidden embed so the render pipeline waits for the texture before frames start. */
export const GlobeTexture: React.FC = () => (
  <EfImage src={EARTH_TEX} style={{ position: "absolute", left: 0, top: 0, width: 2, height: 1, opacity: 0 }} />
);
