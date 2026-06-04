import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import path from "node:path";

const width = Number(process.env.EXPORT_WIDTH ?? 1280);
const height = Number(process.env.EXPORT_HEIGHT ?? 720);
const fps = Number(process.env.EXPORT_FPS ?? 30);
const durationSeconds = Number(process.env.EXPORT_DURATION_SECONDS ?? 116);
const webmOutput = process.env.EXPORT_WEBM ?? "output/demo.webm";
const mp4Output = process.env.EXPORT_OUTPUT ?? "output/demo.mp4";
const port = Number(process.env.EXPORT_PORT ?? 5184);
const shouldStartServer = process.env.EXPORT_START_SERVER !== "0" && !process.env.EXPORT_URL;
const baseUrl = process.env.EXPORT_URL ?? `http://127.0.0.1:${port}/?standalone=1&walkthrough=1&capture=1&t=0`;
const manualFrames = process.env.EXPORT_MANUAL_FRAMES === "1";

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: "inherit" });
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} exited with code ${code}`));
    });
    child.on("error", reject);
  });
}

async function waitForServer(url) {
  const timeoutAt = Date.now() + 60000;
  while (Date.now() < timeoutAt) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`Timed out waiting for ${url}`);
}

let server = null;
if (shouldStartServer) {
  const nodeForServer = process.env.npm_node_execpath || process.execPath;
  server = spawn(
    nodeForServer,
    ["./node_modules/vite/bin/vite.js", "--host", "127.0.0.1", "--port", String(port)],
    { stdio: "inherit" },
  );
  await waitForServer(`http://127.0.0.1:${port}/`);
}

const browser = await chromium.launch({
  channel: "chrome",
  headless: true,
  args: ["--enable-gpu", "--use-angle=default", "--enable-webgl", "--disable-dev-shm-usage"],
});

const chunks = [];

try {
  const page = await browser.newPage({
    viewport: { width, height },
    deviceScaleFactor: 1,
  });

  await page.exposeFunction("__saveApartmentVideoChunk", (bytes) => {
    chunks.push(Buffer.from(bytes));
    const totalMb = chunks.reduce((sum, chunk) => sum + chunk.length, 0) / 1024 / 1024;
    console.log(`recorded chunk ${chunks.length}, ${totalMb.toFixed(1)} MB buffered`);
  });
  await page.exposeFunction("__apartmentRecordingProgress", (frame, totalFrames) => {
    console.log(`recorded frame ${frame}/${totalFrames}`);
  });

  await page.goto(baseUrl, { waitUntil: "domcontentloaded", timeout: 30000 });
  await page.waitForFunction(
    () => typeof window.__setApartmentCaptureTime === "function" && window.__APARTMENT_SCENE_READY === true,
    null,
    { timeout: 90000 },
  );

  console.log(`recording ${durationSeconds}s canvas stream at ${width}x${height}/${fps}fps`);
  page.setDefaultTimeout(Math.ceil(durationSeconds * 1000 + 120000));
  await page.evaluate(
    async ({ durationMs, targetFps, manualFrameMode }) => {
      const canvas = document.querySelector("canvas");
      if (!canvas) throw new Error("No walkthrough canvas found.");
      const stream = canvas.captureStream(manualFrameMode ? 0 : targetFps);
      const [videoTrack] = stream.getVideoTracks();
      const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
        ? "video/webm;codecs=vp9"
        : MediaRecorder.isTypeSupported("video/webm;codecs=vp8")
          ? "video/webm;codecs=vp8"
          : "video/webm";
      const recorder = new MediaRecorder(stream, {
        mimeType,
        videoBitsPerSecond: 12000000,
      });

      await new Promise((resolve, reject) => {
        recorder.onerror = () => reject(recorder.error ?? new Error("MediaRecorder failed."));
        recorder.ondataavailable = async (event) => {
          if (!event.data.size) return;
          const bytes = Array.from(new Uint8Array(await event.data.arrayBuffer()));
          await window.__saveApartmentVideoChunk(bytes);
        };
        recorder.onstop = resolve;
        recorder.start(1000);

        if (manualFrameMode) {
          const frameDurationMs = 1000 / targetFps;
          const totalFrames = Math.ceil(durationMs / frameDurationMs);
          const twoFrames = () => new Promise((resolveFrame) => requestAnimationFrame(() => requestAnimationFrame(resolveFrame)));
          const sleep = (ms) => new Promise((resolveSleep) => setTimeout(resolveSleep, ms));

          (async () => {
            for (let frame = 0; frame < totalFrames; frame += 1) {
              window.__setApartmentCaptureTime(frame * frameDurationMs);
              await twoFrames();
              videoTrack.requestFrame?.();
              if ((frame + 1) % 300 === 0 || frame === totalFrames - 1) {
                await window.__apartmentRecordingProgress(frame + 1, totalFrames);
              }
              await sleep(frameDurationMs);
            }
            setTimeout(() => recorder.stop(), 500);
          })().catch(reject);
        } else {
          const startedAt = performance.now();
          const tick = (now) => {
            const elapsed = Math.min(durationMs, now - startedAt);
            window.__setApartmentCaptureTime(elapsed);
            if (elapsed < durationMs) {
              requestAnimationFrame(tick);
            } else {
              setTimeout(() => recorder.stop(), 500);
            }
          };
          requestAnimationFrame(tick);
        }
      });
    },
    { durationMs: durationSeconds * 1000, targetFps: fps, manualFrameMode: manualFrames },
  );
} finally {
  await browser.close();
  server?.kill("SIGTERM");
}

await mkdir(path.dirname(webmOutput), { recursive: true });
await mkdir(path.dirname(mp4Output), { recursive: true });
await writeFile(webmOutput, Buffer.concat(chunks));
console.log(`wrote ${webmOutput}`);

await run("ffmpeg", [
  "-y",
  "-i",
  webmOutput,
  "-r",
  String(fps),
  "-c:v",
  "libx264",
  "-preset",
  "medium",
  "-crf",
  "20",
  "-pix_fmt",
  "yuv420p",
  "-movflags",
  "+faststart",
  mp4Output,
]);

console.log(`exported ${mp4Output}`);
