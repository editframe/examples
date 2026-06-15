/**
 * Opus 4.8 ad — brand tokens (0–25s build window)
 * All hex values sampled directly from the reference keyframes.
 * See _opus_run/PALETTE.md for provenance.
 *
 * Builders: tweak colors HERE, not inline. These are also mirrored as CSS
 * custom properties in styles.css (kept in sync for components that use var()).
 */
export const BRAND = {
  // Background
  bgGreen: "#BCD2C8",
  bgTopoLine: "#C7D8CF",

  // Terminal
  termCharcoal: "#191916",
  termHeader: "#23211F",
  termBorder: "#2A2926",
  termTextPrimary: "#E6E4DE",
  termTextSecondary: "#8A8A82",
  termHint: "#7C7C74",
  termAccent: "#F0C674",
  termSelRow: "#2E2D29",
  trafficRed: "#ED6A5E",
  trafficYellow: "#F4BF4F",
  trafficGreen: "#61C554",

  // Creature (coral dog/quadruped, faces right)
  creatureCoral: "#CE6E58",
  creatureEye: "#1A1A1A",

  // Kites
  kiteOrange: "#E7AA5C",
  kitePurple: "#8276B8",
  kitePink: "#E6C4B9",
  kiteSpar: "#38291E",

  // Headlines (faint grey serif on sage)
  headlineSerif: "#8EA49A",

  // Notification cards
  cardWhite: "#EFF1F1",
  cardTitle: "#1A1A1A",
  cardBody: "#6E6F70",
  cardTimestamp: "#8A8C8E",
  iconGreen: "#5EBB86",
  iconBlue: "#67A0F5",

  // Code syntax (VS Code dark-style)
  codeKeyword: "#C586C0",
  codeString: "#6A9955",
  codeType: "#4EC9B0",
  codeVariable: "#9CDCFE",
  codeText: "#D4D4D4",
  codeBullet: "#E6E4DE",
} as const;

export type BrandToken = keyof typeof BRAND;
