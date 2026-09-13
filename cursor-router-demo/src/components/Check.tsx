import React from "react";

export const Check = ({ color, w = 30, h = 22 }: { color: string; w?: number; h?: number }) => (
  <svg width={w} height={h} viewBox="0 0 32 24" fill="none">
    <path d="M3 12.5L12 21L29 3" stroke={color} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
