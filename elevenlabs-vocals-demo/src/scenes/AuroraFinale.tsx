/**
 * AuroraFinale — 11.883–25s (13117ms).
 *
 * Five visual beats:
 *   mseq     F 357.5–524   (167 frames: recording modal sequence)
 *   aurora   F 509–671.5   (orb bloom, aurora stills, player pill)
 *   wipe     F 663–671.5   (black wipe panel)
 *   e2seq    F 665.5–750   (85 frames: finale sequence)
 *
 * mseq and aurora overlap from F 509–524 (aurora on top in z-order).
 *
 * All timing is absolute-frame waypoint animation (irreducible addFrameTask).
 */
import React, { useEffect, useRef } from "react";
import { Timegroup, Image as EfImage } from "@editframe/react";
import { AURORA_FINALE_ABS_START, AURORA_FINALE_MS } from "../constants";
import { seg, wp, easeInCubic, st, type W, type TgEl } from "../lib/anim";

const A = "/elevenlabs-vocals-demo/src/assets";

export const AuroraFinale: React.FC = () => {
  const rootRef = useRef<TgEl>(null);

  useEffect(() => {
    const tg = rootRef.current;
    if (!tg) return;

    tg.initializer = (inst) => {
      const qa = (sel: string) => Array.from(inst.querySelectorAll<HTMLElement>(sel));
      const q = <T extends HTMLElement>(sel: string) => inst.querySelector(sel) as T | null;

      const mseqEls = qa(".w7-seq");
      const rise = q(".w9-circle");
      const riseB = q(".w9-circleb");
      const playerPill = q(".w9-pill");
      const aurWorld = q(".w10-world");
      const aurStills = [q(".w10-a1x"), q(".w10-a2"), q(".w10-a3"), q(".w10-a4"), q(".w10-a5"), q(".w10-a6")];
      const a1b = q(".w10-a1b");
      const blackWipe = q(".w11-wipe");
      const e2Els = qa(".we2-seq");

      const render = (ms: number) => {
        const t = AURORA_FINALE_ABS_START + ms / 1000;
        const F = t * 30 + 1;

        /* mseq — F 357.5–524 */
        {
          const on = F >= 357.5 && F < 524;
          const idx = Math.max(0, Math.min(166, Math.round(F) - 358));
          mseqEls.forEach((el, i) => st(el, "opacity", on && i === idx ? "1" : "0"));
        }

        /* aurora world — F 509–671.5 */
        {
          const wOn = F >= 509 && F < 671.5;
          st(aurWorld, "opacity", wOn ? String(1 - seg(F, 682, 687)) : "0");
          const atx = -1920 * easeInCubic(seg(F, 664, 681));
          st(aurWorld, "transform", `translateX(${atx}px)`);

          const d = wp(F, [[515, 20], [517, 200], [519, 560], [520, 830], [522, 1110], [524, 1324], [526, 1488], [528, 1622], [530, 1732], [532, 1828], [534, 1912], [536, 1980], [540, 2110], [544, 2270]] as W);
          const useB = F >= 519.5;
          st(rise, "opacity", !useB && F >= 514.5 ? String(seg(F, 515, 518)) : "0");
          st(rise, "transform", `translate(${960 - 308}px, ${540 - 308}px) scale(${d / 616})`);
          st(riseB, "opacity", useB && F < 557 ? "1" : "0");
          st(riseB, "transform", `translate(${960 - 500}px, ${540 - 500}px) scale(${d / 1000})`);

          aurStills.forEach((s, i) => {
            const fin = 536 + i * 29.4;
            st(s, "opacity", String(seg(F, fin, fin + 8)));
          });
          st(a1b, "opacity", String(seg(F, 542, 550)));
          st(playerPill, "opacity", String(seg(F, 529.5, 538)));
        }

        /* black wipe — F 663–671.5 */
        {
          const wx = wp(F, [[665, 1920], [668, 1620], [672, 1199], [676, 760], [680, 300], [684, 0]] as W);
          st(blackWipe, "opacity", F >= 663 && F < 671.5 ? "1" : "0");
          st(blackWipe, "transform", `translateX(${wx}px)`);
        }

        /* e2seq — F 665.5+ */
        {
          const eOn = F >= 665.5;
          const eIdx = Math.max(0, Math.min(84, Math.round(F) - 666));
          e2Els.forEach((el, ii) => st(el, "opacity", eOn && ii === eIdx ? String(Math.min(1, seg(F, 666, 672))) : "0"));
        }
      };

      const cleanup = inst.addFrameTask(({ ownCurrentTimeMs }) => render(ownCurrentTimeMs));
      render(0);
      return cleanup;
    };
    return () => { tg.initializer = undefined; };
  }, []);

  return (
    <Timegroup ref={rootRef as React.Ref<HTMLElement>} mode="fixed" duration={`${AURORA_FINALE_MS}ms`} className="absolute inset-0">
      {/* mseq — 167 modal-recording frames */}
      {Array.from({ length: 167 }, (_, i) => (
        <div key={i} className="w7-seq" style={{ position: "absolute", left: 500, top: 235, width: 920, height: 610, opacity: 0 }}>
          <EfImage src={`${A}/mseq-${358 + i}.png`} style={{ position: "absolute", left: 0, top: 0, width: 920, height: 610 }} />
        </div>
      ))}

      {/* aurora world */}
      <div className="w10-world" style={{ position: "absolute", inset: 0, opacity: 0 }}>
        <div className="w9-circle" style={{ position: "absolute", left: 0, top: 0, width: 616, height: 616, transformOrigin: "308px 308px", opacity: 0 }}>
          <EfImage src={`${A}/orbcirc-b1.png`} style={{ position: "absolute", left: 0, top: 0, width: 616, height: 616 }} />
        </div>
        <div className="w9-circleb" style={{ position: "absolute", left: 0, top: 0, width: 1000, height: 1000, transformOrigin: "500px 500px", opacity: 0 }}>
          <EfImage src={`${A}/bigcirc-b3.png`} style={{ position: "absolute", left: 0, top: 0, width: 1000, height: 1000 }} />
        </div>
        <div className="w10-a1x" style={{ position: "absolute", inset: 0, opacity: 0 }}>
          <EfImage src={`${A}/aurstill-b1-1.png`} style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }} />
        </div>
        <div className="w10-a1b" style={{ position: "absolute", inset: 0, opacity: 0 }}>
          <EfImage src={`${A}/aurstill-b2-1b.png`} style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }} />
        </div>
        {[2, 3, 4, 5, 6].map((i) => (
          <div key={i} className={`w10-a${i}`} style={{ position: "absolute", inset: 0, opacity: 0 }}>
            <EfImage src={`${A}/aurstill-b1-${i}.png`} style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }} />
          </div>
        ))}
        <div className="w9-pill s9-pill" style={{ opacity: 0 }}>
          <EfImage src={`${A}/artp-b1.png`} style={{ position: "absolute", left: 9, top: 10, width: 55, height: 55 }} />
          <div style={{ position: "absolute", left: 62, top: 7, width: 335, height: 64 }}>
            <EfImage src={`${A}/pilltxt-b2.png`} style={{ position: "absolute", left: 0, top: 0, width: 335, height: 64 }} />
          </div>
          <div style={{ position: "absolute", right: 84, top: 19, width: 58, height: 38 }}>
            <EfImage src={`${A}/pilltime-b2.png`} style={{ position: "absolute", left: 0, top: 0, width: 58, height: 38 }} />
          </div>
          <div className="s9-heart" style={{ right: 26, top: 23, width: 30, height: 28 }}>
            <EfImage src={`${A}/icon-heartw-b2.png`} style={{ position: "absolute", left: 0, top: 0, width: 30, height: 28 }} />
          </div>
        </div>
      </div>

      {/* black wipe */}
      <div className="w11-wipe" style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, background: "#000", opacity: 0, transform: "translateX(1920px)" }} />

      {/* e2seq — 85 finale frames */}
      {Array.from({ length: 85 }, (_, i) => (
        <div key={i} className="we2-seq" style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, opacity: 0 }}>
          <EfImage src={`${A}/e2seq-${666 + i}.jpg`} style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }} />
        </div>
      ))}
    </Timegroup>
  );
};
