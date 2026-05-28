import React from "react";

const stroke = "#42526E";

export const IconJira: React.FC<{ size?: number }> = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="6" fill="#2684FF" />
    <path
      d="M16 5l5.6 5.6a3.5 3.5 0 010 5L16 21.2l-5.6-5.6a3.5 3.5 0 010-5L16 5z"
      fill="#fff"
    />
    <path
      d="M16 10.5l5.6 5.6a3.5 3.5 0 010 5L16 26.7l-5.6-5.6a3.5 3.5 0 010-5L16 10.5z"
      fill="#fff"
      opacity="0.85"
    />
  </svg>
);

export const IconCursor: React.FC<{ size?: number }> = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 2L21 7v10l-9 5-9-5V7l9-5z" fill="#0B0B0B" />
    <path d="M12 2L21 7l-9 5-9-5 9-5z" fill="#1A1A1A" />
    <path d="M12 12L21 7v10l-9 5V12z" fill="#000" opacity="0.6" />
  </svg>
);

export const IconSpark: React.FC<{ size?: number; color?: string }> = ({ size = 14, color = "#42526E" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 2l1.8 5.4L19 9l-5.2 1.6L12 16l-1.8-5.4L5 9l5.2-1.6L12 2z" fill={color} />
    <path d="M19 14l.9 2.7L22 17l-2.1.6L19 20l-.9-2.4L16 17l2.1-.6L19 14z" fill={color} opacity="0.7" />
  </svg>
);

const IconBox: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      width: 28,
      height: 28,
      borderRadius: 4,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: stroke,
    }}
  >
    {children}
  </div>
);

export const IconBold = () => (
  <IconBox>
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M7 4h7a4 4 0 010 8H7V4z M7 12h8a4 4 0 010 8H7v-8z" stroke={stroke} strokeWidth="2" strokeLinejoin="round" />
    </svg>
  </IconBox>
);

export const IconUnderline = () => (
  <IconBox>
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M6 4v8a6 6 0 0012 0V4 M5 20h14" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
    </svg>
  </IconBox>
);

export const IconTextSize = () => (
  <IconBox>
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M4 6h10 M9 6v14 M14 12h6 M17 12v8" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
    </svg>
  </IconBox>
);

export const IconBullet = () => (
  <IconBox>
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="5" cy="7" r="1.5" fill={stroke} />
      <circle cx="5" cy="12" r="1.5" fill={stroke} />
      <circle cx="5" cy="17" r="1.5" fill={stroke} />
      <path d="M10 7h11 M10 12h11 M10 17h11" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
    </svg>
  </IconBox>
);

export const IconColor = () => (
  <IconBox>
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M5 18h14" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M8 15L12 5l4 10 M9.5 12h5" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </IconBox>
);

export const IconImage = () => (
  <IconBox>
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke={stroke} strokeWidth="2" />
      <circle cx="9" cy="10" r="1.5" fill={stroke} />
      <path d="M21 16l-5-5-8 8" stroke={stroke} strokeWidth="2" strokeLinejoin="round" />
    </svg>
  </IconBox>
);

export const IconCode = () => (
  <IconBox>
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M9 7l-5 5 5 5 M15 7l5 5-5 5" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </IconBox>
);

export const IconEmoji = () => (
  <IconBox>
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke={stroke} strokeWidth="2" />
      <circle cx="9" cy="10" r="1" fill={stroke} />
      <circle cx="15" cy="10" r="1" fill={stroke} />
      <path d="M8 14c1 2 2.5 3 4 3s3-1 4-3" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
    </svg>
  </IconBox>
);

export const IconPlus = () => (
  <IconBox>
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M12 5v14 M5 12h14" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
    </svg>
  </IconBox>
);

export const IconLink = () => (
  <IconBox>
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M10 14a4 4 0 005.6 0l3-3a4 4 0 00-5.6-5.6l-1 1 M14 10a4 4 0 00-5.6 0l-3 3a4 4 0 005.6 5.6l1-1" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
    </svg>
  </IconBox>
);

export const IconUndo = () => (
  <IconBox>
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M9 10H5V6 M5 10a8 8 0 1112 7" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </IconBox>
);

export const IconRedo = () => (
  <IconBox>
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M15 10h4V6 M19 10a8 8 0 10-12 7" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </IconBox>
);

export const IconClock = () => (
  <IconBox>
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke={stroke} strokeWidth="2" />
      <path d="M12 7v5l3 2" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
    </svg>
  </IconBox>
);

export const IconMore = () => (
  <IconBox>
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="6" cy="12" r="1.5" fill={stroke} />
      <circle cx="12" cy="12" r="1.5" fill={stroke} />
      <circle cx="18" cy="12" r="1.5" fill={stroke} />
    </svg>
  </IconBox>
);

export const IconStop: React.FC<{ size?: number }> = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" fill="#FFEBE6" />
    <rect x="8" y="8" width="8" height="8" rx="1.5" fill="#DE350B" />
  </svg>
);

export const IconEyeOff: React.FC<{ size?: number; color?: string }> = ({ size = 14, color = "#6B778C" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M3 3l18 18 M10.6 6.1A10 10 0 0121 12s-1.5 2.5-4 4.3 M6.6 6.6C4.1 8.4 3 12 3 12a10 10 0 0011 5.3" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M9.5 9.5a3 3 0 004.2 4.2" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// Cursor logo as it appears in the toolbar (small round colored hex)
export const IconCursorRound: React.FC<{ size?: number }> = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="curRoundG" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#5B5BFF" />
        <stop offset="50%" stopColor="#9B59FF" />
        <stop offset="100%" stopColor="#5BD0FF" />
      </linearGradient>
    </defs>
    <path d="M12 2L21 7v10l-9 5-9-5V7l9-5z" fill="url(#curRoundG)" />
    <path d="M12 2L21 7l-9 5L3 7l9-5z" fill="#fff" opacity="0.95" />
    <path d="M12 12L21 7v10l-9 5V12z" fill="#000" opacity="0.18" />
  </svg>
);

// Magic wand icon for "Improve writing" button
export const IconWand: React.FC<{ size?: number; color?: string }> = ({ size = 14, color = "#42526E" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M5 20L17 8 M14 5l1.5 1.5 M19 10l1.5 1.5 M20 4l-1 1 M4 14l-1 1" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <circle cx="17" cy="8" r="2" fill={color} opacity="0.15" />
    <path d="M14.6 7.5l1.4 1.4 M16.7 5.4l1.4 1.4" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// Tiny down-chevron used after Cursor logo / B / bullet list
export const IconChevDown: React.FC<{ size?: number; color?: string }> = ({ size = 10, color = "#6B778C" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M6 9l6 6 6-6" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Isometric Cursor cube (for logo card and agent strip).
// The cursor "notch" is the inverse of the cube fill so it reads clearly
// on either black or white backgrounds.
export const IconCursorCube: React.FC<{
  size?: number;
  color?: string;
  notch?: string;
}> = ({ size = 24, color = "#0B0B0B", notch = "#FFFFFF" }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    {/* Top face */}
    <path d="M32 4 L58 17 L32 30 L6 17 Z" fill={color} />
    {/* Left face */}
    <path d="M6 17 L32 30 L32 60 L6 47 Z" fill={color} opacity="0.85" />
    {/* Right face */}
    <path d="M58 17 L32 30 L32 60 L58 47 Z" fill={color} opacity="0.65" />
    {/* Inner triangle (the cursor notch) — punched downward from top */}
    <path d="M32 30 L48 22 L32 50 Z" fill={notch} />
    {/* Subtle edge highlight */}
    <path d="M32 4 L58 17 L32 30 L6 17 Z" fill="none" stroke={color} strokeWidth="0.5" />
  </svg>
);
