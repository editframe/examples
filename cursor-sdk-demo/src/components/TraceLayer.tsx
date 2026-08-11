import { createVideoTraceLayer } from "@shared/components/TraceLayer";

/** Usage in a scene: `<TraceLayer sceneStartMs={7500} enabled={TRACE_MODE} opacity={0.5} />` */
export const TraceLayer = createVideoTraceLayer(
  "/cursor-sdk-demo/src/assets/cursor-sdk-demo-reference-trace.mp4"
);
