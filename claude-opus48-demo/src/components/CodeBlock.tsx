import React, { forwardRef } from "react";

/**
 * Syntax-highlighted code output for the App Router migration (zoomed terminal).
 * Text VERBATIM from 02-timemap-pro.json `ai_response_code` (confirmed vs k_040).
 *
 * Each line is a <div class="code-line"> with token <span> classes
 * (.kw .str .typ .var .txt .bul .com) colored from PALETTE.
 *
 * Lines are exposed via lineRefs so the scene can reveal them one-by-one.
 */

export interface CodeLine {
  reveal: number; // master ms when this line appears
  node: React.ReactNode;
}

interface Props {
  lineRefs: React.RefObject<(HTMLDivElement | null)[]>;
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

export const CODE_LINES: CodeLine[] = [
  { reveal: 18100, node: <>{bul("●")} {txt("I'll start by exploring the repo structure to understand what")}</> },
  { reveal: 18700, node: <>{bul("●")} {txt("Write 70 lines to ")}{v("apps/dashboard/app/orders/[id]/page.tsx")}</> },
  { reveal: 18760, node: <>{"  "}{txt("Wrote ")}{v("70")}{txt(" lines to ")}{v("apps/dashboard/app/orders/[id]/page.tsx")}</> },
  { reveal: 18820, node: <>{"  "}{str('"use client";')}</> },
  { reveal: 18860, node: <>{"  "}</> },
  { reveal: 18900, node: <>{"  "}{kw("import")} {"{ "}{v("useParams")}{", "}{v("useRouter")}{" } "}{kw("from")} {str('"next/navigation";')}</> },
  { reveal: 18950, node: <>{"  "}{kw("import")} {v("useSWR")} {kw("from")} {str('"swr";')}</> },
  { reveal: 19000, node: <>{"  "}{kw("import")} {kw("type")} {"{ "}{typ("Order")}{", "}{typ("Customer")}{" } "}{kw("from")} {str('"@acme/types";')}</> },
  { reveal: 19050, node: <>{"  "}{kw("import")} {"{ "}{v("Avatar")}{", "}{v("Badge")}{", "}{v("Button")}{", "}{v("Card")}{" } "}{kw("from")} {str('"@acme/ui/v1";')}</> },
  { reveal: 19100, node: <>{"  "}{kw("import")} {"{ "}{v("Shell")}{" } "}{kw("from")} {str('"../../../components/Shell";')}</> },
  { reveal: 19150, node: <>{"  "}{kw("import")} {"{ "}{v("formatMoney")}{", "}{v("timeAgo")}{" } "}{kw("from")} {str('"../../../lib/api";')}</> },
  { reveal: 19200, node: <>{"  "}</> },
  { reveal: 19250, node: <>{"  "}{kw("type")} {typ("OrderWithCustomer")} {"= "}{typ("Order")} {"& { "}{v("customer")}{"?: "}{typ("Customer")}{" };"}</> },
  { reveal: 19300, node: <>{"  "}{com("// +76 lines")}</> },
  { reveal: 19600, node: <>{bul("●")} {txt("Now delete dashboard's old pages/ and verify the build:")}</> },
  { reveal: 19680, node: <>{"  "}{txt("Ran 3 shell commands, thought for 3s (ctrl+o to expand)")}</> },
  { reveal: 20000, node: <>{bul("●")} {txt("Build succeeds — every route compiles as a client page under")}</> },
  { reveal: 20080, node: <>{"  "}{txt("the App Router shell. Let me verify the actual rendered HTML")}</> },
  { reveal: 20350, node: <>{bul("●")} {txt("All routes return 200, the metadata export renders the")}</> },
  { reveal: 20430, node: <>{"  "}{txt("correct <title>, the Shell chrome and the Overview cards")}</> },
  { reveal: 20650, node: <>{bul("●")} {txt("Migration is complete and verified. Here's the pattern")}</> },
];

const CodeBlock = forwardRef<HTMLDivElement, Props>(({ lineRefs, fontSize = 22, style }, _ref) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 3, ...style }}>
    {CODE_LINES.map((line, i) => (
      <div
        key={i}
        ref={(el) => {
          if (lineRefs.current) lineRefs.current[i] = el;
        }}
        className="code-line"
        style={{ fontSize, opacity: 0 }}
      >
        {line.node}
      </div>
    ))}
  </div>
));
CodeBlock.displayName = "CodeBlock";
export default CodeBlock;
