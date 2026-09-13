import React, { useEffect, useRef } from "react";
import { Timegroup } from "@editframe/react";
import { ROWLINES } from "../rowlines";
import { GLYPH_D2 } from "../glyphdens2";
import { DTRACKS, CAUSAL_SQUEEZE, G3_ROWS, DECK_BOUNCE, DECK_IDS, DECK_FRONT_UNDER } from "../deck";
import type { TgEl, G } from "../lib/anim";
import { clamp01, lerp, seg, wp, wpn, easeOutCubic, gridX, gridY, gry, setGridDirect } from "../lib/anim";
import { W, H, FPS, DECK_MS, DECK_START, NV, NH, KMIN, JMIN, RESP_LINES, CM } from "../constants";
import { Box, Txt, Grid, GlyphGrid, Img } from "../components/Presentational";

const DECK = [
  { id: "cryo", year: "2026", journal: "Cell", title: ["Cryo-EM Structure of Human PIEZO2", "Reveals Mechanism of Touch Sensation"], authors: "Xiaolin Wu, Daniel Reyes, Kavya Patel, et al.", abs: ["Using single-particle cryo-EM at 2.4 Å resolution, we resolve the full", "architecture of human PIEZO2 in lipid nanodiscs. The structure", "reveals a propeller-shaped trimer whose curved blades flatten", "under membrane tension, providing a structural basis for mechano..."], tags: ["Cryo-EM", "Neuroscience", "Structural Biology"] },
  { id: "solid", year: "2025", journal: "Joule", title: ["Solid-State Lithium Batteries with Garnet", "Electrolytes Achieve 1,200 Wh/L", "Energy Density"], authors: "Anjali Krishnamurthy, Lars Eriksson, Wenjun Zhao", abs: ["We demonstrate a Li-metal solid-state cell using a doped", "Li₇La₃Zr₂O₁₂ electrolyte that achieves 1,200 Wh/L volumetric energy", "density and retains 92% capacity after 800 cycles. Interfacial", "engineering with a thin Al₂O₃ buffer suppresses dendrite formation..."], tags: ["Batteries", "Materials Science", "Energy Storage"] },
  { id: "causal", year: "2024", journal: "Journal of the ASA", title: ["Causal Inference Under Hidden Confounding", "via Instrumental Variable Forests"], authors: "Rebecca Goldstein, Tomás Vargas", abs: ["We propose IV-Forests, a non-parametric estimator for", "heterogeneous treatment effects when unobserved confounders", "are present. Combining instrumental variable methods with random", "forests, our approach provides valid confidence intervals and outp..."], tags: ["Statistics", "Causal Inference", "Machine Learning"] },
  { id: "gut", year: "2024", journal: "Nature Medicine", title: ["Gut Microbiome Diversity Predicts", "Antidepressant Response in Treatment-", "Resistant Depression"], authors: "Sofia Almeida, James O'Brien, Hiroshi Tanaka, et al.", abs: ["In a longitudinal cohort of 412 patients with treatment-resistant", "depression, baseline microbiome alpha diversity strongly predicted", "SSRI response at 12 weeks. Specific Lactobacillus and", "Bifidobacterium signatures correlated with remission, suggesting..."], tags: ["Microbiome", "Psychiatry", "Biomarkers"] },
  { id: "sparse", year: "2025", journal: "NeurIPS", title: ["Sparse Attention Mechanisms for Long-", "Context Reasoning in Transformer", "Architectures"], authors: "Wei Chen, Priya Raghavan, Marcus Holloway, et al.", abs: ["We introduce SparseFlow, a learned sparse attention pattern that", "reduces quadratic attention costs to near-linear while preserving", "long-range dependencies. Evaluated across context lengths up to", "1M tokens, SparseFlow matches dense attention performance..."], tags: ["Transformers", "Attention", "Long Context"] },
];
/* strip order top->bottom on the vertical carousel (index - 2 - d = depth u) */
const STRIP = ["solid", "causal", "gut", "sparse", "cryo"];
export const GLY = [[188, 0], [190, 0.08], [192, 0.18], [194, 0.29], [196, 0.45], [198, 0.59], [200, 0.78], [202, 0.88], [204, 0.91], [208, 0.96], [212, 0.98], [214, 1], [224, 0.97], [226, 0.92], [228, 0.87], [230, 0.68], [232, 0.45], [234, 0.41], [236, 0.32], [238, 0.11], [240, 0]];

export const Deck = () => {
  const rootRef = useRef<TgEl>(null);
  useEffect(() => {
    const tg = rootRef.current;
    if (!tg) return;
    tg.initializer = (inst) => {
      const q = <T extends HTMLElement>(sel: string) => inst.querySelector(sel) as T | null;
      const st = (el: HTMLElement | null, k: string, v: string) => {
        if (k === "width" && v.endsWith("px")) v = `${Math.round(parseFloat(v))}px`;
        if (el && (el.style as any)[k] !== v) (el.style as any)[k] = v;
      };
      const cache = new Map<string, HTMLElement | null>();
      const g = (sel: string) => { if (!cache.has(sel)) cache.set(sel, q(sel)); return cache.get(sel)!; };
      const op = (sel: string, v: number) => st(g(sel), "opacity", String(clamp01(v)));
      const tf = (sel: string, v: string) => st(g(sel), "transform", v);
      const tr = (sel: string, x: number, y: number, sx = 1, sy = sx) => tf(sel, `translate(${x}px, ${y}px) scale(${sx}, ${sy})`);

      const setGrid = (prefix: string, G: G) => {
        for (let i = 0; i < NV; i++) tf(`.${prefix}-v${i}`, `translate(${gridX(G, i + KMIN)}px, 0px)`);
        for (let i = 0; i < NH; i++) tf(`.${prefix}-h${i}`, `translate(0px, ${gridY(G, i + JMIN)}px)`);
      };

      const setCard = (el: string, w: number, top: number, v: number, q = 1) => {
        tr(el, 960 - w / 2, top, w / 730);
        const vv = Math.round(Math.max(0, Math.min(255, v)));
        st(g(`${el}-face`), "background", `rgb(${vv},${vv},${vv})`);
        { const sc = w / 730, dz = Math.max(0, 0.989 - sc), above = top + 246 * sc < 540; op(`${el}-txt`, Math.max(0.5, Math.min(1, (1 - 0.45 * dz) * (above ? 1 - 0.33 * dz : 1)))); }
        if (q < 0.999) { const dx = (730 * (1 - q)) / 2; tf(`${el}-face`, `translate(${dx}px, 0px) scale(${q}, 1)`); tf(`${el}-in`, `translate(${-dx / q}px, 0px) scale(${1 / q}, 1)`); }
        else { tf(`${el}-face`, "none"); tf(`${el}-in`, "none"); }
      };

      /* depth d(f) derived from the front card's year-tag position; cards flow downward, 5-cycle */
      const DD = [[159, 2.1], [163, 1.9], [165, 1.78], [167, 1.66], [169, 1.475], [171, 1.19], [172, 1.0], [173, 0.7], [175, 0.165], [176, -0.18], [177, -0.49], [178, -0.8], [179, -1.15], [181, -1.78], [182, -2.3], [184, -2.78], [185, -3.22], [187, -3.56], [190, -4.07], [192, -4.29], [195, -4.52], [198, -4.7], [200, -4.8], [204, -4.93], [208, -4.99], [210, -5.0], [214, -4.96], [218, -4.88], [222, -4.76], [226, -4.55], [230, -4.3], [234, -4.1], [236, -3.99], [240, -3.8], [242, -3.765], [244, -3.72], [246, -3.8], [248, -3.94], [252, -4.19], [254, -4.45], [256, -4.86], [257, -5.13], [258, -5.44], [259, -5.83], [260, -6.3]];
      const TOPS = [295, 51, -119, -295], BOTS = [784, 1004, 1165, 1330], RSC = [1, 0.778, 0.607, 0.5];
      const DECK_VA = [[0, 59], [0.1, 53], [0.2, 51], [0.33, 47], [0.45, 46], [0.55, 46], [0.65, 48], [0.75, 54], [0.86, 60], [1, 69], [1.2, 79], [1.5, 96], [2, 140], [3, 167]];
      const DECK_VE = [[0, 59], [0.14, 64], [0.25, 72], [0.36, 80], [0.47, 90], [0.6, 110], [0.88, 124], [1, 130], [2, 215], [3, 235]];
      const pick = (arr: number[], a: number) => { const i = Math.min(2, Math.floor(a)); return lerp(arr[i], arr[i + 1], a - i); };
      const CARD3 = [[160, 681], [161, 611], [162, 592], [163, 580], [164, 571], [165, 566], [166, 554], [167, 540], [168, 526], [169, 509], [170, 494], [171, 476], [172, 458], [173, 436], [174, 412], [175, 388], [176, 364], [178, 320], [184, 250]];
      const BOT3 = [[165, 747], [166, 751], [167, 758], [168, 767], [169, 778], [170, 794], [171, 814], [172, 839], [173, 869], [174, 907], [175, 951], [176, 1000], [177, 1056], [178, 1120], [179, 1195], [180, 1280], [181, 1375], [182, 1480], [183, 1600], [184, 1730]];
      const TBL_END = 199, MODEL_START = 207;
      const INST: Record<string, number> = { sparse: 2, gut: 2, causal: 2, solid: 2, cryo: 1 }; /* instance on stage when the model takes over */

      const model = (id: string) => {
        const d = wp(f, DD);
        const u0 = STRIP.indexOf(id) - 2 - d, u = ((((u0 + 2.5) % 5) + 5) % 5) - 2.5, a = Math.min(3, Math.abs(u));
        const sc = u <= 0 ? 1 - 0.17 * a : pick(RSC, a), chh = 492 * sc;
        return { u, w: 730 * sc, top: u <= 0 ? pick(TOPS, a) : pick(BOTS, a) - chh, v: u <= 0 ? wp(a, DECK_VA) : wp(a, DECK_VE), vis: a <= 2.3 };
      };

      const glOn = [false, false];
      let f = 160;
      const renderC = (frame: number) => {
        f = frame;
        const on = f >= 160 && f <= 260;
        op(".sc3", on ? 1 : 0);
        if (!on) return;
        for (let k = 0; k < 2; k++) {
          const key = (k === 0 ? "gl_" : "gr_") + f, D = GLYPH_D2[key], el = g(`.glg${k}`);
          if (!D) { if (glOn[k]) { setGridDirect(el, 27, null, 1); glOn[k] = false; } continue; }
          setGridDirect(el, 27, D, 7.1); glOn[k] = true;
        }
        const o3 = ((((wp(f, G3_ROWS) + 1.5) % 163.3) + 163.3) % 163.3);
        const G: G = { sx: 154.2 / 154, sy: 163.3 / 156, cx: 111.5, cy: 0, tx: 0, ty: ((o3 - 163.3 * (JMIN + 1)) * 156) / 163.3, kx0: 111.5, ky0: 0 };
        setGrid("g3", G);
        { const L = ROWLINES[f] ?? []; for (let i = 0; i < 8; i++) { if (i < L.length) { tf(`.rl3-${i}`, `translate(0px, ${Math.round(L[i]) - 1}px)`); op(`.rl3-${i}`, 1); } else op(`.rl3-${i}`, 0); } }
        const cw3 = wp(f, CARD3) * 1.0028, ch3 = (551 / 736) * cw3;
        const bot3 = f <= 165 ? 540 + ch3 / 2 : wp(f, BOT3) + 2;
        tf(".cc3", `translate(${960 - cw3 / 2}px, ${bot3 - ch3}px) scale(${cw3 / 736})`); op(".cc3", f <= 184 ? 1 : 0);
        /* cycle model: depth d(f) -> slot u per paper (entering side u<0 above, receding side u>0 below) */
        const d = wp(f, DD);
        const blend = seg(f, TBL_END, MODEL_START);
        type Live = { el: string; w: number; top: number; v: number; q: number; key: number; u?: number };
        const live: Live[] = []; const shown = new Set<string>();
        if (blend < 1) {
          /* table phase: the most recently peaked instance is the front (topmost); the others are painted by their distance in age from it */
          const act = DTRACKS.filter((t) => f >= t.E && (f <= t.k[t.k.length - 1][0] || t.k[t.k.length - 1][0] >= 208));
          const peaked = act.filter((t) => t.P <= f).sort((a, b) => b.P - a.P);
          const front = peaked[0] ?? act.slice().sort((a, b) => a.E - b.E)[0];
          act.forEach((t) => {
            const [w0, top0, v0] = wpn(f, t.k);
            let w = w0, top = top0, v = v0;
            if (blend > 0) { const m = model(t.id); w = lerp(w, m.w, blend); top = lerp(top, m.top, blend); v = lerp(v, m.v, blend); }
            const q = t.id === "causal" && t.inst === 1 ? wp(f, CAUSAL_SQUEEZE) : 1;
            live.push({ el: `.pc-${t.id}-${t.inst}`, w, top, v, q, key: t === front ? -1 : Math.abs(t.E - front.E) });
          });
        } else {
          const tab0 = DECK_BOUNCE[f];
          const snapL = ROWLINES[f] ?? [];
          const snap = (y: number | null) => { if (y === null) return y; let b = y, bd = 2.001; for (const l of snapL) { const dd = Math.abs(l - y); if (dd < bd) { b = l; bd = dd; } } return b; };
          const tab = tab0 ? tab0.map((t) => [t[0], snap(t[1]), snap(t[2]), t[3]] as [number, number | null, number | null, number]) : tab0;
          STRIP.forEach((id) => { const m = model(id); if (!m.vis && !tab) return; live.push({ el: `.pc-${id}-${INST[id]}`, w: m.w, top: m.top, v: m.v, q: 1, key: m.u > 0 ? m.u : 10 - m.u, u: m.u }); });
          const ids = DECK_IDS[f];
          if (tab && ids) {
            /* the flurry: identities per frame; the front = the largest card showing both edges a card apart */
            live.length = 0;
            let iF = -1;
            tab.forEach((t, i) => { if (t[1] !== null && t[2] !== null && Math.abs(t[2] - t[1] - 492 * t[0]) <= 16 && (iF < 0 || t[0] > tab[iF][0])) iF = i; });
            tab.forEach((t, i) => {
              const id = ids[i]; if (!id) return;
              const sc = t[1] !== null && t[2] !== null && Math.abs(t[2] - t[1] - 492 * t[0]) <= 16 ? ((t[2] - t[1]) / 492 + t[0]) / 2 : t[0], below = i > iF;
              const top = below ? (t[2] !== null ? t[2] - 492 * sc : t[1] ?? 0) : (t[1] !== null ? t[1] : (t[2] ?? 0) - 492 * sc);
              const key = id === "X" ? 20 : i < iF ? 10 + (iF - i) : i === iF ? (DECK_FRONT_UNDER.has(f) ? 1.5 : 0) : i - iF;
              live.push({ el: id === "X" ? ".pc-causal-1" : `.pc-${id}-${INST[id]}`, w: 730 * sc, top, v: t[3], q: 1, key });
            });
          } else if (tab) {
            const byU = live.slice().sort((a, b) => (a.u ?? 0) - (b.u ?? 0));
            let bestK = 0, bestC = 1e9;
            for (let k = 0; k <= Math.max(0, byU.length - tab.length); k++) {
              let c = 0, n = 0;
              tab.forEach((t, i) => { const jj = i + k; if (jj >= 0 && jj < byU.length) { c += Math.abs(t[0] - byU[jj].w / 730); n++; } });
              if (n >= 1 && c / n < bestC) { bestC = c / n; bestK = k; }
            }
            let mm = 0; for (let i = 1; i < byU.length; i++) if (Math.abs(byU[i].u ?? 0) < Math.abs(byU[mm].u ?? 0)) mm = i;
            let iFront = -1;
            tab.forEach((t, i) => { if (t[1] !== null && t[2] !== null && Math.abs(t[2] - t[1] - 492 * t[0]) <= 16 && (iFront < 0 || t[0] > tab[iFront][0])) iFront = i; });
            if (iFront < 0) iFront = mm - bestK;
            const keep = new Set<Live>();
            tab.forEach((t, i) => {
              const jj = i + bestK; if (jj < 0 || jj >= byU.length) return;
              const c = byU[jj], sc = t[1] !== null && t[2] !== null && Math.abs(t[2] - t[1] - 492 * t[0]) <= 16 ? ((t[2] - t[1]) / 492 + t[0]) / 2 : t[0]; c.w = 730 * sc;
              const below = i > iFront;
              if (below) { if (t[2] !== null) c.top = t[2] - 492 * sc; else if (t[1] !== null) c.top = t[1]; }
              else { if (t[1] !== null) c.top = t[1]; else if (t[2] !== null) c.top = t[2] - 492 * sc; }
              c.v = t[3];
              keep.add(c);
            });
            for (let i = live.length - 1; i >= 0; i--) if (!keep.has(live[i])) live.splice(i, 1);
          }
        }
        if (blend >= 1 && live.length > 1) {
          let iF = -1;
          for (let i = 0; i < live.length; i++) if (live[i].key < 20 && (iF < 0 || live[i].w > live[iF].w)) iF = i;
          if (iF >= 0) {
            const F = live[iF]; let iB = -1;
            for (let i = 0; i < live.length; i++) if (i !== iF && live[i].key < 20 && live[i].top > F.top && (iB < 0 || live[i].top < live[iB].top)) iB = i;
            F.key = iB >= 0 && (F.w - live[iB].w) / 730 < 0.06 ? live[iB].key + 0.5 : 0;
          }
        }
        live.sort((a, b) => b.key - a.key); /* furthest back first; the front card last */
        live.forEach((c) => { const el = g(c.el); if (!el) return; setCard(c.el, c.w, c.top, c.v, c.q); op(c.el, 1); shown.add(c.el); if (el.parentNode) el.parentNode.appendChild(el); });
        DTRACKS.forEach((t) => { const el = `.pc-${t.id}-${t.inst}`; if (!shown.has(el)) op(el, 0); });
        const cc3 = g(".cc3");
        if (f <= 163 && cc3 && cc3.parentNode) cc3.parentNode.appendChild(cc3); /* the chat card still covers the first card */
      };

      const cleanup = inst.addFrameTask((info) => {
        const f = DECK_START + Math.round((info.ownCurrentTimeMs / 1000) * FPS);
        renderC(f);
      });
      return () => { if (cleanup) cleanup(); };
    };
  }, []);

  return (
    <Timegroup ref={rootRef as any} mode="fixed" duration={`${DECK_MS}ms`} fps={24} style={{ position: "relative", width: W, height: H, overflow: "hidden" }}>
      {/* ---------- sc3: B6 deck ---------- */}
      <div className="sc3" style={{ position: "absolute", left: 0, top: 0, width: W, height: H, background: "#FFFFFF", opacity: 0 }}>
        <div style={{ position: "absolute", left: 0, top: 27, width: 594, height: 1054 }}><GlyphGrid c="glg0" cols={27} rows={34} dx={22} dy={31} size={30} color="#DFDFDF" seed={3} font={CM} weight={300} sx={1.2} alt /></div>
        <div style={{ position: "absolute", left: 1324, top: 0, width: 594, height: 1085 }}><GlyphGrid c="glg1" cols={27} rows={35} dx={22} dy={31} size={30} color="#DFDFDF" seed={11} font={CM} weight={300} sx={1.2} alt /></div>
        <Grid c="g3" color="#E8E8E8" hcolor="linear-gradient(to bottom, #F1F1F1 0%, #F1F1F1 33.3%, #ECECEC 33.3%, #ECECEC 66.7%, #F9F9F9 66.7%, #F9F9F9 100%)" t={3} tv={2} />
        {Array.from({ length: 8 }).map((_, i) => <div key={"rl3" + i} className={`rl3-${i}`} style={{ position: "absolute", left: 0, top: 0, width: W, height: 3, background: "#C5C5C5", transformOrigin: "0 0", opacity: 0 }} />)}
        <div className="cc3" style={{ position: "absolute", left: 0, top: 0, width: 736, height: 551, background: "#1D1D1D", borderRadius: 30, overflow: "hidden", transformOrigin: "0 0", opacity: 0 }}>
          <Box x={251} y={31} w={459} h={88} bg="#626262" r={15} />
          <Box x={251} y={32} w={459} h={88} bg="#383838" r={15}>
            <Txt x={16} y={13} size={22} color="#FFFFFF" lh={27} s={{ letterSpacing: "0.055em" }}>My Aria soundbar won't connect to my</Txt>
            <Txt x={16} y={40} size={22} color="#FFFFFF" lh={27} s={{ letterSpacing: "0.055em" }}>TV after the latest firmware update.</Txt>
          </Box>
          <Box x={26} y={160} w={220} h={20}>
            <Box x={-6} y={-6} w={30} h={30} bg="#1D1D1D" r={15} />
            <Img c="agentlogo3" src="/firecrawl-demo/src/assets/firecrawl-demo-logo.png" x={-2} y={-2} w={22} h={22} o={1} />
            <Txt x={29} y={-5} size={21} color="#DEDEDE" lh={27} s={{ letterSpacing: "0.055em" }}>AI Agent</Txt>
          </Box>
          <Box x={25} y={199} w={684} h={220} bg="#202020" r={12} s={{ border: "1px solid #333333", boxSizing: "border-box" }} />
          {RESP_LINES.map((ln, i) => (ln ? <Txt key={i} x={40} y={213 + 26.5 * i} size={22} color="#F2F2F2" lh={27} s={{ letterSpacing: "0.055em" }}>{ln}</Txt> : null))}
          <Box x={22} y={455} w={686} h={75} bg="#383838" r={13} s={{ border: "1px solid #5A5A5A", boxSizing: "border-box" }} />
          <Txt x={41} y={472} size={27.5} color="#B4B4B4" lh={34} s={{ letterSpacing: "0.025em" }}>Ask anything...</Txt>
          <Box x={645} y={465} w={55} h={55} bg="#1D1D1D" r={27.5} s={{ border: "1px solid #3A3A3A", boxSizing: "border-box" }}>
            <Box x={25} y={17} w={1} h={18} bg="#DDDDDD" />
            <Box x={25} y={17} w={1} h={12} bg="#CDCDCD" s={{ transformOrigin: "50% 0", transform: "rotate(45deg)" }} />
            <Box x={25} y={17} w={1} h={12} bg="#CDCDCD" s={{ transformOrigin: "50% 0", transform: "rotate(-45deg)" }} />
          </Box>
        </div>
        {DECK.map((d) => [1, 2].map((n) => {
          const id = `pc-${d.id}-${n}`;
          return (
            <div key={id} className={id} style={{ position: "absolute", left: 0, top: 0, width: 730, height: 492, transformOrigin: "0 0", opacity: 0 }}>
              <div className={`${id}-face`} style={{ position: "absolute", left: 0, top: 0, width: 730, height: 492, background: "#3B3B3B", borderRadius: 43.5, overflow: "hidden", transformOrigin: "0 0" }}>
                <div className={`${id}-in`} style={{ position: "absolute", left: 0, top: 0, width: 730, height: 492, transformOrigin: "0 0" }}>
                  <Box x={35} y={54.5} w={47} h={21} bg="#FCFCFC" r={3}><Txt x={9} y={3} size={11} color="#141414" lh={14} mono weight={500}>{d.year}</Txt></Box>
                  <Box x={86.5} y={54.5} w={d.journal.length * 6.4 + 24} h={21} bg="rgba(0,0,0,0.30)" r={3}><Txt x={12} y={3} size={11.6} color="rgba(255,255,255,0.32)" lh={14} mono>{d.journal}</Txt></Box>
                  {d.title.map((t, i) => <Txt key={i} x={34.5} y={101.5 + 32 * i} size={30} color="#F0F0F0" lh={32} weight={600} s={{ letterSpacing: "0.8px" }}>{t}</Txt>)}
                  {d.tags.reduce<{ x: number; els: React.ReactNode[] }>((acc, t) => { const w = t.length * 6.2 + 14; acc.els.push(<Box key={t} x={acc.x} y={d.title.length <= 2 ? 415 : 419} w={w} h={19} bg="rgba(0,0,0,0.30)" r={3}><Txt x={7} y={5} size={11.6} color="rgba(255,255,255,0.32)" lh={14} mono>{t}</Txt></Box>); acc.x += w + 8; return acc; }, { x: 35, els: [] }).els}
                </div>
              </div>
              <Box x={35} y={d.title.length <= 2 ? 217.5 : 220} w={658} h={175} bg="#181818" r={14}>
                <div className={`${id}-txt`} style={{ position: "absolute", left: 0, top: 0, width: 658, height: 175 }}>
                  <Txt x={21} y={19} size={17} color="#E4E4E4" lh={20} mono s={{ letterSpacing: "0.1px" }}>{d.authors}</Txt>
                {d.abs.map((t, i) => <Txt key={i} x={21} y={61 + 24.5 * i} size={20} color="#777777" lh={24}>{t}</Txt>)}
                </div>
              </Box>
            </div>
          );
        }))}
      </div>
    </Timegroup>
  );
};
