import React from "react";
import { Text } from "@editframe/react";
const NativeText = Text as unknown as React.ComponentType<React.PropsWithChildren<{className:string}>>;

export function Headline({ lines, className }: { lines: string[]; className: string }) {
  return <div className={`headline ${className}`}>
    {lines.map((line, i) => <NativeText className="text-line" key={i}>{line}</NativeText>)}
  </div>;
}

