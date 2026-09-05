import React from "react";

export const Star = ({ size, color }: { size: number; color: string }) => {
  const rays = [];
  const N = 16;
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2;
    const len = i % 2 === 0 ? 46 : 40;
    rays.push(
      <line
        key={i}
        x1={50 + Math.cos(a) * 10}
        y1={50 + Math.sin(a) * 10}
        x2={50 + Math.cos(a) * len}
        y2={50 + Math.sin(a) * len}
        stroke={color}
        strokeWidth={7.5}
        strokeLinecap="round"
      />,
    );
  }
  return (
    <svg viewBox="0 0 100 100" style={{ width: size, height: size, display: "inline-block" }}>
      {rays}
    </svg>
  );
};

export const CursorSvg = ({ size, white }: { size: number; white?: boolean }) => (
  <svg viewBox="0 0 20 28" style={{ width: size * 0.72, height: size, display: "block" }}>
    <path
      d="M2 1 L2 22 L7.4 17.2 L10.6 25 L14.4 23.4 L11.2 15.8 L18 15.2 Z"
      fill={white ? "#fff" : "#000"}
      stroke={white ? "#111" : "#fff"}
      strokeWidth={white ? "1.8" : "1.4"}
    />
  </svg>
);

export const ArrowUp = ({ size, color }: { size: number; color: string }) => (
  <svg viewBox="0 0 24 24" style={{ width: size, height: size, display: "block" }}>
    <path
      d="M12 20 L12 6 M5.5 12 L12 5.2 L18.5 12"
      stroke={color}
      strokeWidth="2.4"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const WavIcon = ({ size, color }: { size: number; color: string }) => (
  <svg viewBox="0 0 26 20" style={{ width: size * 1.3, height: size, display: "block" }}>
    {[3, 8, 13, 18, 23].map((x, i) => {
      const h = [7, 13, 18, 11, 6][i];
      return (
        <line
          key={i}
          x1={x}
          y1={10 - h / 2}
          x2={x}
          y2={10 + h / 2}
          stroke={color}
          strokeWidth="2.0"
          strokeLinecap="round"
        />
      );
    })}
  </svg>
);

export const PasteIcon = ({ size }: { size: number }) => (
  <svg viewBox="0 0 24 28" style={{ width: size * 0.86, height: size, display: "block" }}>
    <rect x="2" y="6" width="13" height="16" rx="2.5" fill="#ececec" stroke="#8a8a8a" strokeWidth="1.6" />
    <rect x="7" y="2" width="13" height="16" rx="2.5" fill="#f4f4f4" stroke="#8a8a8a" strokeWidth="1.6" />
  </svg>
);

export const CopyIcon = ({ size, color }: { size: number; color: string }) => (
  <svg viewBox="0 0 24 24" style={{ width: size, height: size, display: "block" }}>
    <path d="M16 4.5 L7 4.5 A2.5 2.5 0 0 0 4.5 7 L4.5 16" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" />
    <rect x="8" y="8" width="12" height="12" rx="2.5" fill={color} />
  </svg>
);
