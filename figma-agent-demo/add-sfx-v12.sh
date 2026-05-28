#!/usr/bin/env bash
# v12 — Mux script for Figma Native Agent demo (30.8s).
# Music: Pixabay CC0 — see README/CREDITS for attribution.
# Keyboard SFX align with actual typing moments:
#   SceneB prompt typing: master 10600-13700ms
#   SceneC chat input typing: master 23300-25900ms
set -euo pipefail
cd "$(dirname "$0")"

VIDEO_DUR=30.8
FADE_START=28.8
CLICK="./audio/click-hd-loud.mp3"
KBD="./audio/keyboard.wav"
MUSIC="./audio/music-bed.mp3"

VIN="output/demo-silent.mp4"
VOUT="output/demo.mp4"

for f in "$CLICK" "$KBD" "$MUSIC"; do
  [ -f "$f" ] || { echo "MISSING $f"; exit 1; }
done
[ -f "$VIN" ] || { echo "MISSING $VIN — run 'npm run render' first"; exit 1; }

ffmpeg -y -hide_banner -v error \
  -i "$VIN" \
  -i "$MUSIC" \
  -i "$CLICK" \
  -i "$CLICK" \
  -i "$CLICK" \
  -i "$KBD" \
  -i "$KBD" \
  -filter_complex "
    [1:a]atrim=duration=${VIDEO_DUR},afade=t=out:st=${FADE_START}:d=2,volume=0.40[mus];
    [2:a]atrim=duration=1.5,asetpts=PTS-STARTPTS,volume=0.45,adelay=4600|4600[c1];
    [3:a]atrim=duration=1.5,asetpts=PTS-STARTPTS,volume=0.45,adelay=7000|7000[c2];
    [4:a]atrim=duration=1.5,asetpts=PTS-STARTPTS,volume=0.45,adelay=14300|14300[c3];
    [5:a]aloop=loop=3:size=88200,atrim=duration=3.1,asetpts=PTS-STARTPTS,volume=0.28,adelay=10600|10600[kb1];
    [6:a]aloop=loop=2:size=88200,atrim=duration=2.6,asetpts=PTS-STARTPTS,volume=0.28,adelay=23300|23300[kb2];
    [mus][c1][c2][c3][kb1][kb2]amix=inputs=6:duration=longest:normalize=0[aout]
  " \
  -map 0:v -map "[aout]" \
  -c:v copy -c:a aac -b:a 192k -shortest \
  "$VOUT"

echo "✓ Muxed audio → $VOUT"
ls -la "$VOUT"
