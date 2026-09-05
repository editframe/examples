import React from "react";

/** "Light Guide" flower — 6 white petals in a hex ring around a dark-green
 *  6-spoke asterisk + vertical stem, on transparent bg. viewBox 1000x1000.
 *  The green asterisk/stem sits BEHIND the petals (petals occlude the arms).
 *  Split into layers so S02 can windmill-rotate the green group alone. */
const GREEN = "#005C2D";

export const FCX = 500, FCY = 458; // flower hub (viewBox coords)
const R = 256, PR = 132;
const SPOKE_LEN = 234, SPOKE_W = 42;

/** Static stem — vertical, below the hub. Does NOT rotate with the asterisk. */
export const FlowerStem: React.FC<{ size?: number; style?: React.CSSProperties }> = ({ size = 1000, style }) => (
  <svg viewBox="0 0 1000 1000" width={size} height={size} style={style}>
    <rect x={FCX - 15} y={FCY + 120} width={30} height={300} fill={GREEN} />
  </svg>
);

/** 6-spoke asterisk. Resting arms at 12/2/4/6/8/10 o'clock (arm angles
 *  31/96/165/222/273/328° ≈ vertical arm up + one merging into the stem). */
export const FlowerSpokes: React.FC<{ size?: number; style?: React.CSSProperties }> = ({ size = 1000, style }) => (
  <svg viewBox="0 0 1000 1000" width={size} height={size} style={style}>
    {[30, 90, 150].map((deg, i) => {
      const a = (deg * Math.PI) / 180;
      const dx = SPOKE_LEN * Math.cos(a), dy = SPOKE_LEN * Math.sin(a);
      return (
        <line key={i} x1={FCX - dx} y1={FCY - dy} x2={FCX + dx} y2={FCY + dy}
          stroke={GREEN} strokeWidth={SPOKE_W} strokeLinecap="butt" />
      );
    })}
  </svg>
);

/** White petal ring only. */
export const FlowerPetals: React.FC<{ size?: number; style?: React.CSSProperties }> = ({ size = 1000, style }) => (
  <svg viewBox="0 0 1000 1000" width={size} height={size} style={style}>
    {[0, 60, 120, 180, 240, 300].map((deg, i) => {
      const a = (deg * Math.PI) / 180;
      return <circle key={i} cx={FCX + R * Math.cos(a)} cy={FCY + R * Math.sin(a)} r={PR} fill="#FFFFFF" />;
    })}
  </svg>
);

/** Composed static flower (cards): stem + spokes BEHIND petals. */
export const Flower: React.FC<{ size?: number; className?: string; style?: React.CSSProperties }> = ({
  size = 1000, className, style,
}) => (
  <div className={className} style={{ position: "relative", width: size, height: size, ...style }}>
    <FlowerStem size={size} style={{ position: "absolute", left: 0, top: 0 }} />
    <FlowerSpokes size={size} style={{ position: "absolute", left: 0, top: 0 }} />
    <FlowerPetals size={size} style={{ position: "absolute", left: 0, top: 0 }} />
  </div>
);

export default Flower;
