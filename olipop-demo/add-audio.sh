#!/bin/bash
# ── OLIPOP demo · STEP 2 of 2 — music mux ─────────────────────────────────────
# Lays the music bed under the full 20s, producing the final, shippable
# output/demo.mp4 (the cut committed to this repo). Music only — no SFX.
#
#   output/demo-composite.mp4  +  audio/music-bed.mp3  ->  output/demo.mp4
#
# Run composite-well.sh (STEP 1) before this. If you skipped the well composite,
# this falls back to output/demo-silent.mp4. See CREDITS.md for music provenance.
set -e
cd "$(dirname "$0")"

VIN="output/demo-composite.mp4"
[ -f "$VIN" ] || VIN="output/demo-silent.mp4"   # fallback if STEP 1 was skipped
MUSIC="./audio/music-bed.mp3"
VOUT="output/demo.mp4"

[ -f "$VIN" ]   || { echo "MISSING $VIN — run composite-well.sh (or npm run render) first"; exit 1; }
[ -f "$MUSIC" ] || { echo "MISSING $MUSIC"; exit 1; }

# 20s video. Music bed loudnorm-normalized, fade in at the top, fade out under the CTA hold.
ffmpeg -y -hide_banner -v error \
  -i "$VIN" \
  -i "$MUSIC" \
  -filter_complex "
    [1:a]atrim=duration=20,asetpts=PTS-STARTPTS,
         loudnorm=I=-16:TP=-1.5:LRA=11,
         afade=t=in:st=0:d=0.6,
         afade=t=out:st=18.5:d=1.5,
         alimiter=limit=0.97[mus]
  " \
  -map 0:v -map "[mus]" \
  -c:v copy -c:a aac -b:a 192k -shortest \
  "$VOUT"

echo "Muxed music -> $VOUT"
ls -la "$VOUT"
