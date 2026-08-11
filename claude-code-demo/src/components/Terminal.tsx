import React from "react";
import { WindowChrome, type WindowChromeProps } from "@shared/components/WindowChrome";

/**
 * macOS-style terminal window with chrome (traffic lights + centered title) and a body
 * slot. Used both as the hero terminal and the scatter terminals. Thin project-local
 * adapter over `@shared/components/WindowChrome` — `dimChrome` maps to the shared
 * component's `dimmed`.
 */
interface Props extends Omit<WindowChromeProps, "dimmed"> {
  dimChrome?: boolean; // for background scatter terminals
}

const Terminal = React.forwardRef<HTMLDivElement, Props>(({ dimChrome, ...rest }, ref) => (
  <WindowChrome ref={ref} dimmed={dimChrome} {...rest} />
));
Terminal.displayName = "Terminal";
export default Terminal;
