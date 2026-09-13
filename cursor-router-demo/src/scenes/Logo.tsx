import React from "react";
import { Timegroup, Image } from "@editframe/react";
import { LOGO_MS } from "../constants";

const LOGO_SPRITE = "/cursor-router-demo/src/assets/cursor-router-demo-logo-sprite.png";

export const Logo = () => (
  <Timegroup mode="fixed" duration={`${LOGO_MS}ms`} className="absolute w-full h-full bg-white">
    <div className="s7-viewport">
      <div className="s7-sprite">
        <Image src={LOGO_SPRITE} className="s7-sprite-img" />
      </div>
    </div>
  </Timegroup>
);
