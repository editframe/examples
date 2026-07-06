import React from "react";
import NotifCard from "./NotifCard";

/**
 * The three notification cards (Issue 781 · Afternoon at the park · Kite crew).
 * Each card is small & docked top-right while the Command scene's terminal is
 * still up, then grows + migrates to a centered stack once the terminal fades,
 * then the whole stack scrolls up by one slot as the third card arrives. That
 * lifecycle spans from the middle of the Command scene through to the very end
 * of the video, independent of any single scene's own boundary — so, like
 * `CreatureAndKites`, this is a sibling of the scene sequence and keys off the
 * original absolute-ms cues directly (its own local time == composition time).
 *
 * Each card's full small→centered→scrolled journey is one bespoke multi-stop
 * `@keyframes` rule (styles.css: `card-issue`, `card-calendar`, `card-kite`)
 * rather than a per-frame transform computation.
 *
 * Simplification: the original per-frame math nested two lerps for the
 * small→centered move (`left` interpolated between a *time-varying* slide-in
 * position and the centered position, both weighted by the same "exp" progress),
 * which traces a slight quadratic curve. The CSS keyframes below use a plain
 * 2-endpoint eased transition between the small and centered states instead —
 * visually equivalent, not pixel-identical. The calendar card's slide-in
 * (off-right → small slot) is also tightened from 450ms to 350ms so it completes
 * exactly when the centering move begins, avoiding a 100ms window where both
 * would otherwise run at once.
 */
export const NotificationStack: React.FC = () => (
  <div className="absolute inset-0" style={{ zIndex: 30, pointerEvents: "none" }}>
    <NotifCard
      icon="issue"
      width={1000}
      title="Issue 781: App Router migration"
      body={<>Dashboard monorepo needs all 4 apps converted from Pages → App Router</>}
      style={{ position: "absolute", left: 0, top: 0, transformOrigin: "top left", animation: "card-issue 12000ms 13000ms both" }}
    />
    <NotifCard
      icon="calendar"
      width={1000}
      title="Afternoon at the park"
      timestamp="in 10 min"
      body={<>12:00 – 3:00 PM<br />*Bring kites</>}
      style={{ position: "absolute", left: 0, top: 0, transformOrigin: "top left", animation: "card-calendar 4300ms 20700ms both" }}
    />
    <NotifCard
      icon="kite"
      width={1000}
      title="Kite crew"
      timestamp="now"
      body={<>We're on the west side of the park. Can you still make it?</>}
      style={{ position: "absolute", left: 0, top: 0, transformOrigin: "top left", animation: "card-kite 1950ms 23050ms both" }}
    />
  </div>
);

export default NotificationStack;
