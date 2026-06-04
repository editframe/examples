import React, { useCallback, useRef } from "react";
import { Timegroup } from "@editframe/react";
import { OpenClawMark } from "./components/OpenClawMark";
import {
  easeInOutCubic,
  lerp,
  setSignalProgress,
  setStyles,
  setText,
  track,
  typewriter,
} from "./components/helpers";

const WIDTH = 1920;
const HEIGHT = 1080;
const DURATION_MS = 30000;

const prompt = "Can you clear my morning and prep the release follow-up?";
const doneMessage =
  "Done. Moved the 10:30, sent two replies, opened the release follow-up, and added a prep block.";

const receiptItems = [
  "Morning cleared",
  "Replies sent",
  "Release issue opened",
  "Prep block added",
];

const chips = ["Mail", "Calendar", "GitHub", "Reminders", "Local"];

export const Video: React.FC = () => {
  const frameRef = useRef<HTMLDivElement>(null);

  const onFrame = useCallback(({ ownCurrentTimeMs: ms }: { ownCurrentTimeMs: number }) => {
    const root = frameRef.current;
    if (!root) return;

    const intro = 1 - track(ms, 7500, 8200, easeInOutCubic);
    const work = track(ms, 7800, 8800, easeInOutCubic) * (1 - track(ms, 21400, 22200, easeInOutCubic));
    const outro = track(ms, 21800, 22600, easeInOutCubic);
    const final = track(ms, 28000, 28600, easeInOutCubic);

    setStyles(root, "[data-layer='intro']", {
      opacity: `${intro}`,
      transform: `scale(${lerp(1, 0.965, 1 - intro)}) translateY(${lerp(0, -22, 1 - intro)}px)`,
      pointerEvents: intro > 0.05 ? "auto" : "none",
    });

    setStyles(root, "[data-layer='work']", {
      opacity: `${work}`,
      transform: `translateY(${lerp(30, 0, track(ms, 7900, 8800, easeInOutCubic))}px)`,
      pointerEvents: work > 0.05 ? "auto" : "none",
    });

    setStyles(root, "[data-layer='outro']", {
      opacity: `${outro * (1 - final)}`,
      transform: `scale(${lerp(0.97, 1, outro)}) translateY(${lerp(28, 0, outro)}px)`,
      pointerEvents: outro > 0.05 && final < 0.5 ? "auto" : "none",
    });

    setStyles(root, "[data-layer='final']", {
      opacity: `${final}`,
      transform: `scale(${lerp(1.04, 1, final)})`,
    });
    setStyles(root, "[data-ui='topbar']", {
      opacity: `${1 - final}`,
      transform: `translateY(${lerp(0, -18, final)}px)`,
    });

    setText(root, "[data-type='prompt']", typewriter(ms, 900, 4200, prompt));
    setText(root, "[data-type='done']", typewriter(ms, 22600, 2200, doneMessage));
    setStyles(root, "[data-caret='prompt']", {
      opacity: ms > 900 && ms < 5350 && Math.floor(ms / 260) % 2 === 0 ? "1" : "0",
    });
    setStyles(root, "[data-caret='done']", {
      opacity: ms > 22600 && ms < 24900 && Math.floor(ms / 260) % 2 === 0 ? "1" : "0",
    });

    const sendPulse = track(ms, 5200, 5900, easeInOutCubic);
    setStyles(root, "[data-send='button']", {
      transform: `scale(${1 + Math.sin(sendPulse * Math.PI) * 0.09})`,
      boxShadow: `0 0 ${Math.round(lerp(0, 34, Math.sin(sendPulse * Math.PI)))}px rgba(0, 229, 204, 0.52)`,
    });

    chips.forEach((_, index) => {
      const p = track(ms, 5900 + index * 130, 6500 + index * 130, easeInOutCubic);
      setStyles(root, `[data-chip='${index}']`, {
        opacity: `${p}`,
        transform: `translateY(${lerp(16, 0, p)}px)`,
      });
    });

    const routeProgress = track(ms, 6600, 7600, easeInOutCubic);
    setStyles(root, "[data-route='map']", {
      opacity: `${routeProgress}`,
      transform: `scaleX(${lerp(0.2, 1, routeProgress)})`,
    });

    const workChat = track(ms, 7900, 8800, easeInOutCubic);
    setStyles(root, "[data-work='chat']", {
      opacity: `${workChat}`,
      transform: `translateX(${lerp(-28, 0, workChat)}px)`,
    });

    const mail = track(ms, 8600, 10200, easeInOutCubic);
    const calendar = track(ms, 10300, 12100, easeInOutCubic);
    const github = track(ms, 13900, 15300, easeInOutCubic);
    const local = track(ms, 16200, 17600, easeInOutCubic);
    const mailOpacity = mail * lerp(1, 0.66, track(ms, 11800, 13200, easeInOutCubic));
    const calendarOpacity = calendar * lerp(1, 0.76, track(ms, 15000, 16600, easeInOutCubic));
    const githubOpacity = github * lerp(1, 0.86, track(ms, 17800, 19100, easeInOutCubic));

    setSurface(root, "mail", mail, mailOpacity);
    setSurface(root, "calendar", calendar, calendarOpacity);
    setSurface(root, "github", github, githubOpacity);
    setSurface(root, "local", local);

    setSignalProgress(root, "[data-signal='mail']", track(ms, 8400, 9900, easeInOutCubic), mailOpacity);
    setSignalProgress(root, "[data-signal='calendar']", track(ms, 10100, 11700, easeInOutCubic), calendarOpacity);
    setSignalProgress(root, "[data-signal='github']", track(ms, 13600, 15000, easeInOutCubic), githubOpacity);
    setSignalProgress(root, "[data-signal='local']", track(ms, 16000, 17400, easeInOutCubic), local);

    const unread = Math.round(lerp(14, 8, track(ms, 9600, 11600, easeInOutCubic)));
    setText(root, "[data-mail='count']", `${unread} unread`);
    setStyles(root, "[data-mail='reply-one']", { opacity: `${track(ms, 10400, 11200)}` });
    setStyles(root, "[data-mail='reply-two']", { opacity: `${track(ms, 11200, 12000)}` });
    setStyles(root, "[data-mail='check']", { opacity: `${track(ms, 11900, 12600)}` });

    const move = track(ms, 11600, 13700, easeInOutCubic);
    setStyles(root, "[data-cal='conflict']", {
      transform: `translateY(${lerp(0, 58, move)}px)`,
      opacity: `${lerp(1, 0.48, move)}`,
    });
    setStyles(root, "[data-cal='prep']", {
      opacity: `${track(ms, 13200, 14500, easeInOutCubic)}`,
      transform: `translateY(${lerp(16, 0, track(ms, 13200, 14500, easeInOutCubic))}px)`,
    });

    const issue = track(ms, 14600, 16200, easeInOutCubic);
    setStyles(root, "[data-gh='issue']", {
      opacity: `${issue}`,
      transform: `translateY(${lerp(18, 0, issue)}px)`,
    });
    setStyles(root, "[data-gh='bar']", { width: `${Math.round(lerp(0, 86, issue))}%` });

    const heartbeat = 0.55 + Math.sin(ms / 210) * 0.18;
    setStyles(root, "[data-local='pulse']", {
      opacity: `${heartbeat}`,
      transform: `scale(${1 + heartbeat * 0.08})`,
    });
    ["route", "memory", "device"].forEach((key, index) => {
      const p = track(ms, 16200 + index * 520, 16900 + index * 520, easeInOutCubic);
      setStyles(root, `[data-local='${key}']`, {
        opacity: `${p}`,
        transform: `translateX(${lerp(-14, 0, p)}px)`,
      });
    });

    receiptItems.forEach((_, index) => {
      const p = track(ms, 24500 + index * 360, 25100 + index * 360, easeInOutCubic);
      setStyles(root, `[data-receipt='${index}']`, {
        opacity: `${p}`,
        transform: `translateY(${lerp(12, 0, p)}px)`,
      });
    });

    const receiptLine = track(ms, 24200, 26000, easeInOutCubic);
    setStyles(root, "[data-receipt-line]", { width: `${Math.round(lerp(0, 100, receiptLine))}%` });

    const backgroundDrift = Math.sin(ms / 4200) * 10;
    setStyles(root, "[data-bg='grid']", {
      transform: `translate3d(${backgroundDrift}px, ${backgroundDrift * 0.45}px, 0)`,
    });
  }, []);

  return (
    <Timegroup
      mode="fixed"
      duration={`${DURATION_MS}ms`}
      onFrame={onFrame as any}
      style={{
        width: WIDTH,
        height: HEIGHT,
        background: "#050810",
      }}
    >
      <div ref={frameRef} className="oc-frame">
        <Background />

        <div className="oc-topbar" data-ui="topbar">
          <div className="oc-brand">
            <OpenClawMark className="oc-brand-mark" label="OpenClaw mark" />
            <span>OpenClaw</span>
          </div>
          <div className="oc-topbar-meta">personal assistant runtime</div>
        </div>

        <section className="oc-intro" data-layer="intro">
          <div className="oc-headline">
            <div className="oc-kicker">From message to done</div>
            <h1>One request. Real work.</h1>
          </div>

          <div className="oc-chat oc-chat-intro">
            <WindowChrome title="WhatsApp - OpenClaw" />
            <div className="oc-chat-body">
              <div className="oc-message-row">
                <div className="oc-avatar">S</div>
                <div className="oc-bubble oc-bubble-user">
                  <span data-type="prompt" />
                  <span className="oc-caret" data-caret="prompt" />
                </div>
              </div>
              <div className="oc-compose">
                <span>OpenClaw can route this through</span>
                <button data-send="button" aria-label="Send message">Send</button>
              </div>
              <div className="oc-chip-row">
                {chips.map((chip, index) => (
                  <span className="oc-chip" data-chip={index} key={chip}>
                    {chip}
                  </span>
                ))}
              </div>
              <div className="oc-route-map" data-route="map">
                <span>chat</span>
                <i />
                <span>gateway</span>
                <i />
                <span>device</span>
                <i />
                <span>tools</span>
              </div>
            </div>
          </div>
        </section>

        <section className="oc-work" data-layer="work">
          <SignalLayer />
          <div className="oc-work-chat" data-work="chat">
            <WindowChrome title="OpenClaw" />
            <div className="oc-mini-chat">
              <div className="oc-mini-message">{prompt}</div>
              <div className="oc-agent-status">
                <OpenClawMark className="oc-status-mark" label="OpenClaw status" />
                <span>routing across local tools</span>
              </div>
            </div>
          </div>

          <MailSurface />
          <CalendarSurface />
          <GitHubSurface />
          <LocalSurface />
        </section>

        <section className="oc-outro" data-layer="outro">
          <div className="oc-outro-chat">
            <WindowChrome title="OpenClaw receipt" />
            <div className="oc-outro-body">
              <div className="oc-agent-message">
                <OpenClawMark className="oc-agent-mark" label="OpenClaw receipt mark" />
                <div>
                  <span data-type="done" />
                  <span className="oc-caret" data-caret="done" />
                </div>
              </div>
              <div className="oc-receipt-line" data-receipt-line />
              <div className="oc-receipt">
                {receiptItems.map((item, index) => (
                  <div className="oc-receipt-item" data-receipt={index} key={item}>
                    <span>✓</span>
                    <p>{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="oc-final" data-layer="final">
          <OpenClawMark className="oc-final-mark" label="OpenClaw final mark" contrast />
          <h2>OpenClaw</h2>
          <p>The AI that actually does things.</p>
        </section>
      </div>
    </Timegroup>
  );
};

function setSurface(root: HTMLElement, name: string, progress: number, opacity = progress) {
  const clampedOpacity = Math.max(0, Math.min(1, opacity));
  setStyles(root, `[data-surface='${name}']`, {
    opacity: `${clampedOpacity}`,
    transform: `translateY(${lerp(34, 0, progress)}px) scale(${lerp(0.97, 1, progress)})`,
  });
}

function Background() {
  return (
    <>
      <div className="oc-bg" />
      <div className="oc-grid" data-bg="grid" />
      <div className="oc-scanline" />
    </>
  );
}

function WindowChrome({ title }: { title: string }) {
  return (
    <div className="oc-window-chrome">
      <span className="oc-dot oc-dot-red" />
      <span className="oc-dot oc-dot-yellow" />
      <span className="oc-dot oc-dot-green" />
      <strong>{title}</strong>
    </div>
  );
}

function SignalLayer() {
  return (
    <svg className="oc-signals" viewBox="0 0 1920 1080" aria-hidden="true">
      <path data-signal="mail" pathLength="1" d="M458 434 C650 284 820 224 1110 224" />
      <path data-signal="calendar" pathLength="1" d="M476 502 C690 526 850 574 1110 584" />
      <path data-signal="github" pathLength="1" d="M478 568 C588 674 610 790 626 828" />
      <path data-signal="local" pathLength="1" d="M462 622 C708 806 1038 872 1334 872" />
    </svg>
  );
}

function MailSurface() {
  return (
    <article className="oc-surface oc-mail" data-surface="mail">
      <SurfaceHeader label="Mail" status="executing" />
      <div className="oc-mail-stats">
        <strong data-mail="count">14 unread</strong>
        <span>release thread prioritized</span>
      </div>
      <div className="oc-mail-list">
        <MailRow from="Mira" subject="Release notes edits" state="draft ready" />
        <MailRow from="DevRel" subject="Launch slot moved" state="send queued" />
        <MailRow from="Finance" subject="Invoice follow-up" state="later" muted />
      </div>
      <div className="oc-mail-checks">
        <span data-mail="reply-one">reply drafted</span>
        <span data-mail="reply-two">reply sent</span>
        <b data-mail="check">✓ inbox cleared</b>
      </div>
    </article>
  );
}

function MailRow({
  from,
  subject,
  state,
  muted = false,
}: {
  from: string;
  subject: string;
  state: string;
  muted?: boolean;
}) {
  return (
    <div className={`oc-mail-row${muted ? " is-muted" : ""}`}>
      <span>{from}</span>
      <p>{subject}</p>
      <em>{state}</em>
    </div>
  );
}

function CalendarSurface() {
  return (
    <article className="oc-surface oc-calendar" data-surface="calendar">
      <SurfaceHeader label="Calendar" status="resolving" />
      <div className="oc-calendar-grid">
        <div className="oc-time-labels">
          <span>9:00</span>
          <span>10:00</span>
          <span>11:00</span>
          <span>12:00</span>
        </div>
        <div className="oc-calendar-track">
          <div className="oc-event oc-event-conflict" data-cal="conflict">10:30 sync</div>
          <div className="oc-event oc-event-prep" data-cal="prep">release prep</div>
        </div>
      </div>
    </article>
  );
}

function GitHubSurface() {
  return (
    <article className="oc-surface oc-github" data-surface="github">
      <SurfaceHeader label="GitHub" status="writing" />
      <div className="oc-issue" data-gh="issue">
        <div className="oc-issue-title">Release follow-up</div>
        <ul>
          <li>Confirm docs owner</li>
          <li>Attach changelog diff</li>
          <li>Assign launch checklist</li>
        </ul>
      </div>
      <div className="oc-progress">
        <span data-gh="bar" />
      </div>
    </article>
  );
}

function LocalSurface() {
  return (
    <article className="oc-surface oc-local" data-surface="local">
      <SurfaceHeader label="Local" status="online" />
      <div className="oc-device-core">
        <span data-local="pulse" />
        <strong>MacBook route active</strong>
      </div>
      <div className="oc-local-list">
        <p data-local="route">WhatsApp route confirmed</p>
        <p data-local="memory">context recalled</p>
        <p data-local="device">device tools available</p>
      </div>
    </article>
  );
}

function SurfaceHeader({ label, status }: { label: string; status: string }) {
  return (
    <div className="oc-surface-header">
      <h3>{label}</h3>
      <span>{status}</span>
    </div>
  );
}
