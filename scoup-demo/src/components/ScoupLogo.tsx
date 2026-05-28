import React, { forwardRef } from "react";

/**
 * Scoup mark — chat-bubble with "S" inside.
 * Rendered with full yellow fill from frame 0; animation lives in parent
 * (clip-path mask reveal + scale-up via AnimeJS).
 */

type Props = {
  className?: string;
  size?: number;
};

export const ScoupLogo = forwardRef<SVGSVGElement, Props>(
  ({ className = "", size = 200 }, ref) => {
    return (
      <svg
        ref={ref}
        width={size}
        height={(size * 273) / 253}
        viewBox="0 0 253 273"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={{ display: "block" }}
      >
        {/* Bubble — Scoup yellow */}
        <path
          d="M243.398 9.13086V166.065H147.009L101.327 208.89V166.079H53.0518V9.13086H243.398Z"
          fill="#FFBA49"
        />
        {/* Outline cutting the chat-bubble shape */}
        <path
          d="M252.523 175.19H252.521L208.604 218.225H104.716L92.1953 229.964L48.2764 273V218.247H0V43.0381L43.9209 0H252.523V175.19ZM53.0518 166.079H101.327V208.89L147.009 166.065H243.398V9.13086H53.0518V166.079Z"
          fill="#121212"
        />
        {/* Inner "S" letter */}
        <path
          d="M162.919 72.1048C162.097 63.9464 160.126 53.379 145.069 53.379C134.009 53.379 128.697 58.909 128.697 66.4103C128.697 89.1331 181.206 66.246 181.206 107.421C181.206 126.529 166.368 137.918 145.069 137.918C118.459 137.918 107.234 121.437 109.48 105.613H126.945C127.657 116.291 129.026 125.434 145.671 125.434C159.25 125.434 163.959 118.809 163.959 111.582C163.959 87.5996 111.341 109.775 111.341 68.6554C111.341 52.8862 124.482 40.95 144.74 40.95C170.365 40.95 181.042 54.2551 179.673 72.1048H163.028H162.919Z"
          fill="#121212"
        />
      </svg>
    );
  }
);

ScoupLogo.displayName = "ScoupLogo";
