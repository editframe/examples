#!/bin/bash
# ── OLIPOP demo · STEP 1 of 2 — video-in-frame composite ──────────────────────
# The React render (output/demo-silent.mp4) draws a STATIONARY retro badge with a
# fixed EMPTY well (rect x=180 y=640 w=720 h=720 r=36) and a poster placeholder
# inside it from 5.0s–9.0s. This step composites the real OLIPOP retro-animation
# clip (assets/well-video.mp4) into that well, masked to the rounded-rect corners
# with assets/well-mask.png, exactly during the 5–9s STATIONARY window.
#
#   output/demo-silent.mp4  +  assets/well-video.mp4  ->  output/demo-composite.mp4
#
# This is the "video-in-frame" beat Jeremy specified. Run STEP 2 (add-audio.sh)
# after this to mux music + SFX into the final output/demo.mp4.
set -e
cd "$(dirname "$0")"

VIN="output/demo-silent.mp4"
WELL="assets/well-video.mp4"
MASK="assets/well-mask.png"
VOUT="output/demo-composite.mp4"

[ -f "$VIN" ]  || { echo "MISSING $VIN — run 'npm run render' first"; exit 1; }
[ -f "$WELL" ] || { echo "MISSING $WELL"; exit 1; }
[ -f "$MASK" ] || { echo "MISSING $MASK"; exit 1; }

# WELL RECT (must match src/constants.ts — non-negotiable):
WX=180; WY=640; WW=720; WH=720

ffmpeg -y -hide_banner -v error \
  -i "$VIN" \
  -i "$WELL" \
  -i "$MASK" \
  -filter_complex "
    [1:v]trim=duration=4.0,setpts=PTS-STARTPTS,fps=30,
         scale=${WW}:${WH}:force_original_aspect_ratio=increase,
         crop=${WW}:${WH}[wv];
    [wv][2:v]alphamerge[wvm];
    [0:v][wvm]overlay=x=${WX}:y=${WY}:enable='between(t,5,9)'[v]
  " \
  -map "[v]" -an \
  -c:v libx264 -pix_fmt yuv420p -crf 18 -preset medium \
  "$VOUT"

echo "✓ Composited well video → $VOUT"
ls -la "$VOUT"
