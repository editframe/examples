/**
 * Upload — 3.617–5.483s (1866ms).
 *
 * Upload-button image sequence (bseq, 56 frames) with three artwork
 * thumbnails flying into position via waypoint tables.
 *
 * All timing is absolute-frame waypoint animation (irreducible addFrameTask).
 */
import React, { useEffect, useRef } from "react";
import { Timegroup, Image as EfImage } from "@editframe/react";
import { UPLOAD_ABS_START, UPLOAD_MS } from "../constants";
import { seg, wp, st, type W, type TgEl } from "../lib/anim";

const A = "/elevenlabs-vocals-demo/src/assets";

const TH_SC: W = [[137, 1], [146, 0.78], [151, 0.62]];

const THUMBS = [
  {
    key: "t1", img: `${A}/thumb-b1-1.png`, capImg: `${A}/cap-b1-1.png`, capLeft: -8, capW: 180, rest: { x: 1158, y: 720 },
    cx: [[117.5, 1992], [120, 1818], [122, 1515], [124, 1332], [126, 1230], [128, 1167], [130, 1127], [132, 1100], [134, 1082], [138, 1062], [142, 1048], [146, 1038], [151, 1030]] as W,
    cy: [[117.5, 690], [120, 765], [122, 814], [124, 809], [126, 792], [128, 774], [130, 757], [132, 744], [134, 732], [136, 719], [138, 703], [142, 672], [146, 647], [151, 625]] as W,
  },
  {
    key: "t2", img: `${A}/thumb-b1-2.png`, capImg: `${A}/cap-b1-2.png`, capLeft: -8, capW: 144, rest: { x: 1364, y: 786 },
    cx: [[121.5, 1949], [122, 1877], [124, 1623], [126, 1436], [128, 1328], [130, 1245], [132, 1192], [134, 1155], [138, 1110], [142, 1085], [146, 1068], [151, 1052]] as W,
    cy: [[121.5, 780], [122, 788], [124, 848], [126, 858], [128, 848], [130, 833], [134, 806], [138, 776], [142, 744], [146, 712], [151, 688]] as W,
  },
  {
    key: "t3", img: `${A}/thumb-b1-3.png`, capImg: `${A}/cap-b1-3.png`, capLeft: -7, capW: 128, rest: { x: 1639, y: 813 },
    cx: [[123.5, 1990], [124, 1927], [126, 1711], [128, 1523], [130, 1411], [132, 1338], [134, 1285], [136, 1244], [138, 1212], [142, 1163], [146, 1090], [151, 1042]] as W,
    cy: [[123.5, 825], [124, 832], [126, 885], [128, 899], [130, 891], [132, 877], [134, 861], [136, 847], [138, 838], [142, 822], [146, 755], [151, 712]] as W,
  },
];

export const Upload: React.FC = () => {
  const rootRef = useRef<TgEl>(null);

  useEffect(() => {
    const tg = rootRef.current;
    if (!tg) return;

    tg.initializer = (inst) => {
      const qa = (sel: string) => Array.from(inst.querySelectorAll<HTMLElement>(sel));
      const q = <T extends HTMLElement>(sel: string) => inst.querySelector(sel) as T | null;

      const bseqEls = qa(".w2-seq");
      const thumbEls = THUMBS.map(t => ({ el: q(`.w3-${t.key}`), cap: q(`.w3c-${t.key}`) }));

      const render = (ms: number) => {
        const t = UPLOAD_ABS_START + ms / 1000;
        const F = t * 30 + 1;

        /* bseq — F 109.55–165.5 */
        {
          const bsOn = F >= 109.55 && F < 165.5;
          const bsIdx = Math.max(0, Math.min(55, Math.round(F) - 110));
          bseqEls.forEach((el, i) => st(el, "opacity", bsOn && i === bsIdx ? "1" : "0"));
        }

        /* thumbs — waypoint animation */
        THUMBS.forEach((th, i) => {
          const { el, cap } = thumbEls[i];
          const born = th.cx[0][0];
          const on = F >= born && F < 152;
          st(el, "opacity", on ? String(1 - seg(F, 146, 151)) : "0");
          if (cap) st(cap, "opacity", on ? String(seg(F, 126 + i, 129 + i) * (1 - seg(F, 134, 139))) : "0");
          if (!on) {
            st(el, "transform", "translateX(-4000px)");
            if (cap) st(cap, "transform", "translateX(-4000px)");
            return;
          }
          const cx = wp(F, th.cx), cy = wp(F, th.cy);
          const sc = wp(F, TH_SC);
          st(el, "transform", `translate(${cx - 72.5 - th.rest.x}px, ${cy - 72.5 - th.rest.y}px) scale(${sc})`);
          if (cap) {
            st(cap, "transform", `translate(${cx - 72.5 * sc + th.capLeft * sc - th.rest.x}px, ${cy + 72.5 * sc + 6 - (th.rest.y + 144)}px) scale(${sc})`);
          }
        });
      };

      const cleanup = inst.addFrameTask(({ ownCurrentTimeMs }) => render(ownCurrentTimeMs));
      render(0);
      return cleanup;
    };
    return () => { tg.initializer = undefined; };
  }, []);

  return (
    <Timegroup ref={rootRef as React.Ref<HTMLElement>} mode="fixed" duration={`${UPLOAD_MS}ms`} className="absolute inset-0">
      {/* thumbnails */}
      {THUMBS.map((th) => (
        <div key={th.key} className={`w3-${th.key} s3-thumb`} style={{ left: th.rest.x, top: th.rest.y, opacity: 0 }}>
          <EfImage src={th.img} style={{ position: "absolute", left: 0, top: 0, width: 145, height: 145 }} />
        </div>
      ))}
      {THUMBS.map((th) => (
        <div key={th.key} className={`w3c-${th.key}`} style={{ position: "absolute", left: th.rest.x, top: th.rest.y + 144, width: th.capW, height: 42, opacity: 0, transformOrigin: "0 0" }}>
          <EfImage src={th.capImg} style={{ position: "absolute", left: 0, top: 0, width: th.capW, height: 42 }} />
        </div>
      ))}

      {/* bseq — 56 upload-button frames */}
      {Array.from({ length: 56 }, (_, i) => (
        <div key={i} className="w2-seq" style={{ position: "absolute", left: 740, top: 455, width: 440, height: 170, opacity: 0 }}>
          <EfImage src={`${A}/bseq-${110 + i}.png`} style={{ position: "absolute", left: 0, top: 0, width: 440, height: 170 }} />
        </div>
      ))}
    </Timegroup>
  );
};
