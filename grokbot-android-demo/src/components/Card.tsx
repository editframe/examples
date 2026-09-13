import React from "react";
import { Image } from "@editframe/react";

const GROK_ICON = "/grokbot-android-demo/src/assets/grok-icon.png";
const BENJI_AVATAR = "/grokbot-android-demo/src/assets/benji-avatar.png";

export const Card: React.FC<{ benji?: boolean }> = ({ benji = false }) => (
  <div className={`card ${benji ? "benji" : "grok"}`}>
    <div className="avatar">
      <Image src={benji ? BENJI_AVATAR : GROK_ICON} className="avatar-img" />
    </div>
    <div className="copy">
      <div className="title">
        {benji ? "Benji Taylor" : "Grok Bot"}
        <span> · {benji ? "3m" : "1m"}</span>
      </div>
      <div className="body">
        {benji ? (
          <>
            Hey, do we have a recap from this
            <br />
            morning’s design standup?
          </>
        ) : (
          "Your design standup notes are ready."
        )}
      </div>
    </div>
    <div className="chevron">
      <svg viewBox="0 0 24 24">
        <path d="m7 10 5 5 5-5" fill="none" stroke="#66736f" strokeWidth="2" />
      </svg>
    </div>
  </div>
);
