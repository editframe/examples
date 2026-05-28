import React, { forwardRef, useImperativeHandle, useRef } from "react";

/**
 * 3D manila folder with zipper. Exposes an imperative handle so a parent
 * scene can update its visual state every frame WITHOUT triggering React
 * re-renders.
 *
 * Usage:
 *   const folderRef = useRef<CommitFolderHandle>(null);
 *   // in onFrame:
 *   folderRef.current?.update({ lidClose: 0.5, zipperP: 0.2, ... });
 */

export interface CommitFolderState {
  lidClose: number;   // 0..1 — lid rotates from open (-90deg) to closed (0deg)
  zipperP: number;    // 0..1 — zipper teeth close left → right
  lockClick: number;  // 0..1 — small padlock drops in
  secured: number;    // 0..1 — green ✓ badge pulses
  rotateY: number;    // degrees (overall 3D Y rotation)
  rotateX: number;    // degrees (overall 3D X rotation)
}

export interface CommitFolderHandle {
  update(s: Partial<CommitFolderState>): void;
}

interface Props {
  width?: number;
  height?: number;
  label?: string;
  initial?: Partial<CommitFolderState>;
}

const DEFAULT_STATE: CommitFolderState = {
  lidClose: 0,
  zipperP: 0,
  lockClick: 0,
  secured: 0,
  rotateY: 0,
  rotateX: -6,
};

export const CommitFolder = forwardRef<CommitFolderHandle, Props>(
  ({ width = 520, height = 360, label = "commit", initial }, ref) => {
    const rootRef = useRef<HTMLDivElement>(null);
    const lidRef = useRef<HTMLDivElement>(null);
    const zipperFillRef = useRef<HTMLDivElement>(null);
    const zipperSliderRef = useRef<HTMLDivElement>(null);
    const zipperWrapRef = useRef<HTMLDivElement>(null);
    const filesRef = useRef<HTMLDivElement>(null);
    const lockRef = useRef<HTMLDivElement>(null);
    const securedRef = useRef<HTMLDivElement>(null);
    const securedTextRef = useRef<HTMLDivElement>(null);

    const stateRef = useRef<CommitFolderState>({ ...DEFAULT_STATE, ...(initial || {}) });

    useImperativeHandle(ref, () => ({
      update(s: Partial<CommitFolderState>) {
        Object.assign(stateRef.current, s);
        const st = stateRef.current;

        if (rootRef.current) {
          rootRef.current.style.transform = `rotateY(${st.rotateY}deg) rotateX(${st.rotateX}deg)`;
        }

        if (lidRef.current) {
          const lidRot = -90 + st.lidClose * 90;
          lidRef.current.style.transform = `rotateX(${lidRot}deg) translateZ(0.5px)`;
        }

        if (filesRef.current) {
          filesRef.current.style.opacity = String(1 - st.lidClose * 0.85);
        }

        if (zipperWrapRef.current) {
          zipperWrapRef.current.style.opacity = st.lidClose > 0.85 ? "1" : "0";
        }

        if (zipperFillRef.current) {
          zipperFillRef.current.style.width = `${Math.min(100, st.zipperP * 100)}%`;
        }

        if (zipperSliderRef.current) {
          zipperSliderRef.current.style.left = `calc(${Math.min(100, st.zipperP * 100)}% - 10px)`;
          zipperSliderRef.current.style.opacity =
            st.zipperP > 0 && st.zipperP < 1 ? "1" : st.zipperP >= 1 ? "0.8" : "0";
        }

        if (lockRef.current) {
          lockRef.current.style.opacity = String(st.lockClick);
          lockRef.current.style.transform = `translate(-50%, -50%) translateY(${(1 - st.lockClick) * -120}px) scale(${0.6 + st.lockClick * 0.4})`;
        }

        if (securedRef.current) {
          securedRef.current.style.opacity = String(st.secured);
          securedRef.current.style.transform = `translate(-50%, 0) scale(${0.6 + st.secured * 0.4})`;
        }

        if (securedTextRef.current) {
          securedTextRef.current.style.opacity =
            st.lidClose > 0.7 ? String((st.lidClose - 0.7) / 0.3) : "0";
        }
      },
    }), []);

    // Initial transform
    const initRotY = stateRef.current.rotateY;
    const initRotX = stateRef.current.rotateX;
    const initLidRot = -90 + stateRef.current.lidClose * 90;

    return (
      <div
        ref={rootRef}
        style={{
          position: "relative",
          width,
          height,
          transformStyle: "preserve-3d",
          transform: `rotateY(${initRotY}deg) rotateX(${initRotX}deg)`,
          willChange: "transform",
        }}
      >
        {/* Back panel — base of folder */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(135deg, #D9B370 0%, #B5894A 60%, #8E6730 100%)",
            border: "2px solid #5C3F18",
            borderRadius: 10,
            boxShadow: "inset 0 -8px 18px rgba(0,0,0,0.25), 0 18px 48px -10px rgba(0,0,0,0.55)",
            transform: "translateZ(0px)",
          }}
        >
          {/* Tab */}
          <div
            style={{
              position: "absolute",
              top: -28,
              left: 36,
              width: 130,
              height: 32,
              background: "linear-gradient(135deg, #D9B370 0%, #A87C3F 100%)",
              border: "2px solid #5C3F18",
              borderBottom: "none",
              borderRadius: "10px 10px 0 0",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 14,
              fontWeight: 700,
              color: "#3A2710",
              letterSpacing: "0.16em",
              textAlign: "center",
              lineHeight: "30px",
            }}
          >
            {label.toUpperCase()}
          </div>
          {/* Manila texture lines */}
          <div
            style={{
              position: "absolute",
              inset: 8,
              backgroundImage:
                "repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 4px)",
              borderRadius: 6,
            }}
          />
          {/* Files inside (visible when lid open) */}
          <div
            ref={filesRef}
            style={{
              position: "absolute",
              inset: "22px 30px",
              display: "flex",
              flexDirection: "column",
              gap: 8,
              opacity: 1,
              willChange: "opacity",
            }}
          >
            {["script_runner.py", "jwt_handler.py", "exports.py", "queries.py"].map((f, i) => (
              <div
                key={i}
                style={{
                  background: "rgba(255,255,255,0.92)",
                  border: "1px solid rgba(58,39,16,0.4)",
                  borderRadius: 4,
                  padding: "8px 14px",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 13,
                  color: "#3A2710",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  boxShadow: "0 2px 4px rgba(0,0,0,0.18)",
                }}
              >
                <span
                  style={{
                    width: 14,
                    height: 16,
                    background: "#FFF",
                    border: "1px solid #3A2710",
                    borderRadius: 2,
                    position: "relative",
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      width: 5,
                      height: 5,
                      background: "#3A2710",
                    }}
                  />
                </span>
                {f}
              </div>
            ))}
          </div>
        </div>

        {/* Lid */}
        <div
          ref={lidRef}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: "50%",
            height: "100%",
            transformOrigin: "50% 100%",
            transform: `rotateX(${initLidRot}deg) translateZ(0.5px)`,
            background: "linear-gradient(180deg, #E5C282 0%, #C49858 100%)",
            border: "2px solid #5C3F18",
            borderRadius: "10px 10px 6px 6px",
            backfaceVisibility: "hidden",
            boxShadow: "inset 0 6px 12px rgba(255,255,255,0.18), 0 6px 16px rgba(0,0,0,0.3)",
            willChange: "transform",
          }}
        >
          {/* Lid texture */}
          <div
            style={{
              position: "absolute",
              inset: 8,
              backgroundImage:
                "repeating-linear-gradient(0deg, rgba(0,0,0,0.04) 0px, rgba(0,0,0,0.04) 1px, transparent 1px, transparent 5px)",
              borderRadius: 4,
            }}
          />

          {/* Zipper */}
          <div
            ref={zipperWrapRef}
            style={{
              position: "absolute",
              left: 24,
              right: 24,
              top: 12,
              height: 14,
              opacity: 0,
              willChange: "opacity",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(180deg, #2A2A2E 0%, #4A4A50 50%, #2A2A2E 100%)",
                borderRadius: 2,
                border: "1px solid #1A1A1E",
              }}
            />
            <div
              ref={zipperFillRef}
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: "0%",
                backgroundImage:
                  "repeating-linear-gradient(90deg, #C0C4CA 0px, #C0C4CA 3px, #6E7278 3px, #6E7278 6px)",
                borderRadius: 2,
                boxShadow: "inset 0 0 4px rgba(0,0,0,0.4)",
                willChange: "width",
              }}
            />
            <div
              ref={zipperSliderRef}
              style={{
                position: "absolute",
                left: "-10px",
                top: -3,
                width: 18,
                height: 20,
                background: "linear-gradient(180deg, #E0E2E6 0%, #8A8E94 60%, #4A4E54 100%)",
                border: "1.5px solid #1A1A1E",
                borderRadius: 3,
                boxShadow: "0 2px 4px rgba(0,0,0,0.5)",
                opacity: 0,
                willChange: "left, opacity",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: 5,
                  top: 8,
                  width: 8,
                  height: 8,
                  background: "#1A1A1E",
                  borderRadius: 1,
                }}
              />
            </div>
          </div>

          {/* Center brand emblem on closed lid */}
          <div
            ref={securedTextRef}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 22,
              fontWeight: 700,
              color: "#3A2710",
              letterSpacing: "0.32em",
              opacity: 0,
              willChange: "opacity",
            }}
          >
            SECURED
          </div>
        </div>

        {/* Padlock dropping onto folder */}
        <div
          ref={lockRef}
          style={{
            position: "absolute",
            left: "50%",
            top: "30%",
            transform: "translate(-50%, -50%) translateY(-120px) scale(0.6)",
            opacity: 0,
            zIndex: 5,
            willChange: "transform, opacity",
          }}
        >
          <svg width={70} height={92} viewBox="0 0 70 92">
            <defs>
              <linearGradient id="folder-lock" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFE08A" />
                <stop offset="50%" stopColor="#D9A434" />
                <stop offset="100%" stopColor="#6E5018" />
              </linearGradient>
            </defs>
            <path
              d="M 18 44 V 28 a 17 17 0 0 1 34 0 V 44 h -10 V 28 a 7 7 0 0 0 -14 0 V 44 Z"
              fill="#8A8E94"
              stroke="#1F1F22"
              strokeWidth={1.6}
            />
            <rect x={10} y={40} width={50} height={48} rx={6} fill="url(#folder-lock)" stroke="#1F1F22" strokeWidth={2} />
            <circle cx={35} cy={62} r={5} fill="#1F1F22" />
            <rect x={32.5} y={64} width={5} height={14} fill="#1F1F22" />
          </svg>
        </div>

        {/* SECURED ✓ green pulse */}
        <div
          ref={securedRef}
          style={{
            position: "absolute",
            left: "50%",
            top: "115%",
            transform: "translate(-50%, 0) scale(0.6)",
            opacity: 0,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 22,
            fontWeight: 800,
            color: "#FFF",
            letterSpacing: "0.18em",
            background: "linear-gradient(135deg, #2C8A4A, #1A5D2E)",
            padding: "10px 26px",
            borderRadius: 6,
            boxShadow: "0 0 36px rgba(44,138,74,0.7), 0 8px 22px rgba(0,0,0,0.25)",
            whiteSpace: "nowrap",
            willChange: "opacity, transform",
          }}
        >
          SECURED ✓
        </div>
      </div>
    );
  }
);

CommitFolder.displayName = "CommitFolder";
