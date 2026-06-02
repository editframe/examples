#!/usr/bin/env bash
# v16 — Mux script for Cursor With Jira demo (28.5s).
# Music: Pixabay CC0 — see CREDITS.md for attribution.
# Click SFX overlay at master 21500ms (the "Suggest a Reply" cursor click).
set -euo pipefail
cd "$(dirname "$0")"

CLICK="./audio/click-hd-loud.mp3"
VIN="output/demo-silent.mp4"
AUDIO_SRC="./audio/audio-bed.mp3"
VOUT="output/demo.mp4"

for f in "$CLICK" "$VIN" "$AUDIO_SRC"; do
  [ -f "$f" ] || { echo "MISSING $f"; exit 1; }
done

ffmpeg -y -hide_banner -v error \
  -i "$VIN" \
  -i "$AUDIO_SRC" \
  -i "$CLICK" \
  -filter_complex "
    [1:a]volume=1.0[bed];
    [2:a]atrim=duration=1.5,asetpts=PTS-STARTPTS,volume=0.50,adelay=21500|21500[c1];
    [bed][c1]amix=inputs=2:duration=longest:normalize=0[aout]
  " \
  -map 0:v -map "[aout]" \
  -c:v copy -c:a aac -b:a 192k -shortest \
  "$VOUT"

echo "v16 → $VOUT"
ls -la "$VOUT"
