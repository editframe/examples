#!/usr/bin/env bash
# v11 — Mux script for Claude Security demo (19s).
# Music: Pixabay CC0 — see CREDITS.md for attribution.
# Click SFX: Click Sound Effect (HD) — separately sourced, ships with this repo.
set -euo pipefail
cd "$(dirname "$0")"

VIDEO_DUR=19.0
FADE_START=17
CLICK="./audio/click-hd-loud.mp3"
MUSIC="./audio/music-bed.mp3"

VIN="output/demo-silent.mp4"
VOUT="output/demo.mp4"

for f in "$CLICK" "$MUSIC"; do
  [ -f "$f" ] || { echo "MISSING $f"; exit 1; }
done
[ -f "$VIN" ] || { echo "MISSING $VIN — run 'npm run render' first"; exit 1; }

ffmpeg -y -hide_banner -v error \
  -i "$VIN" \
  -i "$MUSIC" \
  -i "$CLICK" \
  -filter_complex "
    [1:a]atrim=duration=${VIDEO_DUR},afade=t=out:st=${FADE_START}:d=2,volume=0.55[mus];
    [2:a]atrim=duration=1.5,asetpts=PTS-STARTPTS,volume=0.45,adelay=5000|5000[c1];
    [mus][c1]amix=inputs=2:duration=longest:normalize=0[aout]
  " \
  -map 0:v -map "[aout]" \
  -c:v copy -c:a aac -b:a 192k -shortest \
  "$VOUT"

echo "✓ Muxed audio → $VOUT"
ls -la "$VOUT"
