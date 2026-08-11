import { createFramesTraceLayer } from "@shared/components/TraceLayer";
import { getTraceFrameForMs, TRACE_FRAMES } from "../assets/trace-frames";

/** Usage in a scene: `<TraceLayer sceneStartMs={7500} enabled={TRACE_MODE} opacity={0.5} />` */
export const TraceLayer = createFramesTraceLayer({ frames: TRACE_FRAMES, getFrameForMs: getTraceFrameForMs });
