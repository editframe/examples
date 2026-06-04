import React from "react";

type OpenClawMarkProps = {
  className?: string;
  label?: string;
  contrast?: boolean;
};

export function OpenClawMark({ className, label = "OpenClaw", contrast = false }: OpenClawMarkProps) {
  const gradientId = `openclaw-gradient-${label.replace(/[^a-z0-9]/gi, "").toLowerCase()}`;
  const gradientStart = contrast ? "#ff7079" : "#ff4d4d";
  const gradientEnd = contrast ? "#e63946" : "#991b1b";
  const bodyFill = contrast ? "#ff4d4d" : "#e63946";

  return (
    <svg
      className={className}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label={label}
      role="img"
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={gradientStart} />
          <stop offset="100%" stopColor={gradientEnd} />
        </linearGradient>
      </defs>
      <path
        d="M60 10 C30 10 15 35 15 55 C15 75 30 95 45 100 L45 110 L55 110 L55 100 C55 100 60 102 65 100 L65 110 L75 110 L75 100 C90 95 105 75 105 55 C105 35 90 10 60 10Z"
        fill={bodyFill}
      />
      <path
        d="M20 45 C5 40 0 50 5 60 C10 70 20 65 25 55 C28 48 25 45 20 45Z"
        fill={bodyFill}
      />
      <path
        d="M100 45 C115 40 120 50 115 60 C110 70 100 65 95 55 C92 48 95 45 100 45Z"
        fill={bodyFill}
      />
      <path d="M45 15 Q35 5 30 8" stroke={gradientStart} strokeWidth="3" strokeLinecap="round" />
      <path d="M75 15 Q85 5 90 8" stroke={gradientStart} strokeWidth="3" strokeLinecap="round" />
      <circle cx="45" cy="35" r="6" fill="#050810" />
      <circle cx="75" cy="35" r="6" fill="#050810" />
      <circle cx="46" cy="34" r="2.5" fill="#00e5cc" />
      <circle cx="76" cy="34" r="2.5" fill="#00e5cc" />
    </svg>
  );
}
