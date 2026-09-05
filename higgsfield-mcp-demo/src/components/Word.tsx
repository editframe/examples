import React from "react";

export const W = ({ g, t, cls }: { g: string; t: string; cls?: string }) => (
  <>
    {t.split(" ").map((w, i) => (
      <span key={i} className={`w ${cls ?? ""}`} data-g={g}>
        {w}{" "}
      </span>
    ))}
  </>
);
