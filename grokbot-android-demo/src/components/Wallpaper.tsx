import React from "react";

export const Wallpaper: React.FC = () => (
  <div className="wallpaper">
    <svg className="grain" width="100%" height="100%">
      <filter id="grain">
        <feTurbulence type="fractalNoise" baseFrequency=".75" numOctaves="3" seed="12" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain)" opacity=".12" />
    </svg>
  </div>
);
