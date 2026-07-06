import React from "react";
import { Timegroup } from "@editframe/react";
import { Reveal } from "../components/Reveal";
import { Cursor, AGENT_ICON } from "../components/icons";
import { SCENES, FONT } from "../constants";

const INTEGRATIONS = [
  { name: "ChatPRD", tagline: "Writes requirements, manages issues, and gives feedback" },
  { name: "Devin", tagline: "Scopes issues and drafts PRs" },
  { name: "Fin", tagline: "Connects you with your customer experience" },
  { name: "Sentry", tagline: "Automatically runs root cause analysis and fixes issues with Seer" },
  { name: "Stilla", tagline: "Adds meeting context and drafts code changes" },
];

/**
 * INTEGRATIONS — settings page auto-scrolls through agent cards; cursor clicks Enable on
 * Devin. 2167ms local. The cursor's brief 4px "click" bump (visible for ~140ms in the
 * original) is dropped as a minor simplification — imperceptible at this scale, and
 * dropping it avoids a fiddly multi-stop keyframe for a sub-pixel-scale detail.
 */
export const Integrations: React.FC = () => (
  <Timegroup mode="fixed" duration={`${SCENES.integrations.duration}ms`} className="absolute inset-0">
    <Reveal enter={[0, 220]} exit={[2047, 2167]} y={0} className="absolute inset-0 overflow-hidden" style={{ fontFamily: FONT }}>
      <div
        style={{
          position: "absolute", top: 0, left: 290, width: 1390, willChange: "transform",
          animation: "integrations-scroll-in 800ms 100ms cubic-bezier(0.45,0,0.55,1) both",
        }}
      >
        {INTEGRATIONS.map((agent, i) => {
          const Icon = AGENT_ICON[agent.name];
          const isDevin = i === 1;
          return (
            <div
              key={i}
              style={{
                background: "#0E0E12", border: "1px solid #1d1d22", borderRadius: 14, padding: "46px 36px",
                marginBottom: 31, display: "flex", alignItems: "center", gap: 24,
                animation: isDevin ? "devin-card-highlight 1ms 600ms forwards" : undefined,
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
                  <Icon size={40} />
                  <span style={{ color: "#F2F2F4", fontSize: 27, fontWeight: 500 }}>{agent.name}</span>
                </div>
                <div style={{ color: "#8A8F98", fontSize: 24 }}>{agent.tagline}</div>
              </div>
              <div style={{ background: "#5E6AD2", borderRadius: 9, padding: "13px 34px", flexShrink: 0 }}>
                <span style={{ color: "#fff", fontSize: 24, fontWeight: 500 }}>Enable</span>
              </div>
            </div>
          );
        })}
      </div>
      <Cursor
        style={{
          animation: [
            "instant-show 1ms 200ms both",
            "devin-cursor-move 800ms 200ms cubic-bezier(0.33,1,0.68,1) both",
          ].join(", "),
        }}
      />
    </Reveal>
  </Timegroup>
);
