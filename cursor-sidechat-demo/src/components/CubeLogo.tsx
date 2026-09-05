import React from "react";

export const CubeLogo = ({ w = 114 }: { w?: number }) => (
  <svg width={w} height={(w * 130) / 114} viewBox="0 0 114 130">
    <path d="M57 0 L113 32 L113 97 L57 129 L1 97 L1 32 Z" fill="#0c0c0c" />
    <path d="M1 32 L108 34 L57 124 L57 64 Z" fill="#f7f7f7" />
  </svg>
);
