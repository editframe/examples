import React from "react";

/**
 * Figma "F" mark — canonical 38×57 SVG paths from Figma brand guidelines.
 *   top-left  orange  #F24E1E  (half-pill, rounded left)
 *   top-right pink    #FF7262  (half-pill, rounded right)
 *   mid-left  purple  #A259FF  (half-pill, rounded left)
 *   mid-right blue    #1ABCFE  (full circle)
 *   bot-left  green   #0ACF83  (half-pill with bottom-left circle)
 */
export const FigmaLogo: React.FC<{ size?: number }> = ({ size = 80 }) => {
  const w = size;
  const h = size * (57 / 38);
  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 38 57"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block" }}
    >
      {/* bottom-left green */}
      <path
        d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z"
        fill="#0ACF83"
      />
      {/* top-left orange */}
      <path
        d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z"
        fill="#F24E1E"
      />
      {/* mid-left purple */}
      <path
        d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z"
        fill="#A259FF"
      />
      {/* top-right pink */}
      <path
        d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z"
        fill="#FF7262"
      />
      {/* mid-right blue circle */}
      <path
        d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z"
        fill="#1ABCFE"
      />
    </svg>
  );
};

export default FigmaLogo;
