import React from "react";

/**
 * Sandbox3D — a CSS-3D scene revealing the Bookworm phone design as a
 * volumetric object. A central phone slab floats; auxiliary screen plates
 * (Home / Read / Library / Profile) orbit around it. Particles drift in 3D
 * space. The camera angle is controlled by `cameraDeg` (yaw, in degrees).
 *
 * All transforms use `transform-style: preserve-3d` so children compose
 * properly. Tuned to look genuinely 3D, not flat.
 */
export type Sandbox3DProps = {
  cameraDeg: number; // 0..360 yaw rotation of the entire stage
  cameraTilt?: number; // pitch
  zoom?: number; // 1 = normal, >1 = closer
  particleSeed?: number;
  intensity?: number; // 0..1 overall scene opacity (for entry/exit fades)
};

const PARTICLES = 80;

function pseudoRandom(seed: number): number {
  const x = Math.sin(seed * 9999.123) * 43758.5453;
  return x - Math.floor(x);
}

const PhoneScreen: React.FC<{
  bg: string;
  children?: React.ReactNode;
  glow?: string;
  width?: number;
  height?: number;
}> = ({ bg, children, glow = "#7CB342", width = 320, height = 640 }) => (
  <div
    style={{
      width,
      height,
      borderRadius: 36,
      background: bg,
      boxShadow: `0 0 0 8px #111, 0 0 60px ${glow}99, 0 30px 80px rgba(0,0,0,0.6)`,
      overflow: "hidden",
      position: "relative",
      fontFamily: "Inter, sans-serif",
      color: "#1F3B12",
    }}
  >
    {children}
  </div>
);

export const Sandbox3D: React.FC<Sandbox3DProps> = ({
  cameraDeg,
  cameraTilt = -8,
  zoom = 1,
  particleSeed = 1,
  intensity = 1,
}) => {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        perspective: "2000px",
        perspectiveOrigin: "50% 45%",
        opacity: intensity,
        background:
          "radial-gradient(ellipse at center, #0F1A14 0%, #050805 70%, #000 100%)",
        overflow: "hidden",
      }}
    >
      {/* Distant nebula glow */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 1400,
          height: 1400,
          marginLeft: -700,
          marginTop: -700,
          background:
            "radial-gradient(ellipse at center, rgba(124,179,66,0.18) 0%, rgba(31,91,46,0.08) 30%, transparent 60%)",
          filter: "blur(40px)",
          pointerEvents: "none",
        }}
      />

      {/* Floor grid (one-point perspective wireframe) */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "70%",
          width: 4000,
          height: 4000,
          marginLeft: -2000,
          transform: `rotateX(72deg) rotateZ(${cameraDeg * 0.3}deg) scale(${zoom})`,
          transformOrigin: "center top",
          background: `
            linear-gradient(to right, rgba(124,179,66,0.18) 1px, transparent 1px) 0 0 / 80px 80px,
            linear-gradient(to bottom, rgba(124,179,66,0.18) 1px, transparent 1px) 0 0 / 80px 80px
          `,
          maskImage:
            "radial-gradient(ellipse at center top, black 0%, black 30%, transparent 70%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center top, black 0%, black 30%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Stage with preserve-3d — everything inside is a real 3D object */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 0,
          height: 0,
          transformStyle: "preserve-3d",
          transform: `rotateX(${cameraTilt}deg) rotateY(${cameraDeg}deg) scale(${zoom})`,
        }}
      >
        {/* CENTER: the Bookworm phone slab — face forward */}
        <div
          style={{
            position: "absolute",
            left: -160,
            top: -320,
            transformStyle: "preserve-3d",
          }}
        >
          {/* Front face */}
          <div style={{ transform: "translateZ(20px)" }}>
            <PhoneScreen bg="linear-gradient(160deg, #E8F5D8 0%, #C4E18A 100%)">
              <div style={{ padding: "32px 24px 8px", display: "flex", justifyContent: "space-between", fontSize: 16, fontWeight: 600 }}>
                <span>9:41</span>
                <span>● ●●</span>
              </div>
              <div style={{ padding: "8px 24px" }}>
                <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.02em" }}>Hi, Ava</div>
                <div style={{ fontSize: 13, marginTop: 4, color: "rgba(31,59,18,0.7)" }}>Resume reading</div>
              </div>
              <div
                style={{
                  margin: "14px 24px",
                  height: 280,
                  borderRadius: 18,
                  background: "repeating-conic-gradient(#F9C5D5 0 25%, #C8E6A0 0 50%) 0 0/30px 30px",
                  boxShadow: "0 12px 28px rgba(0,0,0,0.25)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  padding: "26px 0",
                  alignItems: "center",
                  color: "#5B2A3A",
                  fontWeight: 800,
                  fontSize: 26,
                  letterSpacing: "0.3em",
                }}
              >
                <span>SPLIT</span>
                <span style={{ fontSize: 12, opacity: 0.9, lineHeight: 1.2 }}>NATASHA<br />RUIZ</span>
              </div>
              <div style={{ padding: "8px 24px", display: "flex", gap: 8 }}>
                <div style={{ flex: 1, padding: "10px 0", textAlign: "center", border: "1.5px solid #7CB342", borderRadius: 999, fontWeight: 600, fontSize: 13, background: "#fff", color: "#1F5B2E" }}>+ Library</div>
                <div style={{ flex: 1, padding: "10px 0", textAlign: "center", background: "#7CB342", borderRadius: 999, fontWeight: 600, fontSize: 13, color: "#fff" }}>✓ Read</div>
              </div>
              <div style={{ padding: "14px 24px 0" }}>
                <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.02em" }}>SPLIT</div>
                <div style={{ fontSize: 13, color: "rgba(31,59,18,0.7)" }}>Natasha Ruiz</div>
              </div>
            </PhoneScreen>
          </div>
          {/* Edge slab back face (gives volume) */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              width: 320,
              height: 640,
              borderRadius: 36,
              background: "#1A1A1A",
              transform: "translateZ(-20px)",
              boxShadow: "0 0 40px rgba(124,179,66,0.3)",
            }}
          />
          {/* Side strips for slab edges */}
          {[
            { side: "top", t: "rotateX(90deg) translateZ(320px)", w: 320, h: 40 },
            { side: "bottom", t: "rotateX(-90deg) translateZ(320px)", w: 320, h: 40 },
            { side: "left", t: "rotateY(-90deg) translateZ(0px)", w: 40, h: 640 },
            { side: "right", t: "rotateY(90deg) translateZ(320px)", w: 40, h: 640 },
          ].map((s) => (
            <div
              key={s.side}
              style={{
                position: "absolute",
                left: s.side === "left" ? -20 : s.side === "right" ? 0 : 0,
                top: s.side === "top" ? -20 : s.side === "bottom" ? 600 : 0,
                width: s.w,
                height: s.h,
                background: "linear-gradient(180deg, #2A2A2A, #0E0E0E)",
                transform: s.t,
                transformOrigin: "0 0",
                borderRadius: 4,
              }}
            />
          ))}
        </div>

        {/* ORBITING screens — Home/Read/Library/Profile floating around */}
        {[
          { label: "Home", angle: -55, dist: 520, ty: -120, bg: "linear-gradient(160deg, #F1F8E4 0%, #E0F0C0 100%)", glow: "#A8DA8F" },
          { label: "Read", angle: -25, dist: 600, ty: 80, bg: "linear-gradient(160deg, #2E7D32 0%, #1F5B2E 100%)", glow: "#7CB342", dark: true },
          { label: "Library", angle: 35, dist: 560, ty: -60, bg: "linear-gradient(160deg, #C8E6C9 0%, #A5D6A7 100%)", glow: "#7CB342" },
          { label: "Profile", angle: 65, dist: 540, ty: 130, bg: "linear-gradient(160deg, #E8F5D8 0%, #C4E18A 100%)", glow: "#A8DA8F" },
        ].map((p, i) => {
          const rad = (p.angle * Math.PI) / 180;
          const tx = Math.sin(rad) * p.dist;
          const tz = -Math.abs(Math.cos(rad)) * p.dist * 0.6 - 100;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: -120,
                top: -240,
                transform: `translate3d(${tx}px, ${p.ty}px, ${tz}px) rotateY(${-p.angle * 0.4}deg)`,
                transformStyle: "preserve-3d",
                opacity: 0.92,
              }}
            >
              <PhoneScreen bg={p.bg} glow={p.glow} width={240} height={480}>
                <div style={{ padding: "22px 18px 4px", display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 600, color: p.dark ? "rgba(255,255,255,0.8)" : "rgba(31,59,18,0.7)" }}>
                  <span>9:41</span>
                  <span>● ●●</span>
                </div>
                <div style={{ padding: "6px 18px", color: p.dark ? "#fff" : "#1F3B12" }}>
                  <div style={{ fontSize: 18, fontWeight: 700 }}>{p.label}</div>
                </div>
                {p.label === "Read" && (
                  <div style={{ padding: "10px 18px", color: "#fff" }}>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>SPLIT</div>
                    <div style={{ fontSize: 11, opacity: 0.7 }}>Page 145 / 392</div>
                    <div style={{ marginTop: 12, height: 6, background: "rgba(255,255,255,0.18)", borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ width: "62%", height: "100%", background: "#A8DA8F" }} />
                    </div>
                    <div style={{ marginTop: 22, fontSize: 12, lineHeight: 1.5, opacity: 0.85 }}>
                      The light came in slow that morning. She didn't move for a long while…
                    </div>
                  </div>
                )}
                {p.label === "Library" && (
                  <div style={{ padding: "12px 18px", display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {["Fiction", "Mystery", "Sci-fi", "Bio"].map((l, j) => (
                      <div key={j} style={{ background: j % 2 === 0 ? "#A8DA8F" : "rgba(31,59,18,0.1)", color: "#1F3B12", padding: "5px 10px", borderRadius: 999, fontSize: 11, fontWeight: 600 }}>{l}</div>
                    ))}
                    <div style={{ marginTop: 12, width: 80, height: 110, borderRadius: 6, background: "repeating-conic-gradient(#F9C5D5 0 25%, #C8E6A0 0 50%) 0 0/18px 18px", boxShadow: "0 3px 8px rgba(0,0,0,0.18)" }} />
                  </div>
                )}
                {p.label === "Profile" && (
                  <div style={{ padding: "16px 18px" }}>
                    <div style={{ width: 60, height: 60, borderRadius: "50%", background: "#1F5B2E", margin: "0 auto" }} />
                    <div style={{ textAlign: "center", marginTop: 10, fontSize: 14, fontWeight: 700, color: "#1F3B12" }}>Ava Wong</div>
                    <div style={{ textAlign: "center", fontSize: 11, color: "rgba(31,59,18,0.6)" }}>Streak · 4 days</div>
                    <div style={{ display: "flex", justifyContent: "space-around", marginTop: 18, fontSize: 11, color: "rgba(31,59,18,0.7)" }}>
                      <span>32 read</span>
                      <span>11 saved</span>
                    </div>
                  </div>
                )}
                {p.label === "Home" && (
                  <div style={{ padding: "10px 18px" }}>
                    <div style={{ width: "100%", height: 120, borderRadius: 12, background: "repeating-conic-gradient(#F9C5D5 0 25%, #C8E6A0 0 50%) 0 0/22px 22px" }} />
                    <div style={{ marginTop: 12, fontSize: 13, fontWeight: 700, color: "#1F3B12" }}>Continue reading</div>
                    <div style={{ fontSize: 11, color: "rgba(31,59,18,0.6)" }}>62% · Natasha Ruiz</div>
                  </div>
                )}
                {/* Floating label */}
                <div
                  style={{
                    position: "absolute",
                    bottom: -42,
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "rgba(0,0,0,0.7)",
                    color: "#A8DA8F",
                    padding: "4px 10px",
                    borderRadius: 6,
                    fontSize: 11,
                    fontWeight: 600,
                    fontFamily: "Inter, sans-serif",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    whiteSpace: "nowrap",
                    border: "1px solid rgba(124,179,66,0.4)",
                  }}
                >
                  {p.label}.tsx
                </div>
              </PhoneScreen>
            </div>
          );
        })}

        {/* Wireframe halo around center phone — a 3D bounding box for that "this is a 3D object" feel */}
        {[-340, 340].map((zPos, i) => (
          <div
            key={`bbz${i}`}
            style={{
              position: "absolute",
              left: -200,
              top: -360,
              width: 400,
              height: 720,
              border: "1px dashed rgba(124,179,66,0.45)",
              transform: `translateZ(${zPos}px)`,
              borderRadius: 12,
              boxShadow: "inset 0 0 30px rgba(124,179,66,0.2)",
            }}
          />
        ))}

        {/* Particles in 3D space */}
        {Array.from({ length: PARTICLES }).map((_, i) => {
          const r1 = pseudoRandom(i + particleSeed);
          const r2 = pseudoRandom(i * 2.7 + particleSeed);
          const r3 = pseudoRandom(i * 3.9 + particleSeed);
          const tx = (r1 - 0.5) * 1800;
          const ty = (r2 - 0.5) * 1000;
          const tz = (r3 - 0.5) * 1200;
          const size = 2 + r1 * 4;
          const isGreen = r2 > 0.5;
          return (
            <div
              key={`p${i}`}
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: size,
                height: size,
                borderRadius: "50%",
                background: isGreen ? "#A8DA8F" : "#FFFFFF",
                boxShadow: `0 0 ${size * 3}px ${isGreen ? "#A8DA8F" : "#fff"}`,
                transform: `translate3d(${tx}px, ${ty}px, ${tz}px)`,
                opacity: 0.3 + r3 * 0.5,
              }}
            />
          );
        })}
      </div>

      {/* Foreground vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)",
          pointerEvents: "none",
          mixBlendMode: "multiply",
        }}
      />

      {/* Hint chip */}
      <div
        style={{
          position: "absolute",
          left: 64,
          bottom: 64,
          background: "rgba(255,255,255,0.07)",
          border: "1px solid rgba(168,218,143,0.35)",
          color: "#A8DA8F",
          padding: "10px 18px",
          borderRadius: 8,
          fontFamily: "Inter, sans-serif",
          fontSize: 14,
          fontWeight: 600,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          backdropFilter: "blur(8px)",
          boxShadow: "0 0 30px rgba(124,179,66,0.3)",
        }}
      >
        3D Sandbox · Bookworm
      </div>
      <div
        style={{
          position: "absolute",
          right: 64,
          bottom: 64,
          color: "rgba(255,255,255,0.5)",
          fontFamily: "Inter, sans-serif",
          fontSize: 12,
          fontWeight: 500,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          textAlign: "right",
        }}
      >
        room to explore
        <div style={{ color: "#A8DA8F", fontSize: 20, fontWeight: 700, letterSpacing: "-0.01em", textTransform: "none", marginTop: 4 }}>
          your design, alive
        </div>
      </div>
    </div>
  );
};

export default Sandbox3D;
