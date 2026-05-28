import React from "react";

export type BookwormVariant = {
  title: string;
  author: string;
  pct: number; // 0..1
  page: number;
  total: number;
  tone?: "lime" | "deepGreen" | "limeLight" | "mint";
  layout?: "hero" | "progress" | "streak" | "chart" | "shelf" | "cover";
};

/**
 * Bookworm reading-app mockup card. Single component, instanced ~8 times in
 * the grid with different titles/authors/% progress + tone variations.
 *
 * Sized to fit inside a 280×420 card slot by default but `scale` adjusts.
 */
export const BookwormCard: React.FC<{
  v: BookwormVariant;
  width?: number;
  height?: number;
  rounded?: number;
}> = ({ v, width = 280, height = 420, rounded = 22 }) => {
  const tone = v.tone ?? "lime";
  const bg =
    tone === "deepGreen"
      ? "linear-gradient(160deg, #2E7D32 0%, #1F5B2E 100%)"
      : tone === "limeLight"
      ? "linear-gradient(160deg, #F1F8E4 0%, #E0F0C0 100%)"
      : tone === "mint"
      ? "linear-gradient(160deg, #C8E6C9 0%, #A5D6A7 100%)"
      : "linear-gradient(160deg, #E8F5D8 0%, #C4E18A 100%)";

  const isDark = tone === "deepGreen";
  const text = isDark ? "#FFFFFF" : "#1F3B12";
  const textDim = isDark ? "rgba(255,255,255,0.75)" : "rgba(31,59,18,0.7)";
  const layout = v.layout ?? "hero";

  return (
    <div
      style={{
        width,
        height,
        borderRadius: rounded,
        background: bg,
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 8px 24px rgba(0,0,0,0.25), 0 1px 0 rgba(255,255,255,0.06) inset",
        fontFamily: "Inter, sans-serif",
        color: text,
      }}
    >
      {/* iOS status bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "14px 22px 6px 22px",
          fontSize: 13,
          fontWeight: 600,
          color: textDim,
        }}
      >
        <span>9:41</span>
        <span style={{ letterSpacing: 1 }}>● ●●</span>
      </div>

      {layout === "hero" && (
        <div style={{ padding: "8px 18px" }}>
          <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.02em" }}>Hi, Ava</div>
          <div
            style={{
              marginTop: 16,
              padding: 14,
              borderRadius: 14,
              background: isDark ? "rgba(255,255,255,0.08)" : "rgba(31,59,18,0.07)",
              border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(31,59,18,0.08)",
            }}
          >
            <div style={{ fontSize: 18, fontWeight: 700 }}>{v.title}</div>
            <div style={{ fontSize: 12, color: textDim, marginTop: 2 }}>{v.author}</div>
            <div style={{ marginTop: 12, height: 6, background: isDark ? "rgba(255,255,255,0.15)" : "rgba(31,59,18,0.12)", borderRadius: 3, overflow: "hidden" }}>
              <div style={{ width: `${v.pct * 100}%`, height: "100%", background: isDark ? "#A8DA8F" : "#7CB342" }} />
            </div>
            <div style={{ fontSize: 10, color: textDim, marginTop: 6 }}>
              Page {v.page}/{v.total} · {Math.round(v.pct * 100)}%
            </div>
          </div>
          <BookCover small style={{ marginTop: 14 }} />
        </div>
      )}

      {layout === "progress" && (
        <div style={{ padding: "8px 18px" }}>
          <div style={{ fontSize: 22, fontWeight: 700 }}>{v.title}</div>
          <div style={{ fontSize: 12, color: textDim }}>{v.author}</div>
          <div style={{ marginTop: 18 }}>
            <DonutProgress pct={v.pct} dark={isDark} />
          </div>
          <div style={{ marginTop: 18, fontSize: 12, color: textDim }}>Chapter 3 of 8 · {v.page}/{v.total}</div>
        </div>
      )}

      {layout === "streak" && (
        <div style={{ padding: "8px 18px" }}>
          <div style={{ fontSize: 20, fontWeight: 700 }}>Reading streak</div>
          <div style={{ fontSize: 12, color: textDim, marginTop: 2 }}>{v.title}</div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 22, fontSize: 11, color: textDim }}>
            {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
              <span key={i}>{d}</span>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
            {[1, 2, 3, 4, 5, 6, 7].map((i) => {
              const filled = i <= 4;
              return (
                <div
                  key={i}
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    background: filled ? (isDark ? "#A8DA8F" : "#1F5B2E") : "transparent",
                    border: `2px dashed ${filled ? "transparent" : textDim}`,
                  }}
                />
              );
            })}
          </div>
          <div style={{ fontSize: 10, color: textDim, marginTop: 14, textAlign: "center" }}>Extend your streak — read 30 min</div>
        </div>
      )}

      {layout === "chart" && (
        <div style={{ padding: "8px 18px" }}>
          <div style={{ fontSize: 20, fontWeight: 700 }}>This week</div>
          <div style={{ fontSize: 12, color: textDim, marginTop: 2 }}>{v.title}</div>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginTop: 24, height: 110, gap: 6 }}>
            {[0.4, 0.7, 0.5, 0.9, 0.6, 0.3, 0.8].map((h, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: `${h * 100}%`,
                  background: isDark ? "#A8DA8F" : "#1F5B2E",
                  borderRadius: 4,
                  opacity: 0.9,
                }}
              />
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 10, color: textDim }}>
            {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => <span key={i}>{d}</span>)}
          </div>
        </div>
      )}

      {layout === "shelf" && (
        <div style={{ padding: "8px 18px" }}>
          <div style={{ fontSize: 20, fontWeight: 700 }}>Your shelves</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 14 }}>
            {[
              { l: "Fiction", n: 12, hi: true },
              { l: "Mystery", n: 32, hi: false },
              { l: "Romance", n: 17, hi: false },
              { l: "Sci-fi", n: 11, hi: true },
              { l: "Biography", n: 6, hi: false },
            ].map((p, i) => (
              <div
                key={i}
                style={{
                  background: p.hi ? "#A8DA8F" : isDark ? "rgba(255,255,255,0.1)" : "rgba(31,59,18,0.1)",
                  color: p.hi ? "#1F3B12" : text,
                  padding: "6px 12px",
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                {p.l} <span style={{ opacity: 0.6, marginLeft: 4 }}>{p.n}</span>
              </div>
            ))}
          </div>
          <BookCover small style={{ marginTop: 16 }} />
        </div>
      )}

      {layout === "cover" && (
        <div style={{ padding: "8px 18px" }}>
          <BookCover />
          <div style={{ marginTop: 14, fontSize: 22, fontWeight: 700, letterSpacing: "-0.01em" }}>{v.title}</div>
          <div style={{ fontSize: 12, color: textDim }}>{v.author}</div>
          <div style={{ display: "flex", gap: 6, marginTop: 12, flexWrap: "wrap" }}>
            <Pill label="Non-fiction" color="#E91E63" textColor="#fff" />
            <Pill label="Sociology" color={isDark ? "#A8DA8F" : "#1F5B2E"} textColor={isDark ? "#1F3B12" : "#fff"} />
            <Pill label="App" color={isDark ? "rgba(255,255,255,0.15)" : "rgba(31,59,18,0.12)"} textColor={text} />
          </div>
        </div>
      )}

      {/* Bottom nav dots */}
      <div
        style={{
          position: "absolute",
          bottom: 14,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          gap: 18,
          opacity: 0.55,
        }}
      >
        <NavIcon path="M3 11l9-8 9 8v10a2 2 0 0 1-2 2h-4v-7h-6v7H5a2 2 0 0 1-2-2z" color={text} />
        <NavIcon path="M11 4a7 7 0 1 1-4.95 11.95l-3.78 3.78-1.41-1.41 3.78-3.78A7 7 0 0 1 11 4z" color={text} />
        <NavIcon path="M4 4h10a4 4 0 0 1 4 4v12H8a4 4 0 0 1-4-4z" color={text} />
      </div>
    </div>
  );
};

const NavIcon: React.FC<{ path: string; color: string }> = ({ path, color }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d={path} stroke={color} strokeWidth="1.6" fill="none" />
  </svg>
);

const Pill: React.FC<{ label: string; color: string; textColor: string }> = ({ label, color, textColor }) => (
  <div
    style={{
      background: color,
      color: textColor,
      padding: "5px 11px",
      borderRadius: 999,
      fontSize: 11,
      fontWeight: 600,
    }}
  >
    {label}
  </div>
);

const BookCover: React.FC<{ small?: boolean; style?: React.CSSProperties }> = ({ small, style }) => {
  const size = small ? 70 : 130;
  // pink/green checker cover with SPLIT type
  return (
    <div
      style={{
        width: size,
        height: size * 1.3,
        borderRadius: 6,
        background:
          "repeating-conic-gradient(#F9C5D5 0 25%, #C8E6A0 0 50%) 0 0/22px 22px",
        position: "relative",
        boxShadow: "0 3px 8px rgba(0,0,0,0.18)",
        overflow: "hidden",
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "10% 0",
          alignItems: "center",
          color: "#5B2A3A",
          fontFamily: "Inter, serif",
          fontWeight: 800,
          fontSize: size * 0.13,
          letterSpacing: "0.3em",
        }}
      >
        <span>SPLIT</span>
        <span style={{ fontSize: size * 0.08, opacity: 0.85 }}>NATASHA<br />RUIZ</span>
      </div>
    </div>
  );
};

const DonutProgress: React.FC<{ pct: number; dark: boolean }> = ({ pct, dark }) => {
  const r = 38;
  const c = 2 * Math.PI * r;
  return (
    <svg width="110" height="110" viewBox="0 0 110 110">
      <circle cx="55" cy="55" r={r} fill="none" stroke={dark ? "rgba(255,255,255,0.18)" : "rgba(31,59,18,0.15)"} strokeWidth="10" />
      <circle
        cx="55"
        cy="55"
        r={r}
        fill="none"
        stroke={dark ? "#A8DA8F" : "#1F5B2E"}
        strokeWidth="10"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - pct)}
        strokeLinecap="round"
        transform="rotate(-90 55 55)"
      />
      <text x="55" y="62" textAnchor="middle" fontSize="20" fontWeight="700" fill={dark ? "#fff" : "#1F3B12"}>
        {Math.round(pct * 100)}%
      </text>
    </svg>
  );
};
