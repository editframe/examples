import React from "react";

/**
 * Heavy iron padlock — body + shackle. Solid SVG fills (no gradients) for
 * bulletproof rendering — multiple Padlocks can mount without any ID
 * collision issues.
 */

interface Props {
  size?: number;
  state?: "locked" | "unlocked";
  bodyColor?: string;
  bodyShadow?: string;
  bodyHighlight?: string;
  shackleColor?: string;
  glow?: number;
  shackleOpen?: number;
  bodyCrack?: number;
  rotation?: number;
  label?: string;
  labelColor?: string;
  style?: React.CSSProperties;
  id?: string;
}

export const Padlock: React.FC<Props> = ({
  size = 160,
  state = "locked",
  bodyColor,
  bodyShadow,
  bodyHighlight,
  shackleColor = "#7E848B",
  glow = 0,
  shackleOpen = 0,
  bodyCrack = 0,
  rotation = 0,
  label,
  labelColor,
  style,
}) => {
  const isLocked = state === "locked";
  const _body = bodyColor ?? (isLocked ? "#D02A2A" : "#2C8A4A");
  const _shadow = bodyShadow ?? (isLocked ? "#6E1212" : "#114A1F");
  const _highlight = bodyHighlight ?? (isLocked ? "#FF7A7A" : "#7FD49A");
  const _label = labelColor ?? "#FFF";

  const W = size;
  const H = size * 1.4;
  const bodyW = W * 0.86;
  const bodyH = H * 0.62;
  const bodyX = (W - bodyW) / 2;
  const bodyY = H - bodyH - 2;
  const r = bodyW * 0.12;

  const shackleW = bodyW * 0.62;
  const shackleX = (W - shackleW) / 2;
  const shackleH = H - bodyH;
  const shackleTopR = shackleW / 2;
  const shackleTh = shackleW * 0.22;

  const splitOffset = bodyCrack * (bodyW * 0.4);
  const splitRot = bodyCrack * 14;

  // Top-third highlight band, bottom-third shadow band — simulates gradient
  return (
    <svg
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      style={{ overflow: "visible", transform: `rotate(${rotation}deg)`, ...style }}
    >
      {/* Outer glow */}
      {glow > 0.01 && (
        <ellipse
          cx={W / 2}
          cy={H / 2 + 10}
          rx={W * 0.85 * (1 + glow * 0.3)}
          ry={H * 0.55 * (1 + glow * 0.3)}
          fill={_body}
          opacity={glow * 0.55}
        />
      )}

      {/* Shackle — solid metallic gray */}
      <g transform={`translate(0 ${-shackleOpen * shackleH * 0.55})`}>
        <path
          d={`
            M ${shackleX} ${bodyY + 8}
            L ${shackleX} ${bodyY - shackleH + shackleTopR}
            A ${shackleTopR} ${shackleTopR} 0 0 1 ${shackleX + shackleW} ${bodyY - shackleH + shackleTopR}
            L ${shackleX + shackleW} ${bodyY + 8}
            L ${shackleX + shackleW - shackleTh} ${bodyY + 8}
            L ${shackleX + shackleW - shackleTh} ${bodyY - shackleH + shackleTopR + shackleTh / 2}
            A ${shackleTopR - shackleTh} ${shackleTopR - shackleTh} 0 0 0 ${shackleX + shackleTh} ${bodyY - shackleH + shackleTopR + shackleTh / 2}
            L ${shackleX + shackleTh} ${bodyY + 8}
            Z
          `}
          fill={shackleColor}
          stroke="#1F1F22"
          strokeWidth={1.4}
        />
        {/* Inner-shadow rim on shackle */}
        <path
          d={`M ${shackleX + 2} ${bodyY + 6} L ${shackleX + 2} ${bodyY - shackleH + shackleTopR}`}
          stroke="#3A3E45"
          strokeWidth={2}
          fill="none"
        />
        {/* Highlight on shackle */}
        <path
          d={`M ${shackleX + shackleTh - 2} ${bodyY + 6} L ${shackleX + shackleTh - 2} ${bodyY - shackleH + shackleTopR + shackleTh}`}
          stroke="#D6DAE0"
          strokeWidth={2}
          fill="none"
          opacity={0.7}
        />
      </g>

      {/* LEFT HALF body */}
      <g
        transform={`translate(${-splitOffset / 2} 0) rotate(${-splitRot} ${bodyX + bodyW * 0.25} ${bodyY + bodyH / 2})`}
      >
        <rect
          x={bodyX}
          y={bodyY}
          width={bodyW / 2 + 1}
          height={bodyH}
          fill={_body}
        />
        {/* highlight band */}
        <rect
          x={bodyX}
          y={bodyY}
          width={bodyW / 2 + 1}
          height={bodyH * 0.28}
          fill={_highlight}
          opacity={0.5}
        />
        {/* shadow band */}
        <rect
          x={bodyX}
          y={bodyY + bodyH * 0.72}
          width={bodyW / 2 + 1}
          height={bodyH * 0.28}
          fill={_shadow}
          opacity={0.55}
        />
        {/* left half keyhole */}
        <path
          d={`M ${W / 2 - bodyW * 0.085} ${bodyY + bodyH * 0.42}
              a ${bodyW * 0.085} ${bodyW * 0.085} 0 0 1 ${bodyW * 0.085} ${0}
              L ${W / 2} ${bodyY + bodyH * 0.42 + bodyH * 0.32}
              L ${W / 2 - bodyW * 0.04} ${bodyY + bodyH * 0.42 + bodyH * 0.32}
              Z`}
          fill="#0E0F11"
        />
      </g>

      {/* RIGHT HALF body */}
      <g
        transform={`translate(${splitOffset / 2} 0) rotate(${splitRot} ${bodyX + bodyW * 0.75} ${bodyY + bodyH / 2})`}
      >
        <rect
          x={W / 2 - 1}
          y={bodyY}
          width={bodyW / 2 + 1}
          height={bodyH}
          fill={_body}
        />
        <rect
          x={W / 2 - 1}
          y={bodyY}
          width={bodyW / 2 + 1}
          height={bodyH * 0.28}
          fill={_highlight}
          opacity={0.5}
        />
        <rect
          x={W / 2 - 1}
          y={bodyY + bodyH * 0.72}
          width={bodyW / 2 + 1}
          height={bodyH * 0.28}
          fill={_shadow}
          opacity={0.55}
        />
        <path
          d={`M ${W / 2} ${bodyY + bodyH * 0.42}
              a ${bodyW * 0.085} ${bodyW * 0.085} 0 0 1 ${bodyW * 0.085} ${0}
              L ${W / 2 + bodyW * 0.04} ${bodyY + bodyH * 0.42 + bodyH * 0.32}
              L ${W / 2} ${bodyY + bodyH * 0.42 + bodyH * 0.32}
              Z`}
          fill="#0E0F11"
        />
      </g>

      {/* Outer rounded outline */}
      <rect
        x={bodyX}
        y={bodyY}
        width={bodyW}
        height={bodyH}
        rx={r}
        fill="none"
        stroke="#1F1F22"
        strokeWidth={2.4}
      />

      {/* Crack line when bodyCrack > 0 */}
      {bodyCrack > 0.02 && (
        <path
          d={`M ${W / 2} ${bodyY} L ${W / 2 - 4} ${bodyY + bodyH * 0.2} L ${W / 2 + 4} ${bodyY + bodyH * 0.45} L ${W / 2 - 4} ${bodyY + bodyH * 0.7} L ${W / 2} ${bodyY + bodyH}`}
          stroke="#0E0F11"
          strokeWidth={2 + bodyCrack * 3}
          fill="none"
          opacity={bodyCrack}
        />
      )}

      {/* Label */}
      {label && (
        <g transform={`translate(${W / 2} ${bodyY + bodyH + 22})`}>
          <rect
            x={-bodyW * 0.55}
            y={-13}
            width={bodyW * 1.1}
            height={26}
            rx={4}
            fill="#0E0F11"
            stroke={_body}
            strokeWidth={1.6}
          />
          <text
            x={0}
            y={5}
            textAnchor="middle"
            fontFamily="'JetBrains Mono', monospace"
            fontSize={12}
            fontWeight={700}
            fill={_label}
            style={{ letterSpacing: "0.08em" }}
          >
            {label}
          </text>
        </g>
      )}
    </svg>
  );
};
