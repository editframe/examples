import ReactDOM from "react-dom/client";
import "@editframe/elements/styles.css";
import renderEntry from "virtual:editframe-render-entry";
import { App } from "./App";

const root = document.getElementById("root");
if (!root) {
  throw new Error("Root element not found");
}

if (renderEntry) {
  const styleLink = document.createElement("link");
  styleLink.rel = "stylesheet";
  styleLink.href = renderEntry.stylesUrl;
  document.head.appendChild(styleLink);
}

ReactDOM.createRoot(root).render(<App renderVideo={renderEntry?.Video ?? null} />);
