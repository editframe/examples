import { createVideoTraceLayer } from "@shared/components/TraceLayer";

/** Usage in a scene: `<TraceLayer sceneStartMs={7500} enabled={TRACE_MODE} opacity={0.5} />` */
export const TraceLayer = createVideoTraceLayer(
  "/claude-code-financial-demo/src/assets/claude-code-financial-demo-reference-trace.mp4"
);
