import React from "react";

/**
 * Syntax-highlighted code output for the App Router migration (zoomed terminal).
 * Text VERBATIM from the original build brief.
 *
 * Each line is a <div class="code-line"> with token <span> classes
 * (.kw .str .typ .var .txt .bul .com) colored from PALETTE.
 *
 * Lines reveal themselves via a `code-line-in` CSS keyframe with an
 * `animation-delay` computed once per line (from its own `reveal` timestamp,
 * already converted to the Command scene's local ms) — no refs, no per-frame
 * opacity writes.
 */

export interface CodeLine {
  /** Command-scene-local ms when this line appears (converted from the original
   *  absolute master-ms cue — see constants.ts SCENES doc for the conversion). */
  reveal: number;
  node: React.ReactNode;
}

interface Props {
  fontSize?: number;
  style?: React.CSSProperties;
}

// Token helpers
const kw = (t: string) => <span className="kw">{t}</span>;
const str = (t: string) => <span className="str">{t}</span>;
const typ = (t: string) => <span className="typ">{t}</span>;
const v = (t: string) => <span className="var">{t}</span>;
const txt = (t: string) => <span className="txt">{t}</span>;
const bul = (t: string) => <span className="bul">{t}</span>;
const com = (t: string) => <span className="com">{t}</span>;

// reveal times are Command-scene-local ms (converted from the original absolute
// cues: 18100, 18700, 18760, 18820, 18860, 18900, 18950, 19000, 19050, 19100,
// 19150, 19200, 19250, 19300, 19600, 19680, 20000, 20080, 20350, 20430, 20650
// minus the Command scene's own absolute start, 12200ms — see constants.ts).
export const CODE_LINES: CodeLine[] = [
  { reveal: 5900, node: <>{bul("●")} {txt("I'll start by exploring the repo structure to understand what")}</> },
  { reveal: 6500, node: <>{bul("●")} {txt("Write 70 lines to ")}{v("apps/dashboard/app/orders/[id]/page.tsx")}</> },
  { reveal: 6560, node: <>{"  "}{txt("Wrote ")}{v("70")}{txt(" lines to ")}{v("apps/dashboard/app/orders/[id]/page.tsx")}</> },
  { reveal: 6620, node: <>{"  "}{str('"use client";')}</> },
  { reveal: 6660, node: <>{"  "}</> },
  { reveal: 6700, node: <>{"  "}{kw("import")} {"{ "}{v("useParams")}{", "}{v("useRouter")}{" } "}{kw("from")} {str('"next/navigation";')}</> },
  { reveal: 6750, node: <>{"  "}{kw("import")} {v("useSWR")} {kw("from")} {str('"swr";')}</> },
  { reveal: 6800, node: <>{"  "}{kw("import")} {kw("type")} {"{ "}{typ("Order")}{", "}{typ("Customer")}{" } "}{kw("from")} {str('"@acme/types";')}</> },
  { reveal: 6850, node: <>{"  "}{kw("import")} {"{ "}{v("Avatar")}{", "}{v("Badge")}{", "}{v("Button")}{", "}{v("Card")}{" } "}{kw("from")} {str('"@acme/ui/v1";')}</> },
  { reveal: 6900, node: <>{"  "}{kw("import")} {"{ "}{v("Shell")}{" } "}{kw("from")} {str('"../../../components/Shell";')}</> },
  { reveal: 6950, node: <>{"  "}{kw("import")} {"{ "}{v("formatMoney")}{", "}{v("timeAgo")}{" } "}{kw("from")} {str('"../../../lib/api";')}</> },
  { reveal: 7000, node: <>{"  "}</> },
  { reveal: 7050, node: <>{"  "}{kw("type")} {typ("OrderWithCustomer")} {"= "}{typ("Order")} {"& { "}{v("customer")}{"?: "}{typ("Customer")}{" };"}</> },
  { reveal: 7100, node: <>{"  "}{com("// +76 lines")}</> },
  { reveal: 7400, node: <>{bul("●")} {txt("Now delete dashboard's old pages/ and verify the build:")}</> },
  { reveal: 7480, node: <>{"  "}{txt("Ran 3 shell commands, thought for 3s (ctrl+o to expand)")}</> },
  { reveal: 7800, node: <>{bul("●")} {txt("Build succeeds — every route compiles as a client page under")}</> },
  { reveal: 7880, node: <>{"  "}{txt("the App Router shell. Let me verify the actual rendered HTML")}</> },
  { reveal: 8150, node: <>{bul("●")} {txt("All routes return 200, the metadata export renders the")}</> },
  { reveal: 8230, node: <>{"  "}{txt("correct <title>, the Shell chrome and the Overview cards")}</> },
  { reveal: 8450, node: <>{bul("●")} {txt("Migration is complete and verified. Here's the pattern")}</> },
];

const CodeBlock: React.FC<Props> = ({ fontSize = 22, style }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 3, ...style }}>
    {CODE_LINES.map((line, i) => (
      <div
        key={i}
        className="code-line"
        style={{ fontSize, animation: `code-line-in 150ms ${line.reveal}ms cubic-bezier(0.33,1,0.68,1) backwards` }}
      >
        {line.node}
      </div>
    ))}
  </div>
);
export default CodeBlock;
