import React from "react";
import ReactDOM from "react-dom/client";
import { TimelineRoot } from "@editframe/react";
import { Video } from "./Video";
import { ApartmentScene } from "./scene/FinalApartmentScene";
import "@editframe/elements/styles.css";
import "./styles.css";

const root = document.getElementById("root");
if (!root) {
  throw new Error("Root element not found");
}

const isStandaloneCheckpoint = new URLSearchParams(window.location.search).get("standalone") === "1";
const isTimelineRender = new URLSearchParams(window.location.search).get("timeline") === "1";

ReactDOM.createRoot(root).render(
  isTimelineRender ? (
    <TimelineRoot id="root" component={Video} />
  ) : isStandaloneCheckpoint ? (
    <ApartmentScene />
  ) : (
    <ApartmentScene mode="walkthrough" />
  ),
);
